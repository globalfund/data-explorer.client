import React from "react";
import filter from "lodash/filter";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import * as echarts from "echarts/core";
import Divider from "@mui/material/Divider";
import ReactDOMServer from "react-dom/server";
import { SVGRenderer } from "echarts/renderers";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { LineSeriesOption, LineChart as EChartsLine } from "echarts/charts";
import { chartTooltipCommonConfig } from "app/components/charts/common/tooltip/config";
import {
  colors,
  LineChart2Props,
} from "app/pages/datasets/opex/charts/line-2/data";
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
        {props.items.map((item: any) => (
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
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  marginRight: "5px",
                  display: "inline-block",
                  background: item.color ?? "transparent",
                }}
              />
              {item.name}
            </div>
            <div
              className="chart-tooltip-text"
              style={{ width: "calc(100% / 2)" }}
            >
              {item.value.toFixed(2).replace(".00", "")}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LineChart2: React.FC<LineChart2Props> = (
  props: LineChart2Props,
) => {
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
          nameTextStyle: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.LINE_CHART.CHART_TEXT_COLOR,
          },
          interval: 20,
          max: 140,
          axisLabel: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.LINE_CHART.CHART_TEXT_COLOR,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
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
            interval: 0,
            fontSize: "14px",
            rotate: mobile ? 90 : 0,
            fontFamily: "Inter, sans-serif",
            color: appColors.LINE_CHART.CHART_TEXT_COLOR,
          },
          axisLine: {
            lineStyle: {
              width: 1,
              color: appColors.LINE_CHART.AXIS_COLOR,
            },
          },
        },
        series: props.data.map((line, i) => ({
          type: "line",
          name: line.name,
          data: line.data,
          showSymbol: true,
          smooth: true,
          color: line.itemStyle?.color ?? colors[i % colors.length],
          endLabel: {
            show: false,
          },
          lineStyle: {
            width: 2.5,
            color: line.itemStyle?.color ?? colors[i % colors.length],
            type:
              line.itemStyle?.borderType ??
              (line.name === "Workforce" ? "solid" : "dashed"),
          },
          symbol: "circle",
          symbolSize: 8,
          emphasis: {
            disabled: true,
          },
          itemStyle: line.itemStyle,
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
                  value: line.value,
                  color:
                    line.itemStyle?.color ??
                    colors[lines.indexOf(line) % colors.length],
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
          itemWidth: 12,
          itemHeight: 12,
          icon: "roundRect",
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
