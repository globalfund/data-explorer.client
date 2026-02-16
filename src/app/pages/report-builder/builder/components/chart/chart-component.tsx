import { MappedDimension } from "app/state/api/action-reducers/report-builder/sync";
import React from "react";
import { useEcharts } from "./hooks/useEcharts";
import { ChartType } from "./data";
import { Box } from "@mui/material";
import HeatmapChartComponent from "./heatmap-chart-component";

interface ChartComponentProps {
  data: any;
  chartType: ChartType;
  setVisualOptions?: (value: Record<string, any>) => void;
  visualOptions: Record<string, any>;
  mapping: MappedDimension | undefined;
  id: string;
  readOnly?: boolean;
  loading?: boolean;
}

const ChartComponent = (props: ChartComponentProps) => {
  const { render } = useEcharts({
    readOnly: props.readOnly,
    visualOptions: props.visualOptions,
    setVisualOptions: props.setVisualOptions,
  });
  const domRef = React.useRef<HTMLDivElement>(null);

  // client side rendering
  React.useEffect(() => {
    if (
      domRef &&
      domRef.current &&
      props.chartType &&
      props.data &&
      props.chartType !== "heatmap"
    ) {
      try {
        render(
          props.data,
          domRef.current,
          props.chartType,
          props.visualOptions,
          props.mapping,
          props.id,
        );
      } catch (e: any) {
        if (process.env.NODE_ENV === "development") {
          console.log("chart error", e);
        }
      }
    }
  }, [
    props.data,
    props.chartType,
    props.visualOptions,
    props.mapping,
    props.id,
  ]);

  return (
    <>
      {props.chartType === "heatmap" ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
          id={props.id}
        >
          <HeatmapChartComponent
            data={props.data}
            chartType={props.chartType}
            visualOptions={props.visualOptions}
            mapping={props.mapping}
            id={props.id}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
          ref={domRef}
          id={props.id}
        />
      )}
    </>
  );
};

export default ChartComponent;
