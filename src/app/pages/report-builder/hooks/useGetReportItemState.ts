import {
  RBReportItem,
  RBReportItemTypes,
  ReportItemOf,
} from "app/state/api/action-reducers/report-builder/sync";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

/** * Custom hook to get the state of a report item, whether it's a main item or a grid child item.
 * @param id - The ID of the report item.
 * @param parent - Optional parent information if the item is a child of a grid or column.
 * @returns An object containing the selected item, edit function, delete function, and duplicate function.
 */

const useGetReportItemState = <T extends RBReportItemTypes>({
  id,
  parent,
}: {
  id: string;
  parent?: {
    id: string;
    type: string;
  };
}) => {
  const selectedItemMain = useStoreState((state) =>
    state.RBReportItemsState.items.find((i) => i.id === id),
  ) as ReportItemOf<T>;

  const editItemMain = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );

  const removeItemMain = useStoreActions(
    (actions) => actions.RBReportItemsState.removeItem,
  );
  const duplicateItem = useStoreActions(
    (actions) => actions.RBReportItemsState.duplicateItem,
  );

  const duplicateGridItem = useStoreActions(
    (actions) => actions.RBReportItemsState.duplicateGridItem,
  );

  const selectedGridItem = useStoreState(
    (state) =>
      (
        state.RBReportItemsState.items.find(
          (i) => i.id === parent?.id && i.type === parent?.type,
        ) as ReportItemOf<"grid" | "column">
      )?.data?.items.find((gi) => gi.id === id) as ReportItemOf<T>,
  );

  const editGridItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editGridItem,
  );

  const deleteGridItem = useStoreActions(
    (actions) => actions.RBReportItemsState.deleteGridItem,
  );

  const editGridChildItem = (payload: RBReportItem) => {
    if (!parent?.id) return;
    editGridItem({
      gridId: parent.id,
      item: {
        ...payload,
        id,
      },
    });
  };

  const deleteGridChildItem = () => {
    if (!parent?.id) return;
    deleteGridItem({
      gridId: parent.id,
      itemId: id,
    });
  };

  const duplicateGridChildItem = () => {
    if (!parent?.id) return;
    duplicateGridItem({
      gridId: parent.id,
      itemId: id,
    });
  };

  return {
    selectedItem: parent?.id ? selectedGridItem : selectedItemMain,
    editItem: parent?.id ? editGridChildItem : editItemMain,
    deleteItem: parent?.id ? deleteGridChildItem : () => removeItemMain(id),
    duplicateItem: parent?.id
      ? duplicateGridChildItem
      : () => duplicateItem(id),
  };
};

export default useGetReportItemState;
