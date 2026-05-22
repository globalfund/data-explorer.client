import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import TableChartIcon from "@mui/icons-material/TableChart";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import StorageIcon from "@mui/icons-material/Storage";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DatasetProfile } from "./types";

interface DatasetProfileHeaderProps {
  datasetName: string;
  datasetDescription: string;
  profile: DatasetProfile;
}

const StatItem: React.FC<{
  icon: React.ReactNode;
  value: string | number;
  label: string;
}> = ({ icon, value, label }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    {icon}
    <Typography variant="body2" fontWeight={600} color="text.primary">
      {typeof value === "number" ? value.toLocaleString() : value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

export const DatasetProfileHeader: React.FC<DatasetProfileHeaderProps> = ({
  datasetName,
  datasetDescription,
  profile,
}) => {
  const formatMemory = (mb: number) => {
    if (mb < 1) {
      return `${(mb * 1024).toFixed(0)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <FolderIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="h6" fontWeight={600}>
          {datasetName.charAt(0).toUpperCase() + datasetName.slice(1)} Dataset
          Profile
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {datasetDescription}
        <br />
        {profile.summary}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          p: 2,
          bgcolor: "grey.50",
          borderRadius: 1,
        }}
      >
        <StatItem
          icon={
            <TableChartIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          }
          value={profile.num_rows}
          label="rows"
        />
        <StatItem
          icon={
            <ViewColumnIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          }
          value={profile.num_columns}
          label="columns"
        />
        <StatItem
          icon={<StorageIcon sx={{ fontSize: 18, color: "text.secondary" }} />}
          value={formatMemory(profile.memory_usage_mb)}
          label=""
        />
        <StatItem
          icon={
            <ContentCopyIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          }
          value={profile.num_duplicate_rows}
          label="duplicates"
        />
      </Box>
    </Box>
  );
};
