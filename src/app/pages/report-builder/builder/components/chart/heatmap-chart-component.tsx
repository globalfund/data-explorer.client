import React from "react";
import { ChartType } from "./data";
import { HeatmapDataItem } from "app/components/charts/heatmap/data";
import { MappedDimension } from "app/state/api/action-reducers/report-builder/sync";
import { colorPaletteSequentialData } from "../panel/elements-controller/common/data";
import {
  Box,
  Divider,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import uniqBy from "lodash/uniqBy";
import orderBy from "lodash/orderBy";
import get from "lodash/get";
import isNumber from "lodash/isNumber";
import {
  ColName,
  Container,
  Row,
  RowCol,
  RowName,
  Scrollable,
} from "app/components/charts/heatmap/styles";
import { appColors } from "app/theme";
import { formatFinancialValue } from "app/utils/formatFinancialValue";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip describeChild {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ffffff",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    padding: "10px",
  },
}));

const HeatmapTooltip = (props: any) => {
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
      <div className="chart-tooltip-title">{props.value}</div>
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
          <b>{props.yAxisName}</b>
        </div>
        <div className="chart-tooltip-text">
          <b>{props.xAxisName}</b>
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
          {props.yAxisValue}
        </div>
        <div className="chart-tooltip-text">{props.xAxisValue}</div>
      </div>
    </div>
  );
};

interface HeatmapChartComponentProps {
  data: any;
  chartType: ChartType;
  visualOptions: any;
  mapping: MappedDimension | undefined;
  id: string;
}

