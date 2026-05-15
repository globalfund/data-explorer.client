import React from "react";
import filter from "lodash/filter";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import * as echarts from "echarts/core";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ReactDOMServer from "react-dom/server";
import { SVGRenderer } from "echarts/renderers";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { splitStringInMiddle } from "app/utils/splitStringInMiddle";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { BarSeriesOption, BarChart as EChartsBar } from "echarts/charts";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { chartTooltipCommonConfig } from "app/components/charts/common/tooltip/config";
import {
  findDeep,
  ExpandableHorizontalBarProps,
  ExpandableHorizontalBarChartDataItem,
} from "app/components/charts/expandable-horizontal-bar/data";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
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
        <div className="chart-tooltip-text">{props.seriesName}</div>
        <div className="chart-tooltip-text">
          {formatFinancialValue(props.value)}
        </div>
      </div>
    </div>
  );
};

export const ExpandableHorizontalBar: React.FC<ExpandableHorizontalBarProps> = (
  props: ExpandableHorizontalBarProps,
) => {
  const isMounted = React.useRef(false);
  const isTouch = useMediaQuery("(hover: none)");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [data, setData] = React.useState(props.data);
  const [expandedBars, setExpandedBars] = React.useState<string[]>([]);
  const [stateChart, setStateChart] =
    React.useState<echarts.EChartsType | null>(null);

  useChartResizeObserver({
    chart: stateChart,
    containerId: "expandable-horizontal-bar-chart",
    containerRef: containerRef,
  });

  const range = React.useMemo(() => {
    return getRange(data, ["value", "value1"]);
  }, [data]);

  const xAxisKeys = React.useMemo(() => {
    return data.map((item) => item.name);
  }, [data]);

  const seriesData = React.useMemo(() => {
    const values = filter(
      data.map((item) => item.value),
      (v: number | undefined) => v,
    ) as number[];
    const values1 = filter(
      data.map((item) => item.value1),
      (v: number | undefined) => v,
    ) as number[];
    if (values1.length === 0) {
      return [values];
    }
    return [values, values1];
  }, [data]);

  const onBarClick = (value: string) => {
    const item = findDeep(props.data, value);
    if (item && item.items && item.items.length > 0) {
      setExpandedBars((prev) => {
        if (prev.includes(value)) {
          return prev.filter((v) => v !== value);
        }
        return [...prev, value];
      });
    }
  };

  const reset = () => {
    setExpandedBars([]);
  };

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
      > = {
        grid: {
          top: 40,
          left: 20,
          right: 10,
          bottom: 20,
          containLabel: true,
        },
        xAxis: {
          type: "value",
          name: range.abbr,
          position: "top",
          alignTicks: true,
          nameTextStyle: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.X_AXIS_TEXT_COLOR,
          },
          axisLabel: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.AXIS_TEXT_COLOR,
            formatter: (value: number) => {
              return getFinancialValueWithMetricPrefix(value, range.index);
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: appColors.TIME_CYCLE.AXIS_COLOR,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: appColors.TIME_CYCLE.AXIS_COLOR,
            },
          },
        },
        yAxis: {
          type: "category",
          data: xAxisKeys,
          triggerEvent: true,
          inverse: true,
          axisTick: {
            alignWithLabel: false,
            interval: "auto",
            show: true,
            inside: false,
            length: chart.getWidth() - chart.getWidth() / 6,
            lineStyle: {
              color: appColors.TIME_CYCLE.AXIS_COLOR,
            },
          },
          nameTextStyle: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.Y_AXIS_TEXT_COLOR,
          },
          axisLabel: {
            align: "right",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.Y_AXIS_TEXT_COLOR,
            // margin: chart.getWidth() / 6,
            formatter: (value: string) => {
              const item = findDeep(props.data, value);
              let label = value;
              if (label.length > 40) {
                const [string1, string2] = splitStringInMiddle(value);
                label = `${string1}\n${string2}`;
              }
              if (!item?.items || item.items.length === 0) {
                return label;
              }
              const isExpanded = expandedBars.includes(value);
              return `${label} ${isExpanded ? "▲" : "▼"} `;
            },
          },
          axisLine: {
            lineStyle: {
              width: 1,
              color: appColors.TIME_CYCLE.AXIS_COLOR,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: appColors.TIME_CYCLE.AXIS_COLOR,
            },
          },
        },
        series: seriesData.map((values, index) => ({
          type: "bar",
          name:
            index === 0 ? props.valueLabels.value : props.valueLabels.value1,
          data: values,
          barWidth: seriesData.length > 1 ? "15px" : "30px",
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
                    appColors.TIME_CYCLE.PLEDGE_COLOR,
                    appColors.TIME_CYCLE.CONTRIBUTION_COLOR,
                  ][index],
                }
              : props.itemStyle,
        })),
        legend: {
          right: 0,
          align: "left",
          itemWidth: 11,
          itemHeight: 11,
          show: seriesData.length > 1,
          textStyle: {
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            color: appColors.TIME_CYCLE.LEGEND_TEXT_COLOR,
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

      if (!isMounted.current) {
        chart.on("click", "yAxis", (params) => {
          const { value } = params;
          if (value) onBarClick(value?.toString());
        });
      }

      chart.setOption(option);
      setStateChart(chart);
      isMounted.current = true;
    }
  }, [containerRef.current, range]);

  React.useEffect(() => {
    if (expandedBars.length > 0) {
      const newData: ExpandableHorizontalBarChartDataItem[] = [];
      const temp = [...props.data];
      for (const item of temp) {
        // newData.push(item);
        if (
          expandedBars.includes(item.name) &&
          item.items &&
          item.items.length > 0
        ) {
          item.items.forEach((subItem) => {
            newData.push(subItem);
            if (expandedBars.includes(subItem.name) && subItem.items) {
              subItem.items.forEach((subSubItem) => {
                newData.push(subSubItem);
              });
            }
          });
        }
      }
      setData(newData);
    } else {
      setData(props.data);
    }
  }, [expandedBars, props.data]);

  React.useEffect(() => {
    if (stateChart) {
      stateChart.setOption({
        yAxis: {
          axisLabel: {
            formatter: (value: string) => {
              const item = findDeep(props.data, value);
              let label = value;
              if (label.length > 40) {
                const [string1, string2] = splitStringInMiddle(value);
                label = `${string1}\n${string2}`;
              }
              if (!item?.items || item.items.length === 0) {
                return label;
              }
              const isExpanded = expandedBars.includes(value);
              return `${label} ${isExpanded ? "▲" : "▼"} `;
            },
          },
        },
      });
    }
  }, [stateChart, expandedBars]);

  React.useEffect(() => {
    if (stateChart) {
      stateChart.setOption({
        yAxis: {
          data: xAxisKeys,
        },
        series: seriesData.map((values) => ({
          data: values,
        })),
      });
    }
  }, [stateChart, seriesData, xAxisKeys]);

  return (
    <React.Fragment>
      <Typography
        fontSize="14px"
        sx={{
          top: "0px",
          position: "absolute",
        }}
      >
        Y Axis / <b>{props.yAxisLabel}</b>
        {expandedBars.length > 0 && (
          <Button
            onClick={reset}
            variant="outlined"
            sx={{
              zIndex: 1,
              marginLeft: "10px",
            }}
          >
            Back
          </Button>
        )}
      </Typography>
      <Typography
        fontSize="14px"
        sx={{
          right: 0,
          top: "20px",
          position: "absolute",
        }}
      >
        X Axis /{" "}
        <b>
          {props.xAxisLabel} (US$ in {range.abbr})
        </b>
      </Typography>
      <Box
        id="expandable-horizontal-bar-chart"
        data-cy="expandable-horizontal-bar-chart"
        ref={containerRef}
        width="100%"
        height={data.length * 40 + 100}
        sx={{
          "> div": {
            borderRadius: "8px",
          },
        }}
      />
    </React.Fragment>
  );
};
