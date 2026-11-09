import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { createStore, StoreProvider } from "easy-peasy";
import {
  RBReportItemsControllerState,
  RBReportRTEState,
} from "app/state/api/action-reducers/report-builder/sync";
import ElementsController from "./index";

// A declaration, so it exists before the hoisted jest.mock calls run.
function mockPanel(name: string) {
  return {
    __esModule: true,
    default: () => require("react").createElement("div", null, `${name} panel`),
  };
}
jest.mock("./text", () => mockPanel("text"));
jest.mock("./image", () => mockPanel("image"));
jest.mock("./kpi", () => mockPanel("kpi"));
jest.mock("./section-divider", () => mockPanel("divider"));
jest.mock("./grid", () => mockPanel("grid"));
jest.mock("./column", () => mockPanel("column"));
jest.mock("./table", () => mockPanel("table"));
// Fails on the same data that broke its chart.
jest.mock("./chart", () => ({
  __esModule: true,
  default: () => {
    throw new Error("bad chart data");
  },
}));
jest.mock("react-draggable", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

const setup = () => {
  const store = createStore({ RBReportItemsControllerState, RBReportRTEState });
  render(
    <StoreProvider store={store}>
      <ElementsController />
    </StoreProvider>,
  );
  const select = (type: "chart" | "table") =>
    act(() =>
      store
        .getActions()
        .RBReportItemsControllerState.setItem({ id: type, type, open: true }),
    );
  return { store, select };
};

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

test("a settings panel that fails shows a message instead of the error page", () => {
  const { store, select } = setup();
  select("chart");
  expect(screen.getByRole("alert")).toHaveTextContent(
    "The settings for this element couldn't be displayed.",
  );
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(store.getState().RBReportItemsControllerState.item).toBeNull();
});

test("selecting another element shows its panel again", () => {
  const { select } = setup();
  select("chart");
  expect(screen.getByRole("alert")).toBeInTheDocument();
  select("table");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByText("table panel")).toBeInTheDocument();
});
