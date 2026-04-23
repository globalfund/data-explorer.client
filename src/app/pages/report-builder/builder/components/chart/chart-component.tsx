import { MappedDimension } from "app/state/api/action-reducers/report-builder/sync";
import React from "react";
import { useEcharts } from "./hooks/useEcharts";
import { ChartType } from "./data";
import { Box } from "@mui/material";
import HeatmapChartComponent from "./heatmap-chart-component";
import { TitleDropArea } from "./title/title-drop-area";
import TitleArea from "./title/title-area";
import AxisNameArea from "./axis-name-area";
import { EChartsType } from "echarts/core";
import Legend from "./legend";

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
  const [isDraggingTitle, setIsDraggingTitle] = React.useState(false);

  const [stateChart, setStateChart] = React.useState<EChartsType | null>(null);

  const { render } = useEcharts({
    readOnly: props.readOnly,
    visualOptions: props.visualOptions,
    setVisualOptions: props.setVisualOptions,
    setStateChart: setStateChart,
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
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        paddingTop: props.visualOptions?.paddingTop,
        paddingLeft: props.visualOptions?.paddingLeft,
        paddingRight: props.visualOptions?.paddingRight,
        paddingBottom: props.visualOptions?.paddingBottom,
        borderWidth: props.visualOptions?.strokeWidth,
        borderColor: props.visualOptions?.strokeColor || "#98A1AA",
        borderRadius: props.visualOptions?.cornerRadius || "0px",
        backgroundColor: props.visualOptions?.background || "#ffffff",
        borderStyle: "solid",
      }}
    >
      <TitleArea
        position="top"
        visualOptions={props.visualOptions}
        setVisualOptions={props.setVisualOptions}
        viewMode={props.readOnly}
        setIsDraggingTitle={setIsDraggingTitle}
      />
      <Legend
        chart={stateChart}
        chartType={props.chartType}
        visualOptions={props.visualOptions}
        position="top"
        setIsDragging={setIsDraggingTitle}
        viewMode={props.readOnly}
        mappedData={props.data}
        mapping={props.mapping}
      />
      <Box
        sx={{
          width: "100%",
          flex: 1,
          minHeight: 0,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isDraggingTitle ? (
          <>
            <TitleDropArea
              position="top"
              visualOptions={props.visualOptions}
              setVisualOptions={props.setVisualOptions}
            />
            <TitleDropArea
              position="bottom"
              visualOptions={props.visualOptions}
              setVisualOptions={props.setVisualOptions}
            />
          </>
        ) : null}

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "auto minmax(0, 1fr)",
            gridTemplateRows: "minmax(0, 1fr) auto",
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              gridColumn: 1,
              gridRow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 0,
            }}
          >
            <AxisNameArea
              visualOptions={props.visualOptions}
              setVisualOptions={props.setVisualOptions}
              mapping={props.mapping}
              chartType={props.chartType}
              variant="y"
              viewMode={props.readOnly}
            />
          </Box>

          <Box
            sx={{
              gridColumn: 2,
              gridRow: 1,
              minWidth: 0,
              minHeight: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {props.chartType === "heatmap" ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                }}
                id={props.id}
              >
                <HeatmapChartComponent
                  data={props.data ?? []}
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
          </Box>

          <Box
            sx={{
              gridColumn: 2,
              gridRow: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AxisNameArea
              visualOptions={props.visualOptions}
              setVisualOptions={props.setVisualOptions}
              mapping={props.mapping}
              chartType={props.chartType}
              variant="x"
              viewMode={props.readOnly}
            />
          </Box>
        </Box>
      </Box>
      <Legend
        chart={stateChart}
        chartType={props.chartType}
        position="bottom"
        setIsDragging={setIsDraggingTitle}
        visualOptions={props.visualOptions}
        viewMode={props.readOnly}
        mappedData={props.data}
        mapping={props.mapping}
      />
      <TitleArea
        position="bottom"
        visualOptions={props.visualOptions}
        setVisualOptions={props.setVisualOptions}
        viewMode={props.readOnly}
        setIsDraggingTitle={setIsDraggingTitle}
      />
    </Box>
  );
};

export default ChartComponent;
