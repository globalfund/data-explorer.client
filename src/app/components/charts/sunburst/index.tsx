import React from "react";
import get from "lodash/get";
import find from "lodash/find";
import sumBy from "lodash/sumBy";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import * as echarts from "echarts/core";
import Divider from "@mui/material/Divider";
import ReactDOMServer from "react-dom/server";
import { SVGRenderer } from "echarts/renderers";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { useChartResizeObserver } from "app/hooks/useChartResizeObserver";
import { TooltipComponent, TooltipComponentOption } from "echarts/components";
import { chartTooltipCommonConfig } from "app/components/charts/common/tooltip/config";
import {
  SunburstProps,
  SunburstDataItem,
} from "app/components/charts/sunburst/data";
import {
  SunburstSeriesOption,
  SunburstChart as EChartsSunburst,
} from "echarts/charts";
import ChevronRight from "@mui/icons-material/ChevronRight";

echarts.use([EChartsSunburst, TooltipComponent, SVGRenderer]);

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
        <div className="chart-tooltip-text">{props.label}</div>
        <div className="chart-tooltip-text">
          {formatFinancialValue(props.value)}
        </div>
      </div>
    </div>
  );
};

const Breadcrumbs = (props: {
  onTotalClick: () => void;
  items: SunburstProps["selectedItem"][];
  onItemClick: (item: SunburstProps["selectedItem"]) => void;
}) => {
  if (props.items.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        "> div": {
          height: "38px",
          display: "flex",
          padding: "0 16px",
          borderRadius: "2px",
          alignItems: "center",
        },
      }}
    >
      <Box
        sx={{
          color: "#000000",
          cursor: "pointer",
          background: "#CFD4DA",
        }}
        onClick={props.onTotalClick}
      >
        Total
      </Box>
      <ChevronRight fontSize="large" />
      {props.items.map((item, index) => (
        <React.Fragment key={item?.item.name}>
          <Box
            sx={
              index === props.items.length - 1
                ? {
                    color: "#FFFFFF",
                    cursor: "default",
                    background: "#000000",
                  }
                : {
                    color: "#000000",
                    cursor: "pointer",
                    background: "#CFD4DA",
                  }
            }
            onClick={() => props.onItemClick(item)}
          >
            {item?.item.name}
          </Box>
          {index !== props.items.length - 1 && (
            <ChevronRight fontSize="large" />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export function SunburstChart(props: SunburstProps) {
  const isTouch = useMediaQuery("(hover: none)");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectionsRef = React.useRef<
    {
      dataIndex: number;
      item: SunburstDataItem;
    }[]
  >([]);

  const [stateChart, setStateChart] = React.useState<echarts.ECharts | null>(
    null,
  );

  useChartResizeObserver({
    chart: stateChart,
    containerId: "sunburst-chart",
    containerRef: containerRef,
  });

  const [selections, setSelections] = React.useState<
    {
      dataIndex: number;
      item: SunburstDataItem;
    }[]
  >([]);

  const clearSelections = () => {
    setSelections([]);
    setCenterLabel("");
  };

  const onBreadcrumbClick = (item: SunburstProps["selectedItem"]) => {
    const index = selections.findIndex(
      (selection) => selection.dataIndex === item?.dataIndex,
    );
    if (index !== -1) {
      const item2 = selections.slice(0, index + 1);
      setSelections(item2);
      setCenterLabel("in " + item2[item2.length - 1].item.name);
    }
  };

  const flattenData = React.useMemo(() => {
    const data: any[] = [];
    props.data.forEach((item) => {
      data.push(item);
      if (item.children) {
        item.children.forEach((child) => {
          data.push(child);
          if (child.children) {
            child.children.forEach((grandChild) => {
              data.push(grandChild);
              if (grandChild.children) {
                grandChild.children.forEach((grandGrandChild) => {
                  data.push(grandGrandChild);
                });
              }
            });
          }
        });
      }
    });
    return data;
  }, [props.data]);

  const dataToShow = React.useMemo(() => {
    if (selections.length === 0) {
      return props.data;
    }
    return [
      find(flattenData, { name: selections[selections.length - 1].item.name }),
    ];
  }, [flattenData, selections]);

  const total = React.useMemo(() => {
    return sumBy(props.data, "value");
  }, [props.data]);

  const [centerValue, setCenterValue] = React.useState(total);
  const [centerLabel, setCenterLabel] = React.useState("");

  React.useEffect(() => {
    if (containerRef.current) {
      const chart = echarts.init(containerRef.current, undefined, {
        renderer: "svg",
      });

      const option: echarts.ComposeOption<
        SunburstSeriesOption | TooltipComponentOption
      > = {
        series: {
          id: "sectors-sunburst",
          type: "sunburst",
          data: dataToShow,
          radius: ["50%", "100%"],
          nodeClick: false,
          color: appColors.SUNBURST.ITEM_COLORS,
          emphasis: {
            focus: "ancestor",
            label: {
              show: false,
            },
          },
          label: {
            show: false,
          },
          levels: [
            {},
            {
              radius: ["50%", "80%"],
              itemStyle: {
                opacity: 1,
              },
            },
            {
              radius: ["80%", "100%"],
              itemStyle: {
                opacity: 1,
              },
            },
          ],
        },
        tooltip: {
          show: true,
          ...chartTooltipCommonConfig(isTouch),
          formatter: (params: any) => {
            return ReactDOMServer.renderToString(
              <Tooltip {...params} label={props.tooltipLabel} />,
            );
          },
        },
      };

      chart.setOption(option);

      chart.on("click", (params: any) => {
        const name = get(params, "data.name", "");
        const value = get(params, "data.value", 0);
        if (name) {
          setCenterLabel("in " + name);
        }
        if (value) {
          setCenterValue(value);
        }
        setSelections(
          params.treePathInfo.slice(1).map((item: any) => ({
            dataIndex: item.dataIndex,
            item: {
              name: item.name,
              value: item.value,
            },
          })),
        );
      });

      setStateChart(chart);
    }
  }, [containerRef.current, isTouch]);

  React.useEffect(() => {
    if (stateChart) {
      stateChart.setOption({
        series: {
          data: dataToShow,
        },
      });
    }
  }, [stateChart, dataToShow]);

  React.useEffect(() => {
    selectionsRef.current = selections;
    const backButton = document.getElementById("tab-view-back-button");
    if (selections.length === 0) {
      props.setSelectedItem(null);
      if (backButton) {
        backButton.style.display = "none";
      }
    } else {
      props.setSelectedItem(selections[selections.length - 1]);
      if (backButton) {
        backButton.style.display = "flex";
      }
    }
  }, [selections]);

  React.useEffect(() => {
    if (
      props.selectedItem &&
      (selections.length === 0 ||
        selections[selections.length - 1].dataIndex !==
          props.selectedItem.dataIndex)
    ) {
      setSelections((prev) => {
        if (props.selectedItem) {
          return [
            ...prev,
            {
              item: props.selectedItem.item,
              dataIndex: props.selectedItem.dataIndex,
            },
          ];
        }
        return prev;
      });
    }
  }, [props.selectedItem]);

  return (
    <React.Fragment>
      <Breadcrumbs
        items={selections}
        onTotalClick={clearSelections}
        onItemClick={onBreadcrumbClick}
      />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          position: "relative",
          justifyContent: "center",
        }}
      >
        <Box
          id="sunburst-chart"
          data-cy="sunburst-chart"
          ref={containerRef}
          width="600px"
          height="600px"
          sx={{
            "> div": {
              borderRadius: "8px",
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            zIndex: -1,
            width: "100%",
            height: "100%",
            display: "flex",
            position: "absolute",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            "@media (max-width: 767px)": {
              h5: {
                fontSize: "18px",
              },
            },
          }}
        >
          <Typography variant="h4" textAlign="center">
            {props.centerLabel}
            <br />
            {centerLabel}
          </Typography>
          <Typography variant="h4" fontWeight="400">
            {formatFinancialValue(centerValue)}
          </Typography>
        </Box>
      </Box>
    </React.Fragment>
  );
}
