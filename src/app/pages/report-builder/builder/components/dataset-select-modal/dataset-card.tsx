import React from "react";
import { Box, Typography } from "@mui/material";
import DatabaseIcon from "app/assets/vectors/DatasetSelectDatabase.svg?react";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleIcon from "app/assets/vectors/CheckCircle.svg?react";
import { useGFSampleDataset } from "app/hooks/queries/report-builder";

interface DatasetCardProps {
  dataset: {
    id: string;
    name: string;
    description: string;
  };
  active: boolean;
  setSelectedDataset: (id: string) => void;
  getDatasetLatestUpdate: (id: string) => string;
}

const DatasetCard = ({
  dataset,
  active,
  setSelectedDataset,
  getDatasetLatestUpdate,
}: DatasetCardProps) => {
  const sampledDatasetQuery = useGFSampleDataset(dataset.id);
  const sampledDatasetResult = sampledDatasetQuery.data?.data?.data?.result;
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
        border: active ? "0.5px solid #3154f4" : "0.5px solid #98A1AA",
        boxShadow: active ? "0 0 10px 0 rgba(152, 161, 170, 0.60)" : "none",
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
          <Typography fontSize="14px" color="#373d43" lineHeight="normal">
            {sampledDatasetResult?.count?.toLocaleString() ?? 0} rows •{" "}
            {sampledDatasetResult?.stats.length?.toLocaleString() ?? 0} cols
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
          <Typography fontSize="14px" color="#373d43" lineHeight="normal">
            Updated on {getDatasetLatestUpdate(dataset.id)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DatasetCard;
