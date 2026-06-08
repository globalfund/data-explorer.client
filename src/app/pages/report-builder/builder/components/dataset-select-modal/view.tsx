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
import DropWrapper from "app/components/drop-wrapper";
import DragWrapper from "app/components/drag-wrapper";

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

  const [isDraggingColumn, setIsDraggingColumn] = React.useState(false);

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

  const handleAddColumn = (column: DatasetColumn) => {
    setSelectedColumnNames((current) =>
      current.includes(column.name)
        ? [...current.filter((name) => name !== column.name), column.name]
        : [...current, column.name],
    );
  };

  const handleInsertColumn = (column: DatasetColumn, newIndex: number) => {
    setSelectedColumnNames((current) => {
      const withoutColumn = current.filter((name) => name !== column.name);
      const currentIndex = current.indexOf(column.name);
      if (currentIndex === -1) {
        // column is being added from available fields, insert at newIndex
        return [
          ...withoutColumn.slice(0, newIndex),
          column.name,
          ...withoutColumn.slice(newIndex),
        ];
      }
      // column is being moved within selected columns, insert at newIndex with current column removed
      const adjustedIndex = currentIndex < newIndex ? newIndex - 1 : newIndex;
      return [
        ...withoutColumn.slice(0, adjustedIndex),
        column.name,
        ...withoutColumn.slice(adjustedIndex),
      ];
    });
  };

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
              columns.map((column) => {
                const selected = selectedColumnNames.includes(column.name);
                const FieldIcon = getFieldIcon(column.type);
                return (
                  <DragWrapper
                    key={column.name}
                    data={column}
                    type="COLUMN"
                    sx={{ borderRadius: "26px" }}
                    disabled={selected}
                    setIsDragging={setIsDraggingColumn}
                  >
                    <Box
                      component="button"
                      type="button"
                      disabled={selected}
                      sx={{
                        ...fieldChipSx,
                        color: selected ? "#adb5bd" : "#373d43",
                        borderColor: selected ? "#dfe3e5" : "#98a1aa",
                      }}
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
                    </Box>
                  </DragWrapper>
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
          <Box
            sx={{
              columnGap: isDraggingColumn ? 0 : "10px",
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
            {selectedColumns.length ? (
              <React.Fragment>
                {selectedColumns.map((column, index) => {
                  const FieldIcon = getFieldIcon(column.type);
                  return (
                    <React.Fragment key={column.name}>
                      {isDraggingColumn ? (
                        <DropWrapper
                          accept={["SELECTED_COLUMN", "COLUMN"]}
                          sx={{
                            height: "100%",
                            position: "relative",
                            minWidth: index === 0 ? undefined : "10px",
                            minHeight: "28px",
                          }}
                          dropHandler={(item) =>
                            handleInsertColumn(item, index)
                          }
                        >
                          {({ isOver, item, itemType }) =>
                            isOver ? (
                              <Typography
                                fontSize="14px"
                                color="#adb5bd"
                                sx={{
                                  padding: "0 10px",
                                  width: "100%",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  marginLeft: index === 0 ? "-16px" : "0",
                                }}
                              >
                                {itemType === "COLUMN"
                                  ? `Release to add "${item.name}"`
                                  : `Release to move "${item.name}" here`}
                              </Typography>
                            ) : (
                              <Box
                                sx={{
                                  height: "28px",
                                  width: "100px",
                                  position: "absolute",
                                  left: index === 0 ? "-16px" : "-45px",
                                }}
                              />
                            )
                          }
                        </DropWrapper>
                      ) : null}
                      <DragWrapper
                        type="SELECTED_COLUMN"
                        data={column}
                        sx={{
                          gap: "6px",
                          px: "12px",
                          py: "6px",
                          display: "flex",
                          color: "#ffffff",
                          borderRadius: "6px",
                          alignItems: "center",
                          bgcolor:
                            column.type === "number" ? "#0E6027" : "#3154f4",
                          svg: {
                            flexShrink: 0,
                          },
                        }}
                        setIsDragging={setIsDraggingColumn}
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
                      </DragWrapper>
                      {isDraggingColumn &&
                      index === selectedColumns.length - 1 ? (
                        <Box
                          sx={{
                            height: "28px",
                            width: "10px",
                          }}
                        />
                      ) : null}
                    </React.Fragment>
                  );
                })}
                <DropWrapper
                  accept={["COLUMN", "SELECTED_COLUMN"]}
                  dropHandler={(item) => {
                    handleAddColumn(item);
                  }}
                  sx={{
                    flex: 1,
                    minWidth: "120px",
                  }}
                >
                  {({ isOver, item, itemType }) =>
                    isOver ? (
                      <Typography
                        fontSize="14px"
                        color="#adb5bd"
                        sx={{
                          width: "100%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {itemType === "COLUMN"
                          ? `Release to add "${item.name}"`
                          : `Release to move "${item.name}" here`}
                      </Typography>
                    ) : (
                      <Typography
                        fontSize="14px"
                        color="#adb5bd"
                        sx={{ width: "100%" }}
                      >
                        + drop more
                      </Typography>
                    )
                  }
                </DropWrapper>
              </React.Fragment>
            ) : (
              <DropWrapper
                accept={["COLUMN"]}
                dropHandler={(item) => {
                  handleAddColumn(item);
                }}
                sx={{
                  flex: 1,
                  minWidth: "120px",
                }}
              >
                {({ isOver, item, itemType }) =>
                  isOver ? (
                    <Typography fontSize="14px" color="#adb5bd">
                      {itemType === "COLUMN"
                        ? `Release to add "${item.name}"`
                        : `Release to move "${item.name}" here`}
                    </Typography>
                  ) : (
                    <Typography
                      fontSize="14px"
                      color="#adb5bd"
                      sx={{ width: "100%" }}
                    >
                      Drop fields here {"->"}
                    </Typography>
                  )
                }
              </DropWrapper>
            )}
          </Box>
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
  );
};

export default DatasetSelectModalDataView;
