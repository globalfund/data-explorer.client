import React from "react";
import { render, screen } from "@testing-library/react";
import { createStore, StoreProvider } from "easy-peasy";
import { RBReportItemsState } from "app/state/api/action-reducers/report-builder/sync";
import { createReportItem } from "app/pages/report-builder/component-registry/model";
import { Component as ReportBuilderPreview } from "./index";

jest.mock("@auth0/auth0-react", () => ({
  withAuthenticationRequired: (component: unknown) => component,
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "report-1" }),
}));
jest.mock("app/hooks/queries/report-builder", () => ({
  useGetReport: () => mockReportQuery,
}));
jest.mock("app/pages/report-builder/component-registry/renderer", () => ({
  ReportItemContent: ({ item }: { item: { id: string } }) =>
    require("react").createElement("div", null, `item ${item.id}`),
}));
jest.mock(
  "app/pages/report-builder/builder/components/order-container/view",
  () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => children,
  }),
);
jest.mock("app/pages/report-builder/builder/components/empty-preview", () => ({
  EmptyPreview: () => null,
}));
jest.mock("app/components/page-loader", () => ({ PageLoader: () => null }));

const savedReport = {
  id: "report-1",
  name: "Saved",
  description: "",
  settings: RBReportItemsState.settings,
  items: [createReportItem("section_divider", { id: "saved" })],
};
const mockReportQuery = {
  data: { data: savedReport },
  isLoading: false,
  isError: false,
  error: null,
};

const setup = ({ draftOf }: { draftOf?: string } = {}) => {
  const store = createStore({ RBReportItemsState });
  if (draftOf) {
    const actions = store.getActions().RBReportItemsState;
    actions.hydrateReport({
      ...savedReport,
      id: draftOf,
      items: [createReportItem("section_divider", { id: "draft" })],
    });
    actions.setName("Draft");
  }
  const view = render(
    <StoreProvider store={store}>
      <ReportBuilderPreview />
    </StoreProvider>,
  );
  return { store, ...view };
};

test("an unsaved draft of the report is kept and left for the editor", () => {
  const { store, unmount } = setup({ draftOf: "report-1" });
  expect(screen.getByText("item draft")).toBeInTheDocument();
  expect(screen.queryByText("item saved")).not.toBeInTheDocument();
  unmount();
  expect(store.getState().RBReportItemsState).toMatchObject({
    id: "report-1",
    name: "Draft",
    dirty: true,
  });
});

test.each([{}, { draftOf: "another-report" }])(
  "otherwise the saved report is shown and cleared on leaving (%p)",
  (options) => {
    const { store, unmount } = setup(options);
    expect(screen.getByText("item saved")).toBeInTheDocument();
    unmount();
    expect(store.getState().RBReportItemsState).toMatchObject({
      id: "",
      items: [],
      dirty: false,
    });
  },
);
