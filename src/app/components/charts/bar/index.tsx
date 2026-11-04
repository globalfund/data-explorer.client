import React from "react";
import filter from "lodash/filter";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import * as echarts from "echarts/core";
import { chartTheme } from "app/components/charts/common/theme/config";
import Divider from "@mui/material/Divider";
import ReactDOMServer from "react-dom/server";
import { SVGRenderer } from "echarts/renderers";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BarChartProps } from "app/components/charts/bar/data";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { BarSeriesOption, BarChart as EChartsBar } from "echarts/charts";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { chartTooltipCommonConfig } from "app/components/charts/common/tooltip/config";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";
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
          <b>Component</b>
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
          {props.seriesName}
        </div>
        <div className="chart-tooltip-text">
          {formatFinancialValue(props.value)}
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

  const range = React.useMemo(() => {
    return getRange(props.data, ["value", "value1"]);
  }, [props.data]);

  const xAxisKeys = React.useMemo(() => {
    return props.data.map((item) => item.name);
  }, [props.data]);

  const seriesData = React.useMemo(() => {
    const values = filter(
      props.data.map((item) => item.value),
      (v: number | undefined) => v,
    ) as number[];
    const values1 = filter(
      props.data.map((item) => item.value1),
      (v: number | undefined) => v,
    ) as number[];
    if (values1.length === 0) {
      return [values];
    }
    return [values, values1];
  }, [props.data]);

  const barWidth = React.useMemo(() => {
    if (mobile) {
      return "30px";
    }
    if (seriesData.length > 1) {
      return "37px";
    }
    return "72px";
  }, [seriesData, mobile]);

  React.useEffect(() => {
    if (containerRef.current) {
      const chart = echarts.init(containerRef.current, chartTheme, {
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
          name: range.abbr,
          position: "left",
          alignTicks: true,
          nameTextStyle: {
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.AXIS_TEXT_COLOR,
          },
          axisLabel: {
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.AXIS_TEXT_COLOR,
            formatter: (value: number) => {
              if (value === 0) return "";
              return getFinancialValueWithMetricPrefix(value, range.index);
            },
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: appColors.TIME_CYCLE.AXIS_COLOR,
            },
          },
          splitLine: {
            show: false,
          },
        },
        xAxis: {
          type: "category",
          data: xAxisKeys,
          axisTick: {
            show: true,
            alignWithLabel: true,
          },
          nameTextStyle: {
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.AXIS_TEXT_COLOR,
          },
          axisLabel: {
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.AXIS_TEXT_COLOR,
            rotate:
              mobile && !(seriesData[0] && seriesData[0].length > 4) ? 90 : 0,
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
            show: mobile && seriesData[0] && seriesData[0].length > 4,
            start: mobile && seriesData[0] && seriesData[0].length > 4 ? 70 : 0,
          },
        ],
        series: seriesData.map((values, index) => ({
          type: "bar",
          name:
            index === 0 ? props.valueLabels.value : props.valueLabels.value1,
          data: values,
          barWidth,
          colorBy: seriesData.length > 1 ? "series" : "data",
          color:
            seriesData.length > 1
              ? [
                  appColors.TIME_CYCLE.BAR_COLOR_2,
                  appColors.TIME_CYCLE.BAR_COLOR_3,
                ]
              : [
                  appColors.TIME_CYCLE.BAR_COLOR_1,
                  appColors.TIME_CYCLE.BAR_COLOR_2,
                  appColors.TIME_CYCLE.BAR_COLOR_3,
                  appColors.TIME_CYCLE.BAR_COLOR_4,
                  appColors.TIME_CYCLE.BAR_COLOR_5,
                ],
          emphasis: {
            disabled: true,
          },
          itemStyle:
            seriesData.length > 1
              ? {
                  color: [
                    appColors.TIME_CYCLE.BAR_COLOR_2,
                    appColors.TIME_CYCLE.BAR_COLOR_3,
                  ][index],
                }
              : props.itemStyle,
        })),
        legend: {
          right: 0,
          itemWidth: 8,
          itemHeight: 8,
          align: "left",
          show: seriesData.length > 1,
          textStyle: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.AXIS_TEXT_COLOR,
          },
          data: [
            props.valueLabels.value,
            props.valueLabels.value1
              ? props.valueLabels.value1
              : props.valueLabels.value,
          ],
        },
        tooltip: {
          show: true,
          ...chartTooltipCommonConfig(isTouch),
          formatter: (params: any) => {
            return ReactDOMServer.renderToString(<Tooltip {...params} />);
          },
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
          axisLabel: {
            formatter: (value: number) => {
              return getFinancialValueWithMetricPrefix(value, range.index);
            },
          },
        },
        xAxis: {
          data: xAxisKeys,
          rotate:
            mobile && !(seriesData[0] && seriesData[0].length > 4) ? 90 : 0,
        },
        dataZoom: [
          {
            type: "slider",
            show: mobile && seriesData[0] && seriesData[0].length > 4,
            start: mobile && seriesData[0] && seriesData[0].length > 4 ? 70 : 0,
          },
        ],
        series: seriesData.map((values, index) => ({
          data: values,
          name:
            index === 0 ? props.valueLabels.value : props.valueLabels.value1,
          barWidth,
          itemStyle:
            seriesData.length > 1
              ? {
                  color: [
                    appColors.TIME_CYCLE.BAR_COLOR_2,
                    appColors.TIME_CYCLE.BAR_COLOR_3,
                  ][index],
                }
              : props.itemStyle,
        })),
      });
    }
  }, [
    range,
    mobile,
    barWidth,
    xAxisKeys,
    seriesData,
    stateChart,
    props.valueLabels,
  ]);

  return (
    <React.Fragment>
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
