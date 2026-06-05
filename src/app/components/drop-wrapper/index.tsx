import { Box, SxProps } from "@mui/system";
import React from "react";
import { useDrop } from "react-dnd";

interface DropWrapperProps {
  accept: string[];
  hoverHandler?: (item: any, monitor: any) => void;
  dropHandler?: (item: any, monitor: any) => void;
  children: ({
    isOver,
    item,
    itemType,
  }: {
    isOver: boolean;
    item: any;
    itemType: string;
  }) => React.ReactNode;
  sx?: SxProps<any>;
}

const DropWrapper: React.FC<DropWrapperProps> = ({
  accept,
  hoverHandler,
  children,
  sx,
  dropHandler,
}) => {
  const dropRef = React.useRef<HTMLDivElement>(null);
  const [{ isOver, item, itemType }, drop] = useDrop<
    any,
    void,
    { handlerId: any; isOver: boolean; item: any; itemType: any }
  >({
    accept,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: !!monitor.isOver(),
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
      };
    },
    hover: hoverHandler,
    drop: dropHandler,
  });

  drop(dropRef);
  return (
    <Box sx={sx} ref={dropRef}>
      {children ? children({ isOver, item, itemType: itemType }) : null}
    </Box>
  );
};

export default DropWrapper;
