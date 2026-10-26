import React from "react";
import Box from "@mui/material/Box";
import * as echarts from "echarts/core";
import { chartTheme } from "app/components/charts/common/theme/config";
import Divider from "@mui/material/Divider";
import ReactDOMServer from "react-dom/server";
import { SVGRenderer } from "echarts/renderers";
import useMediaQuery from "@mui/material/useMediaQuery";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { PieSeriesOption, PieChart as EChartsPie } from "echarts/charts";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { TooltipComponent, TooltipComponentOption } from "echarts/components";
import { chartTooltipCommonConfig } from "app/components/charts/common/tooltip/config";
import {
  RadialChartProps,
  itemLabelFormatter,
} from "app/components/charts/radial/data";

echarts.use([EChartsPie, TooltipComponent, SVGRenderer]);

const Tooltip = (props: any) => {
  const showList =
    props.data.tooltip &&
    props.data.tooltip.items.length > 0 &&
    props.data.tooltip.items[0].name.length > 0;

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
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div className="chart-tooltip-text">
          <b>{props.label}</b>
        </div>
        <div className="chart-tooltip-text">
          {showList
            ? ""
            : `${((props.value / props.totalValue) * 100)
                .toFixed(2)
                .replace(".00", "")}% - `}
          {formatFinancialValue(props.value)}
        </div>
      </div>
      {showList && (
        <React.Fragment>
          <Divider
            style={{ width: "100%", borderColor: "#DFE3E5", margin: "5px 0" }}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <div className="chart-tooltip-text">
              <b>Location</b>
            </div>
            <div className="chart-tooltip-text">
              <b>Amount</b>
            </div>
          </div>
          {props.data.tooltip.items.map((item: any) => (
            <div
              key={item.name}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div className="chart-tooltip-text">
                <b>{item.name}</b>
              </div>
              <div
                className="chart-tooltip-text"
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                {item.percentage.toFixed(2).replace(".00", "")}% -{" "}
                {formatFinancialValue(item.value)}
              </div>
            </div>
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

export const RadialChart: React.FC<RadialChartProps> = (
  props: RadialChartProps,
) => {
  const isTouch = useMediaQuery("(hover: none)");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [stateChart, setStateChart] =
    React.useState<echarts.EChartsType | null>(null);

  const totalValue = React.useMemo(() => {
    return props.data.reduce((acc, item) => acc + item.value, 0);
  }, [props.data]);

  useChartResizeObserver({
    chart: stateChart,
    containerId: "radial-chart",
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
          endAngle: 360,
          startAngle: 180,
          data: props.data,
          center: ["50%", "70%"],
          radius: ["60%", "100%"],
          label: {
            show: true,
            fontSize: "16px",
            minMargin: 0,
            fontFamily: "'Inter', sans-serif",
            formatter: (params) => {
              return itemLabelFormatter(params, props.itemLabelFormatterType);
            },
            rich: {
              boldName: {
                fontSize: "16px",
                fontWeight: "bold",
              },
            },
          },
          labelLine: {
            length: 5,
            length2: 5,
          },
        },
        tooltip: {
          show: true,
          ...chartTooltipCommonConfig(isTouch),
          formatter: (params: any) => {
            return ReactDOMServer.renderToString(
              <Tooltip
                {...params}
                totalValue={totalValue}
                label={props.tooltipLabel}
              />,
            );
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
        id="radial-chart"
        data-cy="radial-chart"
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
