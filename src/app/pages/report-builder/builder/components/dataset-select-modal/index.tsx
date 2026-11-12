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
  DatasetSourceId,
  externalSources,
  formatDatasetDate,
  getApiErrorMessage,
  getColumnType,
  getDatasetLatestUpdateKey,
  getExternalDatasetKey,
  uploadFileExtensions,
} from "./utils";
import {
  useConnectExternalDataset,
  useExternalSourceCounts,
  useExternalSourceSearch,
  useGFSampleDataset,
  useUploadDataset,
} from "app/hooks/queries/report-builder";
import useDatasetItems from "app/pages/report-builder/hooks/useDatasetItems";
import { RBExternalDatasetModel } from "app/state/api/action-reducers/report-builder/sync";

const SEARCH_DEBOUNCE_MS = 400;

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
  handleSelectDataset?: (params: {
    selectedDataset: string;
    filters: Record<string, any[]>;
    previewColumns: {
      name: string;
      id: string;
      type: string;
    }[];
    sorting: { column: string; order: "asc" | "desc" }[];
  }) => void;
}> = ({ open, onClose, skipColumnSelection, handleSelectDataset }) => {
  const [step, setStep] = React.useState<DatasetModalStep>("select");
  const [search, setSearch] = React.useState("");
  const [selectedSort, setSelectedSort] =
    React.useState<DatasetSort>("updatedDate DESC");
  const [selectedType, setSelectedType] =
    React.useState<DatasetTypeFilter>("all");
  const [selectedDataset, setSelectedDataset] = React.useState<string>("");
  const [source, setSource] = React.useState<DatasetSourceId>("global-fund");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedExternal, setSelectedExternal] =
    React.useState<RBExternalDatasetModel | null>(null);
  const [rowsPerPage, setRowsPerPage] =
    React.useState<DatasetRowsPerPage>("10");
  const [previewColumns, setPreviewColumns] = React.useState<DatasetColumn[]>(
    [],
  );
  const [previewFilters, setPreviewFilters] = React.useState<
    Record<string, any[]>
  >({});
  const [previewSorting, setPreviewSorting] = React.useState<
    { column: string; order: "asc" | "desc" }[]
  >([]);
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem: item } = useGetReportItemState<
    "table" | "chart" | "kpi_box"
  >({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const sampledDatasetQuery = useGFSampleDataset(selectedDataset);
  const sampledDataset = sampledDatasetQuery?.data?.data?.data?.result;

  const { getDatasetItem, userDatasetItems, userDatasetsLoading } =
    useDatasetItems();
  const externalSource = externalSources[source] ?? null;
  const externalCountsQuery = useExternalSourceCounts(open);
  const externalSearchQuery = useExternalSourceSearch({
    source: open ? externalSource : null,
    search: debouncedSearch,
    sortBy: selectedSort === "name ASC" ? "name" : undefined,
  });
  const connectExternalDataset = useConnectExternalDataset();
  const uploadDataset = useUploadDataset();
  const [uploadError, setUploadError] = React.useState("");

  const externalItems = React.useMemo(
    () => externalSearchQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [externalSearchQuery.data],
  );
  const connectedKeys = React.useMemo(
    () =>
      new Set(
        userDatasetItems
          .filter((dataset) => dataset.userDataset?.sourceUrl)
          .map((dataset) => getExternalDatasetKey(dataset.userDataset!)),
      ),
    [userDatasetItems],
  );

  React.useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [search]);

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
      setSelectedExternal(null);
      setUploadError("");
      connectExternalDataset.reset();
      // Datasets are stored by id: an id without the Global Fund prefix is one
      // the user uploaded or connected.
      const dataset = item?.data?.dataset;
      setSource(
        dataset && !dataset.startsWith("gf_") ? "my-datasets" : "global-fund",
      );
    }
  }, [item?.data?.dataset, open]);

  React.useEffect(() => {
    if (selectedController?.extra?.table?.datasetModalStep) {
      setStep(selectedController.extra.table.datasetModalStep);
    } else if (selectedController?.extra?.chart?.datasetModalStep) {
      setStep(selectedController.extra.chart.datasetModalStep);
    } else if (selectedController?.extra?.kpi_box?.datasetModalStep) {
      setStep(selectedController.extra.kpi_box.datasetModalStep);
    } else {
      setStep("select");
    }
  }, [
    selectedController?.extra?.table?.datasetModalStep,
    selectedController?.extra?.chart?.datasetModalStep,
    selectedController?.extra?.kpi_box?.datasetModalStep,
  ]);

  const getDatasetLatestUpdate = React.useCallback(
    (id: string) => {
      const userDataset = getDatasetItem(id)?.userDataset;
      if (userDataset) {
        return formatDatasetDate(
          userDataset.updatedDate ?? userDataset.createdDate,
        );
      }
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
    [datasetsLatestUpdate, getDatasetItem],
  );

  const filteredDatasets = React.useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    if (source === "my-datasets") {
      return userDatasetItems
        .filter((dataset) =>
          [dataset.name, dataset.description]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm),
        )
        .sort((a, b) => {
          if (selectedSort === "name ASC") return a.name.localeCompare(b.name);
          if (selectedSort === "name DESC") return b.name.localeCompare(a.name);
          // The API returns them newest first.
          return 0;
        });
    }
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
  }, [
    getDatasetLatestUpdate,
    search,
    selectedSort,
    selectedType,
    source,
    userDatasetItems,
  ]);

  const handleSourceChange = (newSource: DatasetSourceId) => {
    setSource(newSource);
    setSelectedExternal(null);
    connectExternalDataset.reset();
  };

  // Shows a dataset that was just uploaded or connected, selected and ready
  // to be configured.
  const showUserDataset = (id: string) => {
    setSearch("");
    setSelectedExternal(null);
    setSource("my-datasets");
    setSelectedDataset(id);
  };

  const handleUpload = (file: File) => {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!uploadFileExtensions.includes(extension)) {
      setUploadError(
        `Unsupported file type, please upload one of: ${uploadFileExtensions.join(", ")}`,
      );
      return;
    }
    setUploadError("");
    uploadDataset.mutate(file, {
      onSuccess: (response) => showUserDataset(response.data.id),
      onError: (error) =>
        setUploadError(
          getApiErrorMessage(error, "Unable to upload the file, try again."),
        ),
    });
  };

  const handleConnectExternal = () => {
    if (!selectedExternal) return;
    connectExternalDataset.mutate(selectedExternal, {
      onSuccess: (response) => showUserDataset(response.data.id),
    });
  };

  const initialSelectedColumns = React.useMemo(() => {
    if (item?.type !== "table") {
      return [];
    }
    if (selectedDataset !== item?.data?.dataset) return [];
    return item?.data?.columns ?? [];
  }, [
    item?.data?.dataset,
    (item?.data as { columns?: any[] })?.columns,
    selectedDataset,
  ]);

  React.useEffect(() => {
    if (sampledDataset) {
      const dataTypes = sampledDataset?.dataTypes ?? {};
      const columns =
        sampledDataset?.stats?.map((stat) => ({
          name: stat.name,
          id: stat.name,
          type: getColumnType(dataTypes[stat.name]),
        })) ?? [];

      if (skipColumnSelection) {
        setPreviewColumns(columns);
      } else {
        setPreviewColumns(
          initialSelectedColumns.length
            ? initialSelectedColumns.map((col) => ({
                name: col.name,
                id: col.id,
                type: getColumnType(dataTypes[col.name]),
              }))
            : [],
        );
      }
    }
  }, [initialSelectedColumns, sampledDataset, skipColumnSelection]);

  React.useEffect(() => {
    if (item?.type === "table") {
      setPreviewFilters(item?.data?.filters || {});
      setPreviewSorting(item?.data?.sorting || []);
    }
    if (item?.type === "chart") {
      setPreviewFilters(item?.data?.appliedFilters || {});
    }
    if (item?.type === "kpi_box") {
      setPreviewFilters(item?.data?.appliedFilters || {});
    }
  }, [
    (item?.data as any)?.appliedFilters,
    (item?.data as any)?.filters,
    (item?.data as any)?.sorting,
    sampledDataset,
  ]);

  const handleOpenView = () => {
    if (!selectedDataset) return;

    if (skipColumnSelection && sampledDataset) {
      setStep("preview");
      return;
    }
    setStep("view");
  };

  const handlePreviewTable = () => {
    setStep("preview");
  };

  const handleUseDataset = () => {
    if (!item || !selectedDataset || !previewColumns.length) return;
    handleSelectDataset?.({
      selectedDataset,
      filters: previewFilters,
      previewColumns,
      sorting: previewSorting,
    });
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
              {source === "global-fund" && (
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
              )}
            </Box>

            <DatasetSelect
              source={source}
              onSourceChange={handleSourceChange}
              sourceCounts={{
                "global-fund": datasetItems.length,
                who: externalCountsQuery.data?.data?.WHO,
                kaggle: externalCountsQuery.data?.data?.Kaggle,
                "my-datasets": userDatasetItems.length,
              }}
              selectedDataset={selectedDataset}
              setSelectedDataset={setSelectedDataset}
              selectedDatasetItem={getDatasetItem(selectedDataset)}
              getDatasetLatestUpdate={getDatasetLatestUpdate}
              filteredDatasets={filteredDatasets}
              datasetsLoading={source === "my-datasets" && userDatasetsLoading}
              external={{
                items: externalItems,
                loading: externalSearchQuery.isLoading,
                error: externalSearchQuery.isError
                  ? getApiErrorMessage(
                      externalSearchQuery.error,
                      "Unable to search this source, try again later.",
                    )
                  : "",
                hasMore: !!externalSearchQuery.hasNextPage,
                loadingMore: externalSearchQuery.isFetchingNextPage,
                onLoadMore: () => externalSearchQuery.fetchNextPage(),
                selected: selectedExternal,
                onSelect: (dataset) => {
                  connectExternalDataset.reset();
                  setSelectedExternal(dataset);
                },
                connectedKeys,
              }}
              upload={{
                onUpload: handleUpload,
                uploading: uploadDataset.isPending,
                error: uploadError,
              }}
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
              {externalSource && connectExternalDataset.isError && (
                <Typography
                  role="alert"
                  fontSize="14px"
                  color="#d32f2f"
                  sx={{ mr: "auto" }}
                >
                  {getApiErrorMessage(
                    connectExternalDataset.error,
                    "Unable to connect the dataset, try again.",
                  )}
                </Typography>
              )}
              {externalSource && connectExternalDataset.isPending && (
                <Typography fontSize="14px" color="#373d43" sx={{ mr: "auto" }}>
                  Downloading and processing the dataset, this can take a
                  minute...
                </Typography>
              )}
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{ textTransform: "none", fontSize: "16px" }}
              >
                Cancel
              </Button>
              {externalSource ? (
                <Button
                  variant="contained"
                  data-cy="rb-dataset-connect"
                  disabled={
                    !selectedExternal || connectExternalDataset.isPending
                  }
                  onClick={handleConnectExternal}
                  sx={{
                    color: "#ffffff",
                    fontSize: "16px",
                    borderRadius: "4px",
                    textTransform: "none",
                    bgcolor: "#3154f4",
                    "&:hover": { bgcolor: "#2542c7" },
                    "&.Mui-disabled": { color: "#ffffff", bgcolor: "#dfe3e5" },
                  }}
                >
                  {connectExternalDataset.isPending
                    ? "Connecting..."
                    : "Connect Dataset"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  data-cy="rb-dataset-next"
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
              )}
            </Box>
          </React.Fragment>
        ) : step === "view" ? (
          <DatasetSelectModalDataView
            selectedDataset={selectedDataset}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            onBack={() => setStep("select")}
            onCancel={onClose}
            onPreviewTable={handlePreviewTable}
            sampledDataset={sampledDataset}
            sampledDatasetLoading={sampledDatasetQuery.isFetching}
            setPreviewColumns={setPreviewColumns}
            previewColumns={previewColumns}
          />
        ) : (
          <DataPreview
            selectedDataset={selectedDataset}
            setPreviewColumns={setPreviewColumns}
            previewColumns={previewColumns}
            filters={previewFilters}
            setFilters={setPreviewFilters}
            sorting={previewSorting}
            setSorting={setPreviewSorting}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            onBack={() => {
              if (skipColumnSelection) {
                setStep("select");
              } else {
                setStep("view");
              }
            }}
            onBackToDatasets={() => setStep("select")}
            onCancel={onClose}
            onUseDataset={handleUseDataset}
          />
        )}
      </Box>
    </Modal>
  );
};
