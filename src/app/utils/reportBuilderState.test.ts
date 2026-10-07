import {
  hydrateReportItems,
  persistedReportItemsChanged,
  prepareReportItemsForSave,
} from "./reportBuilderState";
import { createReportItem } from "app/pages/report-builder/component-registry/model";

test("round-trips nested report data without stripping settings or modifying input", () => {
  const grid = createReportItem("grid");
  grid.data.items = [createReportItem("image")];
  const items = [grid];
  const before = JSON.parse(JSON.stringify(items));
  expect(hydrateReportItems(prepareReportItemsForSave(items))).toEqual(before);
  expect(items).toEqual(before);
});
test("equivalent persisted copies stay unchanged; nested edits and order changes are detected", () => {
  const grid = createReportItem("grid");
  const items = [grid, createReportItem("text")];
  expect(
    persistedReportItemsChanged(items, JSON.parse(JSON.stringify(items))),
  ).toBe(false);
  expect(persistedReportItemsChanged(items, [...items].reverse())).toBe(true);
  const copy = JSON.parse(JSON.stringify(items));
  copy[0].data.items[0].options.width = "25%";
  expect(persistedReportItemsChanged(items, copy)).toBe(true);
  expect(persistedReportItemsChanged([], [])).toBe(false);
  expect(persistedReportItemsChanged([], items)).toBe(true);
});
