import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { createStore, StoreProvider } from "easy-peasy";
import {
  RBReportItem,
  RBReportItemsControllerState,
  RBReportItemsState,
} from "app/state/api/action-reducers/report-builder/sync";
import { createReportItem } from "app/pages/report-builder/component-registry/model";
import VisualOptions from "../../common/visual-options";
import ChartTitleField from "./index";

// rb-core.charts can't load under jest; titles only need the bar chart's
// dimensions.
jest.mock("../utils", () => ({
  getDimensions: () => [
    { id: "bars", required: true },
    { id: "size", required: true, aggregation: true },
  ],
}));

const setup = (options: Record<string, any> = {}) => {
  const store = createStore({
    RBReportItemsState,
    RBReportItemsControllerState,
  });
  const chart = {
    ...createReportItem("chart", {
      id: "chart",
      initialized: true,
      options: { showChartName: true, ...options },
    }),
    data: {
      dataset: "gf_results",
      chartType: "bar",
      mapping: {
        bars: { value: ["Component"], mappedType: ["string"] },
        size: {
          value: ["Result"],
          mappedType: ["number"],
          config: { aggregation: ["sum"] },
        },
      },
      appliedFilters: { Year: [2020, 2021, 2022, 2023, 2024] },
    },
  } as RBReportItem;
  store.getActions().RBReportItemsState.hydrateReport({
    id: "report",
    name: "Report",
    description: "",
    settings: RBReportItemsState.settings,
    items: [chart],
  });
  store.getActions().RBReportItemsControllerState.setItem({
    id: "chart",
    type: "chart",
    open: true,
  });
  const chartOptions = () =>
    store.getState().RBReportItemsState.items[0].options as Record<string, any>;
  return { store, chartOptions };
};

const renderField = (options?: Record<string, any>) => {
  const result = setup(options);
  render(
    <StoreProvider store={result.store}>
      <ChartTitleField />
    </StoreProvider>,
  );
  return { ...result, input: screen.getByLabelText("Chart title") };
};

const typeTitle = (input: HTMLElement, value: string) => {
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
};

test("a new chart's title is suggested from its data", () => {
  const { input } = renderField({ chartTitle: "", chartTitleAuto: true });
  expect(input).toHaveValue("Result by Component (2020–2024)");
  expect(input).toHaveAttribute("placeholder", "Add a chart title…");
  expect(
    screen.getByText(/Suggested from the chart's data/),
  ).toBeInTheDocument();
});

test("a chart saved with the old default title gets one from its data", () => {
  const { input } = renderField({ chartTitle: "Bar Chart" });
  expect(input).toHaveValue("Result by Component (2020–2024)");
});

test("an author's title replaces the suggested one until they use it again", () => {
  const { input, chartOptions } = renderField();
  typeTitle(input, "  Results by disease ");
  expect(chartOptions()).toMatchObject({
    chartTitle: "Results by disease",
    chartTitleAuto: false,
  });
  expect(input).toHaveValue("Results by disease");

  fireEvent.click(screen.getByRole("button", { name: "Use it" }));
  expect(chartOptions()).toMatchObject({
    chartTitle: "",
    chartTitleAuto: true,
  });
  expect(input).toHaveValue("Result by Component (2020–2024)");
});

test("a blank title is kept and flagged as required", () => {
  const { input, chartOptions } = renderField();
  typeTitle(input, "");
  expect(chartOptions()).toMatchObject({
    chartTitle: "",
    chartTitleAuto: false,
  });
  expect(input).toHaveValue("");
  expect(
    screen.getByText(/A chart title is required before sharing the report/),
  ).toBeInTheDocument();
});

test("leaving the title as it was, or pressing Escape, changes nothing", () => {
  const { input, store } = renderField({
    chartTitle: "",
    chartTitleAuto: true,
  });
  const before = store.getState().RBReportItemsState.items;
  typeTitle(input, "Result by Component (2020–2024)");
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "Abandoned" } });
  fireEvent.keyDown(input, { key: "Escape" });
  fireEvent.blur(input);
  expect(store.getState().RBReportItemsState.items).toBe(before);
  expect(input).toHaveValue("Result by Component (2020–2024)");
});

test("saving other options doesn't undo a title edited meanwhile on the chart", () => {
  jest.useFakeTimers();
  const { store, chartOptions } = setup({ showLegend: true });
  render(
    <StoreProvider store={store}>
      <VisualOptions
        tab="layout"
        defaultOptionsToDisplay={{
          showLegend: { type: "boolean", label: "Show Legend", tab: "layout" },
        }}
      />
    </StoreProvider>,
  );
  fireEvent.click(screen.getByRole("checkbox"));
  // The title is edited on the chart before the option is saved.
  act(() => {
    store.getActions().RBReportItemsState.editItem({
      ...store.getState().RBReportItemsState.items[0],
      options: {
        ...chartOptions(),
        chartTitle: "Results",
        chartTitleAuto: false,
      },
    } as RBReportItem);
  });
  act(() => {
    jest.advanceTimersByTime(500);
  });
  expect(chartOptions()).toMatchObject({
    showLegend: false,
    chartTitle: "Results",
    chartTitleAuto: false,
  });
  jest.useRealTimers();
});
