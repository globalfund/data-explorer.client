import React from "react";
import { Box, SxProps } from "@mui/material";
import { useDroppable } from "@dnd-kit/react";

interface DropAreaProps {
  sx?: SxProps<any>;
  children?:
    | (({
        isDropTarget,
      }: {
        isDropTarget: boolean;
      }) => React.ReactNode | React.ReactNode[])
    | React.ReactNode
    | React.ReactNode[];
  id: string;
}

const DropArea = (props: DropAreaProps) => {
  const { isDropTarget, ref } = useDroppable({
    id: props.id,
    type: "DROP_AREA",
    accept: ["SELECTED_COLUMN", "AVAILABLE_COLUMN"],
  });
  return (
    <Box ref={ref} sx={props.sx}>
      {typeof props.children === "function"
        ? props.children({ isDropTarget })
        : props.children}
    </Box>
  );
};

export default DropArea;
