import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import update from "immutability-helper";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import React from "react";
import { useDrag, useDrop, XYCoord } from "react-dnd";

export const StoryElementsType = {
  ITEM: "item",
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const useDragReportComponent = ({
  id,
  index,
  ref,
}: {
  id: string;
  index: number;
  ref: React.RefObject<HTMLDivElement>;
}) => {
  const reportState = useStoreState((state) => state.RBReportItemsState);
  const items = reportState.items;

  const setItems = useStoreActions(
    (actions) => actions.RBReportItemsState.setItems,
  );

  const moveItem = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setItems(
        update(items, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, items[dragIndex] as RBReportItem],
          ],
        }),
      );
    },
    [items],
  );

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

  return { drag, drop, handlerId, isDragging };
};

export default useDragReportComponent;
