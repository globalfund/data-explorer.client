import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DatasetArrowLeftIcon from "app/assets/vectors/DatasetArrowLeft.svg?react";
import DatasetArrowRightIcon from "app/assets/vectors/DatasetArrowRight.svg?react";
import DatasetFieldCloseIcon from "app/assets/vectors/DatasetFieldClose.svg?react";
import DatasetFieldDateIcon from "app/assets/vectors/DatasetFieldDate.svg?react";
import DatasetFieldNumberIcon from "app/assets/vectors/DatasetFieldNumber.svg?react";
import DatasetFieldTextIcon from "app/assets/vectors/DatasetFieldText.svg?react";
import { datasetItems } from "app/pages/report-builder/builder/components/chart/data";
import {
  DataType,
  RBSampledDatasetResponse,
} from "app/state/api/action-reducers/report-builder/sync";
import { DatasetStepHeader } from "./step-header";
import {
  DatasetColumn,
  DatasetRowsPerPage,
  formatCellValue,
  formatNumber,
  getColumnType,
} from "./utils";
import ColumnSortWrapper from "./sort-wrapper";
import DropArea from "./drop-area";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import uniq from "lodash/uniq";

interface DataViewProps {
  selectedDataset: string;
  initialSelectedColumns?: string[];
  rowsPerPage: DatasetRowsPerPage;
  onRowsPerPageChange: (rowsPerPage: DatasetRowsPerPage) => void;
  onBack: () => void;
  onCancel: () => void;
  onPreviewTable: (columns: DatasetColumn[]) => void;
  sampledDataset?: RBSampledDatasetResponse["data"]["result"];
  sampledDatasetLoading?: boolean;
}

const getFieldIcon = (type: DataType) => {
  if (type === "number") return DatasetFieldNumberIcon;
  if (type === "date" || type === "date-time") return DatasetFieldDateIcon;
  return DatasetFieldTextIcon;
};

const fieldChipSx = {
  m: 0,
  gap: "6px",
  px: "12px",
  py: "6px",
  display: "flex",
  font: "inherit",
  color: "#373d43",
  borderRadius: "26px",
  alignItems: "center",
  bgcolor: "#ffffff",
  border: "0.5px solid #98a1aa",
  svg: {
    flexShrink: 0,
  },
};

