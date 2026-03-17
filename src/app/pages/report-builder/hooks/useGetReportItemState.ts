import {
  RBReportItem,
  RBReportItemTypes,
  ReportItemOf,
} from "app/state/api/action-reducers/report-builder/sync";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

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

  return {
    selectedItem: parent?.id ? selectedGridItem : selectedItemMain,
    editItem: parent?.id ? editGridChildItem : editItemMain,
  };
};

export default useGetReportItemState;
