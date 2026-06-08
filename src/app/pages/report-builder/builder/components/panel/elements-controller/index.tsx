import { useStoreState } from "app/state/store/hooks";
import React from "react";
import TextController from "./text";
import ImageController from "./image";
import KPIController from "./kpi";
import ChartController from "./chart";
import SectionDividerController from "./section-divider";
import GridController from "./grid";
import ColumnController from "./column";
import TableController from "./table";

export default function ElementsController() {
  const selectedItem = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const activeRTE = useStoreState((state) => state.RBReportRTEState.activeRTE);

  const renderItem = () => {
    if (selectedItem?.parent?.open) {
      if (selectedItem?.parent?.type === "grid") {
        return <GridController />;
      } else if (selectedItem?.parent?.type === "column") {
        return <ColumnController />;
      }
    }

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
      case "table":
        return <TableController />;
      default:
        return null;
    }
  };

  return selectedItem?.open ? renderItem() : null;
}
