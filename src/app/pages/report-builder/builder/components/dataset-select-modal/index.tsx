import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "app/assets/vectors/Search_grants.svg?react";
import InputAdornment from "@mui/material/InputAdornment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DatabaseIcon from "app/assets/vectors/DatasetSelectDatabase.svg?react";
import { ArrowForward, Close } from "@mui/icons-material";
import { Modal } from "@mui/material";
import { datasetItems } from "app/pages/report-builder/builder/components/chart/data";
import { useStoreState } from "app/state/store/hooks";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import { DatasetSelect } from "./select";
import DatasetSelectModalDataView from "./view";
import DataPreview from "./preview";
import {
  DatasetColumn,
  DatasetRowsPerPage,
  getColumnType,
  getDatasetLatestUpdateKey,
} from "./utils";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useGFSampleDataset } from "app/hooks/queries/report-builder";

type DatasetSort = "updatedDate DESC" | "name ASC" | "name DESC";
type DatasetTypeFilter = "all" | "global-fund";
type DatasetModalStep = "select" | "view" | "preview";

const sortOptions = [
  { label: "Updated", value: "updatedDate DESC" },
  { label: "Name", value: "name ASC" },
  { label: "Name Z-A", value: "name DESC" },
];

const typeOptions = [
  { label: "Type", value: "all" },
  { label: "Global Fund", value: "global-fund" },
];

const vectorIconSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const DatasetSelectModal: React.FC<{
  open: boolean;
  onClose: () => void;
  skipColumnSelection?: boolean;
  handleSelectDataset?: (
    selectedDataset: string,
    previewColumns: {
      name: string;
      type: string;
    }[],
  ) => void;
}> = ({ open, onClose, skipColumnSelection, handleSelectDataset }) => {
  const [step, setStep] = React.useState<DatasetModalStep>("select");
  const [search, setSearch] = React.useState("");
  const [selectedSort, setSelectedSort] =
    React.useState<DatasetSort>("updatedDate DESC");
  const [selectedType, setSelectedType] =
    React.useState<DatasetTypeFilter>("all");
  const [selectedDataset, setSelectedDataset] = React.useState<string>("");
  const [rowsPerPage, setRowsPerPage] =
    React.useState<DatasetRowsPerPage>("10");
  const [previewColumns, setPreviewColumns] = React.useState<DatasetColumn[]>(
    [],
  );
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem: item } = useGetReportItemState<"table">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const sampledDatasetQuery = useGFSampleDataset(selectedDataset);
  const sampledDataset = sampledDatasetQuery?.data?.data?.data?.result;

  const datasetsLatestUpdate = useStoreState(
    (state) =>
      get(state.datasetsLatestUpdate, "data.data", []) as {
        name: string;
        date: string;
      }[],
  );

  React.useEffect(() => {
    if (open) {
      setSearch("");
      setSelectedSort("updatedDate DESC");
      setSelectedType("all");
      setSelectedDataset(item?.data?.dataset ?? "");
      setRowsPerPage("10");
      setPreviewColumns([]);
      setStep("select");
    }
  }, [item?.data?.dataset, open]);

  React.useEffect(() => {
    if (selectedController?.extra?.table?.datasetModalStep) {
      setStep(selectedController.extra.table.datasetModalStep);
    }
  }, [selectedController?.extra?.table?.datasetModalStep]);

  const getDatasetLatestUpdate = React.useCallback(
    (id: string) => {
      const key = getDatasetLatestUpdateKey(id);
      if (!key) return "05-01-2025";
      return (
        get(
          datasetsLatestUpdate.find((dataset) => dataset.name === key),
          "date",
          "",
        ) || "05-01-2025"
      );
    },
    [datasetsLatestUpdate],
  );

  const filteredDatasets = React.useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return datasetItems
      .filter((dataset) => {
        if (selectedType === "global-fund" && !dataset.id.startsWith("gf_")) {
          return false;
        }
        if (!searchTerm) return true;
        return [dataset.name, dataset.description]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);
      })
      .sort((a, b) => {
        if (selectedSort === "name ASC") return a.name.localeCompare(b.name);
        if (selectedSort === "name DESC") return b.name.localeCompare(a.name);
        return (
          getDatasetLatestUpdate(b.id).localeCompare(
            getDatasetLatestUpdate(a.id),
          ) || a.name.localeCompare(b.name)
        );
      });
  }, [getDatasetLatestUpdate, search, selectedSort, selectedType]);

  const initialSelectedColumns = React.useMemo(() => {
    if (selectedDataset !== item?.data?.dataset) return [];
    return item?.data?.columns ?? [];
  }, [item?.data?.dataset, item?.data?.columns, selectedDataset]);

  const handleOpenView = () => {
    if (!selectedDataset) return;

    if (skipColumnSelection && sampledDataset) {
      const dataTypes = sampledDataset?.dataTypes ?? {};
      const columns =
        sampledDataset?.stats?.map((stat) => ({
          name: stat.name,
          type: getColumnType(dataTypes[stat.name]),
        })) ?? [];

      setPreviewColumns(columns);
      setStep("preview");
      return;
    }
    setStep("view");
  };

  const handlePreviewTable = (columns: DatasetColumn[]) => {
    setPreviewColumns(columns);
    setStep("preview");
  };

  const handleUseDataset = () => {
    if (!item || !selectedDataset || !previewColumns.length) return;
    handleSelectDataset?.(selectedDataset, previewColumns);
    onClose();
  };

  return (
    <Modal disableScrollLock open={open} onClose={onClose}>
      <Box
        id="table-controller"
        sx={{
          position: "absolute",
          top: "48px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 96px)",
          maxWidth: "1344px",
          maxHeight: "calc(100vh - 107px - 48px)",
          background: "#ffffff",
          border: "0.5px solid #98A1AA",
          borderRadius: "4px",
          boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          "@media (max-width: 900px)": {
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 32px)",
            maxHeight: "calc(100vh - 32px)",
          },
          "@media (max-width: 767px)": {
            top: 0,
            left: 0,
            width: "100%",
            height: "100dvh",
            maxHeight: "100dvh",
            borderRadius: 0,
            transform: "none",
          },
        }}
      >
        <Box
          sx={{
            p: "20px",
            display: "flex",
            alignItems: "center",
            borderBottom: "0.5px solid #cfd4da",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <Box sx={{ gap: "8px", display: "flex", alignItems: "center" }}>
            <Box sx={{ ...vectorIconSx, width: 39, height: 39 }}>
              <DatabaseIcon />
            </Box>
            <Box>
              <Typography fontSize="20px" fontWeight={700} lineHeight="normal">
                Connect a Dataset
              </Typography>
              <Typography fontSize="16px" lineHeight="normal">
                Search, preview, connect and filter a dataset.
              </Typography>
            </Box>
          </Box>
          <IconButton
            aria-label="Close asset library"
            onClick={onClose}
            sx={{
              width: 34,
              height: 34,
              borderRadius: "4px",
              border: "0.5px solid #cfd4da",
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
        {step === "select" ? (
          <React.Fragment>
            <Box
              sx={{
                gap: "16px",
                p: "8px 16px",
                display: "flex",
                bgcolor: "#f8f9fa",
                alignItems: "stretch",
                borderBottom: "0.5px solid #cfd4da",
              }}
            >
              <TextField
                fullWidth
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
                  ".MuiInputBase-root": {
                    height: "34px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    bgcolor: "#ffffff",
                  },

                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "0.5px solid #98A1AA",
                  },
                }}
              />
              <Select
                size="small"
                value={selectedSort}
                onChange={(event) =>
                  setSelectedSort(event.target.value as DatasetSort)
                }
                sx={{
                  height: "34px",
                  minWidth: "103px",
                  bgcolor: "#ffffff",
                  flexShrink: 0,
                }}
                IconComponent={KeyboardArrowDownIcon}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <Select
                size="small"
                value={selectedType}
                onChange={(event) =>
                  setSelectedType(event.target.value as DatasetTypeFilter)
                }
                sx={{
                  height: "34px",
                  minWidth: "90px",
                  bgcolor: "#ffffff",
                  flexShrink: 0,
                }}
                IconComponent={KeyboardArrowDownIcon}
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <DatasetSelect
              selectedDataset={selectedDataset}
              setSelectedDataset={setSelectedDataset}
              filteredDatasets={filteredDatasets}
            />

            <Box
              sx={{
                gap: "16px",
                p: "16px",
                display: "flex",
                bgcolor: "#f8f9fa",
                alignItems: "center",
                justifyContent: "flex-end",
                borderTop: "0.5px solid #cfd4da",
              }}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{ textTransform: "none", fontSize: "16px" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={!selectedDataset}
                endIcon={<ArrowForward />}
                onClick={handleOpenView}
                sx={{
                  color: "#ffffff",
                  fontSize: "16px",
                  borderRadius: "4px",
                  textTransform: "none",
                  bgcolor: !selectedDataset ? "#dfe3e5" : "#3154f4",
                  "&:hover": {
                    bgcolor: !selectedDataset ? "#dfe3e5" : "#2542c7",
                  },
                }}
              >
                {selectedDataset
                  ? "View, Filter and Sort"
                  : "Configure Dataset"}
              </Button>
            </Box>
          </React.Fragment>
        ) : step === "view" ? (
          <DndProvider backend={HTML5Backend}>
            <DatasetSelectModalDataView
              selectedDataset={selectedDataset}
              initialSelectedColumns={initialSelectedColumns.map(
                (col) => col.id,
              )}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
              onBack={() => setStep("select")}
              onCancel={onClose}
              onPreviewTable={handlePreviewTable}
              sampledDataset={sampledDataset}
              sampledDatasetLoading={sampledDatasetQuery.isFetching}
            />{" "}
          </DndProvider>
        ) : (
          <DataPreview
            selectedDataset={selectedDataset}
            selectedColumns={previewColumns}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            onBack={() => setStep("view")}
            onBackToDatasets={() => setStep("select")}
            onCancel={onClose}
            onUseDataset={handleUseDataset}
          />
        )}
      </Box>
    </Modal>
  );
};
