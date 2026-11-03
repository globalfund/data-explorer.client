import React from "react";
import sumBy from "lodash/sumBy";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import * as echarts from "echarts/core";
import { chartTheme } from "app/components/charts/common/theme/config";
import Divider from "@mui/material/Divider";
import ReactDOMServer from "react-dom/server";
import { SVGRenderer } from "echarts/renderers";
import { TooltipComponentOption } from "echarts";
import { TooltipComponent } from "echarts/components";
import { formatLocale } from "app/utils/formatLocale";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TreemapProps } from "app/components/charts/treemap/data";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { chartTooltipCommonConfig } from "app/components/charts/common/tooltip/config";
import {
  TreemapSeriesOption,
  TreemapChart as EchartsTreemap,
} from "echarts/charts";

echarts.use([EchartsTreemap, TooltipComponent, SVGRenderer]);

const Tooltip = (props: any) => {
  return (
    <div
      className="chart-tooltip"
      style={{
        gap: "10px",
        width: "250px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="chart-tooltip-title">
        {formatFinancialValue(props.value)}
      </div>
      <Divider
        style={{ width: "100%", borderColor: "#DFE3E5", margin: "5px 0" }}
      />
      <div className="chart-tooltip-text">
        {props.name} -{" "}
        {((props.value / props.total) * 100).toFixed(2).replace(".00", "")}%
      </div>
    </div>
  );
};

export const Treemap: React.FC<TreemapProps> = (props: TreemapProps) => {
  const isTouch = useMediaQuery("(hover: none)");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [stateChart, setStateChart] =
    React.useState<echarts.EChartsType | null>(null);

  useChartResizeObserver({
    chart: stateChart,
    containerId: "treemap-chart",
    containerRef: containerRef,
  });

  const isMultilevel = React.useMemo(() => {
    return props.data.some((item) => item.children);
  }, [props.data]);

  const total = React.useMemo(() => sumBy(props.data, "value"), [props.data]);

  React.useEffect(() => {
    if (containerRef.current) {
      const chart = echarts.init(containerRef.current, chartTheme, {
        renderer: "svg",
      });

      const option: echarts.ComposeOption<
        TreemapSeriesOption | TooltipComponentOption
      > = {
        // @ts-expect-error ECharts type mismatch
        series: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 16,
          roam: false,
          leafDepth: 1,
          type: "treemap",
          data: props.data,
          nodeClick: false,
          drillDownIcon: "",
          emphasis: {
            disabled: true,
          },
          levels: [
            {
              label: {
                offset: [8, 8],
                position: "insideTopLeft",
                fontFamily: "Inter, sans-serif",
                formatter: (params: any) => {
                  return [
                    `{name|${params.data.name}}`,
                    `{value|${formatLocale(params.value)}}`,
                  ].join("\n");
                },
                rich: {
                  name: {
                    lineHeight: 15,
                    fontSize: "6px",
                    fontWeight: "bold",
                  },
                  value: {
                    fontSize: "6px",
                  },
                },
              },
              upperLabel: {
                show: false,
              },
              color: [
                appColors.TREEMAP.NODE_COLOR_1,
                appColors.TREEMAP.NODE_COLOR_2,
                appColors.TREEMAP.NODE_COLOR_3,
                appColors.TREEMAP.NODE_COLOR_4,
                appColors.TREEMAP.NODE_COLOR_5,
              ],
            },
            {
              label: {
                offset: [8, 8],
                position: "insideTopLeft",
                fontFamily: "Inter, sans-serif",
                formatter: (params: any) => {
                  return [
                    `{name|${params.data.name}}`,
                    `{value|${formatLocale(params.value)}}`,
                  ].join("\n");
                },
                rich: {
                  name: {
                    lineHeight: 25,
                    fontWeight: "bold",
                    fontSize: isMultilevel ? "14px" : "16px",
                  },
                  value: {
                    fontSize: isMultilevel ? "14px" : "16px",
                  },
                },
              },
              color: [
                appColors.TREEMAP.NODE_COLOR_1,
                appColors.TREEMAP.NODE_COLOR_2,
                appColors.TREEMAP.NODE_COLOR_3,
                appColors.TREEMAP.NODE_COLOR_4,
                appColors.TREEMAP.NODE_COLOR_5,
              ],
            },
          ],
          breadcrumb: {
            show: false,
          },
        },
        tooltip: {
          show: true,
          ...chartTooltipCommonConfig(isTouch),
          formatter: (params: any) => {
            return ReactDOMServer.renderToString(
              <Tooltip {...params} total={total} />,
            );
          },
        },
      };

      chart.setOption(option);
      setStateChart(chart);
    }
  }, [containerRef.current, isMultilevel]);

  React.useEffect(() => {
    if (stateChart) {
      stateChart.setOption({
        series: {
          data: props.data,
        },
        tooltip: {
          formatter: (params: any) => {
            return ReactDOMServer.renderToString(
              <Tooltip {...params} total={total} />,
            );
          },
        },
      });
    }
  }, [props.data, total]);

  return (
    <React.Fragment>
      <Box
        id="treemap-chart"
        data-cy="treemap-chart"
        ref={containerRef}
        width="100%"
        height="400px"
        sx={{
          "> div": {
            borderRadius: "8px",
          },
        }}
      />
    </React.Fragment>
  );
};
