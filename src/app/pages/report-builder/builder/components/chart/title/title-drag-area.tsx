import { Box } from "@mui/material";
import React from "react";
import EditableTitle from "../editable-title";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/react/sortable";
import { CHART_TITLE_PLACEHOLDER } from "./chart-title";
import { getTitleJustifyContent, getTitleTextSx } from "./title-style";

interface TitleDragAreaProps {
  index: number;
  visualOptions: Record<string, any>;
  title: string;
  onTitleChange?: (value: string) => void;
  setIsDraggingTitle?: (dragging: boolean) => void;
}

export const TitleDragArea = (props: TitleDragAreaProps) => {
  const dragRef = React.useRef<HTMLDivElement>(null);
  const [element, setElement] = React.useState<Element | null>(null);

  const [isEditing, setIsEditing] = React.useState(false);

  const [isOver, setIsOver] = React.useState(false);

  const { isDragging } = useSortable({
    id: "title",
    index: props.index,
    type: "title",
    element,
    handle: dragRef,
    accept: ["title", "chart", "legend"],
  });

  React.useEffect(() => {
    props.setIsDraggingTitle?.(isDragging);
  }, [isDragging]);

  const { chartTitleOptions } = props.visualOptions;

  return (
    <Box
      sx={{
        textAlign: chartTitleOptions?.align,
      }}
      onMouseOver={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) {
          return;
        }
        setIsOver(true);
      }}
      onMouseLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) {
          return;
        }
        setIsOver(false);
      }}
      ref={setElement}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            cursor: "grab",
            visibility: isEditing || isOver ? "visible" : "hidden",
            display: "flex",
            alignItems: "center",
          }}
          ref={dragRef}
        >
          <DragIndicator />
        </Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: getTitleJustifyContent(chartTitleOptions?.align),
          }}
        >
          <EditableTitle
            title={props.title}
            onTitleChange={(value) => props.onTitleChange?.(value)}
            setEditing={setIsEditing}
            sx={getTitleTextSx(chartTitleOptions)}
            placeholder={CHART_TITLE_PLACEHOLDER}
            ariaLabel="Chart title"
            data-cy="rb-chart-title"
          />
        </Box>
      </Box>
    </Box>
  );
};
