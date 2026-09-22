import React from "react";
import filter from "lodash/filter";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import * as echarts from "echarts/core";
import Divider from "@mui/material/Divider";
import ReactDOMServer from "react-dom/server";
import { SVGRenderer } from "echarts/renderers";
import useMediaQuery from "@mui/material/useMediaQuery";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { LineChartProps } from "app/pages/datasets/opex/charts/line/data";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { LineSeriesOption, LineChart as EChartsLine } from "echarts/charts";
import { chartTooltipCommonConfig } from "app/components/charts/common/tooltip/config";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  MarkLineComponent,
} from "echarts/components";
import {
  GridComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from "echarts";

echarts.use([
  EChartsLine,
  GridComponent,
  TooltipComponent,
  SVGRenderer,
  LegendComponent,
  MarkLineComponent,
]);

const Tooltip: React.FC<{
  name: string;
  items: { name: string; value: string }[];
}> = (props) => {
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
          gap: "7px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            style={{ width: "calc(100% / 2)" }}
          >
            <b>Line</b>
          </div>
          <div
            className="chart-tooltip-text"
            style={{ width: "calc(100% / 2)" }}
          >
            <b>Value</b>
          </div>
        </div>
        {props.items.slice(0, 2).map((item: any) => (
          <div
            key={item.name}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              className="chart-tooltip-text"
              style={{ width: "calc(100% / 2)" }}
            >
              {item.name}
            </div>
            <div
              className="chart-tooltip-text"
              style={{ width: "calc(100% / 2)" }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LineChart: React.FC<LineChartProps> = (props: LineChartProps) => {
  const isTouch = useMediaQuery("(hover: none)");
  const mobile = useMediaQuery("(max-width: 767px)");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [stateChart, setStateChart] =
    React.useState<echarts.EChartsType | null>(null);

  useChartResizeObserver({
    chart: stateChart,
    containerId: "line-chart",
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
        | LegendComponentOption
        | TooltipComponentOption
      > = {
        grid: {
          top: 40,
          left: 60,
          right: 70,
          bottom: props.xAxisSubLabels ? 55 : 40,
        },
        yAxis: {
          name: "",
          type: "value",
          position: "left",
          alignTicks: true,
          interval: props.yAxisValues
            ? (Math.max(...props.yAxisValues) -
                Math.min(...props.yAxisValues)) /
              (props.yAxisValues.length - 1)
            : undefined,
          min: props.yAxisValues ? Math.min(...props.yAxisValues) : undefined,
          max: props.yAxisValues ? Math.max(...props.yAxisValues) : undefined,
          nameTextStyle: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.LINE_CHART.CHART_TEXT_COLOR,
          },
          axisLabel: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.LINE_CHART.CHART_TEXT_COLOR,
            formatter: (value: number) => {
              if (value === 0) {
                return "";
              }
              if (value >= 1e9) {
                return `$${(value / 1e9).toFixed(1)}B`.replace(".0", "");
              }
              if (value >= 1e6) {
                return `$${(value / 1e6).toFixed(1)}M`.replace(".0", "");
              }
              if (value >= 1e3) {
                return `$${(value / 1e3).toFixed(1)}K`.replace(".0", "");
              }
              return `$${value}`;
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        xAxis: {
          type: "category",
          data: props.xAxisKeys,
          boundaryGap: props.boundaryGap ?? false,
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: mobile ? 90 : 0,
            fontFamily: "Inter, sans-serif",
            formatter: (value: string, index: number) => {
              const subLabel = props.xAxisSubLabels?.[index];
              return subLabel
                ? `{title|${value}}\n{subtitle|${subLabel}}`
                : `{title|${value}}`;
            },
            rich: {
              title: {
                fontSize: 14,
                fontWeight: props.xAxisSubLabels ? 700 : 400,
                lineHeight: 20,
                fontFamily: "Inter, sans-serif",
                color: "#373D43",
              },
              subtitle: {
                fontSize: 14,
                lineHeight: 20,
                fontFamily: "Inter, sans-serif",
                color: appColors.LINE_CHART.CHART_TEXT_COLOR,
              },
            },
          },
          axisLine: {
            lineStyle: {
              width: 1,
              color: appColors.LINE_CHART.AXIS_COLOR,
            },
          },
        },
        series: props.data.map((line, index) => ({
          type: "line",
          name: line.name,
          data: line.data,
          showSymbol: true,
          color: line.itemStyle?.color,
          endLabel: {
            show: false,
          },
          lineStyle: {
            width: 2.5,
            color: line.itemStyle?.color,
            type: line.itemStyle?.borderType,
          },
          symbolSize: 8,
          symbol: line.symbol ?? "circle",
          areaStyle: {
            color: line.areaStyle?.color,
            opacity: line.areaStyle?.opacity ?? 0,
          },
          emphasis: {
            disabled: true,
          },
          itemStyle: line.itemStyle,
          markLine:
            index === 0 && props.cumulativeLineValue !== undefined
              ? {
                  symbol: "none",
                  silent: true,
                  animation: false,
                  lineStyle: {
                    width: 1.5,
                    type: "dashed",
                    color: appColors.LINE_CHART.CUMULATIVE_LINE_COLOR,
                  },
                  label: {
                    show: true,
                    fontWeight: 700,
                    fontSize: "20px",
                    position: "insideEndTop",
                    fontFamily: "Inter, sans-serif",
                    color: appColors.LINE_CHART.CUMULATIVE_LINE_COLOR,
                    formatter: () => `Cumulative ${props.cumulativeLineValue}¢`,
                  },
                  data: [{ yAxis: props.cumulativeLineValue }],
                }
              : undefined,
        })),
        tooltip: {
          show: true,
          ...chartTooltipCommonConfig(isTouch),
          trigger: "axis",
          formatter: (lines: any) => {
            const xAxisValue = lines[0].axisValue;
            const items: {
              name: string;
              value: string;
            }[] = filter(lines, (line: any) => line.value !== undefined).map(
              (line: any) => {
                return {
                  name: line.seriesName,
                  value: !props.cumulativeLineValue
                    ? formatFinancialValue(line.value)
                    : `${line.value}¢`,
                };
              },
            );
            return ReactDOMServer.renderToString(
              <Tooltip name={xAxisValue} items={items} />,
            );
          },
        },
        legend: {
          right: 0,
          itemGap: 20,
          itemWidth: 50,
          itemHeight: 3,
          show: Boolean(props.showLegend),
          textStyle: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.LINE_CHART.CHART_TEXT_COLOR,
          },
        },
      };

      chart.setOption(option);
      setStateChart(chart);
    }
  }, [
    props.data,
    props.xAxisKeys,
    props.xAxisSubLabels,
    props.cumulativeLineValue,
    containerRef.current,
  ]);

  return (
    <React.Fragment>
      <Box
        id="line-chart"
        data-cy="line-chart"
        ref={containerRef}
        width="100%"
        height={props.height ?? "480px"}
        sx={{
          "> div": {
            borderRadius: "8px",
          },
        }}
      />
    </React.Fragment>
  );
};
