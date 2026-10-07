import { createStore } from "easy-peasy";
import {
  RBReportItemsState,
  RBReportItemsControllerState,
  RBReportItemOrderState,
  RBReportNotesState,
  RBReportRTEState,
  RBTooltipTriggerState,
  FilterOptionGroupsState,
} from "./sync";
import { createReportItem } from "app/pages/report-builder/component-registry/model";

const makeStore = () => createStore({ report: RBReportItemsState });
let store: ReturnType<typeof makeStore>;
beforeEach(() => {
  store = makeStore();
});
const report = () => store.getState().report;
const actions = () => store.getActions().report;
const seed = () => {
  actions().hydrateReport({
    id: "report-1",
    name: "Saved",
    description: "Description",
    settings: { ...report().settings, width: "800" },
    items: [createReportItem("text", { id: "text-1" })],
  });
};

test("hydrates saved reports cleanly and resets the whole draft", () => {
  seed();
  expect(report()).toMatchObject({
    id: "report-1",
    name: "Saved",
    description: "Description",
    dirty: false,
    settings: { width: "800" },
  });
  actions().setName("Draft");
  actions().resetReport();
  expect(report()).toMatchObject({
    id: "",
    name: "",
    description: "",
    items: [],
    dirty: false,
    settings: { width: "0", padding: ["50", "50", "50", "50"] },
  });
});
test("name changes mark dirty but an unchanged name stays clean", () => {
  seed();
  actions().setName("Saved");
  expect(report().dirty).toBe(false);
  actions().setName("Changed");
  expect(report().dirty).toBe(true);
  actions().markClean();
  expect(report().dirty).toBe(false);
});
test("adds, reorders, edits and removes items without losing other content", () => {
  seed();
  const image = createReportItem("image", { id: "image" });
  actions().addItem(image);
  expect(report().dirty).toBe(true);
  actions().markClean();
  actions().setItems([...report().items].reverse());
  expect(report().items.map((i) => i.id)).toEqual(["image", "text-1"]);
  expect(report().dirty).toBe(true);
  actions().editItem({ ...image, data: { src: "image.png" } });
  expect(report().items[0].data).toEqual({ src: "image.png" });
  actions().removeItem("image");
  expect(report().items.map((i) => i.id)).toEqual(["text-1"]);
  actions().clearItems();
  expect(report().items).toEqual([]);
});
test("identical persisted items do not trigger autosave", () => {
  seed();
  actions().setItems(JSON.parse(JSON.stringify(report().items)));
  actions().editItem({ ...report().items[0] });
  expect(report().dirty).toBe(false);
});
test("invalid edit/remove/duplicate targets preserve state and clean status", () => {
  seed();
  const before = report();
  actions().removeItem("absent");
  actions().editItem(createReportItem("text", { id: "absent" }));
  actions().duplicateItem("absent");
  for (const gridId of ["absent", "text-1"]) {
    actions().editGridItem({ gridId, item: createReportItem("text") });
    actions().deleteGridItem({ gridId, itemId: "absent" });
    actions().duplicateGridItem({ gridId, itemId: "absent" });
  }
  expect(report()).toEqual(before);
});
test("clearing an empty draft stays clean", () => {
  actions().clearItems();
  expect(report().dirty).toBe(false);
});
test("settings and metadata are saved together; resetting settings restores defaults", () => {
  seed();
  actions().setReportSettings({
    name: "New",
    description: "New description",
    settings: { ...report().settings, backgroundColor: "red" },
  });
  expect(report()).toMatchObject({
    name: "New",
    description: "New description",
    dirty: true,
    settings: { backgroundColor: "red" },
  });
  actions().markClean();
  actions().resetSettings();
  expect(report()).toMatchObject({
    dirty: true,
    settings: {
      width: "0",
      height: "0",
      backgroundColor: "#FFFFFF",
      strokeColor: "#000000",
      borderRadius: "0",
    },
  });
});
test.each(["grid", "column"] as const)(
  "edits and deletes %s children while preserving slot layout",
  (type) => {
    const parent = createReportItem(type, { id: "parent", columns: 2 });
    const child = createReportItem("image", {
      id: parent.data.items[0].id,
      options: { width: "50%", height: "220px" },
    });
    parent.data.items[0] = child;
    actions().setItems([parent]);
    actions().markClean();
    actions().editGridItem({ gridId: "parent", item: { ...child } });
    expect(report().dirty).toBe(false);
    actions().editGridItem({
      gridId: "parent",
      item: { ...child, data: { src: "new.png" } },
    });
    expect(report().dirty).toBe(true);
    actions().markClean();
    actions().deleteGridItem({ gridId: "parent", itemId: child.id });
    const current = report().items[0] as typeof parent;
    expect(current.data.items).toHaveLength(2);
    expect(current.data.items[0]).toEqual({
      id: child.id,
      type: "unknown",
      initialized: false,
      data: null,
      options: { width: "50%", height: "220px" },
    });
    expect(current.data.items[1]).toEqual(parent.data.items[1]);
    expect(report().dirty).toBe(true);
  },
);
test("deleting a child without dimensions restores full slot size", () => {
  const parent = createReportItem("column");
  parent.data.items = [createReportItem("section_divider", { id: "child" })];
  delete parent.data.items[0].options;
  actions().setItems([parent]);
  actions().deleteGridItem({ gridId: parent.id, itemId: "child" });
  expect((report().items[0] as typeof parent).data.items[0].options).toEqual({
    width: "100%",
    height: "100%",
  });
});
test.each(["grid", "column"] as const)(
  "duplicates %s with fresh parent and child IDs",
  (type) => {
    const parent = createReportItem(type, { columns: 2 });
    actions().setItems([parent, createReportItem("text", { id: "last" })]);
    actions().markClean();
    actions().duplicateItem(parent.id);
    const copy = report().items[1] as typeof parent;
    expect(copy.id).not.toBe(parent.id);
    expect(copy.data.items.map((i) => i.id)).not.toEqual(
      parent.data.items.map((i) => i.id),
    );
    expect(
      new Set([...parent.data.items, ...copy.data.items].map((i) => i.id)).size,
    ).toBe(4);
    expect(copy.data.items.map((i) => i.options)).toEqual(
      parent.data.items.map((i) => i.options),
    );
    expect(report().items[2].id).toBe("last");
    expect(report().dirty).toBe(true);
  },
);
test("duplicates a leaf adjacent to the original without altering it", () => {
  seed();
  actions().duplicateItem("text-1");
  expect(report().items).toHaveLength(2);
  expect(report().items[1]).toEqual({
    ...report().items[0],
    id: expect.any(String),
  });
  expect(report().items[1].id).not.toBe("text-1");
});
test("duplicating a column child inserts next to it and redistributes widths", () => {
  const parent = createReportItem("column", { columns: 2 });
  actions().setItems([parent]);
  actions().duplicateGridItem({
    gridId: parent.id,
    itemId: parent.data.items[0].id,
  });
  const current = report().items[0] as typeof parent;
  expect(current.data.columns).toBe(3);
  expect(current.data.items.map((i) => i.options?.width)).toEqual([
    "33.33%",
    "33.33%",
    "33.33%",
  ]);
  expect(current.data.items[2].id).toBe(parent.data.items[1].id);
  expect(current.data.items[1].id).not.toBe(parent.data.items[0].id);
});
test.each(["grid", "column"] as const)(
  "missing %s child operations are harmless",
  (type) => {
    const parent = createReportItem(type);
    actions().setItems([parent]);
    actions().markClean();
    actions().editGridItem({
      gridId: parent.id,
      item: createReportItem("text", { id: "missing" }),
    });
    actions().deleteGridItem({ gridId: parent.id, itemId: "missing" });
    actions().duplicateGridItem({ gridId: parent.id, itemId: "missing" });
    expect(report().items).toEqual([parent]);
    expect(report().dirty).toBe(false);
  },
);
test("editor transient state actions do not alter persisted report state", () => {
  const editor = createStore({
    controller: RBReportItemsControllerState,
    order: RBReportItemOrderState,
    notes: RBReportNotesState,
    rte: RBReportRTEState,
    tooltip: RBTooltipTriggerState,
    filters: FilterOptionGroupsState,
  });
  const a = editor.getActions();
  a.controller.setItem({ id: "one", type: "text", open: true });
  expect(editor.getState().controller.item?.id).toBe("one");
  a.controller.clearItem();
  expect(editor.getState().controller.item).toBeNull();
  a.order.setIsDragging({ rowId: "one", isDragging: true });
  expect(editor.getState().order).toEqual({ itemId: "one", isDragging: true });
  a.notes.setValue("Notes");
  a.rte.setContent("<p>Text</p>");
  a.rte.setActiveRTE(null);
  a.tooltip.setValue({ visible: true, id: "one" });
  a.filters.setValue([{ name: "country", options: [] }]);
  expect(editor.getState()).toMatchObject({
    notes: { value: "Notes" },
    rte: { content: "<p>Text</p>", activeRTE: null },
    tooltip: { tooltip: { visible: true, id: "one" } },
    filters: { value: [{ name: "country", options: [] }] },
  });
});
