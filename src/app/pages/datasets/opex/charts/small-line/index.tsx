import React from "react";
import Box from "@mui/material/Box";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { GridComponent } from "echarts/components";
import { LineChartProps } from "app/pages/datasets/opex/charts/line/data";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { LineSeriesOption, LineChart as EChartsLine } from "echarts/charts";
import {
  GridComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from "echarts";

echarts.use([EChartsLine, GridComponent, SVGRenderer]);

export const SmallLineChart: React.FC<LineChartProps> = (
  props: LineChartProps,
) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerId = React.useId();

  const [stateChart, setStateChart] =
    React.useState<echarts.EChartsType | null>(null);

  useChartResizeObserver({
    chart: stateChart,
    containerId: containerId,
    containerRef: containerRef,
  });

  React.useEffect(() => {
    if (containerRef.current) {
      const chart = echarts.init(containerRef.current, undefined, {
        renderer: "svg",
      });

      const option: echarts.ComposeOption<
        | LineSeriesOption
        | GridComponentOption
        | YAXisComponentOption
        | XAXisComponentOption
      > = {
        grid: {
          top: 0,
          left: 0,
          right: 10,
          bottom: 0,
          show: false,
        },
        yAxis: {
          name: "",
          type: "value",
          position: "left",
          alignTicks: true,
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        xAxis: {
          type: "category",
          data: props.xAxisKeys,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        series: props.data.map((line) => ({
          type: "line",
          name: line.name,
          data: line.data.map((value, index) => ({
            value,
            symbolSize: index === line.data.length - 1 ? 8 : 0,
          })),
          showSymbol: true,
          color: line.itemStyle?.color,
          lineStyle: {
            width: 1.5,
            color: line.itemStyle?.color,
          },
          symbol: line.symbol ?? "circle",
          areaStyle: {
            color: line.areaStyle?.color,
            opacity: line.areaStyle?.opacity ?? 0,
          },
          emphasis: {
            disabled: true,
          },
          itemStyle: line.itemStyle,
        })),
      };

      chart.setOption(option);
      setStateChart(chart);
    }
  }, [props.data, props.xAxisKeys, containerRef.current]);

  return (
    <React.Fragment>
      <Box
        width="100%"
        id={containerId}
        ref={containerRef}
        data-cy="line-chart"
        height={props.height}
      />
    </React.Fragment>
  );
};
