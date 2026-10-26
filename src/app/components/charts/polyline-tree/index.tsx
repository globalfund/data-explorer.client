import React from "react";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import * as echarts from "echarts/core";
import { chartTheme } from "app/components/charts/common/theme/config";
import { SVGRenderer } from "echarts/renderers";
import { formatLocale } from "app/utils/formatLocale";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { TreeSeriesOption, TreeChart as EchartsTree } from "echarts/charts";
import { PolylineTreeProps } from "app/components/charts/polyline-tree/data";

echarts.use([EchartsTree, SVGRenderer]);

export const PolylineTree: React.FC<PolylineTreeProps> = (
  props: PolylineTreeProps,
) => {
  const mobile = useMediaQuery("(max-width: 767px)");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [stateChart, setStateChart] =
    React.useState<echarts.EChartsType | null>(null);

  useChartResizeObserver({
    chart: stateChart,
    containerId: "polyline-tree",
    containerRef: containerRef,
  });

  React.useEffect(() => {
    if (containerRef.current) {
      const chart = echarts.init(containerRef.current, chartTheme, {
        renderer: "svg",
      });

      const option: echarts.ComposeOption<TreeSeriesOption> = {
        series: {
          type: "tree",
          data: [props.data],
          top: "50px",
          left: mobile ? "25px" : "50px",
          bottom: "50px",
          right: mobile ? "50%" : "70%",
          edgeShape: "polyline",
          symbolSize: 9,
          symbol: (value) => {
            if (value) return "circle";
            return "none";
          },
          lineStyle: {
            width: 1,
          },
          label: {
            align: "center",
            position: "left",
            padding: [0, 5, 0, 5],
            verticalAlign: "middle",
            backgroundColor: appColors.COMMON.WHITE,
            rich: {
              value: {
                fontSize: 14,
                fontWeight: "bold",
              },
              smallName: {
                fontSize: 14,
              },
              name: {
                fontSize: 16,
                fontWeight: "bold",
              },
              bigName: {
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            formatter: (params) => {
              if (params.dataIndex === 1) {
                return `{bigName|${params.name}}`;
              }
              if (params.value) {
                return [
                  `{value|${formatLocale(params.value as number).replace(
                    "US$",
                    "",
                  )}}`,
                  `{smallName|${params.name}}`,
                ].join(" ");
              }
              return `{name|${params.name}}`;
            },
          },
          leaves: {
            label: {
              align: "left",
              position: "right",
              verticalAlign: "middle",
            },
          },
          emphasis: {
            disabled: mobile,
            focus: "descendant",
            label: {
              rich: {
                value: {
                  fontSize: 16,
                },
                smallName: {
                  fontSize: 16,
                },
              },
            },
          },
        },
      };

      chart.setOption(option);
      setStateChart(chart);
    }
  }, [containerRef.current, mobile]);

  return (
    <React.Fragment>
      <Box
        id="polyline-tree"
        data-cy="polyline-tree"
        ref={containerRef}
        width="100%"
        height="1400px"
        sx={{
          "> div": {
            borderRadius: "8px",
          },
        }}
      />
    </React.Fragment>
  );
};
