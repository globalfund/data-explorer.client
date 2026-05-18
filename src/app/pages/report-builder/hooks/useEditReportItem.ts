import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

type EditReportItemPayload = Partial<
  Pick<RBReportItem, "open" | "focus" | "key" | "options" | "name">
> & {
  parentId?: string;
  id: string;
};

const useEditReportItem = () => {
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const editItemMain = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );

  const editGridItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editGridItem,
  );

  const editItem = (payload: EditReportItemPayload) => {
    const { parentId, ...rest } = payload;
    let item = null;
    if (parentId) {
      const parent = items.find((i) => i.id === parentId);
      if (parent?.type !== "grid" && parent?.type !== "column") {
        console.error(`Parent item with ID ${parentId} not found.`);
        return;
      }
      item = parent.data?.items.find((i) => i.id === payload.id);
      if (!item) {
        console.error(
          `Item with ID ${payload.id} not found in grid with ID ${parentId}.`,
        );
        return;
      }

      editGridItem({
        gridId: parentId,
        item: {
          ...item,
          ...rest,
        },
      });
      return;
    }
    item = items.find((i) => i.id === payload.id);
    if (!item) {
      console.error(`Item with ID ${payload.id} not found.`);
      return;
    }
    editItemMain({
      ...item,
      ...rest,
    });
  };

  return editItem;
};

export default useEditReportItem;
