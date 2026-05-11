import React from "react";
import Box from "@mui/material/Box";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { useStoreState } from "app/state/store/hooks";
import useDragReportComponent from "app/pages/report-builder/hooks/useDragReportComponent";

interface ItemComponentProps {
  id: string;
  index: number;
  childrenData: any[];
  children: React.ReactNode;
  viewMode?: boolean;
}

const style = {
  width: "100%",
  transform: "translate(0px, 0px)",
};

export const ItemComponent = (props: ItemComponentProps) => {
  const { id, children: content, index } = props;

  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const active =
    !props.viewMode &&
    (selectedController?.id === id || selectedController?.parent?.id === id);

  const ref = React.useRef<HTMLDivElement>(null);

  const { drag, drop, handlerId, isDragging } = useDragReportComponent({
    id,
    index,
    ref,
  });

  drag(drop(ref));

  return (
    <Box
      id={`container-${id}`}
      className="order-item-container"
      sx={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
        border: active ? "0.5px solid #3154F4" : "0.5px solid transparent",
        borderRadius: "4px",
      }}
    >
      <Box
        id={`item-${id}`}
        ref={ref}
        className="drag-indicator"
        data-handler-id={handlerId}
        sx={{
          top: 0,
          zIndex: 1,
          left: "-22px",
          height: "100%",
          cursor: isDragging ? "grabbing" : "grab",
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          display:
            props.childrenData[props.index]?.structure === null
              ? "none"
              : "flex",
        }}
      >
        <DragIndicator fontSize="small" />
      </Box>
      {content}
    </Box>
  );
};
