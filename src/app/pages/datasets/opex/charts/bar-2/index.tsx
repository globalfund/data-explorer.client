import React from "react";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BarSeriesOption, BarChart as EChartsBar } from "echarts/charts";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { BarChart2Props } from "app/pages/datasets/opex/charts/bar-2/data";
import {
  GridComponent,
  LegendComponent,
  DataZoomSliderComponent,
  DataZoomComponentOption,
} from "echarts/components";
import {
  GridComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
  LegendComponentOption,
} from "echarts";

echarts.use([
  EChartsBar,
  SVGRenderer,
  GridComponent,
  LegendComponent,
  DataZoomSliderComponent,
]);

export const BarChart2: React.FC<BarChart2Props> = (props: BarChart2Props) => {
  const mobile = useMediaQuery("(max-width: 767px)");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [stateChart, setStateChart] =
    React.useState<echarts.EChartsType | null>(null);

  useChartResizeObserver({
    chart: stateChart,
    containerId: "bar-chart",
    containerRef: containerRef,
  });

  React.useEffect(() => {
    if (containerRef.current) {
      const chart = echarts.init(containerRef.current, undefined, {
        renderer: "svg",
      });

      const option: echarts.ComposeOption<
        | BarSeriesOption
        | GridComponentOption
        | YAXisComponentOption
        | XAXisComponentOption
        | LegendComponentOption
        | DataZoomComponentOption
      > = {
        grid: {
          top: 40,
          left: 20,
          right: 20,
          containLabel: true,
          bottom: mobile ? 50 : 20,
        },
        xAxis: {
          type: "value",
          alignTicks: true,
          nameTextStyle: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.AXIS_TEXT_COLOR,
          },
          max: props.max,
          axisLabel: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.AXIS_TEXT_COLOR,
            formatter: (params: any) => `${params.value}¢`,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
          },
        },
        yAxis: {
          type: "category",
          position: "left",
          data: props.xAxisKeys,
          axisTick: {
            show: false,
          },
          nameTextStyle: {
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.AXIS_TEXT_COLOR,
          },
          axisLabel: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.AXIS_TEXT_COLOR,
            rotate: mobile && !(props.data && props.data.length > 4) ? 90 : 0,
          },
          axisLine: {
            lineStyle: {
              width: 1,
              color: appColors.TIME_CYCLE.AXIS_COLOR,
            },
          },
        },
        dataZoom: [
          {
            type: "slider",
            show: mobile && props.data && props.data.length > 4,
            start: mobile && props.data && props.data.length > 4 ? 70 : 0,
          },
        ],
        series: props.categories.map((category, ci) => ({
          type: "bar",
          name: category,
          stack: props.stack ? "total" : undefined,
          data: props.xAxisKeys.map((_, xi) => props.data[xi][ci]),
          barWidth: "44px",
          emphasis: {
            disabled: true,
          },
          colors: props.colors,
          colorBy: "series",
          color: props.stack
            ? props.colors[ci % props.colors.length]
            : undefined,
          label: {
            show: true,
            precision: 1,
            position: "right",
            formatter: (params: any) => `${params.value}¢`,
          },
          itemStyle: props.stack
            ? {
                color: props.colors[ci % props.colors.length],
              }
            : {
                color: "#013E77",
              },
        })),
      };

      chart.setOption(option);
      setStateChart(chart);
    }
  }, [containerRef.current]);

  React.useEffect(() => {
    if (stateChart) {
      stateChart.setOption({
        grid: {
          bottom: mobile ? 50 : 20,
        },
        xAxis: {
          max: props.max,
          axisLabel: {
            formatter: (value: any) => `${value}¢`,
          },
        },
        yAxis: {
          data: props.xAxisKeys,
          rotate: mobile && !(props.data && props.data.length > 4) ? 90 : 0,
        },
        dataZoom: [
          {
            type: "slider",
            show: mobile && props.data && props.data.length > 4,
            start: mobile && props.data && props.data.length > 4 ? 70 : 0,
          },
        ],
        series: props.categories.map((category, ci) => ({
          name: category,
          data: props.xAxisKeys.map((_, xi) => props.data[xi][ci]),
          barWidth: "34px",
          stack: props.stack ? "total" : undefined,
          colors: props.colors,
          colorBy: "series",
          color: props.stack
            ? props.colors[ci % props.colors.length]
            : undefined,
          itemStyle: props.stack
            ? {
                color: props.colors[ci % props.colors.length],
              }
            : {
                color: "#013E77",
              },
        })),
      });
    }
  }, [
    mobile,
    props.max,
    props.data,
    stateChart,
    props.xAxisKeys,
    props.categories,
    props.yAxisFormatter,
  ]);

  return (
    <React.Fragment>
      {props.customLegends && (
        <Box
          sx={{
            gap: "20px",
            width: "100%",
            display: "flex",
            marginTop: "20px",
            justifyContent: "flex-end",
            "> div": {
              gap: "7px",
              display: "flex",
              alignItems: "center",
              "> div": {
                width: "12px",
                height: "12px",
                borderRadius: "2px",
              },
            },
          }}
        >
          <Box>
            <Box bgcolor="#007B50" />
            <Typography fontSize="14px" color="#6B7280">
              Under budget
            </Typography>
          </Box>
          <Box>
            <Box bgcolor="#144BC0" />
            <Typography fontSize="14px" color="#6B7280">
              Over budget
            </Typography>
          </Box>
        </Box>
      )}
      <Box
        id="bar-chart"
        data-cy="bar-chart"
        ref={containerRef}
        width="100%"
        height="350px"
        sx={{
          "> div": {
            borderRadius: "8px",
          },
        }}
      />
    </React.Fragment>
  );
};
