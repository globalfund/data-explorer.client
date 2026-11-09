import React from "react";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { createStore, StoreProvider } from "easy-peasy";
import {
  RBReportItemsControllerState,
  RBReportItemsState,
} from "app/state/api/action-reducers/report-builder/sync";
import { createReportItem } from "./model";
import {
  ReportItemErrorBoundary,
  useReportItemErrorActions,
} from "./error-boundary";

const Broken: React.FC<{ fail: boolean }> = ({ fail }) => {
  if (fail) throw new Error("bad item data");
  return <div>chart content</div>;
};

const renderItem = (
  item: { fail: boolean },
  {
    viewMode = false,
    onSelect,
    onDelete,
  }: { viewMode?: boolean; onSelect?: () => void; onDelete?: () => void } = {},
) => (
  <>
    <ReportItemErrorBoundary
      itemId="chart-1"
      itemType="chart"
      resetKey={item}
      viewMode={viewMode}
      onSelect={onSelect}
      onDelete={onDelete}
    >
      <Broken fail={item.fail} />
    </ReportItemErrorBoundary>
    <div>next item</div>
  </>
);

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

test("a crashing item shows a message and leaves the rest of the report", () => {
  render(
    renderItem({ fail: true }, { onSelect: jest.fn(), onDelete: jest.fn() }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    "This chart couldn't be displayed. Click it to change its settings, or delete it.",
  );
  expect(screen.getByText("next item")).toBeInTheDocument();
});

test("view mode leaves out the editing advice and controls", () => {
  const onSelect = jest.fn();
  render(
    renderItem(
      { fail: true },
      { viewMode: true, onSelect, onDelete: jest.fn() },
    ),
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    /^This chart couldn't be displayed\.$/,
  );
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("alert"));
  expect(onSelect).not.toHaveBeenCalled();
});

test("a failed item can still be selected and deleted", () => {
  const onSelect = jest.fn();
  const onDelete = jest.fn();
  render(renderItem({ fail: true }, { onSelect, onDelete }));
  fireEvent.click(screen.getByRole("alert"));
  expect(onSelect).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Delete" }));
  expect(onDelete).toHaveBeenCalledTimes(1);
  // Deleting doesn't also select the item that's going away.
  expect(onSelect).toHaveBeenCalledTimes(1);
});

test("an item without a settings panel is only offered deletion", () => {
  render(renderItem({ fail: true }, { onDelete: jest.fn() }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "This chart couldn't be displayed. Delete it, then add it again.",
  );
  expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
});

test("the item renders again once it changes", () => {
  const { rerender } = render(renderItem({ fail: true }));
  expect(screen.getByRole("alert")).toBeInTheDocument();
  rerender(renderItem({ fail: false }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByText("chart content")).toBeInTheDocument();
});

describe("useReportItemErrorActions", () => {
  const setup = (
    props: Parameters<typeof useReportItemErrorActions>[0],
    items: ReturnType<typeof createReportItem>[],
  ) => {
    const store = createStore({
      RBReportItemsState,
      RBReportItemsControllerState,
    });
    items.forEach((item) =>
      store.getActions().RBReportItemsState.addItem(item),
    );
    const { result } = renderHook(() => useReportItemErrorActions(props), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <StoreProvider store={store}>{children}</StoreProvider>
      ),
    });
    return { store, actions: result.current };
  };

  test("selects and deletes a top-level item", () => {
    const { store, actions } = setup({ itemId: "chart", itemType: "chart" }, [
      createReportItem("chart", { id: "chart" }),
    ]);
    act(() => actions.onSelect?.());
    expect(store.getState().RBReportItemsControllerState.item).toEqual({
      id: "chart",
      type: "chart",
      open: true,
    });
    act(() => actions.onDelete?.());
    expect(store.getState().RBReportItemsState.items).toHaveLength(0);
    expect(store.getState().RBReportItemsControllerState.item).toMatchObject({
      id: "",
      open: false,
    });
  });

  test("selects and empties the cell of a grid child", () => {
    const grid = createReportItem("grid", { id: "grid" });
    grid.data.items = [createReportItem("table", { id: "table" })];
    const parent = { id: "grid", type: "grid" as const };
    const { store, actions } = setup(
      { itemId: "table", itemType: "table", parent },
      [grid],
    );
    act(() => actions.onSelect?.());
    expect(store.getState().RBReportItemsControllerState.item).toEqual({
      id: "table",
      type: "table",
      open: true,
      parent: { ...parent, open: false },
    });
    act(() => actions.onDelete?.());
    const [gridItem] = store.getState().RBReportItemsState.items;
    expect(gridItem.type === "grid" && gridItem.data.items[0]).toMatchObject({
      id: "table",
      type: "unknown",
    });
  });

  test("grids can only be deleted, and view mode gets nothing", () => {
    const grid = createReportItem("grid", { id: "grid" });
    expect(
      setup({ itemId: "grid", itemType: "grid" }, [grid]).actions.onSelect,
    ).toBeUndefined();
    expect(
      setup({ itemId: "grid", itemType: "grid", viewMode: true }, [grid])
        .actions,
    ).toEqual({});
  });
});
