import { useStoreState } from "app/state/store/hooks";
import VisualOptions from "../../common/visual-options";
import { getVisualOptionsToDisplay } from "../utils";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

export default function Advanced() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem } = useGetReportItemState<"chart">({
    id: selectedItemController?.id || "",
    parent: selectedItemController?.parent ?? undefined,
  });

  const defaultOptionsToDisplay = getVisualOptionsToDisplay(
    selectedItem?.data?.chartType as string,
  );

  return (
    <VisualOptions
      defaultOptionsToDisplay={defaultOptionsToDisplay}
      tab="advanced"
    />
  );
}
