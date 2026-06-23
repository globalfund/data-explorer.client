import { Box } from "@mui/material";

import EditableTitle from "../editable-title";
import DragIndicator from "@mui/icons-material/DragIndicator";

interface TitleStaticAreaProps {
  visualOptions: Record<string, any>;
  setVisualOptions?: (value: Record<string, any>) => void;
}

export const TitleStaticArea = (props: TitleStaticAreaProps) => {
  const { chartTitleOptions } = props.visualOptions;

  return (
    <Box
      sx={{
        textAlign: props.visualOptions.chartTitleOptions.align,
      }}
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
            visibility: "hidden",
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
            onTitleChange={() => {}}
            sx={{
              fontFamily: chartTitleOptions.fontFamily,
              fontWeight: chartTitleOptions.fontWeight.split("+")?.[0] || "400",
              fontStyle:
                chartTitleOptions.fontWeight.split("+")?.[1] || "normal",
              fontSize: chartTitleOptions.fontSize + "px",
              color: chartTitleOptions.textColor,
              backgroundColor: chartTitleOptions.backgroundColor,
            }}
            disabled
          />
        </Box>
      </Box>
    </Box>
  );
};
