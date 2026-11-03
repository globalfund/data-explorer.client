import React from "react";
import get from "lodash/get";
import max from "lodash/max";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import * as echarts from "echarts/core";
import { chartTheme } from "app/components/charts/common/theme/config";
import findIndex from "lodash/findIndex";
import { SVGRenderer } from "echarts/renderers";
import { LegendComponent } from "echarts/components";
import { RadarChartProps } from "app/components/charts/radar/data";
import { LegendComponentOption, RadarComponentOption } from "echarts";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { RadarSeriesOption, RadarChart as EChartsRadar } from "echarts/charts";

echarts.use([EChartsRadar, SVGRenderer, LegendComponent]);

export const RadarChart: React.FC<RadarChartProps> = (
  props: RadarChartProps,
) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [stateChart, setStateChart] =
    React.useState<echarts.EChartsType | null>(null);

  useChartResizeObserver({
    chart: stateChart,
    containerId: "radar-chart",
    containerRef: containerRef,
  });

  React.useEffect(() => {
    if (containerRef.current) {
      const chart = echarts.init(containerRef.current, chartTheme, {
        renderer: "svg",
      });

      const maxValue = max([
        ...props.data.budgetValues,
        ...props.data.disbursementValues,
      ]);

      const option: echarts.ComposeOption<
        RadarSeriesOption | RadarComponentOption | LegendComponentOption
      > = {
        radar: {
          indicator: props.data.components.map((component) => ({
            name: component,
            max: maxValue,
          })),
          axisName: {
            show: true,
            color: appColors.RADAR_CHART.AXIS_NAME_COLOR,
            formatter: (value) => {
              const indicatorIndex = findIndex(
                props.data.components,
                (c) => c === value,
              );
              const budgetValue = get(
                props.data.budgetValues,
                `[${indicatorIndex}]`,
                0,
              );
              const disbursementValue = get(
                props.data.disbursementValues,
                `[${indicatorIndex}]`,
                0,
              );
              const percentage =
                budgetValue > 0 ? (disbursementValue / budgetValue) * 100 : 0;
              return `${value} (${percentage.toFixed(2).replace(".00", "")}%)`;
            },
          },
        },
        series: {
          type: "radar",
          color: appColors.RADAR_CHART.COLORS,
          data: [
            {
              name: "Budget",
              value: props.data.budgetValues,
            },
            {
              name: "Disbursement",
              value: props.data.disbursementValues,
            },
          ],
        },
        legend: {
          top: 0,
          left: 0,
          show: true,
          itemWidth: 16,
          itemHeight: 9,
          orient: "horizontal",
          textStyle: {
            fontSize: "12px",
          },
        },
      };

      chart.setOption(option);
      setStateChart(chart);
    }
  }, [props.data, containerRef.current]);

  return (
    <React.Fragment>
      <Box
        id="radar-chart"
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
