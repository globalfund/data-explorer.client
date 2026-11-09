import React from "react";
import { act, render, screen } from "@testing-library/react";
import { createStore, StoreProvider } from "easy-peasy";
import {
  FilterOptionGroupsState,
  RBReportItemsControllerState,
  RBReportItemsState,
  ReportItemOf,
} from "app/state/api/action-reducers/report-builder/sync";
import { createReportItem } from "app/pages/report-builder/component-registry/model";
import { ReportBuilderPageChart } from "./index";

const mockChartProps: { current: Record<string, any> | null } = {
  current: null,
};
jest.mock("./chart-component", () => ({
  __esModule: true,
  default: (props: Record<string, any>) => {
    mockChartProps.current = props;
    return require("react").createElement("div", { "data-testid": "chart" });
  },
}));
jest.mock("./placeholders/placeholder", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../panel/elements-controller/chart/utils", () => ({
  checkValidDimensionMapping: () => true,
}));
const mockRenderChartData = {
  mutate: jest.fn(),
  reset: jest.fn(),
  isError: false,
  error: null as unknown,
};
jest.mock("app/hooks/queries/report-builder", () => ({
  useRenderChartData: () => mockRenderChartData,
}));

const barChart = (initialized: boolean) => {
  const chart = createReportItem("chart", {
    id: "chart",
    context: "grid",
    initialized,
  });
  chart.data = {
    ...chart.data,
    chartType: "bar",
    dataset: "dataset",
    mapping: {},
    renderedChartData: {} as ReportItemOf<"chart">["data"]["renderedChartData"],
  };
  return chart;
};

const setup = (
  chart: ReportItemOf<"chart">,
  { inGrid = false, viewMode = false } = {},
) => {
  const store = createStore({
    RBReportItemsState,
    RBReportItemsControllerState,
    FilterOptionGroupsState,
  });
  if (inGrid) {
    const grid = createReportItem("grid", { id: "grid" });
    grid.data.items = [chart];
    store.getActions().RBReportItemsState.addItem(grid);
  } else {
    store.getActions().RBReportItemsState.addItem(chart);
  }
  render(
    <StoreProvider store={store}>
      <ReportBuilderPageChart
        id="chart"
        viewMode={viewMode}
        parent={inGrid ? { id: "grid", type: "grid" } : undefined}
      />
    </StoreProvider>,
  );
  return store;
};

const gridChild = (store: ReturnType<typeof setup>) => {
  const [grid] = store.getState().RBReportItemsState.items;
  return grid.type === "grid" ? grid.data.items[0] : undefined;
};

beforeEach(() => {
  mockChartProps.current = null;
  Object.assign(mockRenderChartData, { isError: false, error: null });
});

test("a zoom saved after a grid chart is deleted doesn't bring it back", () => {
  const store = setup(barChart(true), { inGrid: true });
  const { setVisualOptions } = mockChartProps.current!;

  act(() => setVisualOptions({ dataZoomStart: 10 }));
  expect(gridChild(store)?.options).toEqual({ dataZoomStart: 10 });

  act(() =>
    store
      .getActions()
      .RBReportItemsState.deleteGridItem({ gridId: "grid", itemId: "chart" }),
  );
  // The debounced zoom is flushed by the setter of the chart's last render.
  act(() => setVisualOptions({ dataZoomStart: 20 }));
  expect(gridChild(store)).toMatchObject({ id: "chart", type: "unknown" });
});

test("an uninitialized chart whose data fails to load shows the error", () => {
  Object.assign(mockRenderChartData, {
    isError: true,
    error: { isAxiosError: true, response: { status: 404 } },
  });
  // Asset pages load their chart like this, in view mode.
  setup(barChart(false), { viewMode: true });
  expect(screen.getByRole("alert")).toHaveTextContent(
    "The data for this chart is no longer available.",
  );
});
