import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { createStore, StoreProvider } from "easy-peasy";
import {
  MappedDimension,
  RBReportItem,
  RBReportItemsControllerState,
  RBReportItemsState,
  ReportItemOf,
} from "app/state/api/action-reducers/report-builder/sync";
import { createReportItem } from "app/pages/report-builder/component-registry/model";
import ChartSelectModal from "./index";

jest.mock("app/hooks/useCMSData", () => ({ useCMSData: () => ({}) }));
// rb-core.charts can't load under jest; these are its bar, line and pie
// dimensions.
jest.mock(
  "app/pages/report-builder/builder/components/panel/elements-controller/chart/utils",
  () => {
    const any = ["number", "string", "date"];
    const dimensions: Record<string, unknown[]> = {
      bar: [
        { id: "bars", name: "Category", validTypes: any, required: true },
        {
          id: "size",
          name: "Value",
          validTypes: ["number"],
          required: true,
          aggregation: true,
        },
        { id: "breakdown", name: "Breakdown", validTypes: any },
      ],
      line: [
        { id: "x", name: "X Axis", validTypes: any, required: true },
        {
          id: "y",
          name: "Y Axis",
          validTypes: ["number"],
          required: true,
          multiple: true,
          aggregation: true,
        },
      ],
      pie: [
        { id: "category", name: "Category", validTypes: any, required: true },
        {
          id: "value",
          name: "Value",
          validTypes: ["number"],
          required: true,
          aggregation: true,
        },
      ],
    };
    return {
      getDimensions: (chartType: string) => dimensions[chartType] ?? [],
      getDefaultVisualOptions: () => ({}),
    };
  },
);

const category = { value: ["Country"], mappedType: ["string"] };
const disbursement = {
  value: ["Disbursement"],
  mappedType: ["number"],
  config: { aggregation: ["sum"] },
};

const setup = (chartType: "bar" | "pie", mapping: MappedDimension) => {
  const store = createStore({
    RBReportItemsState,
    RBReportItemsControllerState,
  });
  const chart = createReportItem("chart", { id: "chart", initialized: true });
  chart.data = {
    ...chart.data,
    chartType,
    mapping,
    dataset: "gf_results",
    renderedChartData: {} as ReportItemOf<"chart">["data"]["renderedChartData"],
  };
  store.getActions().RBReportItemsState.hydrateReport({
    id: "report",
    name: "Report",
    description: "",
    settings: RBReportItemsState.settings,
    items: [chart as RBReportItem],
  });
  store.getActions().RBReportItemsControllerState.setItem({
    id: "chart",
    type: "chart",
    open: true,
  });
  const onClose = jest.fn();
  const onSwitch = jest.fn();
  render(
    <StoreProvider store={store}>
      <ChartSelectModal open onClose={onClose} onSwitch={onSwitch} />
    </StoreProvider>,
  );
  const chartData = () =>
    (store.getState().RBReportItemsState.items[0] as ReportItemOf<"chart">)
      .data;
  return { chartData, onClose, onSwitch };
};

const useChartType = (id: string) => {
  const card = document.querySelector(
    `[data-cy="rb-chart-type-card"][data-id="${id}"]`,
  );
  fireEvent.click(card!);
  fireEvent.click(screen.getByRole("button", { name: /Use this Chart/ }));
};

test("switching type keeps the fields that fit", () => {
  const { chartData, onClose, onSwitch } = setup("pie", {
    category,
    value: disbursement,
  });
  useChartType("line");

  expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  expect(chartData()).toMatchObject({
    chartType: "line",
    mapping: { x: category, y: disbursement },
    // The pie's data isn't drawn as a line while the line's loads.
    renderedChartData: null,
  });
  expect(onSwitch).toHaveBeenCalledWith({
    from: "Pie Chart",
    to: "Line Chart",
    kept: [
      { field: "Country", from: "Category", to: "X Axis" },
      { field: "Disbursement", from: "Value", to: "Y Axis" },
    ],
    removed: [],
  });
  expect(onClose).toHaveBeenCalled();
});

test("switching type asks before removing fields that don't fit", () => {
  const breakdown = { value: ["Component"], mappedType: ["string"] };
  const { chartData, onClose } = setup("bar", {
    bars: category,
    size: disbursement,
    breakdown,
  });
  useChartType("line");

  const dialog = screen.getByRole("alertdialog");
  expect(dialog).toHaveTextContent(
    "Switching to Line Chart will remove your Breakdown field — continue?",
  );
  expect(dialog).toHaveTextContent("Breakdown: Component");
  expect(chartData().chartType).toBe("bar");

  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  expect(chartData()).toMatchObject({
    chartType: "bar",
    mapping: { bars: category, size: disbursement, breakdown },
  });
  expect(onClose).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: /Use this Chart/ }));
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(chartData()).toMatchObject({
    chartType: "line",
    mapping: { x: category, y: disbursement },
  });
  expect(onClose).toHaveBeenCalled();
});

test("keeping the same type leaves the chart as it was", () => {
  const { chartData, onSwitch } = setup("pie", { category });
  useChartType("pie");
  expect(chartData()).toMatchObject({
    chartType: "pie",
    mapping: { category },
    renderedChartData: {},
  });
  expect(onSwitch).not.toHaveBeenCalled();
});