const DatasetSelectModalDataView: React.FC<DataViewProps> = ({
  selectedDataset,
  initialSelectedColumns = [],
  rowsPerPage,
  onRowsPerPageChange,
  onBack,
  onCancel,
  onPreviewTable,
  sampledDataset,
  sampledDatasetLoading,
}) => {
  const [selectedColumnNames, setSelectedColumnNames] = React.useState<
    string[]
  >([]);

  const selectedDatasetItem = datasetItems.find(
    (dataset) => dataset.id === selectedDataset,
  );

  const [isDraggingColumn1, setIsDraggingColumn1] = React.useState(false);
  const [isDraggingColumn2, setIsDraggingColumn2] = React.useState(false);

  const isDraggingColumn = isDraggingColumn1 || isDraggingColumn2;

  React.useEffect(() => {
    setSelectedColumnNames(initialSelectedColumns);
  }, [initialSelectedColumns, selectedDataset]);

  const columns = React.useMemo<DatasetColumn[]>(() => {
    const dataTypes = sampledDataset?.dataTypes ?? {};
    return (
      sampledDataset?.stats?.map((stat) => ({
        name: stat.name,
        type: getColumnType(dataTypes[stat.name]),
      })) ?? []
    );
  }, [sampledDataset?.dataTypes, sampledDataset?.stats]);

  const columnsByName = React.useMemo(() => {
    return new Map(columns.map((column) => [column.name, column]));
  }, [columns]);

  const selectedColumns = React.useMemo(
    () =>
      selectedColumnNames.map(
        (name) =>
          columnsByName.get(name) ?? {
            name,
            type: "string" as DataType,
          },
      ),
    [columnsByName, selectedColumnNames],
  );

  const previewRows = React.useMemo(
    () => (sampledDataset?.sample ?? []).slice(0, 5),
    [sampledDataset?.sample],
  );

  const cellCount =
    typeof sampledDataset?.count === "number"
      ? sampledDataset.count * columns.length
      : undefined;
  const stepSubtitle = sampledDatasetLoading
    ? "Loading dataset..."
    : `${formatNumber(sampledDataset?.count)} rows (${formatNumber(
        cellCount,
      )} cells) have been successfully parsed, now you can choose table columns!`;

  const handleRemoveColumn = (columnName: string) => {
    setSelectedColumnNames((current) =>
      current.filter((name) => name !== columnName),
    );
  };

  const handlePreviewTable = () => {
    if (!selectedColumns.length) return;
    onPreviewTable(selectedColumns);
  };

  return (
    <DragDropProvider
      onDragOver={(event) => {
        setSelectedColumnNames((current) => {
          const newOrder = move(
            {
              SELECT_AREA: columns
                .filter((column) => !current.includes(column.name))
                .map((c) => c.name),
              DROP_AREA: current,
            },
            event,
          ).DROP_AREA;
          console.log("newOrder", newOrder);
          return uniq(newOrder);
        });
      }}
    >
      <React.Fragment>
        <Box
          sx={{
            minHeight: 0,
            flex: 1,
            display: "flex",
            overflowY: "auto",
            flexDirection: "column",
            bgcolor: "#ffffff",
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#000",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#D9D9D9",
            },
          }}
        >
          <DatasetStepHeader
            title={selectedDatasetItem?.name || "Selected Dataset"}
            subtitle={stepSubtitle}
            rowsPerPage={rowsPerPage}
            onBack={onBack}
            onRowsPerPageChange={onRowsPerPageChange}
          />

          <Box
            sx={{
              p: "16px",
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              borderBottom: "0.5px solid #cfd4da",
            }}
          >
            <Typography fontSize="16px" fontWeight={700} color="#000">
              Available Fields - drag into table columns
            </Typography>
            <Box
              sx={{
                gap: "10px",
                p: "16px",
                display: "flex",
                flexWrap: "wrap",
                minHeight: "70px",
                bgcolor: "#f8f9fa",
                borderRadius: "9px",
                alignItems: "flex-start",
              }}
            >
              {sampledDatasetLoading ? (
                <Typography fontSize="14px" color="#adb5bd">
                  Loading fields...
                </Typography>
              ) : columns.length ? (
                columns.map((column, index) => {
                  const selected = selectedColumnNames.includes(column.name);
                  const FieldIcon = getFieldIcon(column.type);
                  return (
                    <ColumnSortWrapper
                      id={column.name}
                      index={index}
                      key={column.name}
                      disabled={selected}
                      type="AVAILABLE_COLUMN"
                      sx={{
                        ...fieldChipSx,
                        color: selected ? "#adb5bd" : "#373d43",
                        borderColor: selected ? "#dfe3e5" : "#98a1aa",
                      }}
                      setIsDragging={setIsDraggingColumn1}
                      group="SELECT_AREA"
                    >
                      <FieldIcon />
                      <Typography
                        component="span"
                        fontSize="14px"
                        lineHeight="normal"
                        color="inherit"
                      >
                        {column.name}
                      </Typography>
                    </ColumnSortWrapper>
                  );
                })
              ) : (
                <Typography fontSize="14px" color="#adb5bd">
                  No fields available
                </Typography>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              p: "16px",
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              borderBottom: "0.5px solid #cfd4da",
            }}
          >
            <Typography fontSize="16px" fontWeight={700} color="#000">
              Table columns (ordered) - drag to reorder, x to remove
            </Typography>
            <DropArea
              key="DROP_AREA"
              id="DROP_AREA"
              sx={{
                columnGap: "10px",
                padding: "16px",
                display: "flex",
                rowGap: "10px",
                flexWrap: "wrap",
                minHeight: "44px",
                bgcolor: "#f8f9fa",
                borderRadius: "9px",
                alignItems: "center",
                border: `0.5px dashed ${isDraggingColumn ? "#3154F4" : "#98a1aa"}`,
              }}
            >
              {({ isDropTarget }) => (
                <>
                  {selectedColumns.length ? (
                    <React.Fragment>
                      {selectedColumns.map((column, index) => {
                        const FieldIcon = getFieldIcon(column.type);
                        return (
                          <React.Fragment key={column.name}>
                            <ColumnSortWrapper
                              index={index}
                              id={column.name}
                              key={column.name}
                              type="SELECTED_COLUMN"
                              sx={{
                                gap: "6px",
                                px: "12px",
                                py: "6px",
                                display: "flex",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "6px",
                                alignItems: "center",
                                bgcolor:
                                  column.type === "number"
                                    ? "#0E6027"
                                    : "#3154f4",
                                svg: {
                                  flexShrink: 0,
                                },
                              }}
                              setIsDragging={setIsDraggingColumn2}
                              group="DROP_AREA"
                            >
                              <FieldIcon />
                              <Typography
                                component="span"
                                fontSize="14px"
                                lineHeight="normal"
                                color="inherit"
                              >
                                {column.name}
                              </Typography>
                              <Box
                                component="button"
                                type="button"
                                aria-label={`Remove ${column.name}`}
                                onClick={() => handleRemoveColumn(column.name)}
                                sx={{
                                  p: 0,
                                  m: 0,
                                  width: 14,
                                  height: 14,
                                  border: 0,
                                  color: "#ffffff",
                                  display: "flex",
                                  cursor: "pointer",
                                  bgcolor: "transparent",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <DatasetFieldCloseIcon />
                              </Box>
                            </ColumnSortWrapper>
                          </React.Fragment>
                        );
                      })}

                      <Typography
                        fontSize="14px"
                        color="#adb5bd"
                        sx={{ width: "100%" }}
                      >
                        {isDropTarget ? "Release to drop" : "+ drop more"}
                      </Typography>
                    </React.Fragment>
                  ) : (
                    <Typography
                      fontSize="14px"
                      color="#adb5bd"
                      sx={{ width: "100%" }}
                    >
                      {isDropTarget ? "Release to drop" : "Drop fields here ->"}
                    </Typography>
                  )}
                </>
              )}
            </DropArea>
          </Box>

          <Box
            sx={{
              p: "20px",
              minHeight: "312px",
              display: "flex",
              flex: 1,
            }}
          >
            <Box
              sx={{
                width: "100%",
                minHeight: "242px",
                overflow: "auto",
                bgcolor: "#f8f9fa",
                border: "0.5px solid #cfd4da",
                "&::-webkit-scrollbar": {
                  width: "4px",
                  height: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#000",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#D9D9D9",
                },
              }}
            >
              <Box
                sx={{
                  height: "40px",
                  px: "16px",
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#f8f9fa",
                  borderBottom: "0.5px solid #cfd4da",
                }}
              >
                <Typography fontSize="16px" fontWeight={700} color="#000">
                  Data Preview (first 5 rows)
                </Typography>
              </Box>

              {selectedColumns.length ? (
                previewRows.length ? (
                  <Box
                    component="table"
                    sx={{
                      width: "max-content",
                      minWidth:
                        selectedColumns.length === 1
                          ? "240px"
                          : `${selectedColumns.length * 220}px`,
                      borderCollapse: "collapse",
                      tableLayout: "fixed",
                      th: {
                        height: "48px",
                        px: "16px",
                        py: "12px",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#101018",
                        textAlign: "left",
                        bgcolor: "#f8f9fa",
                        border: "0.5px solid #cfd4da",
                      },
                      td: {
                        height: "48px",
                        px: "16px",
                        py: "12px",
                        fontSize: "14px",
                        color: "#373d43",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        bgcolor: "#f8f9fa",
                        border: "0.5px solid #cfd4da",
                      },
                    }}
                  >
                    <Box component="thead">
                      <Box component="tr">
                        {selectedColumns.map((column) => (
                          <Box
                            key={column.name}
                            component="th"
                            sx={{ width: "220px" }}
                          >
                            {column.name}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box component="tbody">
                      {previewRows.map((row, rowIndex) => (
                        <Box
                          key={`preview-row-${rowIndex.toString()}`}
                          component="tr"
                        >
                          {selectedColumns.map((column) => (
                            <Box
                              key={`${rowIndex.toString()}-${column.name}`}
                              component="td"
                            >
                              {formatCellValue(row?.[column.name])}
                            </Box>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: "74px",
                      px: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottom: "0.5px solid #cfd4da",
                    }}
                  >
                    <Typography fontSize="14px" color="#373d43">
                      No preview rows available
                    </Typography>
                  </Box>
                )
              ) : (
                <Box
                  sx={{
                    height: "74px",
                    px: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "0.5px solid #cfd4da",
                  }}
                >
                  <Typography fontSize="14px" color="#373d43">
                    Add columns to preview
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            gap: "16px",
            p: "16px",
            display: "flex",
            bgcolor: "#f8f9fa",
            alignItems: "center",
            justifyContent: "flex-end",
            borderTop: "0.5px solid #cfd4da",
            "@media (max-width: 767px)": {
              alignItems: "stretch",
              flexDirection: "column",
            },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<DatasetArrowLeftIcon />}
            onClick={onBack}
            sx={{
              color: "#000",
              fontSize: "16px",
              borderRadius: "4px",
              textTransform: "none",
              borderColor: "#98a1aa",
              bgcolor: "#ffffff",
            }}
          >
            Back to Datasets
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              color: "#000",
              fontSize: "16px",
              borderRadius: "4px",
              textTransform: "none",
              borderColor: "#98a1aa",
              bgcolor: "#ffffff",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!selectedColumns.length}
            endIcon={<DatasetArrowRightIcon />}
            onClick={handlePreviewTable}
            sx={{
              color: "#ffffff",
              fontSize: "16px",
              borderRadius: "4px",
              textTransform: "none",
              bgcolor: "#3154f4",
              "&:hover": {
                bgcolor: "#2542c7",
              },
              "&.Mui-disabled": {
                color: "#adb5bd",
                bgcolor: "#dfe3e5",
              },
            }}
          >
            Preview Table
          </Button>
        </Box>
      </React.Fragment>
    </DragDropProvider>
  );
};

export default DatasetSelectModalDataView;
