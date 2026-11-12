import React from "react";
import { Box, Typography } from "@mui/material";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import InsertDriveFileOutlined from "@mui/icons-material/InsertDriveFileOutlined";
import CheckCircleIcon from "app/assets/vectors/CheckCircle.svg?react";
import { RBExternalDatasetModel } from "app/state/api/action-reducers/report-builder/sync";
import { formatDatasetDate } from "./utils";

interface ExternalDatasetCardProps {
  dataset: RBExternalDatasetModel;
  active: boolean;
  connected: boolean;
  onSelect: (dataset: RBExternalDatasetModel) => void;
}

const clampSx = (lines: number) => ({
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: lines,
});

const ExternalDatasetCard = ({
  dataset,
  active,
  connected,
  onSelect,
}: ExternalDatasetCardProps) => {
  const published = formatDatasetDate(dataset.datePublished);
  return (
    <Box
      component="button"
      type="button"
      data-cy="rb-external-dataset-card"
      aria-pressed={active}
      onClick={() => onSelect(dataset)}
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
      <Box sx={{ display: "flex", gap: "8px", width: "100%" }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            fontSize="14px"
            fontWeight={700}
            color="#000"
            lineHeight="normal"
            sx={clampSx(2)}
          >
            {dataset.title}
          </Typography>
          {dataset.summary && (
            <Typography
              fontSize="14px"
              color="#373d43"
              lineHeight="normal"
              sx={{ mt: "4px", ...clampSx(2) }}
            >
              {dataset.summary}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 18,
            height: 18,
            flexShrink: 0,
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
                border: "1.25px solid #ADB5BD",
                borderRadius: "50%",
              }}
            />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          gap: "4px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {dataset.file && (
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <InsertDriveFileOutlined
              sx={{ width: 16, height: 16, color: "#98a1aa" }}
            />
            <Typography
              noWrap
              fontSize="14px"
              color="#373d43"
              lineHeight="normal"
            >
              {dataset.file}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            gap: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <AccessTimeOutlined
              sx={{ width: 16, height: 16, color: "#98a1aa" }}
            />
            <Typography fontSize="14px" color="#373d43" lineHeight="normal">
              {published ? `Published on ${published}` : dataset.source}
            </Typography>
          </Box>
          {connected && (
            <Box
              sx={{
                px: "8px",
                py: "2px",
                borderRadius: "14px",
                bgcolor: "#a7f0ba",
              }}
            >
              <Typography fontSize="12px" color="#000" lineHeight="normal">
                Connected
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ExternalDatasetCard;
