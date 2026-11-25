import {
  IChartDimension,
  MappedDimension,
} from "app/state/api/action-reducers/report-builder/sync";
import {
  findMissingDimensions,
  getDimensionRole,
  getMissingDimensionPrompt,
  getRemovedFieldsWarning,
  joinWithAnd,
  switchMapping,
} from "./switch-mapping";

// The charts' dimensions as rb-core.charts defines them; it can't load under
// jest.
const dimension = (
  id: string,
  name: string,
  validTypes: string[],
  extra: Partial<IChartDimension> = {},
): IChartDimension => ({
  id,
  name,
  validTypes,
  required: true,
  description: "",
  ...extra,
});
const ANY = ["number", "string", "date"];
const NUMBER = ["number"];
const charts: Record<string, IChartDimension[]> = {
  bar: [
    dimension("bars", "Category", ANY),
    dimension("size", "Value", NUMBER, { aggregation: true }),
    dimension("breakdown", "Breakdown", ANY, { required: false }),
  ],
  line: [
    dimension("x", "X Axis", ANY),
    dimension("y", "Y Axis", NUMBER, { multiple: true, aggregation: true }),
  ],
  pie: [
    dimension("category", "Category", ANY),
    dimension("value", "Value", NUMBER, { aggregation: true }),
  ],
  sankey: [
    dimension("steps", "Steps", ANY, { multiple: true, minValues: 2 }),
    dimension("size", "Size", NUMBER, { aggregation: true }),
  ],
  scatter: [
    dimension("x", "X Axis", ["number", "date"]),
    dimension("y", "Y Axis", ["number", "date"]),
    dimension("size", "Size", NUMBER, { required: false }),
    dimension("label", "Label", ANY, { required: false }),
  ],
  geomap: [
    dimension("country", "Country", ["string"]),
    dimension("size", "Size", NUMBER, { aggregation: true }),
  ],
  treemap: [
    dimension("hierarchy", "Hierarchy", ANY, { multiple: true }),
    dimension("size", "Size", NUMBER, {
      required: false,
      aggregation: true,
    }),
  ],
  radar: [
    dimension("dimensions", "Dimensions", NUMBER, {
      multiple: true,
      minValues: 3,
    }),
    dimension("category", "Category", ANY, { required: false }),
  ],
  heatmap: [
    dimension("x", "X Axis", ANY),
    dimension("y", "Y Axis", ANY),
    dimension("size", "Size", NUMBER, {
      required: false,
      aggregation: true,
    }),
  ],
};

const fields = (...entries: [string, string][]) => ({
  value: entries.map(([name]) => name),
  mappedType: entries.map(([, type]) => type),
});
const measure = (aggregation: string, ...entries: [string, string][]) => ({
  ...fields(...entries),
  config: { aggregation: entries.map(() => aggregation) },
});

const pieMapping: MappedDimension = {
  category: fields(["Country", "string"]),
  value: measure("avg", ["Disbursement", "number"]),
};
const barMapping: MappedDimension = {
  bars: fields(["Country", "string"]),
  size: measure("sum", ["Disbursement", "number"]),
  breakdown: fields(["Component", "string"]),
};

const switchChart = (from: string, to: string, mapping: MappedDimension) =>
  switchMapping(charts[from], charts[to], mapping);

