import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { StoreProvider, createStore } from "easy-peasy";
import { MemoryRouter } from "react-router-dom";
import { RBReportItemsState } from "app/state/api/action-reducers/report-builder/sync";
import { createReportItem } from "../../../component-registry/model";
import { ReportBuilderPageHeader } from "./index";

jest.mock("app/utils/exportReport", () => ({
  exportReportFromServer: jest.fn(),
}));
jest.mock("app/hooks/useCMSData", () => ({ useCMSData: () => ({}) }));
jest.mock("app/hooks/queries/report-builder", () => ({
  usePatchReport: () => mockMutation,
  useGetReport: () => mockReportQuery,
  useGetAsset: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "report-1" }),
}));
jest.mock("./add-component", () => ({ __esModule: true, default: () => null }));
jest.mock("../asset-library-modal", () => ({ AssetLibraryModal: () => null }));
jest.mock("app/pages/report-builder/main/components/use-asset-modal", () => ({
  ReportBuilderUseAssetModal: () => null,
}));
jest.mock("app/pages/report-builder/main/components/new-report-modal", () => ({
  ReportBuilderNewReportModal: () => null,
}));
jest.mock(
  "app/pages/report-builder/main/components/report-issue-modal",
  () => ({ ReportBuilderReportIssueModal: () => null }),
);
const mockMutation = {
  mutate: jest.fn(),
  reset: jest.fn(),
  isPending: false,
  isSuccess: false,
  isError: false,
  isPaused: false,
  error: null,
};
const mockReportQuery = { isError: false };
const setup = (
  options: { dirty?: boolean; id?: string; preview?: boolean } = {},
) => {
  window.history.replaceState(
    {},
    "",
    options.preview
      ? "/report-builder/reports/report-1"
      : "/report-builder/reports/report-1/edit",
  );
  const store = createStore({ RBReportItemsState });
  store.getActions().RBReportItemsState.hydrateReport({
    id: options.id ?? "report-1",
    name: "Report",
    description: "Description",
    settings: RBReportItemsState.settings,
    items: [
      createReportItem("text", { id: "empty" }),
      createReportItem("section_divider", { id: "complete" }),
    ],
  });
  if (options.dirty) store.getActions().RBReportItemsState.setName("Draft");
  const tree = () => (
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <StoreProvider store={store}>
        <ReportBuilderPageHeader />
      </StoreProvider>
    </MemoryRouter>
  );
  const view = render(tree());
  return { store, ...view, rerenderHeader: () => view.rerender(tree()) };
};
beforeEach(() => {
  jest.useFakeTimers();
  mockReportQuery.isError = false;
  Object.assign(mockMutation, {
    isPending: false,
    isSuccess: false,
    isError: false,
    isPaused: false,
    error: null,
  });
});
afterEach(() => {
  jest.useRealTimers();
});
const advance = (ms = 2000) =>
  act(() => {
    jest.advanceTimersByTime(ms);
  });
