import { useStoreState } from "app/state/store/hooks";
import React from "react";
import TextController from "./text";
import ImageController from "./image";
import KPIController from "./kpi";
import ChartController from "./chart";
import SectionDividerController from "./section-divider";

export default function ElementsController() {
  const selectedItem = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const activeRTE = useStoreState((state) => state.RBReportRTEState.activeRTE);

  const renderItem = () => {
    switch (selectedItem?.type) {
      case "text":
        return activeRTE && <TextController />;
      case "image":
        return <ImageController />;
      case "kpi_box":
        return <KPIController />;
      case "chart":
        return <ChartController />;
      case "section_divider":
        return <SectionDividerController />;
      default:
        return null;
    }
  };

  return selectedItem?.open ? renderItem() : null;
}
