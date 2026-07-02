import React from "react";
import { SxProps } from "@mui/system";
import { useSortable } from "@dnd-kit/react/sortable";
import { Box } from "@mui/material";

interface ColumnSortWrapperProps {
  id: string;
  index: number;
  children?: React.ReactNode | React.ReactNode[];
  group?: string;
  sx?: SxProps<any>;
  setIsDragging?: (dragging: boolean) => void;
  disabled?: boolean;
  type: string;
}

const ColumnSortWrapper = (props: ColumnSortWrapperProps) => {
  const { ref, isDragging } = useSortable({
    id: props.id,
    index: props.index,
    type: props.type,
    accept: ["SELECTED_COLUMN", "AVAILABLE_COLUMN"],
    group: props.group,
    disabled: props.disabled
      ? props.disabled
      : {
          draggable: false,
          droppable: props.type === "AVAILABLE_COLUMN",
        },
  });

  React.useEffect(() => {
    if (props.setIsDragging) {
      props.setIsDragging(isDragging);
    }
  }, [isDragging, props.setIsDragging]);

  return (
    <Box
      component="button"
      disabled={props.disabled}
      ref={ref}
      sx={{
        cursor: props.disabled
          ? "not-allowed"
          : isDragging
            ? "grabbing"
            : "grab",
        opacity: isDragging ? 0.5 : 1,
        transform: "translate(0, 0)", // Fixes a potential issue where the dragged had a background shadow
        ...props.sx,
      }}
      data-dragging={isDragging}
    >
      {props.children}
    </Box>
  );
};

export default ColumnSortWrapper;
