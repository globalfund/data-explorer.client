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
import Draggable from "react-draggable";

export default function ElementsController() {
  const nodeRef = React.useRef(null);
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const activeRTE = useStoreState((state) => state.RBReportRTEState.activeRTE);

  const renderItem = () => {
    if (selectedItemController?.parent?.open) {
      if (selectedItemController?.parent?.type === "grid") {
        return <GridController />;
      } else if (selectedItemController?.parent?.type === "column") {
        return <ColumnController />;
      }
    }

    switch (selectedItemController?.type) {
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

  return selectedItemController?.open ? (
    // @ts-expect-error  missing attributes
    <Draggable nodeRef={nodeRef} handle=".panel-drag-handle">
      <div ref={nodeRef}>{renderItem()}</div>
    </Draggable>
  ) : null;
}
