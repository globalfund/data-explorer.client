import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SearchIcon from "app/assets/vectors/Search_grants.svg?react";
import SettingsIcon from "app/assets/vectors/Settings.svg?react";
import SortIcon from "app/assets/vectors/RBTableSort.svg?react";

import FilterIcon from "app/assets/vectors/RBTableFilter.svg?react";
import DatasetArrowLeftIcon from "app/assets/vectors/DatasetArrowLeft.svg?react";
import DatasetArrowRightIcon from "app/assets/vectors/DatasetArrowRight.svg?react";
import { datasetItems } from "app/pages/report-builder/builder/components/chart/data";
import {
  useDatasetFilterOptions,
  useFilteredDatasetPage,
  useGFSampleDataset,
} from "app/hooks/queries/report-builder";
import { DatasetStepHeader } from "./step-header";
import {
  DatasetColumn,
  DatasetRowsPerPage,
  formatCellValue,
  formatNumber,
} from "./utils";
import DatasetColumnHeader from "./dataset-column-header";
import { FilterGroupOptionModel } from "app/state/api/action-reducers/report-builder/sync";
import SelectedFilters from "./selected-filters";
import SelectedSorting from "./selected-sorting";

interface DataPreviewProps {
  selectedDataset: string;
  setPreviewColumns: React.Dispatch<React.SetStateAction<DatasetColumn[]>>;
  previewColumns: DatasetColumn[];
  rowsPerPage: DatasetRowsPerPage;
  onRowsPerPageChange: (rowsPerPage: DatasetRowsPerPage) => void;
  onBack: () => void;
  onBackToDatasets: () => void;
  onCancel: () => void;
  onUseDataset: () => void;
  filters: Record<string, any[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
  sorting?: {
    column: string;
    order: "asc" | "desc";
  }[];
  setSorting?: React.Dispatch<
    React.SetStateAction<{ column: string; order: "asc" | "desc" }[]>
  >;
}

const getVisiblePages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ] as const;
};

const tableCellSx = {
  height: "48px",
  px: "16px",
  py: "12px",
  fontSize: "14px",
  color: "#373d43",
  borderBottom: "0.5px solid #cfd4da",
  borderRight: "0.5px solid #cfd4da",
};

const paginationButtonSx = {
  height: "35px",
  minWidth: "32px",
  px: "12px",
  py: "9px",
  gap: "5px",
  fontSize: "14px",
  fontWeight: 400,
  color: "#000",
  borderRadius: "4px",
  textTransform: "none",
  border: "0.5px solid #98a1aa",
  bgcolor: "#ffffff",
  "&:hover": {
    bgcolor: "#f8f9fa",
  },
  "&.Mui-disabled": {
    color: "#adb5bd",
    borderColor: "#dfe3e5",
    bgcolor: "#dfe3e5",
  },
  ".MuiButton-startIcon, .MuiButton-endIcon": {
    m: 0,
  },
};

const iconButtonSx = {
  padding: "0",
  color: "#252c34",
  borderRadius: "4px",
  border: "0.5px solid transparent",
};

