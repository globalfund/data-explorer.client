import React from "react";
import { act, renderHook } from "@testing-library/react";
import { createStore, StoreProvider } from "easy-peasy";
import { RBReportItemsState } from "app/state/api/action-reducers/report-builder/sync";
import { createReportItem } from "../component-registry/model";
import useEditReportItem from "./useEditReportItem";
import useGetReportItemState from "./useGetReportItemState";

const setup = () => {
  const store = createStore({ RBReportItemsState });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <StoreProvider store={store}>{children}</StoreProvider>
  );
  return { store, wrapper };
};
test("main item hook edits, duplicates, and deletes through the real store", () => {
  const { store, wrapper } = setup();
  store
    .getActions()
    .RBReportItemsState.addItem(createReportItem("image", { id: "image" }));
  const { result } = renderHook(
    () => useGetReportItemState<"image">({ id: "image" }),
    { wrapper },
  );
  expect(result.current.selectedItem.id).toBe("image");
  act(() =>
    result.current.editItem({
      ...result.current.selectedItem,
      data: { src: "saved.png" },
    }),
  );
  expect(result.current.selectedItem.data.src).toBe("saved.png");
  act(() => result.current.duplicateItem());
  expect(store.getState().RBReportItemsState.items).toHaveLength(2);
  act(() => result.current.deleteItem());
  expect(store.getState().RBReportItemsState.items).toHaveLength(1);
  expect(result.current.selectedItem).toBeUndefined();
});
test.each(["grid", "column"] as const)(
  "nested %s hook targets the parent slot and preserves its ID",
  (type) => {
    const { store, wrapper } = setup();
    const parent = createReportItem(type, { id: "parent" });
    parent.data.items = [createReportItem("image", { id: "child" })];
    store.getActions().RBReportItemsState.addItem(parent);
    const { result } = renderHook(
      () =>
        useGetReportItemState<"image">({
          id: "child",
          parent: { id: "parent", type },
        }),
      { wrapper },
    );
    act(() =>
      result.current.editItem(
        createReportItem("image", { id: "wrong", options: { width: "50%" } }),
      ),
    );
    expect(result.current.selectedItem).toMatchObject({
      id: "child",
      options: { width: "50%" },
    });
    if (type === "column") {
      act(() => result.current.duplicateItem());
      expect(
        (store.getState().RBReportItemsState.items[0] as typeof parent).data
          .items,
      ).toHaveLength(2);
    } else {
      act(() => result.current.duplicateItem());
      expect(
        (store.getState().RBReportItemsState.items[0] as typeof parent).data
          .items,
      ).toHaveLength(1);
    }
    act(() => result.current.deleteItem());
    expect(result.current.selectedItem.type).toBe("unknown");
  },
);
test("partial main edits preserve report item data and omitted fields", () => {
  const { store, wrapper } = setup();
  const image = createReportItem("image", { id: "image" });
  store.getActions().RBReportItemsState.addItem(image);
  const { result } = renderHook(useEditReportItem, { wrapper });
  act(() =>
    result.current({ id: "image", name: "Renamed", initialized: true }),
  );
  expect(store.getState().RBReportItemsState.items[0]).toEqual({
    ...image,
    name: "Renamed",
    initialized: true,
  });
});
test.each(["grid", "column"] as const)(
  "partial nested %s edits preserve sibling content",
  (type) => {
    const { store, wrapper } = setup();
    const parent = createReportItem(type, { id: "parent", columns: 2 });
    store.getActions().RBReportItemsState.addItem(parent);
    const { result } = renderHook(useEditReportItem, { wrapper });
    act(() =>
      result.current({
        id: parent.data.items[0].id,
        parentId: "parent",
        name: "Renamed",
      }),
    );
    const current = store.getState().RBReportItemsState
      .items[0] as typeof parent;
    expect(current.data.items[0]).toEqual({
      ...parent.data.items[0],
      name: "Renamed",
    });
    expect(current.data.items[1]).toEqual(parent.data.items[1]);
  },
);
test("missing parent or item logs a useful error and does not corrupt state", () => {
  const { store, wrapper } = setup();
  const parent = createReportItem("grid", { id: "parent" });
  store.getActions().RBReportItemsState.addItem(parent);
  store
    .getActions()
    .RBReportItemsState.addItem(createReportItem("text", { id: "leaf" }));
  const before = store.getState().RBReportItemsState;
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  const { result } = renderHook(useEditReportItem, { wrapper });
  act(() => {
    result.current({ id: "missing" });
    result.current({ id: "missing", parentId: "missing" });
    result.current({ id: "missing", parentId: "leaf" });
    result.current({ id: "missing", parentId: "parent" });
  });
  expect(error).toHaveBeenCalledTimes(4);
  expect(store.getState().RBReportItemsState).toEqual(before);
});
