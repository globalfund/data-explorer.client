import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import TouchAppOutlined from "@mui/icons-material/TouchAppOutlined";
import TextFieldsOutlined from "@mui/icons-material/TextFieldsOutlined";
import UploadIcon from "app/assets/vectors/Upload.svg?react";
import BuildingIcon from "app/assets/vectors/Building.svg?react";
import GlobeIcon from "app/assets/vectors/Globe.svg?react";
import GridIcon from "app/assets/vectors/Grid.svg?react";
import ListIcon from "app/assets/vectors/List.svg?react";

import { useGFSampleDataset } from "app/hooks/queries/report-builder";
import { RBExternalDatasetModel } from "app/state/api/action-reducers/report-builder/sync";
import { DatasetItem } from "app/pages/report-builder/hooks/useDatasetItems";
import { MappingTypeIcons } from "../panel/elements-controller/chart/mapping/data";
import {
  DatasetSourceId,
  externalSources,
  formatDatasetDate,
  formatNumber,
  getColumnType,
  getExternalDatasetKey,
  uploadFileExtensions,
} from "./utils";
import DatasetCard from "./dataset-card";
import ExternalDatasetCard from "./external-dataset-card";

const datasetSourceOptions: {
  id: DatasetSourceId;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "global-fund", label: "Global Fund", icon: BuildingIcon },
  { id: "who", label: "WHO", icon: BuildingIcon },
  { id: "kaggle", label: "Kaggle", icon: GlobeIcon },
  { id: "my-datasets", label: "My Datasets", icon: FolderOutlined },
];

const scrollbarSx = {
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#000",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#D9D9D9",
  },
};

const PreviewRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <Box
    sx={{
      gap: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Typography fontSize="14px" color="#373d43" flexShrink={0}>
      {label}
    </Typography>
    <Typography fontSize="14px" fontWeight={700} textAlign="right" noWrap>
      {children}
    </Typography>
  </Box>
);

const PreviewLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <Box
    component="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{ color: "#3154f4" }}
  >
    {children}
  </Box>
);

const GridMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      gap: "12px",
      p: "32px 16px",
      display: "flex",
      gridColumn: "1 / -1",
      alignItems: "center",
      flexDirection: "column",
      color: "#373d43",
      textAlign: "center",
    }}
  >
    {children}
  </Box>
);

