import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PinIcon from "@mui/icons-material/Pin";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CategoryIcon from "@mui/icons-material/Category";
import { DatasetProfile } from "./types";

interface ColumnTypePillsProps {
  profile: DatasetProfile;
}

interface TypeChipProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  color: string;
}

const TypeChip: React.FC<TypeChipProps> = ({ icon, count, label, color }) => (
  <Chip
    icon={icon as React.ReactElement}
    label={`${label}: ${count}`}
    size="small"
    sx={{
      bgcolor: color,
      color: "white",
      fontWeight: 600,
      "& .MuiChip-icon": {
        color: "white",
      },
    }}
  />
);

export const ColumnTypePills: React.FC<ColumnTypePillsProps> = ({
  profile,
}) => {
  const hasAnyColumns =
    profile.text_columns.length > 0 ||
    profile.numeric_columns.length > 0 ||
    profile.datetime_columns.length > 0 ||
    profile.boolean_columns.length > 0 ||
    profile.categorical_columns.length > 0;

  if (!hasAnyColumns) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        Column Types
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {profile.text_columns.length > 0 && (
          <TypeChip
            icon={<TextFieldsIcon />}
            count={profile.text_columns.length}
            label="Text"
            color="#2563EB"
          />
        )}
        {profile.numeric_columns.length > 0 && (
          <TypeChip
            icon={<PinIcon />}
            count={profile.numeric_columns.length}
            label="Numeric"
            color="#059669"
          />
        )}
        {profile.datetime_columns.length > 0 && (
          <TypeChip
            icon={<CalendarMonthIcon />}
            count={profile.datetime_columns.length}
            label="DateTime"
            color="#7C3AED"
          />
        )}
        {profile.boolean_columns.length > 0 && (
          <TypeChip
            icon={<ToggleOnIcon />}
            count={profile.boolean_columns.length}
            label="Boolean"
            color="#D97706"
          />
        )}
        {profile.categorical_columns.length > 0 && (
          <TypeChip
            icon={<CategoryIcon />}
            count={profile.categorical_columns.length}
            label="Categorical"
            color="#DB2777"
          />
        )}
      </Box>
    </Box>
  );
};
