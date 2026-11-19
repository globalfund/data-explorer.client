import React from "react";
import * as echarts from "echarts";
import { onEchartResize } from "app/utils/onEchartResize";

interface ChartResizeObserverProps {
  containerId: string;
  chart: echarts.EChartsType | null;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useChartResizeObserver = (props: ChartResizeObserverProps) => {
  const [chartResizeObserver, setChartResizeObserver] =
    React.useState<ResizeObserver | null>(null);

  React.useEffect(() => {
    if (props.containerRef.current && props.chart) {
      if (chartResizeObserver) {
        chartResizeObserver.disconnect();
      }
      const ro = new ResizeObserver((entries) => {
        window.requestAnimationFrame(() => {
          if (!props.chart || !Array.isArray(entries) || !entries.length)
            return;
          const container = document.getElementById(props.containerId);
          if (
            container?.clientWidth === props.chart.getWidth() &&
            props.containerRef.current?.clientHeight === props.chart.getHeight()
          )
            return;
          onEchartResize(
            props.chart,
            props.containerId,
            props.containerRef.current?.clientHeight,
          );
        });
      });
      ro.observe(props.containerRef?.current);
      setChartResizeObserver(ro);
    }
  }, [props.containerRef.current, props.chart, props.containerId]);

  React.useEffect(() => {
    return () => {
      if (chartResizeObserver) {
        chartResizeObserver.disconnect();
      }
    };
  }, [chartResizeObserver]);

  return null;
};
