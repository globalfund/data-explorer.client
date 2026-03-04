import { useStoreState } from "app/state/store/hooks";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";
import { getVisualOptionsToDisplay } from "../utils";
import VisualOptions from "../../common/visual-options";

export default function LayoutTab() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find(
    (i) => i.id === selectedItemController?.id,
  ) as ReportItemOf<"chart">;

  const defaultOptionsToDisplay = getVisualOptionsToDisplay(
    selectedItem?.data?.chartType as string,
  );

  return (
    <VisualOptions
      defaultOptionsToDisplay={defaultOptionsToDisplay}
      tab="layout"
    />
  );
}
