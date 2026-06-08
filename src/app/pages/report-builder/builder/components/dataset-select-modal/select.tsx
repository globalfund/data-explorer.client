import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import TouchAppOutlined from "@mui/icons-material/TouchAppOutlined";
import TextFieldsOutlined from "@mui/icons-material/TextFieldsOutlined";
import DatabaseIcon from "app/assets/vectors/DatasetSelectDatabase.svg?react";
import UploadIcon from "app/assets/vectors/Upload.svg?react";
import CheckCircleIcon from "app/assets/vectors/CheckCircle.svg?react";
import BuildingIcon from "app/assets/vectors/Building.svg?react";
import GlobeIcon from "app/assets/vectors/Globe.svg?react";
import GridIcon from "app/assets/vectors/Grid.svg?react";
import ListIcon from "app/assets/vectors/List.svg?react";

import { datasetItems } from "app/pages/report-builder/builder/components/chart/data";
import { useStoreState } from "app/state/store/hooks";
import { useGFSampleDataset } from "app/hooks/queries/report-builder";
import { MappingTypeIcons } from "../panel/elements-controller/chart/mapping/data";
import {
  formatNumber,
  getColumnType,
  getDatasetLatestUpdateKey,
} from "./utils";

const datasetSourceOptions = [
  {
    id: "global-fund",
    label: "Global Fund",
    count: 24,
    icon: BuildingIcon,
  },
  { id: "who", label: "WHO", count: 112, icon: BuildingIcon },
  { id: "kaggle", label: "Kaggle", count: 2360, icon: GlobeIcon },
];

export const DatasetSelect: React.FC<{
  filteredDatasets: {
    id: string;
    name: string;
    description: string;
  }[];
  selectedDataset: string;
  setSelectedDataset: React.Dispatch<React.SetStateAction<string>>;
}> = ({ filteredDatasets, selectedDataset, setSelectedDataset }) => {
  const sampledDatasetQuery = useGFSampleDataset(selectedDataset);
  const sampledDataset = sampledDatasetQuery?.data?.data?.data?.result;
  const datasetsLatestUpdate = useStoreState(
    (state) =>
      get(state.datasetsLatestUpdate, "data.data", []) as {
        name: string;
        date: string;
      }[],
  );

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

  const selectedDatasetItem = datasetItems.find(
    (dataset) => dataset.id === selectedDataset,
  );

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
              {datasetSourceOptions.map((source) => {
                const SourceIcon = source.icon;
                const active = source.id === "global-fund";
                return (
                  <Button
                    key={source.id}
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
                    {source.label} ({source.count})
                  </Button>
                );
              })}
            </Box>
          </Box>
          <Box sx={{ p: "20px" }}>
            <Button
              fullWidth
              startIcon={<UploadIcon />}
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
              Upload a File
            </Button>
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
                {filteredDatasets.length}
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
            {filteredDatasets.map((dataset) => {
              const active = dataset.id === selectedDataset;
              return (
                <Box
                  key={dataset.id}
                  component="button"
                  type="button"
                  onClick={() => setSelectedDataset(dataset.id)}
                  sx={{
                    m: 0,
                    gap: "12px",
                    height: "160px",
                    p: "16px",
                    display: "flex",
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: "4px",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    bgcolor: active ? "#f8f9ff" : "#ffffff",
                    border: active
                      ? "0.5px solid #3154f4"
                      : "0.5px solid #98A1AA",
                    boxShadow: active
                      ? "0 0 10px 0 rgba(152, 161, 170, 0.60)"
                      : "none",
                    font: "inherit",
                  }}
                >
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        fontSize="14px"
                        fontWeight={700}
                        color="#000"
                        lineHeight="normal"
                        sx={{
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                        }}
                      >
                        {dataset.name}
                      </Typography>
                      <Typography
                        fontSize="14px"
                        color="#373d43"
                        lineHeight="normal"
                        sx={{
                          mt: "4px",
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                        }}
                      >
                        {dataset.description}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {active ? (
                        <CheckCircleIcon />
                      ) : (
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            color: "#ADB5BD",
                            border: "1.25px solid #ADB5BD",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: "8px" }}>
                      <DatabaseIcon width={16} height={16} />
                      <Typography
                        fontSize="14px"
                        color="#373d43"
                        lineHeight="normal"
                      >
                        12,480 rows • 8 cols
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <AccessTimeOutlined
                        sx={{ width: 16, height: 16, color: "#98a1aa" }}
                      />
                      <Typography
                        fontSize="14px"
                        color="#373d43"
                        lineHeight="normal"
                      >
                        Updated on {getDatasetLatestUpdate(dataset.id)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
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
          {selectedDatasetItem ? (
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {" "}
                  <Typography fontSize="14px" color="#373d43">
                    Number of Rows
                  </Typography>
                  <Typography fontSize="14px" fontWeight={700}>
                    {previewRowCount}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {" "}
                  <Typography fontSize="14px" color="#373d43">
                    Number of Columns
                  </Typography>
                  <Typography fontSize="14px" fontWeight={700}>
                    {previewColumnCount}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography fontSize="14px" color="#373d43">
                    Number of Cells
                  </Typography>
                  <Typography fontSize="14px" fontWeight={700}>
                    {cellCount}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {" "}
                  <Typography fontSize="14px" color="#373d43">
                    Last Updated
                  </Typography>
                  <Typography fontSize="14px" fontWeight={700}>
                    {getDatasetLatestUpdate(selectedDatasetItem.id)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography fontSize="14px" color="#373d43">
                    Source
                  </Typography>
                  <Typography
                    fontSize="14px"
                    fontWeight={700}
                    color="#3154f4"
                    component="a"
                    href={
                      "https://data.theglobalfund.org/datasets/" +
                      selectedDatasetItem.id
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    data.theglobalfund.org/downloads
                  </Typography>
                </Box>
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
                Select a dataset to preview its columns, row count, and
                metadata.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </React.Fragment>
  );
};