export const DatasetSelect: React.FC<{
  source: DatasetSourceId;
  onSourceChange: (source: DatasetSourceId) => void;
  sourceCounts: Partial<Record<DatasetSourceId, number>>;
  filteredDatasets: DatasetItem[];
  datasetsLoading: boolean;
  selectedDataset: string;
  setSelectedDataset: (id: string) => void;
  selectedDatasetItem?: DatasetItem;
  getDatasetLatestUpdate: (id: string) => string;
  external: {
    items: RBExternalDatasetModel[];
    loading: boolean;
    error: string;
    hasMore: boolean;
    loadingMore: boolean;
    onLoadMore: () => void;
    selected: RBExternalDatasetModel | null;
    onSelect: (dataset: RBExternalDatasetModel) => void;
    connectedKeys: Set<string>;
  };
  upload: {
    onUpload: (file: File) => void;
    uploading: boolean;
    error: string;
  };
}> = ({
  source,
  onSourceChange,
  sourceCounts,
  filteredDatasets,
  datasetsLoading,
  selectedDataset,
  setSelectedDataset,
  selectedDatasetItem,
  getDatasetLatestUpdate,
  external,
  upload,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isExternalSource = !!externalSources[source];
  const sampledDatasetQuery = useGFSampleDataset(selectedDataset);
  const sampledDataset = sampledDatasetQuery?.data?.data?.data?.result;
  const selectedUserDataset = selectedDatasetItem?.userDataset;

  const columns = React.useMemo(() => {
    const dataTypes = sampledDataset?.dataTypes ?? {};
    const statColumns =
      sampledDataset?.stats?.map((stat) => ({
        name: stat.name,
        type: getColumnType(dataTypes[stat.name]),
      })) ?? [];
    return statColumns;
  }, [sampledDataset?.dataTypes, sampledDataset?.stats]);

  const previewRowCount = sampledDatasetQuery.isFetching
    ? "Loading..."
    : formatNumber(sampledDataset?.count);
  const previewColumnCount = sampledDatasetQuery.isFetching
    ? "Loading..."
    : columns.length || "-";

  const cellCount = sampledDatasetQuery.isFetching
    ? "Loading..."
    : formatNumber((sampledDataset?.count || 0) * columns.length);

  return (
    <React.Fragment>
      {" "}
      <Box
        sx={{
          minHeight: 0,
          flex: 1,
          display: "grid",
          gridTemplateColumns: "238px minmax(420px, 1fr) 343px",
          overflow: "hidden",
          "@media (max-width: 1100px)": {
            gridTemplateColumns: "210px minmax(0, 1fr)",
            "#dataset-preview": {
              display: "none",
            },
          },
          "@media (max-width: 767px)": {
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            bgcolor: "#f8f9fa",
            borderRight: "0.5px solid #cfd4da",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            "@media (max-width: 767px)": {
              borderRight: 0,
              borderBottom: "0.5px solid #cfd4da",
              flexShrink: 0,
            },
          }}
        >
          <Box
            sx={{
              p: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              borderBottom: "0.5px solid #cfd4da",
            }}
          >
            <Typography fontSize="16px" fontWeight={700} color="#000">
              Sources
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {datasetSourceOptions.map((option) => {
                const SourceIcon = option.icon;
                const active = option.id === source;
                const count = sourceCounts[option.id];
                return (
                  <Button
                    key={option.id}
                    aria-pressed={active}
                    data-cy={`rb-dataset-source-${option.id}`}
                    onClick={() => onSourceChange(option.id)}
                    startIcon={<SourceIcon />}
                    sx={{
                      gap: "8px",
                      width: "100%",
                      padding: "12px 14px",
                      color: active ? "#3154f4" : "#000000",
                      bgcolor: active ? "#eff1fe" : "transparent",
                      border: active
                        ? "0.5px solid #3154f4"
                        : "0.5px solid transparent",
                      borderRadius: "4px",
                      justifyContent: "flex-start",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 400,
                      ".MuiButton-startIcon": {
                        marginLeft: 0,
                        marginRight: 0,
                      },
                    }}
                  >
                    {option.label}
                    {typeof count === "number"
                      ? ` (${count.toLocaleString("en-US")})`
                      : ""}
                  </Button>
                );
              })}
            </Box>
          </Box>
          <Box sx={{ p: "20px" }}>
            <input
              hidden
              type="file"
              ref={fileInputRef}
              data-cy="rb-dataset-upload-input"
              accept={uploadFileExtensions.join(",")}
              onChange={(event) => {
                const file = event.target.files?.[0];
                // Reset, so the same file can be selected again after an error.
                event.target.value = "";
                if (file) upload.onUpload(file);
              }}
            />
            <Button
              fullWidth
              disabled={upload.uploading}
              data-cy="rb-dataset-upload"
              onClick={() => fileInputRef.current?.click()}
              startIcon={
                upload.uploading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <UploadIcon />
                )
              }
              sx={{
                padding: "12px 14px",
                color: "#000",
                bgcolor: "#fff",
                border: "0.5px solid #98a1aa",
                borderRadius: "4px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              {upload.uploading ? "Uploading..." : "Upload a File"}
            </Button>
            <Typography
              role={upload.error ? "alert" : undefined}
              fontSize="12px"
              mt="8px"
              color={upload.error ? "#d32f2f" : "#373d43"}
            >
              {upload.error ||
                `Supported files: ${uploadFileExtensions.join(", ")}`}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderRight: "0.5px solid #e0e0e0",
            "@media (max-width: 1100px)": {
              borderRight: 0,
            },
          }}
        >
          <Box
            sx={{
              px: "16px",
              py: "8px",
              minHeight: "51px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "0.5px solid #cfd4da",
              flexShrink: 0,
            }}
          >
            <Typography color="#000" fontSize="16px">
              <Box component="span" fontWeight={700}>
                {isExternalSource
                  ? external.items.length
                  : filteredDatasets.length}
                {isExternalSource && external.hasMore ? "+" : ""}
              </Box>{" "}
              Datasets
            </Typography>
            <Box sx={{ display: "flex", gap: "8px" }}>
              <IconButton
                aria-label="Grid view"
                sx={{
                  width: 35,
                  height: 35,
                  borderRadius: "4px",
                  bgcolor: "#eff1fe",
                  border: "0.5px solid #3154f4",
                  color: "#3154f4",
                }}
              >
                <GridIcon />
              </IconButton>
              <IconButton
                aria-label="List view"
                sx={{
                  width: 35,
                  height: 35,
                  borderRadius: "4px",
                  border: "0.5px solid #98a1aa",
                }}
              >
                <ListIcon />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              minHeight: 0,
              flex: 1,
              p: "16px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "8px",
              overflowY: "auto",
              alignContent: "start",
              ...scrollbarSx,
            }}
          >
            {isExternalSource ? (
              <React.Fragment>
                {external.items.map((dataset) => {
                  const key = getExternalDatasetKey(dataset);
                  return (
                    <ExternalDatasetCard
                      key={key}
                      dataset={dataset}
                      onSelect={external.onSelect}
                      connected={external.connectedKeys.has(key)}
                      active={
                        !!external.selected &&
                        getExternalDatasetKey(external.selected) === key
                      }
                    />
                  );
                })}
                {external.loading ? (
                  <GridMessage>
                    <CircularProgress size={24} />
                    <Typography fontSize="14px">
                      Searching datasets...
                    </Typography>
                  </GridMessage>
                ) : external.error ? (
                  <GridMessage>
                    <Typography role="alert" fontSize="14px" color="#d32f2f">
                      {external.error}
                    </Typography>
                  </GridMessage>
                ) : external.items.length === 0 ? (
                  <GridMessage>
                    <Typography fontSize="14px">
                      No datasets found. Try a different search term.
                    </Typography>
                  </GridMessage>
                ) : external.hasMore ? (
                  <GridMessage>
                    <Button
                      variant="outlined"
                      disabled={external.loadingMore}
                      onClick={external.onLoadMore}
                      sx={{ textTransform: "none", fontSize: "14px" }}
                    >
                      {external.loadingMore ? "Loading..." : "Load more"}
                    </Button>
                  </GridMessage>
                ) : null}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {filteredDatasets.map((dataset) => {
                  const active = dataset.id === selectedDataset;
                  return (
                    <DatasetCard
                      key={dataset.id}
                      dataset={dataset}
                      active={active}
                      setSelectedDataset={setSelectedDataset}
                      getDatasetLatestUpdate={getDatasetLatestUpdate}
                    />
                  );
                })}
                {filteredDatasets.length === 0 && (
                  <GridMessage>
                    {datasetsLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Typography fontSize="14px">
                        {source === "my-datasets"
                          ? "No datasets yet. Upload a file, or connect a dataset from WHO or Kaggle."
                          : "No datasets found. Try a different search term."}
                      </Typography>
                    )}
                  </GridMessage>
                )}
              </React.Fragment>
            )}
          </Box>
        </Box>

        <Box
          id="dataset-preview"
          sx={{
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#ffffff",
          }}
        >
          {isExternalSource && external.selected ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ p: "16px", borderBottom: "0.5px solid #cfd4da" }}>
                <Typography fontSize="16px" fontWeight={700} color="#000">
                  {external.selected.title}
                </Typography>
                {external.selected.summary && (
                  <Typography fontSize="16px" color="#373d43" mt="8px">
                    {external.selected.summary}
                  </Typography>
                )}
              </Box>
              <Box sx={{ p: "16px", borderBottom: "0.5px solid #cfd4da" }}>
                {external.selected.file && (
                  <PreviewRow label="Data File">
                    {external.selected.file}
                  </PreviewRow>
                )}
                {external.selected.category && (
                  <PreviewRow label="Category">
                    {external.selected.category}
                  </PreviewRow>
                )}
                {formatDatasetDate(external.selected.datePublished) && (
                  <PreviewRow label="Published">
                    {formatDatasetDate(external.selected.datePublished)}
                  </PreviewRow>
                )}
                <PreviewRow label="Source">
                  <PreviewLink href={external.selected.url}>
                    {external.selected.source}
                  </PreviewLink>
                </PreviewRow>
              </Box>
              <Box sx={{ p: "16px" }}>
                <Typography fontSize="14px" color="#373d43">
                  {external.connectedKeys.has(
                    getExternalDatasetKey(external.selected),
                  )
                    ? "This dataset is already connected, you can find it under My Datasets."
                    : "Connect this dataset to preview its columns and rows. Connected datasets are saved under My Datasets."}
                </Typography>
              </Box>
            </Box>
          ) : !isExternalSource && selectedDatasetItem ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ p: "16px", borderBottom: "0.5px solid #cfd4da" }}>
                <Typography fontSize="16px" fontWeight={700} color="#000">
                  {selectedDatasetItem.name}
                </Typography>
                <Typography fontSize="16px" color="#373d43" mt="8px">
                  {selectedDatasetItem.description}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: "16px",
                  borderBottom: "0.5px solid #cfd4da",
                }}
              >
                <PreviewRow label="Number of Rows">
                  {previewRowCount}
                </PreviewRow>
                <PreviewRow label="Number of Columns">
                  {previewColumnCount}
                </PreviewRow>
                <PreviewRow label="Number of Cells">{cellCount}</PreviewRow>
                <PreviewRow label="Last Updated">
                  {getDatasetLatestUpdate(selectedDatasetItem.id)}
                </PreviewRow>
                <PreviewRow label="Source">
                  {!selectedUserDataset ? (
                    <PreviewLink
                      href={
                        "https://data.theglobalfund.org/datasets/" +
                        selectedDatasetItem.id
                      }
                    >
                      data.theglobalfund.org/downloads
                    </PreviewLink>
                  ) : selectedUserDataset.sourceUrl ? (
                    <PreviewLink href={selectedUserDataset.sourceUrl}>
                      {selectedUserDataset.source}
                    </PreviewLink>
                  ) : (
                    selectedUserDataset.fileName || "Uploaded file"
                  )}
                </PreviewRow>
              </Box>
              <Box sx={{ p: "16px" }}>
                <Typography fontSize="16px" fontWeight={700} mb="12px">
                  Columns
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {columns.map((column) => {
                    const isNumber = column.type === "number";
                    const isDate =
                      column.type === "date" || column.type === "date-time";
                    const columnIcon = MappingTypeIcons[
                      column.type as keyof typeof MappingTypeIcons
                    ] || <TextFieldsOutlined />;
                    return (
                      <Box
                        key={`${column.name}-${column.type}`}
                        sx={{
                          gap: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography fontSize="14px" color="#373d43">
                          {column.name}
                        </Typography>
                        <Box
                          sx={{
                            gap: "4px",
                            display: "flex",
                            alignItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          {columnIcon}
                          <Box
                            sx={{
                              px: "8px",
                              py: "4px",
                              borderRadius: "14px",
                              bgcolor: isNumber ? "#a7f0ba" : "#d6ddfd",
                            }}
                          >
                            <Typography
                              fontSize="14px"
                              color="#000"
                              whiteSpace="nowrap"
                            >
                              {isNumber
                                ? "Numeric Value"
                                : isDate
                                  ? "Date"
                                  : "Text"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                p: "32px 25px",
                gap: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "#adb5bd",
                textAlign: "center",
              }}
            >
              <TouchAppOutlined sx={{ width: 30, height: 30 }} />
              <Typography fontSize="16px" color="#adb5bd">
                {isExternalSource
                  ? "Select a dataset to see its details and connect it."
                  : "Select a dataset to preview its columns, row count, and metadata."}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </React.Fragment>
  );
};
