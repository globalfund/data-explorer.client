import {
  MappedDimension,
  ChartType,
} from "app/state/api/action-reducers/report-builder/sync";
import React from "react";
import { disposeChart, useEcharts } from "./hooks/useEcharts";
import { Box } from "@mui/material";
import HeatmapChartComponent from "./heatmap-chart-component";
import TitleArea from "./title/title-area";
import AxisNameArea from "./axis-name-area";
import { EChartsType } from "echarts/core";
import Legend from "./legend";
import ChartSortWrapper from "./chart-sort-wrapper";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

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
  const [, setIsDraggingTitle] = React.useState(false);

  const [stateChart, setStateChart] = React.useState<EChartsType | null>(null);

  const { render } = useEcharts({
    readOnly: props.readOnly,
    visualOptions: props.visualOptions,
    setVisualOptions: props.setVisualOptions,
    setStateChart: setStateChart,
  });

  const orderList = React.useMemo(() => {
    const defaultOrder = ["title", "chart", "legend"];
    if (!props.visualOptions?.orderList) {
      return defaultOrder;
    }
    return props.visualOptions?.orderList;
  }, [props.visualOptions?.orderList]);

  const domRef = React.useRef<HTMLDivElement>(null);
  // The node the echarts instance lives on. It changes or disappears when the
  // chart type switches to or from heatmap, which renders without echarts.
  const renderedNodeRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(
    () => () => {
      if (renderedNodeRef.current) disposeChart(renderedNodeRef.current);
    },
    [],
  );

  // client side rendering
  React.useEffect(() => {
    if (renderedNodeRef.current && renderedNodeRef.current !== domRef.current) {
      disposeChart(renderedNodeRef.current);
      renderedNodeRef.current = null;
    }
    if (
      domRef &&
      domRef.current &&
      props.chartType &&
      props.data &&
      props.chartType !== "heatmap"
    ) {
      renderedNodeRef.current = domRef.current;
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
    <DragDropProvider
      onDragOver={(event) => {
        console.log("drag over", event);
        props.setVisualOptions?.({
          ...props.visualOptions,
          orderList: move(orderList, event),
        });
      }}
    >
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
        {orderList.map((item: string, index: number) => {
          if (item === "title") {
            return (
              <TitleArea
                key={item}
                index={index}
                visualOptions={props.visualOptions}
                setVisualOptions={props.setVisualOptions}
                viewMode={props.readOnly}
                setIsDraggingTitle={setIsDraggingTitle}
              />
            );
          }
          if (item === "legend") {
            return (
              <Legend
                index={index}
                key={item}
                chart={stateChart}
                chartType={props.chartType}
                visualOptions={props.visualOptions}
                setIsDragging={setIsDraggingTitle}
                viewMode={props.readOnly}
                mappedData={props.data}
                mapping={props.mapping}
              />
            );
          }
          if (item === "chart") {
            return (
              <Box
                sx={{
                  width: "100%",
                  flex: 1,
                  minHeight: 0,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
                key={item}
              >
                <ChartSortWrapper id={props.id} index={index}>
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
                </ChartSortWrapper>
              </Box>
            );
          }
        })}
      </Box>
    </DragDropProvider>
  );
};

export default ChartComponent;
