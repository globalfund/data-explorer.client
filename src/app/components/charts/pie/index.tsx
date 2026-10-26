import React from "react";
import Box from "@mui/material/Box";
import * as echarts from "echarts/core";
import { chartTheme } from "app/components/charts/common/theme/config";
import Divider from "@mui/material/Divider";
import ReactDOMServer from "react-dom/server";
import { SVGRenderer } from "echarts/renderers";
import { TooltipComponentOption } from "echarts";
import { TooltipComponent } from "echarts/components";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PieChartProps } from "app/components/charts/pie/data";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { PieSeriesOption, PieChart as EChartsPie } from "echarts/charts";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { chartTooltipCommonConfig } from "app/components/charts/common/tooltip/config";

echarts.use([EChartsPie, TooltipComponent, SVGRenderer]);

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
          Disbursement
        </div>
        <div className="chart-tooltip-text">
          {formatFinancialValue(props.data.amount)}
        </div>
      </div>
    </div>
  );
};

export const PieChart: React.FC<PieChartProps> = (props: PieChartProps) => {
  const isTouch = useMediaQuery("(hover: none)");
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

      const option: echarts.ComposeOption<
        PieSeriesOption | TooltipComponentOption
      > = {
        series: {
          type: "pie",
          data: props.data,
          cursor: "default",
          label: {
            show: true,
            fontSize: "12px",
            fontWeight: "bold",
            fontFamily: "'Inter', sans-serif",
          },
          labelLine: {
            length: 10,
            length2: 5,
          },
          emphasis: {
            disabled: true,
          },
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
  }, [props.data, containerRef.current]);

  return (
    <React.Fragment>
      <Box
        id="pie-chart"
        ref={containerRef}
        width="100%"
        height="265px"
        sx={{
          "> div": {
            borderRadius: "8px",
          },
        }}
      />
    </React.Fragment>
  );
};
