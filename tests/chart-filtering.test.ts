import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getFilterValues,
  getMatchingFilterValues,
  searchFilterOptions,
  updateFieldFilter,
} from "../src/app/pages/report-builder/builder/components/panel/elements-controller/chart/filtering/utils";

const geography = [
  {
    label: "Europe",
    value: "region-europe",
    subOptions: [
      { label: "France", value: "FR" },
      { label: "Germany", value: "DE" },
    ],
  },
  {
    label: "Africa",
    value: "region-africa",
    subOptions: [
      { label: "Kenya", value: "KE" },
      { label: "France", value: "FR" },
    ],
  },
];

test("counts unique API values across nested groups, not display labels", () => {
  assert.deepEqual(getFilterValues(geography), [
    "region-europe",
    "FR",
    "DE",
    "region-africa",
    "KE",
  ]);
  assert.deepEqual(getFilterValues([]), []);
});

test("value search preserves ancestors and only matching descendants", () => {
  const original = structuredClone(geography);
  assert.deepEqual(searchFilterOptions(geography, "  kEnYa "), [
    {
      label: "Africa",
      value: "region-africa",
      subOptions: [{ label: "Kenya", value: "KE" }],
    },
  ]);
  assert.deepEqual(geography, original);
  assert.deepEqual(searchFilterOptions(geography, "missing"), []);
  assert.deepEqual(searchFilterOptions(geography, " "), geography);
});

test("matching a parent field value keeps its children visible", () => {
  assert.deepEqual(searchFilterOptions(geography, "Europe"), [geography[0]]);
});

test("Select all search matches excludes context-only ancestors", () => {
  assert.deepEqual(getMatchingFilterValues(geography, "Kenya"), ["KE"]);
  assert.deepEqual(getMatchingFilterValues(geography, "France"), ["FR"]);
  assert.deepEqual(getMatchingFilterValues(geography, "Europe"), [
    "region-europe",
    "FR",
    "DE",
  ]);
  assert.deepEqual(
    getMatchingFilterValues(geography, ""),
    getFilterValues(geography),
  );
  assert.deepEqual(getMatchingFilterValues(geography, "missing"), []);
});

test("applying a field preserves other filters and does not mutate saved values", () => {
  const saved = { Component: ["HIV"], Geography: ["DE"] };
  const selected = ["FR", "KE", "FR"];
  const updated = updateFieldFilter(saved, "Geography", selected);
  assert.deepEqual(updated, { Component: ["HIV"], Geography: ["FR", "KE"] });
  assert.deepEqual(saved, { Component: ["HIV"], Geography: ["DE"] });
  assert.deepEqual(selected, ["FR", "KE", "FR"]);
});

test("applying Clear removes only that field's filter", () => {
  const saved = { Component: ["HIV"], Geography: ["DE"] };
  assert.deepEqual(updateFieldFilter(saved, "Geography", []), {
    Component: ["HIV"],
  });
  assert.deepEqual(saved.Geography, ["DE"]);
  assert.deepEqual(updateFieldFilter({}, "Geography", []), {});
});
