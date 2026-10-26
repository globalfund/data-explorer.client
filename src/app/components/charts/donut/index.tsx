import React from "react";
import Box from "@mui/material/Box";
import * as echarts from "echarts/core";
import { chartTheme } from "app/components/charts/common/theme/config";
import { SVGRenderer } from "echarts/renderers";
import { DonutChartProps } from "app/components/charts/donut/data";
import { PieSeriesOption, PieChart as EChartsPie } from "echarts/charts";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";

echarts.use([EChartsPie, SVGRenderer]);

export const DonutChart: React.FC<DonutChartProps> = (
  props: DonutChartProps,
) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [stateChart, setStateChart] =
    React.useState<echarts.EChartsType | null>(null);

  useChartResizeObserver({
    chart: stateChart,
    containerId: "pie-chart",
    containerRef: containerRef,
  });

  React.useEffect(() => {
    if (containerRef.current) {
      const chart = echarts.init(containerRef.current, chartTheme, {
        renderer: "svg",
      });

      const option: echarts.ComposeOption<PieSeriesOption> = {
        series: {
          type: "pie",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          data: [props.value, 100 - props.value],
          radius: ["80%", "100%"],
          center: ["50%", "50%"],
          cursor: "default",
          color: [props.valueColor ?? "#013E77", "#CFD4DA"],
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          emphasis: {
            disabled: true,
          },
        },
      };

      chart.setOption(option);
      setStateChart(chart);
    }
  }, [props.value, containerRef.current]);

  return (
    <React.Fragment>
      <Box
        id={props.id ?? "donut-chart"}
        ref={containerRef}
        width="150px"
        height="150px"
        position="relative"
        data-cy="donut-chart"
        sx={{
          "> div": {
            borderRadius: "8px",
          },
          "> span": {
            top: 0,
            left: 0,
            width: "150px",
            height: "150px",
            display: "flex",
            fontSize: "12px",
            textAlign: "center",
            position: "absolute",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            "> b": {
              fontSize: "14px",
            },
          },
        }}
      >
        <span>
          <b>{props.value.toFixed(1).replace(".0", "")}%</b>
          {props.label}
        </span>
      </Box>
    </React.Fragment>
  );
};
