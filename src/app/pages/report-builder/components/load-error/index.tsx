import React from "react";
import Box from "@mui/material/Box";
import { isAxiosError } from "axios";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

const getMessage = (error: unknown, itemType: "report" | "asset") => {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  if (status === 403) {
    return `You don't have access to this ${itemType}.`;
  }
  if (status === 404) {
    return `This ${itemType} doesn't exist or has been deleted.`;
  }
  return `Something went wrong while loading this ${itemType}.`;
};

export const ReportBuilderLoadError: React.FC<{
  error: unknown;
  itemType: "report" | "asset";
}> = ({ error, itemType }) => {
  return (
    <Box
      role="alert"
      data-testid="report-builder-load-error"
      sx={{
        gap: "16px",
        padding: "32px",
        display: "flex",
        maxWidth: "480px",
        bgcolor: "#ffffff",
        borderRadius: "8px",
        textAlign: "center",
        alignItems: "center",
        flexDirection: "column",
        border: "1px solid #cfd4da",
      }}
    >
      <Typography fontSize="16px" color="#252c34">
        {getMessage(error, itemType)}
      </Typography>
      <Link to="/report-builder" style={{ color: "#3154f4", fontSize: "14px" }}>
        Back to Report Builder
      </Link>
    </Box>
  );
};
