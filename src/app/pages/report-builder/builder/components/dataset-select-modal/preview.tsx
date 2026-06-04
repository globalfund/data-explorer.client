import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SearchIcon from "app/assets/vectors/Search_grants.svg?react";
import SettingsIcon from "app/assets/vectors/Settings_ButtonIcon.svg?react";
import SortIcon from "app/assets/vectors/RBTableSort.svg?react";
import FilterIcon from "app/assets/vectors/RBTableFilter.svg?react";
import DatasetArrowLeftIcon from "app/assets/vectors/DatasetArrowLeft.svg?react";
import DatasetArrowRightIcon from "app/assets/vectors/DatasetArrowRight.svg?react";
import { datasetItems } from "app/pages/report-builder/builder/components/chart/data";
import {
  useGFDatasetPage,
  useGFSampleDataset,
} from "app/hooks/queries/report-builder";
import { DatasetStepHeader } from "./step-header";
import {
  DatasetColumn,
  DatasetRowsPerPage,
  formatCellValue,
  formatNumber,
} from "./utils";

interface DataPreviewProps {
  selectedDataset: string;
  selectedColumns: DatasetColumn[];
  rowsPerPage: DatasetRowsPerPage;
  onRowsPerPageChange: (rowsPerPage: DatasetRowsPerPage) => void;
  onBack: () => void;
  onBackToDatasets: () => void;
  onCancel: () => void;
  onUseDataset: () => void;
}

const headerTooltip =
  "Hover to reveal sort and filter options, double-click to edit the header cell text.";

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
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  border: "0.5px solid #cfd4da",
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
  width: 35,
  height: 35,
  color: "#252c34",
  borderRadius: "4px",
  border: "0.5px solid transparent",
  "&:hover": {
    bgcolor: "#eff1fe",
    borderColor: "#3154f4",
  },
};

const DataPreview: React.FC<DataPreviewProps> = ({
  selectedDataset,
  selectedColumns,
  rowsPerPage,
  onRowsPerPageChange,
  onBack,
  onBackToDatasets,
  onCancel,
  onUseDataset,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const pageSize = Number(rowsPerPage);
  const selectedDatasetItem = datasetItems.find(
    (dataset) => dataset.id === selectedDataset,
  );
  const sampledDatasetQuery = useGFSampleDataset(selectedDataset);
  const sampledDataset = sampledDatasetQuery?.data?.data?.data?.result;
  const datasetQuery = useGFDatasetPage(selectedDataset, currentPage, pageSize);
  const pageResult = datasetQuery?.data?.data?.data?.result;
  const totalRows = pageResult?.count ?? sampledDataset?.count ?? 0;
  const totalColumns = sampledDataset?.stats?.length || selectedColumns.length;
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

  const pageRows = React.useMemo(() => pageResult?.data ?? [], [pageResult]);
  const filteredRows = React.useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return pageRows;
    return pageRows.filter((row) =>
      selectedColumns.some((column) =>
        formatCellValue(row?.[column.name]).toLowerCase().includes(searchTerm),
      ),
    );
  }, [pageRows, search, selectedColumns]);

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
            gap: "12px",
            px: "16px",
            py: "10px",
            display: "flex",
            alignItems: "center",
            borderBottom: "0.5px solid #cfd4da",
          }}
        >
          <Tooltip title="Table settings" arrow>
            <IconButton aria-label="Table settings" sx={iconButtonSx}>
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
          <Box sx={{ width: "1px", height: 35, bgcolor: "#cfd4da" }} />
          <Typography
            fontSize="16px"
            color="#373d43"
            sx={{ flex: 1, minWidth: 0 }}
          >
            No filters or sort active - click any column header to configure
          </Typography>
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

        <Box
          sx={{
            minHeight: 0,
            flex: 1,
            p: "16px 16px 0",
            overflow: "auto",
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
              width: "100%",
              height: "100%",
              overflow: "auto",
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
                minWidth: "100%",
                borderCollapse: "collapse",
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
                  textAlign: "left",
                },
              }}
            >
              <Box component="thead">
                <Box component="tr">
                  <Box component="th" sx={{ width: "51px" }}>
                    #
                  </Box>
                  {selectedColumns.map((column, index) => (
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
                    sx={{ width: "51px", bgcolor: "#ffffff" }}
                  >
                    {""}
                  </Box>
                  {selectedColumns.map((column) => (
                    <Box
                      key={`column-header-${column.name}`}
                      component="th"
                      sx={{
                        width: "240px",
                        color: "#101018",
                        fontWeight: 700,
                        textAlign: "left",
                        bgcolor: "#ffffff",
                      }}
                    >
                      <Tooltip
                        arrow
                        title={headerTooltip}
                        slotProps={{
                          arrow: {
                            sx: { color: "#000" },
                          },
                          tooltip: {
                            sx: {
                              p: "10px",
                              color: "#ffffff",
                              fontSize: "14px",
                              maxWidth: "217px",
                              bgcolor: "#000000",
                              boxShadow:
                                "0px 2px 3.5px 0px rgba(0, 0, 0, 0.12)",
                            },
                          },
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontWeight: 700,
                          }}
                        >
                          {column.name}
                        </Box>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {datasetQuery.isFetching && !filteredRows.length ? (
                  <Box component="tr">
                    <Box
                      component="td"
                      colSpan={selectedColumns.length + 1}
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
                        {selectedColumns.map((column) => (
                          <Box
                            key={`${rowIndex}-${column.name}`}
                            component="td"
                            sx={{
                              width: "240px",
                              bgcolor: rowBg,
                            }}
                          >
                            {formatCellValue(row?.[column.name])}
                          </Box>
                        ))}
                      </Box>
                    );
                  })
                ) : (
                  <Box component="tr">
                    <Box
                      component="td"
                      colSpan={selectedColumns.length + 1}
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
          disabled={!selectedColumns.length}
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