describe("switching a chart's type", () => {
  test("keeps fields in dimensions of the same role", () => {
    const result = switchChart("pie", "line", pieMapping);
    expect(result.mapping).toEqual({
      x: fields(["Country", "string"]),
      // The chart's aggregation goes with its measure.
      y: measure("avg", ["Disbursement", "number"]),
    });
    expect(result.kept).toEqual([
      { field: "Country", from: "Category", to: "X Axis" },
      { field: "Disbursement", from: "Value", to: "Y Axis" },
    ]);
    expect(result.removed).toEqual([]);
  });

  test("removes the fields the new type has no place for", () => {
    const result = switchChart("bar", "line", barMapping);
    expect(result.mapping).toEqual({
      x: fields(["Country", "string"]),
      y: measure("sum", ["Disbursement", "number"]),
    });
    expect(result.removed).toEqual([{ field: "Component", from: "Breakdown" }]);
  });

  test("gives dimensions that take several fields the rest of their role", () => {
    expect(switchChart("bar", "sankey", barMapping).mapping).toEqual({
      steps: fields(["Country", "string"], ["Component", "string"]),
      size: measure("sum", ["Disbursement", "number"]),
    });
  });

  test("keeps a field in the dimension of the same name", () => {
    const line: MappedDimension = {
      x: fields(["Year", "number"]),
      y: measure("sum", ["Disbursement", "number"]),
    };
    expect(switchChart("line", "scatter", line).mapping).toEqual({
      x: fields(["Year", "number"]),
      y: fields(["Disbursement", "number"]),
    });
  });

  test("doesn't put a measure where a category goes", () => {
    const line: MappedDimension = {
      x: fields(["Year", "number"]),
      y: measure("sum", ["Disbursement", "number"]),
    };
    const result = switchChart("line", "heatmap", line);
    expect(result.mapping).toEqual({
      x: fields(["Year", "number"]),
      size: measure("sum", ["Disbursement", "number"]),
    });
    expect(findMissingDimensions(charts.heatmap, result.mapping)).toEqual([
      { dimension: charts.heatmap[1], needed: 1 },
    ]);
  });

  test("removes a field whose type the new dimension doesn't take", () => {
    const pie: MappedDimension = {
      category: fields(["Year", "number"]),
      value: measure("sum", ["Disbursement", "number"]),
    };
    const result = switchChart("pie", "geomap", pie);
    expect(result.mapping).toEqual({
      size: measure("sum", ["Disbursement", "number"]),
    });
    expect(result.removed).toEqual([{ field: "Year", from: "Category" }]);
  });

  test("keeps one field of several where only one fits", () => {
    const radar: MappedDimension = {
      dimensions: fields(["A", "number"], ["B", "number"], ["C", "number"]),
      category: fields(["Country", "string"]),
    };
    const result = switchChart("radar", "pie", radar);
    expect(result.mapping).toEqual({
      category: fields(["Country", "string"]),
      // A measure without an aggregation gets the panel's default.
      value: measure("sum", ["A", "number"]),
    });
    expect(result.removed).toEqual([
      { field: "B", from: "Dimensions" },
      { field: "C", from: "Dimensions" },
    ]);
  });

  test("drops the aggregation where the new dimension has none", () => {
    expect(switchChart("pie", "radar", pieMapping).mapping).toEqual({
      dimensions: fields(["Disbursement", "number"]),
      category: fields(["Country", "string"]),
    });
  });

  test("removes fields whose type isn't known", () => {
    const result = switchChart("pie", "bar", {
      category: { value: ["Country"], mappedType: [] },
    });
    expect(result.mapping).toEqual({});
    expect(result.removed).toEqual([{ field: "Country", from: "Category" }]);
  });

  test("leaves out fields of dimensions the old type doesn't have", () => {
    const result = switchChart("pie", "bar", {
      ...pieMapping,
      stale: fields(["Region", "string"]),
    });
    expect(result.removed).toEqual([]);
    expect(result.mapping).not.toHaveProperty("breakdown");
  });

  test("has nothing to keep or remove without a mapping", () => {
    expect(switchChart("pie", "line", {})).toEqual({
      mapping: {},
      kept: [],
      removed: [],
    });
    expect(switchMapping([], charts.line, undefined).mapping).toEqual({});
  });
});

test("a dimension's role follows the types it takes", () => {
  expect(getDimensionRole(charts.bar[0])).toBe("category");
  expect(getDimensionRole(charts.geomap[0])).toBe("category");
  expect(getDimensionRole(charts.bar[1])).toBe("measure");
  expect(getDimensionRole(charts.scatter[0])).toBe("either");
});

describe("missing dimensions", () => {
  test("are the required ones without enough fields", () => {
    const sankey = { steps: fields(["Country", "string"]) };
    expect(findMissingDimensions(charts.sankey, sankey)).toEqual([
      { dimension: charts.sankey[0], needed: 1 },
      { dimension: charts.sankey[1], needed: 1 },
    ]);
    expect(findMissingDimensions(charts.bar, undefined)).toHaveLength(2);
    expect(findMissingDimensions(charts.bar, barMapping)).toEqual([]);
    // An emptied dimension is as good as none.
    expect(
      findMissingDimensions(charts.pie, {
        ...pieMapping,
        category: { value: [], mappedType: [] },
      }),
    ).toEqual([{ dimension: charts.pie[0], needed: 1 }]);
  });

  test("ask for what's still needed", () => {
    const [missing] = findMissingDimensions(charts.line, {});
    expect(missing && getMissingDimensionPrompt(missing)).toBe(
      "Pick a dimension for the X Axis to draw this chart.",
    );
    expect(
      getMissingDimensionPrompt({ dimension: charts.line[1], needed: 1 }),
    ).toBe("Pick a measure for the Y Axis to draw this chart.");
    expect(
      getMissingDimensionPrompt({ dimension: charts.scatter[1], needed: 1 }),
    ).toBe("Pick a number or date field for the Y Axis to draw this chart.");
    expect(
      getMissingDimensionPrompt({ dimension: charts.radar[0], needed: 3 }),
    ).toBe("Pick at least 3 measures for the Dimensions to draw this chart.");
    expect(
      getMissingDimensionPrompt({ dimension: charts.radar[0], needed: 2 }),
    ).toBe("Pick 2 more measures for the Dimensions to draw this chart.");
    expect(
      getMissingDimensionPrompt({ dimension: charts.sankey[0], needed: 1 }),
    ).toBe("Pick 1 more dimension for the Steps to draw this chart.");
  });
});

test("the warning names the dimensions whose fields are removed", () => {
  expect(
    getRemovedFieldsWarning("Line Chart", [
      { field: "Component", from: "Breakdown" },
    ]),
  ).toBe(
    "Switching to Line Chart will remove your Breakdown field — continue?",
  );
  expect(
    getRemovedFieldsWarning("Pie Chart", [
      { field: "B", from: "Dimensions" },
      { field: "C", from: "Dimensions" },
      { field: "Region", from: "Label" },
    ]),
  ).toBe(
    "Switching to Pie Chart will remove your Dimensions and Label fields — continue?",
  );
});

test("lists are joined with commas and a final and", () => {
  expect(joinWithAnd([])).toBe("");
  expect(joinWithAnd(["A"])).toBe("A");
  expect(joinWithAnd(["A", "B", "C"])).toBe("A, B and C");
});