const HeatmapChartComponent = (props: HeatmapChartComponentProps) => {
  const { colorPalette } = props.visualOptions;
  const resolvedXAxisName = props.mapping?.x?.value?.[0] ?? "";

  const resolvedYAxisName = props.mapping?.y?.value?.[0] ?? "";

  const data = props.data.map((item: any) => ({
    column: item.x,
    row: item.y,
    value: item.size,
  }));

  const paletteColors: string[] =
    colorPaletteSequentialData.find((item) => item.name === colorPalette)
      ?.colors ??
    colorPaletteSequentialData[0]?.colors ??
    [];

  const values = data.map((d: any) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  function getColor(item?: HeatmapDataItem) {
    if (!item) return "#FFFFFF";

    const value = item.value as number;

    if (maxValue === minValue) {
      return paletteColors[Math.floor(paletteColors.length / 2)] || "#FFFFFF";
    }

    const normalized = (value - minValue) / (maxValue - minValue);

    const index = Math.round(normalized * (paletteColors.length - 1));

    return paletteColors[index] || "#FFFFFF";
  }

  const rootData = React.useMemo(() => {
    return data.filter((d: any) => !d.parentRow && !d.parentColumn);
  }, [data]);

  const visibleRows = React.useMemo(() => {
    let sortedVisibleRows = uniqBy(
      rootData.map((d: any) => ({ name: d.row as string })) as {
        name: string;
      }[],
      "name",
    );
    if (props.visualOptions?.sortXAxis === "ascending") {
      sortedVisibleRows = orderBy(sortedVisibleRows, "name", "asc");
    } else if (props.visualOptions?.sortXAxis === "descending") {
      sortedVisibleRows = orderBy(sortedVisibleRows, "name", "desc");
    }
    return sortedVisibleRows;
  }, [rootData, props.visualOptions?.sortXAxis]);

  const visibleColumns = React.useMemo(() => {
    let sortedVisibleColumns = uniqBy(
      rootData.map((d: any) => ({ name: d.column as string })) as {
        name: string;
      }[],
      "name",
    );
    if (props.visualOptions?.sortYAxis === "ascending") {
      sortedVisibleColumns = orderBy(sortedVisibleColumns, "name", "asc");
    } else if (props.visualOptions?.sortYAxis === "descending") {
      sortedVisibleColumns = orderBy(sortedVisibleColumns, "name", "desc");
    }
    return sortedVisibleColumns;
  }, [rootData, props.visualOptions?.sortYAxis]);

  const itemWidth = 85 + (props.visualOptions?.cellSize ?? 0);
  const itemPadding = props.visualOptions?.cellPadding ?? 4;

  return (
    <Box
      maxWidth="100%"
      maxHeight={"100%"}
      position="relative"
      borderRadius="16px"
      data-cy="heatmap-chart"
      padding="20px 0 10px 0"
      display={"flex"}
      flexDirection={"column"}
    >
      {resolvedXAxisName && (
        <Typography
          top="5px"
          right="20px"
          fontSize="12px"
          fontWeight="700"
          position="absolute"
        >
          {resolvedXAxisName}
        </Typography>
      )}
      <Scrollable>
        <Container style={visibleColumns.length < 10 ? { width: "100%" } : {}}>
          <Row
            style={{
              zIndex: 2,
              top: "-10px",
              position: "sticky",
              background: appColors.HEATMAP.CHART_BG_COLOR,
            }}
          >
            <RowName
              theme={{ width: "227px" }}
              style={{ fontWeight: "700", fontSize: "12px" }}
            >
              {resolvedYAxisName}
            </RowName>
            <Box
              sx={{
                gap: "4px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              {visibleColumns.map((column) => (
                <ColName
                  key={column.name}
                  style={{
                    // fontWeight: column.expanded ? 700 : 400,
                    // background: appColors.HEATMAP.CHART_BG_COLOR,
                    width: itemWidth
                      ? `${itemWidth}px`
                      : `calc((100% - 112px) / ${visibleColumns.length})`,
                    minWidth: itemWidth ? `${itemWidth}px` : "135px",
                    transform: props.visualOptions?.rotateXlabels
                      ? "rotate(-45deg)"
                      : "none",
                  }}
                >
                  {column.name}
                </ColName>
              ))}
            </Box>
          </Row>
          {visibleRows.map((row) => (
            <Row key={row.name}>
              <RowName
                theme={{
                  width: "227px",
                  cursor: "default",
                  background: appColors.COMMON.WHITE,
                }}
                style={{
                  marginTop: itemPadding ? `${itemPadding / 2}px` : "2px",
                  marginBottom: itemPadding ? `${itemPadding / 2}px` : "2px",
                  ...(props.visualOptions?.truncateLongLabels
                    ? {
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }
                    : {}),
                }}
              >
                <Box minWidth="28px" minHeight="28px" />
                {row.name}
              </RowName>
              <Box
                sx={{
                  gap: itemPadding ? `${itemPadding}px` : "4px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {visibleColumns.map((column) => {
                  const mainData = data.find(
                    (d: any) => d.row === row.name && d.column === column.name,
                  );
                  const color = getColor(mainData);
                  let value: number | string = get(mainData, "value", 0);
                  if (isNumber(value)) {
                    if ((value as number) > 0) {
                      value = (value as number).toFixed(2).replace(".00", "");
                      if (props.visualOptions?.monetaryValueTooltip) {
                        value = formatFinancialValue(
                          parseInt(value.toString(), 10),
                        );
                      }
                    } else {
                      const option = props.visualOptions?.emptyCells ?? "0";
                      value =
                        option === "hide"
                          ? ""
                          : option === "show as N/A"
                            ? "N/A"
                            : "0";
                    }
                  }

                  return (
                    <HtmlTooltip
                      key={column.name}
                      disableFocusListener={!props.visualOptions?.showTooltip}
                      disableHoverListener={!props.visualOptions?.showTooltip}
                      disableTouchListener={!props.visualOptions?.showTooltip}
                      title={
                        <HeatmapTooltip
                          value={value}
                          xAxisName={resolvedXAxisName}
                          yAxisName={resolvedYAxisName}
                          xAxisValue={column.name}
                          yAxisValue={row.name}
                        />
                      }
                    >
                      <RowCol
                        key={column.name}
                        style={{
                          // color: pickTextColorBasedOnBgColorAdvanced(
                          //   color,
                          //   "#fff",
                          //   "#000"
                          // ),
                          color: "#000",
                          background: color,
                          width: itemWidth
                            ? `${itemWidth}px`
                            : `calc((100% - 112px) / ${visibleColumns.length})`,
                          minWidth: itemWidth ? `${itemWidth}px` : "135px",
                        }}
                      >
                        {props.visualOptions?.showValues ? value : ""}
                      </RowCol>
                    </HtmlTooltip>
                  );
                })}
              </Box>
            </Row>
          ))}
        </Container>
      </Scrollable>
    </Box>
  );
};

export default HeatmapChartComponent;
