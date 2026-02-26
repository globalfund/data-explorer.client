import React from "react";
import Box from "@mui/material/Box";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

interface ItemComponentProps {
  id: string;
  index: number;
  childrenData: any[];
  children: React.ReactNode;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

export const StoryElementsType = {
  ITEM: "item",
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const style = {
  width: "100%",
  transform: "translate(0px, 0px)",
};

export const ItemComponent = (props: ItemComponentProps) => {
  const { id, children: content, index, moveItem } = props;

  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: any }>({
    accept: StoryElementsType.ITEM,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: StoryElementsType.ITEM,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const isItemDragging = useStoreState(
    (state) => state.RBReportItemOrderState.isDragging,
  );

  const setIsItemDragging = useStoreActions(
    (actions) => actions.RBReportItemOrderState.setIsDragging,
  );

  React.useEffect(() => {
    if (isDragging !== isItemDragging) {
      setIsItemDragging({
        isDragging: isDragging,
        rowId: isDragging ? id : null,
      });
    }
  }, [isDragging]);

  drag(drop(ref));

  return (
    <Box
      ref={ref}
      id={`container-${id}`}
      sx={{ ...style, opacity: isDragging ? 0.5 : 1, position: "relative" }}
    >
      <Box
        id={`item-${id}`}
        ref={ref}
        data-handler-id={handlerId}
        sx={{
          top: 0,
          zIndex: 1,
          left: "-22px",
          height: "100%",
          cursor: "grab",
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
