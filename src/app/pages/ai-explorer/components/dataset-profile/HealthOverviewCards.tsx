import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import WarningIcon from "@mui/icons-material/Warning";
import LockIcon from "@mui/icons-material/Lock";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DatasetProfile } from "./types";

interface HealthOverviewCardsProps {
  profile: DatasetProfile;
}

interface HealthCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sublabel?: string;
  badge?: string;
  color?: "default" | "success" | "warning" | "error";
}

const HealthCard: React.FC<HealthCardProps> = ({
  icon,
  value,
  label,
  sublabel,
  badge,
  color = "default",
}) => {
  const colorMap = {
    default: { bg: "grey.50", border: "grey.200" },
    success: { bg: "success.light", border: "success.main" },
    warning: { bg: "warning.light", border: "warning.main" },
    error: { bg: "error.light", border: "error.main" },
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        bgcolor: colorMap[color].bg,
        border: `1px solid`,
        borderColor: colorMap[color].border,
        minWidth: 140,
        flex: 1,
      }}
    >
      <Box sx={{ color: "text.secondary" }}>{icon}</Box>
      <Typography variant="h6" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {label}
      </Typography>
      {sublabel && (
        <Typography variant="caption" color="text.secondary">
          {sublabel}
        </Typography>
      )}
      {badge && (
        <Box
          sx={{
            mt: 1,
            px: 1,
            py: 0.5,
            bgcolor: "warning.main",
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="white" fontWeight={600}>
            {badge}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export const HealthOverviewCards: React.FC<HealthOverviewCardsProps> = ({
  profile,
}) => {
  const missingCellsColor: "default" | "warning" | "error" =
    profile.total_missing_cells > 500
      ? "error"
      : profile.total_missing_cells > 100
        ? "warning"
        : "default";

  const constantColumnsColor: "default" | "warning" =
    profile.num_constant_columns.length > 0 ? "warning" : "default";

  const highMissingColor: "default" | "warning" | "error" =
    profile.num_high_missing_columns.length > 2
      ? "error"
      : profile.num_high_missing_columns.length > 0
        ? "warning"
        : "default";

  const duplicateRowsColor: "default" | "success" | "warning" | "error" =
    profile.duplicate_row_percentage === 0
      ? "success"
      : profile.duplicate_row_percentage < 5
        ? "warning"
        : "error";

  const duplicateLabel =
    profile.duplicate_row_percentage === 0
      ? "duplicates"
      : `${profile.duplicate_row_percentage.toFixed(1)}% duplicates`;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        Dataset Health Overview
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <HealthCard
          icon={<WarningIcon />}
          value={profile.total_missing_cells.toLocaleString()}
          label="Missing Cells"
          sublabel="total across all columns"
          color={missingCellsColor}
        />
        <HealthCard
          icon={<LockIcon />}
          value={profile.num_constant_columns.length}
          label="Constant Columns"
          badge={
            profile.num_constant_columns.length > 0
              ? "Drop candidates"
              : undefined
          }
          color={constantColumnsColor}
        />
        <HealthCard
          icon={<MailOutlineIcon />}
          value={profile.num_high_missing_columns.length}
          label="High Missing"
          sublabel={
            profile.num_high_missing_columns.length > 0
              ? profile.num_high_missing_columns.slice(0, 2).join(", ")
              : undefined
          }
          color={highMissingColor}
        />
        <HealthCard
          icon={<ContentCopyIcon />}
          value={profile.num_duplicate_rows}
          label={duplicateLabel}
          color={duplicateRowsColor}
        />
      </Box>
    </Box>
  );
};
