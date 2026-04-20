import { Box } from "@mui/material";
import React from "react";
import EditableTitle from "../editable-title";

interface AxisProps {
  variant: "x" | "y";
  mapping: any;
  visualOptions: Record<string, any>;
  setVisualOptions?: (value: Record<string, any>) => void;
  chartType: string;
  viewMode?: boolean;
}

const ValidChartTypes = ["bar", "line", "scatter"];

const AxisNameArea: React.FC<AxisProps> = ({
  variant,
  mapping,
  visualOptions,
  chartType,
  setVisualOptions,
  viewMode,
}) => {
  const { resolvedXAxisName, resolvedYAxisName } = React.useMemo(() => {
    const { customYAxisName, yAxisName, customXAxisName, xAxisName } =
      visualOptions;
    let defaultXAxisName = "";
    let defaultYAxisName = "";
    switch (chartType) {
      case "bar":
        defaultXAxisName = mapping?.bars?.value?.[0] ?? "";
        defaultYAxisName = mapping?.size?.value?.[0] ?? "";
        break;
      case "line":
        defaultXAxisName = mapping?.x?.value?.[0] ?? "";
        defaultYAxisName = mapping?.y?.value?.[0] ?? "";
        break;
      case "scatter":
        defaultXAxisName = mapping?.x?.value?.[0] ?? mapping?.x?.value ?? "";
        defaultYAxisName = mapping?.y?.value?.[0] ?? mapping?.y?.value ?? "";
        break;
      default:
        break;
    }

    const resolvedXAxisName = customXAxisName
      ? (xAxisName ?? defaultXAxisName)
      : defaultXAxisName;

    const resolvedYAxisName = customYAxisName
      ? (yAxisName ?? defaultYAxisName)
      : defaultYAxisName;

    return {
      resolvedXAxisName,
      resolvedYAxisName,
    };
  }, [mapping, visualOptions, chartType]);

  if (!ValidChartTypes.includes(chartType)) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "center center",
          writingMode: variant === "y" ? "vertical-rl" : "horizontal-tb",
          transform: variant === "y" ? "rotate(180deg)" : "none",
        }}
      >
        <EditableTitle
          disabled={viewMode}
          title={variant === "y" ? resolvedYAxisName : resolvedXAxisName}
          onTitleChange={(newTitle) => {
            if (variant === "y") {
              setVisualOptions?.({
                ...visualOptions,
                yAxisName: newTitle,
                customYAxisName: true,
              });
            } else {
              setVisualOptions?.({
                ...visualOptions,
                xAxisName: newTitle,
                customXAxisName: true,
              });
            }
          }}
          sx={{
            fontSize: 12,
            textAlign: "center",
            whiteSpace: "nowrap",
            fontFamily: "Inter, sans-serif",
            color: "#161616",
            fontWeight: "600",
          }}
        />
      </Box>
    </Box>
  );
};

export default AxisNameArea;