test("clean reports never autosave", () => {
  setup();
  advance();
  expect(mockMutation.mutate).not.toHaveBeenCalled();
});
test("dirty report saves after two seconds, including incomplete items", () => {
  const { store } = setup({ dirty: true });
  advance(1999);
  expect(mockMutation.mutate).not.toHaveBeenCalled();
  advance(1);
  expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
  expect(mockMutation.mutate).toHaveBeenCalledWith(
    {
      name: "Draft",
      description: "Description",
      settings: RBReportItemsState.settings,
      items: store.getState().RBReportItemsState.items,
    },
    expect.any(Object),
  );
  const [, callbacks] = mockMutation.mutate.mock.calls[0];
  act(() => callbacks.onSuccess());
  expect(store.getState().RBReportItemsState.dirty).toBe(false);
});
test("rapid edits restart the debounce and save only the latest content", () => {
  const { store } = setup({ dirty: true });
  advance(1500);
  act(() => store.getActions().RBReportItemsState.setName("Latest"));
  advance(1500);
  expect(mockMutation.mutate).not.toHaveBeenCalled();
  advance(500);
  expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
  expect(mockMutation.mutate.mock.calls[0][0].name).toBe("Latest");
});
test("an old save response cannot clear newer unsaved edits", () => {
  const { store } = setup({ dirty: true });
  advance();
  const [, callbacks] = mockMutation.mutate.mock.calls[0];
  act(() => store.getActions().RBReportItemsState.setName("Newer draft"));
  act(() => callbacks.onSuccess());
  expect(store.getState().RBReportItemsState.dirty).toBe(true);
  advance();
  expect(mockMutation.mutate.mock.calls[1][0].name).toBe("Newer draft");
});
test.each([{ preview: true }, { id: "different-report" }])(
  "autosave is blocked for %p",
  (options) => {
    setup({ ...options, dirty: true });
    advance();
    expect(mockMutation.mutate).not.toHaveBeenCalled();
  },
);
test("pending saves block overlapping requests", () => {
  mockMutation.isPending = true;
  setup({ dirty: true });
  advance();
  expect(mockMutation.mutate).not.toHaveBeenCalled();
  expect(screen.getByText("Saving...")).toBeInTheDocument();
});
test("failed saves retain the dirty draft and show an error", () => {
  mockMutation.isError = true;
  const { store } = setup({ dirty: true });
  expect(screen.getByText(/Couldn't save changes/)).toBeInTheDocument();
  expect(store.getState().RBReportItemsState.dirty).toBe(true);
});
test.each([403, 404])(
  "a %i save error stops autosave from retrying",
  (status) => {
    Object.assign(mockMutation, {
      isError: true,
      error: { isAxiosError: true, response: { status } },
    });
    const { store } = setup({ dirty: true });
    advance();
    expect(mockMutation.mutate).not.toHaveBeenCalled();
    expect(store.getState().RBReportItemsState.dirty).toBe(true);
  },
);
test("a server error still retries the save", () => {
  Object.assign(mockMutation, {
    isError: true,
    error: { isAxiosError: true, response: { status: 500 } },
  });
  setup({ dirty: true });
  advance();
  expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
});
test("offline saves show a connection warning", () => {
  mockMutation.isPaused = true;
  setup();
  expect(
    screen.getByText(/changes will sync when connection is restored/),
  ).toBeInTheDocument();
});
test("renaming through the input updates the draft and schedules a save", () => {
  const { store } = setup();
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "Renamed" },
  });
  expect(store.getState().RBReportItemsState.name).toBe("Renamed");
  advance();
  expect(mockMutation.mutate.mock.calls[0][0].name).toBe("Renamed");
});
test("preview disables renaming and unmount cancels scheduled saves", () => {
  const { unmount } = setup({ dirty: true, preview: true });
  expect(screen.getByRole("textbox")).toBeDisabled();
  unmount();
  advance();
  expect(mockMutation.mutate).not.toHaveBeenCalled();
});
test("saved status resets after five seconds", () => {
  mockMutation.isSuccess = true;
  setup();
  expect(screen.getByText("Saved")).toBeInTheDocument();
  advance(4999);
  expect(mockMutation.reset).not.toHaveBeenCalled();
  advance(1);
  expect(mockMutation.reset).toHaveBeenCalledTimes(1);
});
test("failed saves back off before retrying", () => {
  setup({ dirty: true });
  advance();
  expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
  act(() => mockMutation.mutate.mock.calls[0][1].onError());
  advance(3999);
  expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
  advance(1);
  expect(mockMutation.mutate).toHaveBeenCalledTimes(2);
  act(() => mockMutation.mutate.mock.calls[1][1].onError());
  advance(7999);
  expect(mockMutation.mutate).toHaveBeenCalledTimes(2);
  advance(1);
  expect(mockMutation.mutate).toHaveBeenCalledTimes(3);
});
test("switching to preview saves pending edits straight away", () => {
  const { rerenderHeader } = setup({ dirty: true });
  advance(500);
  window.history.replaceState({}, "", "/report-builder/reports/report-1");
  rerenderHeader();
  expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
  expect(mockMutation.mutate.mock.calls[0][0].name).toBe("Draft");
  advance(5000);
  expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
});
test("leaving the editor saves pending edits", () => {
  const { unmount } = setup({ dirty: true });
  advance(500);
  unmount();
  expect(mockMutation.mutate).toHaveBeenCalledTimes(1);
  expect(mockMutation.mutate.mock.calls[0][0].name).toBe("Draft");
});
test("leaving a clean editor saves nothing", () => {
  const { unmount } = setup();
  unmount();
  expect(mockMutation.mutate).not.toHaveBeenCalled();
});
test("closing the tab with unsaved edits asks for confirmation", () => {
  const { store } = setup({ dirty: true });
  const dirtyClose = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(dirtyClose);
  expect(dirtyClose.defaultPrevented).toBe(true);
  act(() => store.getActions().RBReportItemsState.markClean());
  const cleanClose = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(cleanClose);
  expect(cleanClose.defaultPrevented).toBe(false);
});
test.each([false, true])(
  "a report that can't be loaded shows no name or actions (preview: %s)",
  (preview) => {
    mockReportQuery.isError = true;
    setup({ preview, dirty: true });
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByText("Preview")).not.toBeInTheDocument();
    expect(screen.queryByText("Back to Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Share")).not.toBeInTheDocument();
    expect(screen.getByText("My Reports")).toBeInTheDocument();
  },
);
