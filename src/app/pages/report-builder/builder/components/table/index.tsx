import React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import EditableDiv from "app/components/editable-div";
import { useStoreActions } from "app/state/store/hooks";
import { useGFDataset } from "app/hooks/queries/report-builder";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import { useClickOutsideEditor } from "app/hooks/useClickOutsideEditorComponent";
import {
  formatTableCellValue,
  getRowValue,
  getTableCellSizing,
  getTableOptions,
  getTableRowLimit,
  getTableRowsPerPageSize,
  normalizeTableColumns,
  tablePaletteOptions,
  TableColumn,
} from "./options";

const headerTooltip = "Click on headers to edit the text.";

export const ReportBuilderPageTable: React.FC<{
  id: string;
  extRemoveItem?: (e: React.MouseEvent) => void;
  viewMode?: boolean;
  parent?: {
    id: string;
    type: "grid" | "column";
  };
}> = ({ id, viewMode, parent }) => {
  const { selectedItem, editItem } = useGetReportItemState<"table">({
    id,
    parent,
  });
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const clearSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );

  const tableOptions = getTableOptions(selectedItem?.options);
  const viewportRowCount = getTableRowLimit(tableOptions);
  const pageSize = getTableRowsPerPageSize(tableOptions);
  const configured = !!selectedItem?.data?.dataset;
  const columns = normalizeTableColumns(selectedItem?.data?.columns);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const datasetQuery = useGFDataset(
    selectedItem?.data?.dataset || "",
    pageSize,
  );
  const datasetRows = React.useMemo(
    () =>
      datasetQuery.data?.pages.flatMap(
        (page) => page.data?.data?.result?.data ?? [],
      ) ?? [],
    [datasetQuery.data],
  );

  useClickOutsideEditor({
    editorId: "table-render",
    toolbarId: "table-controller",
    modalId: "save-as-asset-modal",
    extraIds: [`dataset-rows-per-page-select`, "table-palette-menu"],
    onOutsideClick: () => {
      clearSelectedItem();
    },
  });

  const handleOpenController = () => {
    if (viewMode || !selectedItem) return;

    editItem({
      ...selectedItem,
      id,
      type: "table",
      open: true,
    });

    if (parent?.id) {
      setSelectedController({
        type: "table",
        open: true,
        id,
        parent: {
          id: parent.id,
          type: parent.type,
          open: false,
        },
      });
    } else {
      setSelectedController({
        type: "table",
        open: true,
        id,
      });
    }
  };

  const handleColumnNameChange = (
    column: TableColumn,
    columnIndex: number,
    nextName: string,
  ) => {
    if (!selectedItem) return;
    const currentColumns = normalizeTableColumns(selectedItem?.data?.columns);

    editItem({
      ...selectedItem,
      id,
      type: "table",
      open: selectedItem.open || false,
      data: {
        ...selectedItem.data,
        columns: currentColumns.map((currentColumn, index) =>
          currentColumn.id === column.id && index === columnIndex
            ? {
                id: currentColumn.id,
                name: nextName,
                type: currentColumn.type || "string",
              }
            : {
                id: currentColumn.id,
                name: currentColumn.name,
                type: currentColumn.type || "string",
              },
        ),
      },
    });
  };

  const visibleRows = React.useMemo(() => {
    const rows = [...datasetRows];
    if (tableOptions.sortBy) {
      rows.sort((a, b) => {
        const column = columns.find((item) => item.id === tableOptions.sortBy);
        if (!column) return 0;
        const aValue = getRowValue(a, column);
        const bValue = getRowValue(b, column);
        const aNumber = Number(aValue);
        const bNumber = Number(bValue);
        const bothNumbers =
          Number.isFinite(aNumber) && Number.isFinite(bNumber);
        const result = bothNumbers
          ? aNumber - bNumber
          : formatTableCellValue(aValue).localeCompare(
              formatTableCellValue(bValue),
              undefined,
              { numeric: true, sensitivity: "base" },
            );

        return tableOptions.sortDirection === "descending" ? -result : result;
      });
    }

    return rows;
  }, [columns, datasetRows, tableOptions.sortBy, tableOptions.sortDirection]);

  const palette =
    tablePaletteOptions[tableOptions.colorPalette] ??
    tablePaletteOptions.default;
  const cellSizing = getTableCellSizing(tableOptions.size);
  const rowNumberColumnWidth = tableOptions.showRowNumbers ? 51 : 0;
  const minTableWidth = Math.max(
    columns.length * 128 + rowNumberColumnWidth,
    420,
  );
  const borderlessBody = tableOptions.display === "list";
  const bodyCellBorder = borderlessBody
    ? "0.5px solid transparent"
    : "0.5px solid #CFD4DA";
  const headerCellBorder =
    tableOptions.display === "list"
      ? "0.5px solid transparent"
      : "0.5px solid #CFD4DA";
  const tableCellSx = {
    p: cellSizing.padding,
    height: cellSizing.height,
    fontSize: "14px",
    lineHeight: "normal",
    border: bodyCellBorder,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };
  const tableHeaderCellSx = {
    ...tableCellSx,
    border: headerCellBorder,
  };
  const rowHeight = Number.parseInt(cellSizing.height, 10) || 31;
  const tableViewportHeight = rowHeight * (viewportRowCount + 1) + 2;

  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      const nearBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight < 80;
      if (
        nearBottom &&
        datasetQuery.hasNextPage &&
        !datasetQuery.isFetchingNextPage
      ) {
        datasetQuery.fetchNextPage();
      }
    },
    [
      datasetQuery.fetchNextPage,
      datasetQuery.hasNextPage,
      datasetQuery.isFetchingNextPage,
    ],
  );

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (
      !configured ||
      !container ||
      !datasetQuery.hasNextPage ||
      datasetQuery.isFetchingNextPage
    ) {
      return;
    }

    if (container.scrollHeight <= container.clientHeight) {
      datasetQuery.fetchNextPage();
    }
  }, [
    configured,
    datasetQuery.fetchNextPage,
    datasetQuery.hasNextPage,
    datasetQuery.isFetchingNextPage,
    tableViewportHeight,
    visibleRows.length,
  ]);

  return (
    <Box
      id="table-render"
      onClick={handleOpenController}
      sx={{
        width: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        "&:hover": {
          ".top-right-actions": {
            display: "flex",
          },
        },
      }}
    >
      {configured ? (
        <Box
          sx={{
            width: parent?.id ? "100%" : tableOptions.width,
            height: parent?.id ? "100%" : tableOptions.height,
            minHeight: tableOptions.height === "auto" ? "auto" : 0,
            display: "flex",
            p: `${tableOptions.paddingTop} ${tableOptions.paddingRight} ${tableOptions.paddingBottom} ${tableOptions.paddingLeft}`,
            cursor: viewMode ? "default" : "pointer",
            borderRadius: "5px",
            alignItems: "flex-start",
            justifyContent: "center",
            border:
              selectedItem?.open && !viewMode
                ? "0.5px solid #3154F4"
                : "0.5px solid transparent",
          }}
        >
          <Box
            ref={scrollContainerRef}
            onScroll={handleScroll}
            sx={{
              width: "100%",
              maxHeight: `${tableViewportHeight}px`,
              overflow: "auto",
            }}
          >
            <Box
              component="table"
              sx={{
                width: "100%",
                minWidth: `${minTableWidth}px`,
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <Box component="thead">
                <Box component="tr">
                  {tableOptions.showRowNumbers ? (
                    <Box
                      component="th"
                      sx={{
                        ...tableHeaderCellSx,
                        width: "51px",
                        top: 0,
                        zIndex: 2,
                        position: "sticky",
                        color: palette.headerText,
                        fontWeight: 400,
                        textAlign: "center",
                        bgcolor: palette.headerBg,
                        borderTopLeftRadius: "4px",
                      }}
                    >
                      #
                    </Box>
                  ) : null}
                  {columns.map((column, index) => (
                    <Box
                      key={`${column.id}-${index}`}
                      component="th"
                      sx={{
                        ...tableHeaderCellSx,
                        top: 0,
                        zIndex: 2,
                        position: "sticky",
                        color: palette.headerText,
                        fontWeight: 700,
                        textAlign: "left",
                        bgcolor: palette.headerBg,
                        ...(!tableOptions.showRowNumbers && index === 0
                          ? { borderTopLeftRadius: "4px" }
                          : {}),
                        ...(index === columns.length - 1
                          ? { borderTopRightRadius: "4px" }
                          : {}),
                      }}
                    >
                      <Tooltip title={headerTooltip} arrow>
                        <Box
                          sx={{
                            minWidth: 0,
                            ".MuiBox-root > div": {
                              width: "100%",
                            },
                          }}
                        >
                          <EditableDiv
                            disabled={viewMode}
                            title={column.name}
                            onTitleChange={(nextName) =>
                              handleColumnNameChange(column, index, nextName)
                            }
                            sx={{
                              width: "100%",
                              p: 0,
                              color: "inherit",
                              display: "block",
                              minWidth: 0,
                              fontSize: "14px",
                              fontWeight: 700,
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              backgroundColor: "transparent",
                            }}
                          />
                        </Box>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {datasetQuery.isLoading ? (
                  <Box component="tr">
                    <Box
                      component="td"
                      colSpan={
                        columns.length + (tableOptions.showRowNumbers ? 1 : 0)
                      }
                      sx={{
                        ...tableCellSx,
                        height: "72px",
                        textAlign: "center",
                        bgcolor: "#FFFFFF",
                      }}
                    >
                      <CircularProgress size={18} />
                    </Box>
                  </Box>
                ) : null}
                {!datasetQuery.isLoading && visibleRows.length === 0 ? (
                  <Box component="tr">
                    <Box
                      component="td"
                      colSpan={
                        columns.length + (tableOptions.showRowNumbers ? 1 : 0)
                      }
                      sx={{
                        ...tableCellSx,
                        height: "72px",
                        color: "#373D43",
                        textAlign: "center",
                        bgcolor: "#FFFFFF",
                      }}
                    >
                      No rows to display
                    </Box>
                  </Box>
                ) : null}
                {!datasetQuery.isLoading
                  ? visibleRows.map((row, rowIndex) => {
                      const rowStriped =
                        tableOptions.rowStripping === "zebra" &&
                        rowIndex % 2 === 0;
                      const textCellBg =
                        tableOptions.rowStripping === "none"
                          ? "#FFFFFF"
                          : rowStriped
                            ? palette.oddRowBg
                            : palette.evenRowBg;
                      const indexCellBg =
                        tableOptions.rowStripping === "none"
                          ? "#FFFFFF"
                          : rowStriped
                            ? palette.oddIndexBg
                            : palette.evenIndexBg;

                      return (
                        <Box component="tr" key={`table-row-${rowIndex}`}>
                          {tableOptions.showRowNumbers ? (
                            <Box
                              component="td"
                              sx={{
                                ...tableCellSx,
                                color: "#373D43",
                                textAlign: "center",
                                bgcolor: indexCellBg,
                                ...(rowIndex === visibleRows.length - 1
                                  ? { borderBottomLeftRadius: "4px" }
                                  : {}),
                              }}
                            >
                              {rowIndex + 1}
                            </Box>
                          ) : null}
                          {columns.map((column, columnIndex) => (
                            <Box
                              key={`${column.id}-${rowIndex}-${columnIndex}`}
                              component="td"
                              sx={{
                                ...tableCellSx,
                                color: "#373D43",
                                bgcolor: textCellBg,
                                ...(!tableOptions.showRowNumbers &&
                                rowIndex === visibleRows.length - 1 &&
                                columnIndex === 0
                                  ? { borderBottomLeftRadius: "4px" }
                                  : {}),
                                ...(rowIndex === visibleRows.length - 1 &&
                                columnIndex === columns.length - 1
                                  ? { borderBottomRightRadius: "4px" }
                                  : {}),
                              }}
                            >
                              {formatTableCellValue(getRowValue(row, column))}
                            </Box>
                          ))}
                        </Box>
                      );
                    })
                  : null}
                {datasetQuery.isFetchingNextPage ? (
                  <Box component="tr">
                    <Box
                      component="td"
                      colSpan={
                        columns.length + (tableOptions.showRowNumbers ? 1 : 0)
                      }
                      sx={{
                        ...tableCellSx,
                        height: "48px",
                        textAlign: "center",
                        bgcolor: "#FFFFFF",
                      }}
                    >
                      <CircularProgress size={16} />
                    </Box>
                  </Box>
                ) : null}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            gap: "10px",
            width: "100%",
            display: "flex",
            padding: "10px",
            cursor: viewMode ? "default" : "pointer",
            borderRadius: "4px",
            alignItems: "center",
            bgcolor: "#d6ddfd",
            flexDirection: "column",
            justifyContent: "center",
            border: "1px dashed #3154f4",
            transition: "all 0.3s ease-in-out",
            height: "330px",
          }}
        >
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path
              d="M12 3.5V21.5M3 9.5H21M3 15.5H21M5 3.5H19C20.1046 3.5 21 4.39543 21 5.5V19.5C21 20.6046 20.1046 21.5 19 21.5H5C3.89543 21.5 3 20.6046 3 19.5V5.5C3 4.39543 3.89543 3.5 5 3.5Z"
              stroke="#3154F4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Typography fontSize="16px" color="#3154f4">
            Click to add a table
          </Typography>
        </Box>
      )}
    </Box>
  );
};
