import React from "react";
import get from "lodash/get";
import filter from "lodash/filter";
import uniqBy from "lodash/uniqBy";
import Box from "@mui/material/Box";
import orderBy from "lodash/orderBy";
import { appColors } from "app/theme";
import isNumber from "lodash/isNumber";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import {
  LEGENDS,
  ItemModel,
  HeatmapProps,
  HeatmapDataItem,
} from "app/components/charts/heatmap/data";
import {
  Row,
  RowCol,
  RowName,
  ColName,
  Container,
  Scrollable,
} from "app/components/charts/heatmap/styles";

export function Heatmap(props: HeatmapProps) {
  const [visibleRows, setVisibleRows] = React.useState<ItemModel[]>([]);
  const [visibleColumns, setVisibleColumns] = React.useState<ItemModel[]>([]);
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
  const [expandedColumns, setExpandedColumns] = React.useState<string[]>([]);

  const rootData = React.useMemo(() => {
    return props.data.filter((d) => !d.parentRow && !d.parentColumn);
  }, [props.data]);

  const onRowExpandClick = (value: string) => () => {
    if (expandedRows.includes(value)) {
      setExpandedRows(expandedRows.filter((item) => item !== value));
    } else {
      setExpandedRows([...expandedRows, value]);
    }
  };

  const onColumnExpandClick = (value: string) => () => {
    if (expandedColumns.includes(value)) {
      setExpandedColumns(expandedColumns.filter((item) => item !== value));
    } else {
      setExpandedColumns([...expandedColumns, value]);
    }
  };

  React.useEffect(() => {
    if (props.expandAll) {
      setExpandedRows(
        filter(props.data, (item: HeatmapDataItem) => !item.parentRow).map(
          (item: HeatmapDataItem) => item.row,
        ),
      );
      setExpandedColumns(
        filter(props.data, (item: HeatmapDataItem) => !item.parentColumn).map(
          (item: HeatmapDataItem) => item.column,
        ),
      );
    } else {
      setExpandedRows([]);
      setExpandedColumns([]);
    }
  }, [props.data, props.rowCategory, props.columnCategory, props.expandAll]);

  React.useEffect(() => {
    setVisibleRows(
      uniqBy(
        rootData.map((d) => {
          const name = d.row;
          const children = uniqBy(
            props.data
              .filter((item) => item.parentRow === name)
              .map((item) => {
                const subName = item.row;
                const subChildren = uniqBy(
                  props.data
                    .filter((subitem) => subitem.parentRow === subName)
                    .map((subitem) => ({
                      name: subitem.row,
                      expanded: false,
                      level: 2,
                    })),
                  "name",
                );
                return {
                  name: subName,
                  expanded: expandedRows.includes(subName),
                  children: subChildren.length > 0 ? subChildren : undefined,
                  level: 1,
                };
              }),
            "name",
          );
          return {
            name,
            expanded: expandedRows.includes(name),
            children: children.length > 0 ? children : undefined,
            level: 0,
          };
        }),
        "name",
      ).sort((a, b) => {
        if (a.name === "Income Level") return 1;
        if (b.name === "Income Level") return -1;
        if (a.name > b.name) return 1;
        if (b.name > a.name) return -1;
        return 0;
      }),
    );
  }, [rootData, expandedRows]);

  React.useEffect(() => {
    setVisibleColumns(
      uniqBy(
        rootData.map((d) => {
          const name = d.column;
          const children = uniqBy(
            props.data
              .filter((item) => item.parentColumn === name)
              .map((item) => {
                const subName = item.column;
                const subChildren = uniqBy(
                  props.data
                    .filter((subitem) => subitem.parentColumn === subName)
                    .map((subitem) => ({
                      name: subitem.column,
                      expanded: false,
                      level: 2,
                    })),
                  "name",
                );
                return {
                  level: 1,
                  name: subName,
                  expanded: expandedColumns.includes(subName),
                  children: subChildren.length > 0 ? subChildren : undefined,
                };
              }),
            "name",
          );
          return {
            name,
            level: 0,
            expanded: expandedColumns.includes(name),
            children: children.length > 0 ? children : undefined,
          };
        }),
        "name",
      ),
    );
  }, [rootData, expandedColumns]);

  const flatVisibleRows = React.useMemo(() => {
    const result: ItemModel[] = [];
    let sortedVisibleRows = visibleRows;
    if (!props.noItemOrdering) {
      sortedVisibleRows = orderBy(visibleRows, "name", "asc");
      if (props.rowCategory === "period") {
        sortedVisibleRows = orderBy(
          visibleRows,
          (item) => parseInt(item.name, 10),
          "desc",
        );
      } else if (props.rowCategory === "grantCycle") {
        sortedVisibleRows = orderBy(
          visibleRows,
          (item) => parseInt(item.name.split(",")[0], 10),
          "desc",
        );
      }
    }
    sortedVisibleRows.forEach((row) => {
      result.push(row);
      if (row.children && row.expanded) {
        (!props.noItemOrdering
          ? orderBy(row.children, "name", "asc")
          : row.children
        ).forEach((child) => {
          result.push(child);
          if (child.children && child.expanded) {
            (!props.noItemOrdering
              ? orderBy(child.children, "name", "asc")
              : child.children
            ).forEach((subchild) => result.push(subchild));
          }
        });
      }
    });
    return result;
  }, [visibleRows, expandedRows]);

  const flatVisibleColumns = React.useMemo(() => {
    const result: ItemModel[] = [];
    let sortedVisibleColumns = visibleColumns;
    if (!props.noItemOrdering) {
      sortedVisibleColumns = orderBy(visibleColumns, "name", "asc");
      if (props.columnCategory === "period") {
        sortedVisibleColumns = orderBy(
          visibleColumns,
          (item) => parseInt(item.name, 10),
          "desc",
        );
      } else if (props.columnCategory === "grantCycle") {
        sortedVisibleColumns = orderBy(
          visibleColumns,
          (item) => parseInt(item.name.split(",")[0], 10),
          "desc",
        );
      }
    }
    sortedVisibleColumns.forEach((column) => {
      result.push(column);
      if (column.children && column.expanded) {
        column.children.forEach((child) => {
          result.push(child);
          if (child.children && child.expanded) {
            child.children.forEach((subchild) => result.push(subchild));
          }
        });
      }
    });
    return result;
  }, [visibleColumns, expandedColumns]);

  const rowNameWidth = React.useMemo(() => {
    if (props.contentProp === "diseaseBurden") {
      return "100px";
    }
    if (props.rowCategory === "period") {
      return "50px";
    }
    // if (
    //   props.rowCategory === "modules" ||
    //   props.rowCategory === "investmentLandscape" ||
    //   props.rowCategory === "principalRecipient"
    // ) {
    //   return "450px";
    // }
    const count =
      (flatVisibleColumns.length > 5 ? 5 : flatVisibleColumns.length) + 1;
    return 1200 - count * 110 + "px";
  }, [props.rowCategory, flatVisibleColumns]);

  return (
    <React.Fragment>
      {!props.noLegend && (
        <Box
          gap="20px"
          width="100%"
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          sx={{
            "> div": {
              gap: "5px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              "> div": {
                width: "11px",
                height: "11px",
              },
            },
            "@media (max-width: 767px)": {
              gap: "10px",
              "> div": {
                flexDirection: "column",
              },
            },
          }}
        >
          {LEGENDS.map((item) => (
            <Box key={item.label}>
              <Box
                bgcolor={item.color}
                border={item.label === "N/A" ? "1px solid #DADADA" : ""}
              />
              <Typography fontSize="14px" color="#495057">
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      <Box
        maxWidth="100%"
        maxHeight="60vh"
        position="relative"
        borderRadius="16px"
        bgcolor={props.bgColor}
        data-cy="heatmap-chart"
        padding="20px 0 10px 0"
      >
        {props.rowHeader && (
          <Typography
            top="5px"
            right="20px"
            fontSize="12px"
            fontWeight="700"
            position="absolute"
          >
            {props.rowHeader}
          </Typography>
        )}
        <Scrollable>
          <Container
            style={flatVisibleColumns.length < 10 ? { width: "100%" } : {}}
          >
            <Row
              style={{
                zIndex: 2,
                top: "-10px",
                position: "sticky",
                background: appColors.HEATMAP.CHART_BG_COLOR,
              }}
            >
              <RowName
                theme={{ width: rowNameWidth }}
                style={{ fontWeight: "700", fontSize: "12px" }}
              >
                {props.columnHeader}
              </RowName>
              <Box
                sx={{
                  gap: "4px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {flatVisibleColumns.map((column) => (
                  <ColName
                    key={column.name}
                    style={{
                      // fontWeight: column.expanded ? 700 : 400,
                      // background: appColors.HEATMAP.CHART_BG_COLOR,
                      width: props.itemWidth
                        ? `${props.itemWidth}px`
                        : `calc((100% - 112px) / ${flatVisibleColumns.length})`,
                      minWidth: props.itemWidth
                        ? `${props.itemWidth}px`
                        : "135px",
                    }}
                  >
                    {column.name}
                    {column.children && (
                      <IconButton
                        onClick={onColumnExpandClick(column.name)}
                        sx={{
                          padding: "4px",
                          transform: `rotate(${column.expanded ? 180 : 0}deg)`,
                        }}
                      >
                        <ChevronRight fontSize="small" />
                      </IconButton>
                    )}
                  </ColName>
                ))}
              </Box>
            </Row>
            {flatVisibleRows.map((row) => (
              <Row key={row.name}>
                <RowName
                  theme={{
                    width: rowNameWidth,
                    cursor: row.children ? "pointer" : "default",
                    background:
                      row.level % 2 === 0 ? appColors.COMMON.WHITE : "#F1F3F5",
                  }}
                  style={row.expanded ? { fontWeight: 700 } : {}}
                  onClick={
                    row.children ? onRowExpandClick(row.name) : undefined
                  }
                >
                  {row.children ? (
                    <IconButton
                      aria-label={`${row.expanded ? "Collapse" : "Expand"} ${row.name} row`}
                      sx={{
                        padding: "4px",
                        transform: `rotate(${row.expanded ? -90 : 90}deg)`,
                      }}
                    >
                      <ChevronRight fontSize="small" />
                    </IconButton>
                  ) : (
                    <React.Fragment>
                      {props.contentProp !== "diseaseBurden" && (
                        <Box minWidth="28px" minHeight="28px" />
                      )}
                    </React.Fragment>
                  )}
                  {row.name}
                </RowName>
                <Box
                  sx={{
                    gap: "4px",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {flatVisibleColumns.map((column) => {
                    const data = props.data.find(
                      (d) => d.row === row.name && d.column === column.name,
                    );
                    const color = props.getItemColor(data);
                    let value: number | string = get(
                      data,
                      props.contentProp,
                      0,
                    );
                    if (isNumber(value)) {
                      if ((value as number) > 0) {
                        value = (value as number).toFixed(2).replace(".00", "");
                      } else {
                        value = "N/A";
                      }
                      if (value !== "N/A") {
                        if (props.valueType === "percentage") {
                          value = value + "%";
                        } else if (props.valueType === "amount") {
                          value = formatFinancialValue(
                            parseInt(value.toString(), 10),
                          );
                        }
                      }
                    }
                    let opacity = props.hoveredLegend === color ? 1 : 0.5;
                    if (!props.hoveredLegend) opacity = 1;
                    return (
                      <RowCol
                        key={column.name}
                        style={{
                          opacity,
                          // color: pickTextColorBasedOnBgColorAdvanced(
                          //   color,
                          //   "#fff",
                          //   "#000"
                          // ),
                          color: "#000",
                          background: color,
                          width: props.itemWidth
                            ? `${props.itemWidth}px`
                            : `calc((100% - 112px) / ${flatVisibleColumns.length})`,
                          minWidth: props.itemWidth
                            ? `${props.itemWidth}px`
                            : "135px",
                        }}
                      >
                        {value}
                      </RowCol>
                    );
                  })}
                </Box>
              </Row>
            ))}
          </Container>
        </Scrollable>
      </Box>
    </React.Fragment>
  );
}
