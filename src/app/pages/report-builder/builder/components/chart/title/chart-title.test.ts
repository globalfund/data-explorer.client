import { IChartDimension } from "app/state/api/action-reducers/report-builder/sync";
import {
  deriveChartTitle,
  getChartTitle,
  getFilteredYearRange,
  humanizeColumnName,
  isChartTitleAuto,
  resetChartTitle,
  setChartTitle,
} from "./chart-title";

// The dimensions rb-core.charts gives these chart types, as far as titles go.
const dimension = (
  id: string,
  required: boolean,
  aggregation = false,
): IChartDimension =>
  ({ id, required, aggregation }) as unknown as IChartDimension;
const BAR = [
  dimension("bars", true),
  dimension("size", true, true),
  dimension("breakdown", false),
];
const LINE = [dimension("x", true), dimension("y", true, true)];
const SCATTER = [
  dimension("x", true),
  dimension("y", true),
  dimension("size", false),
];
const HEATMAP = [
  dimension("x", true),
  dimension("y", true),
  dimension("size", false, true),
];
const RADAR = [dimension("dimensions", true), dimension("category", false)];

const mapped = (...columns: string[]) => ({
  value: columns,
  mappedType: columns.map(() => "string"),
});
const measured = (aggregation: string, ...columns: string[]) => ({
  ...mapped(...columns),
  config: { aggregation: columns.map(() => aggregation) },
});

test.each([
  ["Result", "Result"],
  ["AllocationAmountReferenceRate", "Allocation Amount Reference Rate"],
  ["Continent1", "Continent"],
  ["GeographyName1", "Geography Name"],
  ["InvestmentLandscapeLevel11", "Investment Landscape Level 1"],
  ["GroupingLevel2", "Grouping Level 2"],
  ["2021", "2021"],
  ["ISOCode", "ISO Code"],
  ["number_of_cases", "Number of Cases"],
  ["life-expectancy", "Life Expectancy"],
])("humanizes the column %p as %p", (column, words) => {
  expect(humanizeColumnName(column)).toBe(words);
});

test("a bar chart's title is its measure by its category", () => {
  expect(
    deriveChartTitle(
      {
        chartType: "bar",
        mapping: {
          bars: mapped("Component"),
          size: measured("sum", "Result"),
        },
      },
      BAR,
    ),
  ).toBe("Result by Component");
});

test("a breakdown, an aggregation and a year filter all reach the title", () => {
  expect(
    deriveChartTitle(
      {
        chartType: "bar",
        mapping: {
          bars: mapped("Continent1"),
          size: measured("mean", "Result"),
          breakdown: mapped("Component"),
        },
        appliedFilters: { Year: [2024, 2020, 2021, 2022, 2023] },
      },
      BAR,
    ),
  ).toBe("Average Result by Continent and Component (2020–2024)");
});

test("several measures are listed", () => {
  expect(
    deriveChartTitle(
      {
        chartType: "line",
        mapping: {
          x: mapped("Year"),
          y: measured("median", "BudgetAmount", "ExpenditureAmount", "Count"),
        },
      },
      LINE,
    ),
  ).toBe(
    "Median Budget Amount, Median Expenditure Amount and Median Count by Year",
  );
  expect(
    deriveChartTitle(
      {
        chartType: "line",
        mapping: { x: mapped("Year"), y: measured("count", "Result") },
      },
      LINE,
    ),
  ).toBe("Count of Result by Year");
});

test("charts without a measure are titled by what they compare", () => {
  expect(
    deriveChartTitle(
      {
        chartType: "scatter",
        mapping: { x: mapped("Year"), y: mapped("Result") },
      },
      SCATTER,
    ),
  ).toBe("Result vs Year");
  expect(
    deriveChartTitle(
      {
        chartType: "heatmap",
        mapping: { x: mapped("Year"), y: mapped("Component") },
      },
      HEATMAP,
    ),
  ).toBe("Year by Component");
  expect(
    deriveChartTitle(
      {
        chartType: "radar",
        mapping: {
          dimensions: mapped("Budget", "Expenditure"),
          category: mapped("Component"),
        },
      },
      RADAR,
    ),
  ).toBe("Budget and Expenditure by Component");
});

test("a chart has no title from its data until its mapping is complete", () => {
  expect(
    deriveChartTitle(
      { chartType: "bar", mapping: { bars: mapped("Component") } },
      BAR,
    ),
  ).toBe("");
  expect(
    deriveChartTitle(
      {
        chartType: "bar",
        mapping: { bars: mapped("Component"), size: mapped() },
      },
      BAR,
    ),
  ).toBe("");
  expect(deriveChartTitle({ chartType: "bar" }, [])).toBe("");
  expect(deriveChartTitle({}, BAR)).toBe("");
});

test.each([
  [{ Year: [2020] }, "2020"],
  [{ Year: ["2021", "2020", "2022"] }, "2020–2022"],
  [{ EligibilityYear: [2018, 2022, 2020] }, "2018, 2020, 2022"],
  [{ Year: [2014, 2016, 2018, 2020] }, ""],
  [{ Year: [] }, ""],
  [{ Component: ["Malaria"], AllocationCycle: ["2020-2022"] }, ""],
  [{ YearLabel: ["Latest"] }, ""],
  [undefined, ""],
])("filters %p cover the years %p", (filters, years) => {
  expect(getFilteredYearRange(filters as any)).toBe(years);
});

test("new charts and charts with an old default title follow their data", () => {
  expect(isChartTitleAuto({ chartTitle: "", chartTitleAuto: true })).toBe(true);
  expect(isChartTitleAuto(undefined)).toBe(true);
  expect(isChartTitleAuto({ chartTitle: "Bar Chart" })).toBe(true);
  expect(isChartTitleAuto({ chartTitle: "Chart Title" })).toBe(true);
  expect(isChartTitleAuto({ chartTitle: "Results" })).toBe(false);
  expect(
    isChartTitleAuto({ chartTitle: "Bar Chart", chartTitleAuto: false }),
  ).toBe(false);
});

test("a chart shows its own title, or else the one from its data", () => {
  expect(getChartTitle({ chartTitle: "Bar Chart" }, "Result by Year")).toBe(
    "Result by Year",
  );
  expect(
    getChartTitle(
      { chartTitle: " Results ", chartTitleAuto: false },
      "Result by Year",
    ),
  ).toBe("Results");
  expect(
    getChartTitle({ chartTitle: "", chartTitleAuto: false }, "Result by Year"),
  ).toBe("");
});

test("setting the title makes it the author's, unless it's the suggested one", () => {
  const options = { chartTitle: "", chartTitleAuto: true, height: "400px" };
  expect(setChartTitle(options, " Results ", "Result by Year")).toEqual({
    chartTitle: "Results",
    chartTitleAuto: false,
    height: "400px",
  });
  expect(setChartTitle(options, "", "Result by Year")).toEqual({
    chartTitle: "",
    chartTitleAuto: false,
    height: "400px",
  });
  expect(
    setChartTitle(
      { ...options, chartTitleAuto: false },
      "Result by Year",
      "Result by Year",
    ),
  ).toEqual(options);
  expect(
    resetChartTitle({ chartTitle: "Results", chartTitleAuto: false }),
  ).toEqual({
    chartTitle: "",
    chartTitleAuto: true,
  });
});