const DataPreview: React.FC<DataPreviewProps> = ({
  selectedDataset,
  setPreviewColumns,
  previewColumns,
  rowsPerPage,
  onRowsPerPageChange,
  onBack,
  onBackToDatasets,
  onCancel,
  onUseDataset,
  filters,
  setFilters,
  sorting,
  setSorting,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const pageSize = Number(rowsPerPage);
  const selectedDatasetItem = datasetItems.find(
    (dataset) => dataset.id === selectedDataset,
  );
  const sampledDatasetQuery = useGFSampleDataset(selectedDataset);
  const sampledDataset = sampledDatasetQuery?.data?.data?.data?.result;
  const datasetQuery = useFilteredDatasetPage({
    datasetId: selectedDataset,
    filters,
    sorting: sorting ?? [],
    pageSize,
    page: currentPage,
  });

  const filterOptionsQuery = useDatasetFilterOptions(selectedDataset, filters);
  const filterOptions = filterOptionsQuery?.data?.data;

  const filterOptionGroups = React.useMemo(() => {
    return (
      filterOptions?.reduce(
        (acc: Record<string, FilterGroupOptionModel[]>, group: any) => {
          if (group.options && group.options.length > 0) {
            acc[group.name] = group.options;
          }
          return acc;
        },
        {},
      ) || {}
    );
  }, [filterOptions]);

  const pageResult = datasetQuery?.data?.data;

  const totalRows = pageResult?.count ?? sampledDataset?.count ?? 0;
  const totalColumns = sampledDataset?.stats?.length || previewColumns.length;
  const totalCells = totalRows ? totalRows * totalColumns : undefined;
  const totalPages = Math.max(Math.ceil(totalRows / pageSize), 1);
  const pageStart = totalRows ? (currentPage - 1) * pageSize + 1 : 0;
  const pageEnd = totalRows ? Math.min(currentPage * pageSize, totalRows) : 0;
  const stepSubtitle =
    datasetQuery.isLoading && !pageResult
      ? "Loading dataset..."
      : `${formatNumber(totalRows)} rows (${formatNumber(
          totalCells,
        )} cells) have been successfully parsed, now you can choose table columns!`;

  React.useEffect(() => {
    setCurrentPage(1);
    setSearch("");
  }, [selectedDataset, rowsPerPage]);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const dataTypes = sampledDataset?.dataTypes ?? {};

  const pageRows = React.useMemo(() => pageResult?.result ?? [], [pageResult]);
  const filteredRows = React.useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return pageRows;
    return pageRows.filter((row) =>
      previewColumns.some((column) =>
        formatCellValue(row?.[column.name]).toLowerCase().includes(searchTerm),
      ),
    );
  }, [pageRows, search, previewColumns]);

  const handleRowsPerPageChange = (nextRowsPerPage: DatasetRowsPerPage) => {
    setCurrentPage(1);
    onRowsPerPageChange(nextRowsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const paginationItems = getVisiblePages(currentPage, totalPages);
  const firstPage = currentPage === 1;
  const lastPage = currentPage === totalPages;

  return (
    <React.Fragment>
      <Box
        sx={{
          minHeight: 0,
          flex: 1,
          display: "flex",
          overflow: "hidden",
          flexDirection: "column",
          bgcolor: "#ffffff",
        }}
      >
        <DatasetStepHeader
          title={selectedDatasetItem?.name || "Selected Dataset"}
          subtitle={stepSubtitle}
          rowsPerPage={rowsPerPage}
          onBack={onBack}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <Box
          sx={{
            gap: "16px",
            px: "16px",
            py: "10px",
            display: "flex",
            alignItems: "center",
            borderBottom: "0.5px solid #cfd4da",
          }}
        >
          <Tooltip title="Table settings" arrow>
            <IconButton
              aria-label="Table settings"
              sx={iconButtonSx}
              disableRipple
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{ width: "1px", height: 35, bgcolor: "#cfd4da" }} />
          <TextField
            size="small"
            value={search}
            placeholder="Search"
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: "219px",
              ".MuiInputBase-root": {
                height: "35px",
                fontSize: "14px",
                borderRadius: "5px",
                bgcolor: "#f1f3f5",
              },
              ".MuiOutlinedInput-notchedOutline": {
                border: 0,
              },
            }}
          />

          {(sorting && sorting.length > 0) ||
          Object.values(filters).flat().length > 0 ? null : (
            <>
              <Box sx={{ width: "1px", height: 35, bgcolor: "#cfd4da" }} />
              <Typography fontSize="16px" color="#373d43">
                No filters or sort active - click any column header to configure
              </Typography>
            </>
          )}

          {Object.values(filters).flat().length > 0 ? (
            <>
              <Box sx={{ width: "1px", height: 35, bgcolor: "#cfd4da" }} />
              <Typography fontSize="16px" color="#3154F4">
                {Object.values(filters).flat().length} Filter
                {Object.values(filters).flat().length > 1 ? "s" : ""} active
              </Typography>
            </>
          ) : null}

          {sorting && sorting.length > 0 ? (
            <>
              <Box sx={{ width: "1px", height: 35, bgcolor: "#cfd4da" }} />
              <Typography fontSize="16px" color="#3154F4">
                {sorting.length} sort
                {sorting.length > 1 ? "s" : ""} applied
              </Typography>
            </>
          ) : null}
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Sort columns" arrow>
            <IconButton
              disableRipple
              aria-label="Sort columns"
              sx={iconButtonSx}
            >
              <SortIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter rows" arrow>
            <IconButton aria-label="Filter rows" sx={iconButtonSx}>
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <SelectedFilters
          filters={filters}
          setFilters={setFilters}
          dataTypes={dataTypes}
        />
        <SelectedSorting sorting={sorting} setSorting={setSorting} />
        <Box
          sx={{
            minHeight: 0,
            flex: 1,
            display: "flex",
            p: "20px",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              minHeight: 0,
              width: "100%",
              // position: "relative",
              flex: 1,
              overflow: "auto",
              pb: "20px",
              pr: "20px",
              scrollbarGutter: "stable",
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
              component="table"
              sx={{
                width: "max-content",
                borderCollapse: "separate",
                borderSpacing: 0,
                tableLayout: "fixed",
                th: {
                  ...tableCellSx,
                  fontWeight: 400,
                  color: "#373d43",
                  textAlign: "center",
                  bgcolor: "#f1f3f5",
                },
                td: {
                  ...tableCellSx,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  textAlign: "left",
                },

                // sticky header
                thead: {
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                },

                // sticky first column body cells
                "tbody td:first-of-type": {
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  borderLeft: "0.5px solid #cfd4da",
                },

                // sticky top-left corner cell
                "thead th:first-of-type": {
                  position: "sticky",
                  top: 0,
                  left: 0,
                  borderLeft: "0.5px solid #cfd4da",
                },

                // top border of the table
                "thead tr:first-of-type th": {
                  borderTop: "0.5px solid #cfd4da",
                },

                // left border of the table
                "tr > th:first-of-type, tr > td:first-of-type": {
                  borderLeft: "0.5px solid #cfd4da",
                },
              }}
            >
              <Box component="thead">
                <Box component="tr">
                  <Box component="th" sx={{ width: "51px" }}>
                    #
                  </Box>
                  {previewColumns.map((column, index) => (
                    <Box
                      key={`column-number-${column.name}`}
                      component="th"
                      sx={{ width: "240px" }}
                    >
                      {index + 1}
                    </Box>
                  ))}
                </Box>
                <Box component="tr">
                  <Box
                    component="th"
                    sx={{
                      width: "51px",
                      bgcolor: "#ffffff !important",
                      textAlign: "center",
                    }}
                  ></Box>
                  {previewColumns.map((column) => (
                    <DatasetColumnHeader
                      key={`column-header-${column.name}`}
                      column={column}
                      setColumn={(updatedColumn) => {
                        setPreviewColumns((prevColumns) =>
                          prevColumns.map((col) =>
                            col.name === column.name ? updatedColumn : col,
                          ),
                        );
                      }}
                      filterGroupOptions={
                        filterOptionGroups?.[column.name] || []
                      }
                      setSelectedFilters={(selectedFilters: string[]) => {
                        setFilters((prevFilters) => {
                          if (selectedFilters.length === 0) {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { [column.name]: _, ...rest } = prevFilters;
                            return rest;
                          }
                          return {
                            ...prevFilters,
                            [column.name]: selectedFilters,
                          };
                        });
                      }}
                      selectedFilters={filters?.[column.name] || []}
                      sorting={sorting}
                      setSorting={setSorting}
                    />
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {datasetQuery.isFetching && !filteredRows.length ? (
                  <Box component="tr">
                    <Box
                      component="td"
                      colSpan={previewColumns.length + 1}
                      sx={{
                        textAlign: "center",
                        bgcolor: "#f8f9fa",
                      }}
                    >
                      Loading rows...
                    </Box>
                  </Box>
                ) : filteredRows.length ? (
                  filteredRows.map((row, rowIndex) => {
                    const rowNumber = pageStart + rowIndex;
                    const rowBg = rowIndex % 2 === 0 ? "#f8f9fa" : "#ffffff";
                    return (
                      <Box key={`preview-row-${rowIndex}`} component="tr">
                        <Box
                          component="td"
                          sx={{
                            width: "51px",
                            textAlign: "center",
                            bgcolor: rowBg,
                          }}
                        >
                          {rowNumber}
                        </Box>
                        {previewColumns.map((column) => (
                          <Box
                            key={`${rowIndex}-${column.id}`}
                            component="td"
                            sx={{
                              width: "240px",
                              bgcolor: rowBg,
                            }}
                          >
                            {formatCellValue(row?.[column.id])}
                          </Box>
                        ))}
                      </Box>
                    );
                  })
                ) : (
                  <Box component="tr">
                    <Box
                      component="td"
                      colSpan={previewColumns.length + 1}
                      sx={{
                        textAlign: "center",
                        bgcolor: "#f8f9fa",
                      }}
                    >
                      No rows found
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            gap: "16px",
            p: "16px",
            display: "flex",
            alignItems: "center",
            borderTop: "0.5px solid #cfd4da",
            overflowX: "auto",
            flexShrink: 0,
          }}
        >
          <Typography fontSize="16px" color="#262c34" whiteSpace="nowrap">
            {pageStart}-{pageEnd} of {formatNumber(totalRows)}
          </Typography>
          <Box
            sx={{
              gap: "10px",
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            <Button
              startIcon={<DatasetArrowLeftIcon />}
              disabled={firstPage}
              onClick={() => handlePageChange(1)}
              sx={paginationButtonSx}
            >
              First
            </Button>
            <Button
              startIcon={<DatasetArrowLeftIcon />}
              disabled={firstPage}
              onClick={() => handlePageChange(currentPage - 1)}
              sx={paginationButtonSx}
            >
              Back
            </Button>
            {paginationItems.map((item, index) =>
              typeof item === "number" ? (
                <Button
                  key={`page-${item}`}
                  onClick={() => handlePageChange(item)}
                  sx={{
                    ...paginationButtonSx,
                    px: "10px",
                    color: item === currentPage ? "#3154f4" : "#000",
                    bgcolor: item === currentPage ? "#eff1fe" : "#ffffff",
                    borderColor: item === currentPage ? "#3154f4" : "#98a1aa",
                  }}
                >
                  {item}
                </Button>
              ) : (
                <Typography
                  key={`${item}-${index.toString()}`}
                  fontSize="16px"
                  color="#000"
                  sx={{
                    px: "4px",
                    width: "33px",
                    textAlign: "center",
                  }}
                >
                  ...
                </Typography>
              ),
            )}
            <Button
              endIcon={<DatasetArrowRightIcon />}
              disabled={lastPage}
              onClick={() => handlePageChange(currentPage + 1)}
              sx={paginationButtonSx}
            >
              Next
            </Button>
            <Button
              endIcon={<DatasetArrowRightIcon />}
              disabled={lastPage}
              onClick={() => handlePageChange(totalPages)}
              sx={paginationButtonSx}
            >
              Last
            </Button>
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
          onClick={onBackToDatasets}
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
          disabled={!previewColumns.length}
          endIcon={<DatasetArrowRightIcon />}
          onClick={onUseDataset}
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
          Use Dataset
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default DataPreview;
