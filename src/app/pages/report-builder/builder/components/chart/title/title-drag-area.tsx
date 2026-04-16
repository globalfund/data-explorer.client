import { Box } from "@mui/material";
import React from "react";
import EditableTitle from "../editable-title";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { useDrag } from "react-dnd";

interface TitleDragAreaProps {
  position: string;
  visualOptions: Record<string, any>;
  setVisualOptions?: (value: Record<string, any>) => void;
  setIsDraggingTitle?: (dragging: boolean) => void;
}

export const TitleDragArea = (props: TitleDragAreaProps) => {
  const dragRef = React.useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = React.useState(false);

  const [isOver, setIsOver] = React.useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "title",
    item: () => {
      return { position: props.position };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(dragRef);

  React.useEffect(() => {
    props.setIsDraggingTitle?.(isDragging);
  }, [isDragging]);

  const { chartTitleOptions } = props.visualOptions;

  return (
    <Box
      sx={{
        textAlign: props.visualOptions.chartTitleOptions.align,
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
    >
      {props.visualOptions.chartTitleOptions.position === props.position ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          ref={dragRef}
        >
          <Box
            sx={{
              cursor: "grab",
              visibility: isEditing || isOver ? "visible" : "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            <DragIndicator />
          </Box>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent:
                props.visualOptions.chartTitleOptions.align === "left"
                  ? "flex-start"
                  : props.visualOptions.chartTitleOptions.align === "right"
                    ? "flex-end"
                    : "center",
            }}
          >
            <EditableTitle
              title={props.visualOptions.chartTitle}
              onTitleChange={(newTitle) =>
                props.setVisualOptions?.({
                  ...props.visualOptions,
                  chartTitle: newTitle,
                })
              }
              setEditing={setIsEditing}
              sx={{
                fontFamily: chartTitleOptions.fontFamily,
                fontWeight:
                  chartTitleOptions.fontWeight.split("+")?.[0] || "400",
                fontStyle:
                  chartTitleOptions.fontWeight.split("+")?.[1] || "normal",
                fontSize: chartTitleOptions.fontSize + "px",
                color: chartTitleOptions.textColor,
                backgroundColor: chartTitleOptions.backgroundColor,
              }}
            />
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
