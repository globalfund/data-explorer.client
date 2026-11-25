import {
  IChartDimension,
  MappedDimension,
} from "app/state/api/action-reducers/report-builder/sync";

/**
 * What a chart's dimension holds. A measure is a number to plot; a category
 * groups or places the data. Some, like a scatter chart's axes, take either.
 */
export type DimensionRole = "measure" | "category" | "either";

export const getDimensionRole = (
  dimension: Pick<IChartDimension, "validTypes">,
): DimensionRole => {
  if (dimension.validTypes.includes("string")) return "category";
  if (dimension.validTypes.every((type) => type === "number")) {
    return "measure";
  }
  return "either";
};

/** The aggregation the mapping panel starts a chart with. */
export const DEFAULT_AGGREGATION = "sum";

/** A required dimension that doesn't have the fields it needs yet. */
export interface MissingDimension {
  dimension: IChartDimension;
  /** How many more fields it needs. */
  needed: number;
}

const minimumFields = (dimension: IChartDimension) =>
  Math.max(dimension.minValues ?? 1, 1);

export const findMissingDimensions = (
  dimensions: IChartDimension[],
  mapping: MappedDimension | undefined,
): MissingDimension[] =>
  dimensions.flatMap((dimension) => {
    if (!dimension.required) return [];
    const needed =
      minimumFields(dimension) - (mapping?.[dimension.id]?.value?.length ?? 0);
    return needed > 0 ? [{ dimension, needed }] : [];
  });

const ROLE_NOUNS: Record<DimensionRole, [string, string]> = {
  measure: ["measure", "measures"],
  category: ["dimension", "dimensions"],
  either: ["number or date field", "number or date fields"],
};

/** What to pick to complete a dimension, e.g. "Pick a measure for the Y Axis…". */
export const getMissingDimensionPrompt = ({
  dimension,
  needed,
}: MissingDimension): string => {
  const [one, many] = ROLE_NOUNS[getDimensionRole(dimension)];
  const minimum = minimumFields(dimension);
  let what = `a ${one}`;
  if (needed < minimum) {
    what = `${needed} more ${needed === 1 ? one : many}`;
  } else if (minimum > 1) {
    what = `at least ${minimum} ${many}`;
  }
  return `Pick ${what} for the ${dimension.name} to draw this chart.`;
};

/** A field that fits the new chart type, and where it went. */
export interface KeptField {
  field: string;
  from: string;
  to: string;
}

/** A field the new chart type has no place for. */
export interface RemovedField {
  field: string;
  from: string;
}

export interface MappingSwitch {
  /** The mapping for the new chart type. */
  mapping: MappedDimension;
  kept: KeptField[];
  removed: RemovedField[];
}

/** What switching a chart's type did to its fields, for the panel to explain. */
export interface ChartTypeSwitch {
  /** The chart types' names, as the chart type picker shows them. */
  from: string;
  to: string;
  kept: KeptField[];
  removed: RemovedField[];
}

interface MappedField {
  name: string;
  type: string | undefined;
  from: IChartDimension;
  role: DimensionRole;
}

const rolesFit = (a: DimensionRole, b: DimensionRole) =>
  a === b || a === "either" || b === "either";

/**
 * Moves a chart's fields to the dimensions of another chart type. A field goes
 * where its type is valid and its role fits: first to the dimension of the
 * same name (a line chart's X axis to a heatmap's), then to the first empty
 * dimension of its role, and what's left to dimensions that take several
 * fields. Fields that fit nowhere are removed.
 */
export const switchMapping = (
  from: IChartDimension[],
  to: IChartDimension[],
  mapping: MappedDimension | undefined,
): MappingSwitch => {
  const fields: MappedField[] = from.flatMap((dimension) => {
    const mapped = mapping?.[dimension.id];
    return (mapped?.value ?? []).map((name, index) => ({
      name,
      type: mapped?.mappedType?.[index],
      from: dimension,
      role: getDimensionRole(dimension),
    }));
  });
  // The panel shows one aggregation for the whole chart.
  const aggregation =
    from
      .filter((dimension) => dimension.aggregation)
      .map((dimension) => mapping?.[dimension.id]?.config?.aggregation?.[0])
      .find(Boolean) ?? DEFAULT_AGGREGATION;

  const placed = new Map<string, MappedField[]>(
    to.map((dimension) => [dimension.id, []]),
  );
  const unplaced = new Set(fields);
  const placedIn = (dimension: IChartDimension) =>
    placed.get(dimension.id) ?? [];

  const fits = (field: MappedField, dimension: IChartDimension) =>
    !!field.type &&
    dimension.validTypes.includes(field.type) &&
    rolesFit(field.role, getDimensionRole(dimension)) &&
    (dimension.multiple || placedIn(dimension).length === 0) &&
    !placedIn(dimension).some((other) => other.name === field.name);

  const place = (field: MappedField, dimension: IChartDimension) => {
    placedIn(dimension).push(field);
    unplaced.delete(field);
  };

  // Fields of the dimension's own role come before ones that only fit it.
  const candidates = (dimension: IChartDimension) => {
    const role = getDimensionRole(dimension);
    const fitting = [...unplaced].filter((field) => fits(field, dimension));
    return [
      ...fitting.filter((field) => field.role === role),
      ...fitting.filter((field) => field.role !== role),
    ];
  };

  to.forEach((dimension) => {
    fields
      .filter((field) => field.from.id === dimension.id)
      .forEach((field) => {
        if (unplaced.has(field) && fits(field, dimension)) {
          place(field, dimension);
        }
      });
  });
  to.forEach((dimension) => {
    if (placedIn(dimension).length > 0) return;
    const [field] = candidates(dimension);
    if (field) place(field, dimension);
  });
  to.filter((dimension) => dimension.multiple).forEach((dimension) => {
    candidates(dimension).forEach((field) => {
      if (fits(field, dimension)) place(field, dimension);
    });
  });

  const newMapping: MappedDimension = {};
  const kept: KeptField[] = [];
  to.forEach((dimension) => {
    const dimensionFields = placedIn(dimension);
    if (dimensionFields.length === 0) return;
    newMapping[dimension.id] = {
      value: dimensionFields.map((field) => field.name),
      mappedType: dimensionFields.map((field) => field.type as string),
      ...(dimension.aggregation
        ? { config: { aggregation: dimensionFields.map(() => aggregation) } }
        : {}),
    };
    dimensionFields.forEach((field) =>
      kept.push({
        field: field.name,
        from: field.from.name,
        to: dimension.name,
      }),
    );
  });

  return {
    mapping: newMapping,
    kept,
    removed: [...unplaced].map((field) => ({
      field: field.name,
      from: field.from.name,
    })),
  };
};

/** "A", "A and B", "A, B and C". */
export const joinWithAnd = (items: string[]): string =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/** The dimensions removed fields were in, each once and in order. */
export const getRemovedDimensions = (removed: RemovedField[]): string[] => [
  ...new Set(removed.map((field) => field.from)),
];

/** E.g. "Switching to Line Chart will remove your Breakdown field — continue?" */
export const getRemovedFieldsWarning = (
  chartName: string,
  removed: RemovedField[],
): string => {
  const dimensions = getRemovedDimensions(removed);
  return `Switching to ${chartName} will remove your ${joinWithAnd(dimensions)} ${
    dimensions.length === 1 ? "field" : "fields"
  } — continue?`;
};
