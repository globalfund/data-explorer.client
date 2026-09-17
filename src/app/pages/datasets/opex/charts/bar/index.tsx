import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import * as echarts from "echarts/core";
import Divider from "@mui/material/Divider";
import ReactDOMServer from "react-dom/server";
import { SVGRenderer } from "echarts/renderers";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { BarChartProps } from "app/pages/datasets/opex/charts/bar/data";
import { BarSeriesOption, BarChart as EChartsBar } from "echarts/charts";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { chartTooltipCommonConfig } from "app/components/charts/common/tooltip/config";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomSliderComponent,
  DataZoomComponentOption,
} from "echarts/components";
import {
  GridComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from "echarts";

echarts.use([
  EChartsBar,
  SVGRenderer,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomSliderComponent,
]);

const Tooltip = (props: any) => {
  return (
    <div
      className="chart-tooltip"
      style={{
        gap: "10px",
        width: "400px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="chart-tooltip-title">{props.name}</div>
      <Divider
        style={{ width: "100%", borderColor: "#DFE3E5", margin: "5px 0" }}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div className="chart-tooltip-text">
          <b>Bar</b>
        </div>
        <div className="chart-tooltip-text">
          <b>Amount</b>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          className="chart-tooltip-text"
          style={{
            textTransform: "capitalize",
          }}
        >
          {props.itemName}
        </div>
        <div className="chart-tooltip-text">
          {props.tooltipValueFormatter
            ? props.tooltipValueFormatter(props.value)
            : formatFinancialValue(props.value)}
        </div>
      </div>
    </div>
  );
};

export const BarChart: React.FC<BarChartProps> = (props: BarChartProps) => {
  const isTouch = useMediaQuery("(hover: none)");
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
        | TooltipComponentOption
        | DataZoomComponentOption
      > = {
        grid: {
          top: 40,
          left: 20,
          right: 0,
          containLabel: true,
          bottom: mobile ? 50 : 20,
        },
        yAxis: {
          type: "value",
          position: "left",
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
            formatter: props.yAxisFormatter
              ? props.yAxisFormatter
              : (value: number) => {
                  const isNegative = value < 0;
                  value = Math.abs(value);
                  if (value === 0) {
                    return "";
                  }
                  if (value >= 1e9) {
                    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e9).toFixed(1)}B`.replace(
                      ".0",
                      "",
                    );
                  }
                  if (value >= 1e6) {
                    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e6).toFixed(1)}M`.replace(
                      ".0",
                      "",
                    );
                  }
                  if (value >= 1e3) {
                    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e3).toFixed(1)}K`.replace(
                      ".0",
                      "",
                    );
                  }
                  return `${isNegative ? "-" : ""}$${Math.abs(value)}`;
                },
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
        xAxis: {
          type: "category",
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
          barWidth: "34px",
          emphasis: {
            disabled: true,
          },
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
                borderRadius: 8,
                color: (params: any) =>
                  params.value < 0 ? "#013E77" : "#EA1541",
              },
        })),
        tooltip: {
          show: true,
          ...chartTooltipCommonConfig(isTouch),
          formatter: (params: any) => {
            const values = props.data[params.dataIndex];
            const category = props.categories[params.seriesIndex];
            const value = get(values, `[${params.seriesIndex}]`, 0);
            return ReactDOMServer.renderToString(
              <Tooltip
                value={value}
                name={params.name}
                tooltipValueFormatter={props.tooltipValueFormatter}
                itemName={
                  props.categories.length > 1
                    ? category
                    : value > 0
                      ? "Over budget"
                      : "Under budget"
                }
              />,
            );
          },
        },
        legend: {
          right: 0,
          itemGap: 16,
          align: "left",
          itemWidth: 16,
          itemHeight: 16,
          show: !props.customLegends,
          textStyle: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.AXIS_TEXT_COLOR,
          },
          data: props.categories,
        },
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
        yAxis: {
          max: props.max,
          axisLabel: {
            formatter: props.yAxisFormatter
              ? props.yAxisFormatter
              : (value: number) => {
                  const isNegative = value < 0;
                  value = Math.abs(value);
                  if (value === 0) {
                    return "";
                  }
                  if (value >= 1e9) {
                    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e9).toFixed(1)}B`.replace(
                      ".0",
                      "",
                    );
                  }
                  if (value >= 1e6) {
                    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e6).toFixed(1)}M`.replace(
                      ".0",
                      "",
                    );
                  }
                  if (value >= 1e3) {
                    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e3).toFixed(1)}K`.replace(
                      ".0",
                      "",
                    );
                  }
                  return `${isNegative ? "-" : ""}$${Math.abs(value)}`;
                },
          },
        },
        xAxis: {
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
                borderRadius: 8,
                color: (params: any) =>
                  params.value < 0 ? "#013E77" : "#EA1541",
              },
        })),
        tooltip: {
          show: true,
          ...chartTooltipCommonConfig(isTouch),
          formatter: (params: any) => {
            const values = props.data[params.dataIndex];
            const category = props.categories[params.seriesIndex];
            const value = get(values, `[${params.seriesIndex}]`, 0);
            return ReactDOMServer.renderToString(
              <Tooltip
                value={value}
                name={params.name}
                tooltipValueFormatter={props.tooltipValueFormatter}
                itemName={
                  props.categories.length > 1
                    ? category
                    : value > 0
                      ? "Over budget"
                      : "Under budget"
                }
              />,
            );
          },
        },
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
            <Box bgcolor="#013E77" />
            <Typography fontSize="14px" color="#6B7280">
              Under budget
            </Typography>
          </Box>
          <Box>
            <Box bgcolor="#EA1541" />
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
        height="450px"
        sx={{
          "> div": {
            borderRadius: "8px",
          },
        }}
      />
    </React.Fragment>
  );
};
