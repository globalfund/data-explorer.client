import { Box } from "@mui/material";
import React from "react";
import { useDrop } from "react-dnd";

interface TitleDropAreaProps {
  position: string;
  visualOptions: Record<string, any>;
  setVisualOptions?: (value: Record<string, any>) => void;
}

export const TitleDropArea = (props: TitleDropAreaProps) => {
  const dropRef = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<any, void, { handlerId: any }>({
    accept: ["title", "legend"],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const hoverPosition = props.position;
      if (props.setVisualOptions) {
        if (monitor.getItemType() === "title") {
          props.setVisualOptions({
            ...props.visualOptions,
            chartTitleOptions: {
              ...props.visualOptions.chartTitleOptions,
              position: hoverPosition,
            },
          });
        } else {
          props.setVisualOptions({
            ...props.visualOptions,
            legendPosition: hoverPosition,
          });
        }
      }
    },
  });

  drop(dropRef);

  return (
    <Box
      ref={dropRef}
      sx={{
        width: "100%",
        height: "30%",
        minHeight: 0,
        backgroundColor: "transparent",
        position: "absolute",
        left: 0,
        top: props.position === "top" ? 0 : "70%",
        zIndex: 10,
      }}
    />
  );
};
