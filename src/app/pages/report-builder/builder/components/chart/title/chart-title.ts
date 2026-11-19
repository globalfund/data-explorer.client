import {
  ChartType,
  IChartDimension,
  MappedDimension,
} from "app/state/api/action-reducers/report-builder/sync";

export const CHART_TITLE_PLACEHOLDER = "Add a chart title…";

// The titles charts were given before titles came from their data. A chart
// that still has one was never named, so it gets a title from its data too.
const LEGACY_DEFAULT_TITLES = new Set([
  "Chart Title",
  "Bar Chart",
  "Line Chart",
  "Pie Chart",
  "Scatter Chart",
  "Geomap Chart",
  "Sankey Chart",
  "Treemap Chart",
  "Heatmap Chart",
  "Radar Chart",
]);

const MINOR_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "by",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "per",
  "the",
  "to",
  "vs",
  "with",
]);

/**
 * Turns a dataset column into words for a title: "AllocationAmount" becomes
 * "Allocation Amount", "life_expectancy" becomes "Life Expectancy".
 */
export const humanizeColumnName = (column: string): string => {
  const words = column
    .trim()
    // Columns that repeat for each level of a hierarchy are numbered from 1
    // ("Continent1", "InvestmentLandscapeLevel11"). Only that suffix goes;
    // "GroupingLevel2" and "2021" keep theirs.
    .replace(/(?<=[A-Za-z]\d?)1$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean);

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && MINOR_WORDS.has(lower)) return lower;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

/** "A", "A and B", "A, B and C". */
const joinList = (parts: string[]): string => {
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
};

const withAggregation = (measure: string, aggregation?: string): string => {
  switch (aggregation) {
    case "mean":
      return `Average ${measure}`;
    case "median":
      return `Median ${measure}`;
    case "count":
      return `Count of ${measure}`;
    default:
      // Sums read as the measure itself: "Result", not "Sum of Result".
      return measure;
  }
};

const isYear = (value: number) =>
  Number.isInteger(value) && value >= 1900 && value <= 2100;

/**
 * The years a chart is filtered to, from a filter on a year column: "2020–2024"
 * for a run of years, "2018, 2020, 2022" for a few separate ones, or "" when
 * there is no such filter or the years don't fit in a title.
 */
export const getFilteredYearRange = (
  appliedFilters: Record<string, any[]> | undefined,
): string => {
  for (const [column, values] of Object.entries(appliedFilters ?? {})) {
    if (!/year/i.test(column) || !values?.length) continue;
    const years = values.map(Number);
    if (!years.every(isYear)) continue;

    const sorted = [...new Set(years)].sort((a, b) => a - b);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    if (sorted.length === 1) return `${first}`;
    if (last - first === sorted.length - 1) return `${first}–${last}`;
    if (sorted.length <= 3) return sorted.join(", ");
    return "";
  }
  return "";
};

export interface ChartTitleSource {
  chartType?: ChartType | string | null;
  mapping?: MappedDimension;
  appliedFilters?: Record<string, any[]>;
}

/**
 * A title for a chart from what it shows: "[Measure] by [Dimension] (years)",
 * for example "Result by Component (2020–2024)". Empty until every required
 * dimension is mapped.
 *
 * `dimensions` are the chart type's dimensions, in the order the chart type
 * lists them; dimensions that aggregate are the chart's measures.
 */
export const deriveChartTitle = (
  { chartType, mapping, appliedFilters }: ChartTitleSource,
  dimensions: IChartDimension[],
): string => {
  if (!chartType || dimensions.length === 0) return "";

  const mapped = dimensions.map((dimension) => ({
    dimension,
    columns: (mapping?.[dimension.id]?.value ?? []).filter(Boolean),
    aggregations: mapping?.[dimension.id]?.config?.aggregation ?? [],
  }));
  if (mapped.some((m) => m.dimension.required && m.columns.length === 0)) {
    return "";
  }

  const columnsOf = (id: string) =>
    joinList(
      (mapped.find((m) => m.dimension.id === id)?.columns ?? []).map(
        humanizeColumnName,
      ),
    );

  let title: string;
  if (chartType === "scatter") {
    // A scatter plots one value against another rather than by a category.
    title = `${columnsOf("y")} vs ${columnsOf("x")}`;
  } else {
    const present = mapped.filter((m) => m.columns.length > 0);
    const measures = present
      .filter((m) => m.dimension.aggregation)
      .flatMap((m) =>
        m.columns.map((column, index) =>
          withAggregation(humanizeColumnName(column), m.aggregations[index]),
        ),
      );
    const groups = present
      .filter((m) => !m.dimension.aggregation)
      .map((m) => joinList(m.columns.map(humanizeColumnName)));

    title = measures.length
      ? [joinList(measures), joinList(groups)].filter(Boolean).join(" by ")
      : groups.join(" by ");
  }

  const years = getFilteredYearRange(appliedFilters);
  return years ? `${title} (${years})` : title;
};

/**
 * Whether a chart's title follows its data. New charts' titles do until the
 * author writes their own; so do charts saved with an old default title.
 */
export const isChartTitleAuto = (
  options: Record<string, any> | undefined,
): boolean => {
  if (typeof options?.chartTitleAuto === "boolean") {
    return options.chartTitleAuto;
  }
  const title = options?.chartTitle;
  return !title || LEGACY_DEFAULT_TITLES.has(title);
};

/** The title a chart shows: its own, or the one from its data. */
export const getChartTitle = (
  options: Record<string, any> | undefined,
  suggestedTitle: string,
): string =>
  isChartTitleAuto(options)
    ? suggestedTitle
    : String(options?.chartTitle ?? "").trim();

/**
 * The options after the author sets the title. Setting it to the suggested
 * title keeps it following the data; anything else, a blank included, is the
 * author's own.
 */
export const setChartTitle = (
  options: Record<string, any> | undefined,
  value: string,
  suggestedTitle: string,
): Record<string, any> => {
  const title = value.trim();
  if (title && title === suggestedTitle) {
    return resetChartTitle(options);
  }
  return { ...options, chartTitle: title, chartTitleAuto: false };
};

/** The options after the author goes back to the title from the data. */
export const resetChartTitle = (
  options: Record<string, any> | undefined,
): Record<string, any> => ({
  ...options,
  chartTitle: "",
  chartTitleAuto: true,
});
