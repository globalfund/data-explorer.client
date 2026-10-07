import {
  parseCssPx,
  parseFontSize,
  parseEchartsLayout,
  parseBarWidth,
  generateHeatmapLegends,
  valueFormatter3,
} from "./chart-utils";

test.each([
  [12, 12],
  ["12", 12],
  [" 12.5PX ", 12.5],
  ["-2px", -2],
  [0, 0],
  [null, 7],
  [undefined, 7],
  [NaN, 7],
  [Infinity, 7],
  ["10%", 7],
  ["2em", 7],
  ["auto", 7],
  ["", 7],
])("pixel and font parsing handles %p", (input, expected) => {
  expect(parseCssPx(input, 7)).toBe(expected);
  expect(parseFontSize(input, 7)).toBe(expected);
});
test.each([
  ["10%", "10%"],
  ["-2.5%", "-2.5%"],
  [" CENTER ", "center"],
  ["middle", "middle"],
  ["12px", 12],
  ["12", 12],
  [0, 0],
  [null, "fallback"],
  [undefined, "fallback"],
  [NaN, "fallback"],
  [Infinity, "fallback"],
  ["auto", "fallback"],
  ["2em", "fallback"],
])("chart layout parsing handles %p", (input, expected) =>
  expect(parseEchartsLayout(input, "fallback")).toBe(expected),
);
test("bar widths support auto sizing and numeric fallbacks", () => {
  expect(parseBarWidth("auto", 30)).toBeUndefined();
  expect(parseBarWidth("20px")).toBe(20);
  expect(parseBarWidth(0)).toBe(0);
  expect(parseBarWidth(null, 30)).toBe(30);
  expect(parseBarWidth(undefined)).toBeUndefined();
  expect(parseBarWidth(NaN, 30)).toBe(30);
  expect(parseBarWidth("bad", 30)).toBe(30);
  expect(parseBarWidth("bad")).toBe(0);
});
test("heatmap legends handle missing data and uniform values", () => {
  expect(generateHeatmapLegends([], ["red"])).toEqual([]);
  expect(
    generateHeatmapLegends(
      [{ size: 10 }, { size: 10 }],
      ["blue", "green", "red"],
      { suffix: "%", decimals: 1 },
    ),
  ).toEqual([{ name: "10.0%", color: "green" }]);
  expect(generateHeatmapLegends([{ size: 0 }], [])).toEqual([
    { name: "0", color: "#FFFFFF" },
  ]);
});
test("heatmap legend buckets preserve palette order and optional outlier/NA labels", () => {
  const data = [{ size: 0 }, { size: 30 }];
  expect(generateHeatmapLegends(data, ["a", "b", "c"])).toEqual([
    { name: "< 10", color: "a" },
    { name: "10 - 20", color: "b" },
    { name: "> 20", color: "c" },
    { name: "> 36 outlier", color: "#DADADA" },
    { name: "N/A", color: "#FFFFFF" },
  ]);
  expect(
    generateHeatmapLegends(data, ["a", "b"], {
      suffix: "%",
      decimals: 1,
      includeNA: false,
      includeOutlier: false,
    }),
  ).toEqual([
    { name: "< 15.0%", color: "a" },
    { name: "> 15.0%", color: "b" },
  ]);
});
test("chart tooltips select category or series names and format money", () => {
  const point = { name: "Country", seriesName: "Funding", value: 1000000 };
  expect(valueFormatter3(point, false)).toBe("Country: 1000000");
  expect(valueFormatter3(point, false, true)).toBe("Funding: 1000000");
  expect(valueFormatter3(point, true)).toMatch(/^Country: /);
  expect(valueFormatter3(point, true)).not.toBe("Country: 1000000");
});
