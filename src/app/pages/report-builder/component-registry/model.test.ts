import {
  createReportItem,
  isCreatableReportItemType,
  isReportItemComplete,
} from "./model";
import type { CreatableReportItemType } from "./model";
import type { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";

const types: CreatableReportItemType[] = [
  "text",
  "chart",
  "table",
  "image",
  "kpi_box",
  "grid",
  "column",
  "section_divider",
];

describe("report component creation", () => {
  test.each(types)(
    "creates independent %s items with unique IDs and overridable options",
    (type) => {
      const first = createReportItem(type);
      const second = createReportItem(type, {
        id: "explicit",
        initialized: true,
        options: { width: "42px" },
      });
      expect(first).toMatchObject({ type, initialized: false });
      expect(first.id).toBeTruthy();
      expect(second).toMatchObject({
        id: "explicit",
        initialized: true,
        options: { width: "42px" },
      });
      expect(createReportItem(type).id).not.toBe(first.id);
      expect(first.options?.width).not.toBe("42px");
    },
  );
  test.each(types)("recognizes supported type %s", (type) =>
    expect(isCreatableReportItemType(type)).toBe(true),
  );
  test.each(["unknown", "", "bad", "toString", "constructor", "__proto__"])(
    "rejects unsupported type %s",
    (type) => expect(isCreatableReportItemType(type)).toBe(false),
  );
  test.each(["chart", "image", "kpi_box"] as const)(
    "uses full cell height for %s in a grid",
    (type) => {
      expect(createReportItem(type, { context: "grid" }).options?.height).toBe(
        "100%",
      );
      expect(createReportItem(type).options?.height).not.toBe("100%");
    },
  );
  test("builds a rectangular grid with unique, evenly sized placeholders", () => {
    const grid = createReportItem("grid", { rows: 2, columns: 3 });
    expect(grid.options?.height).toBe("560px");
    expect(grid.data.items).toHaveLength(6);
    expect(new Set(grid.data.items.map((item) => item.id)).size).toBe(6);
    for (const item of grid.data.items)
      expect(item).toMatchObject({
        type: "unknown",
        initialized: false,
        data: null,
        options: { width: "33%", height: "50%" },
      });
  });
  test("builds columns and isolates mutable factory defaults", () => {
    expect(createReportItem("column", { columns: 4 }).data.items).toHaveLength(
      4,
    );
    const first = createReportItem("kpi_box");
    first.data.topLabel!.value = "Changed";
    first.options!.innerLine.borderColor = "red";
    const second = createReportItem("kpi_box");
    expect(second.data.topLabel!.value).toBe("Top Label");
    expect(second.options!.innerLine.borderColor).toBe("#98A1AA");
    expect(createReportItem("image").data).toMatchObject({
      src: "",
      transformCoordinates: { scale: 1, positionX: 0, positionY: 0 },
    });
    expect(createReportItem("chart").data).toEqual({
      dataset: null,
      chartType: undefined,
      mapping: {},
    });
  });
});

describe("report completion", () => {
  test.each(types.filter((type) => type !== "section_divider"))(
    "new %s is incomplete",
    (type) => expect(isReportItemComplete(createReportItem(type))).toBe(false),
  );
  test.each([
    { ...createReportItem("text"), data: { rte: "<p>Report</p>" } },
    { ...createReportItem("image"), data: { src: "image.png" } },
    { ...createReportItem("table"), data: { dataset: "results" } },
    createReportItem("kpi_box", { initialized: true }),
    createReportItem("section_divider"),
  ])("recognizes complete $type", (item) =>
    expect(isReportItemComplete(item)).toBe(true),
  );
  test.each(["dataset", "chartType", "renderedChartData"])(
    "chart requires %s",
    (missing) => {
      const chart = createReportItem("chart");
      Object.assign(chart.data, {
        dataset: "results",
        chartType: "bar",
        renderedChartData: { renderedContent: "svg" },
      });
      expect(isReportItemComplete(chart)).toBe(true);
      delete (chart.data as Record<string, unknown>)[missing];
      expect(isReportItemComplete(chart)).toBe(false);
    },
  );
  test.each(["grid", "column"] as const)(
    "checks nested %s descendants",
    (type) => {
      const parent = createReportItem(type);
      expect(isReportItemComplete(parent.data.items[0])).toBe(false);
      const inner = createReportItem("column");
      inner.data.items = [createReportItem("section_divider")];
      parent.data.items.push(inner);
      expect(isReportItemComplete(parent)).toBe(true);
      parent.data.items = [] as RBReportItem[];
      expect(isReportItemComplete(parent)).toBe(false);
    },
  );
});
