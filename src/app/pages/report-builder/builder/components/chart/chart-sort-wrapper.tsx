import { useSortable } from "@dnd-kit/react/sortable";
import { Box } from "@mui/system";
import React from "react";

interface ChartSortWrapperProps {
  id: string;
  index: number;
  children?: React.ReactNode | React.ReactNode[];
}

const ChartSortWrapper = ({ id, index, children }: ChartSortWrapperProps) => {
  const { ref, isDragging } = useSortable({
    id: "chart",
    index,
    type: "chart",
    accept: ["title", "chart", "legend"],
    disabled: {
      draggable: true,
      droppable: false,
    },
  });
  return (
    <Box
      id={`item-${id}`}
      data-dragging={isDragging}
      sx={{
        flex: 1,
        minHeight: 0,
        width: "100%",
        display: "grid",
        gridTemplateColumns: "auto minmax(0, 1fr)",
        gridTemplateRows: "minmax(0, 1fr) auto",
        alignItems: "stretch",
      }}
      ref={ref}
    >
      {children}
    </Box>
  );
};

export default ChartSortWrapper;
