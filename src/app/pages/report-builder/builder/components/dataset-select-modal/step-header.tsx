import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DatasetArrowLeftIcon from "app/assets/vectors/DatasetArrowLeft.svg?react";
import { DatasetRowsPerPage } from "./utils";

interface DatasetStepHeaderProps {
  title: string;
  subtitle: string;
  rowsPerPage: DatasetRowsPerPage;
  onBack: () => void;
  onRowsPerPageChange: (rowsPerPage: DatasetRowsPerPage) => void;
}

const rowsPerPageOptions: DatasetRowsPerPage[] = ["5", "10", "25", "50"];

export const DatasetStepHeader: React.FC<DatasetStepHeaderProps> = ({
  title,
  subtitle,
  rowsPerPage,
  onBack,
  onRowsPerPageChange,
}) => {
  return (
    <Box
      sx={{
        gap: "16px",
        px: "16px",
        py: "12px",
        display: "flex",
        alignItems: "center",
        bgcolor: "#f8f9fa",
        justifyContent: "space-between",
        borderBottom: "0.5px solid #cfd4da",
        "@media (max-width: 767px)": {
          alignItems: "flex-start",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          gap: "14px",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          onClick={onBack}
          startIcon={<DatasetArrowLeftIcon />}
          sx={{
            p: 0,
            gap: "4px",
            color: "#000",
            minWidth: "auto",
            fontSize: "14px",
            flexShrink: 0,
            fontWeight: 400,
            textTransform: "none",
            ".MuiButton-startIcon": {
              m: 0,
            },
          }}
        >
          Back
        </Button>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            fontSize="16px"
            fontWeight={700}
            color="#000"
            lineHeight="normal"
            noWrap
          >
            {title}
          </Typography>
          <Typography fontSize="14px" color="#000" lineHeight="normal">
            {subtitle}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          gap: "8px",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Typography fontSize="16px" color="#373d43" whiteSpace="nowrap">
          Rows per Page:
        </Typography>
        <Select
          size="small"
          value={rowsPerPage}
          onChange={(event) =>
            onRowsPerPageChange(event.target.value as DatasetRowsPerPage)
          }
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            height: "35px",
            minWidth: "64px",
            bgcolor: "#ffffff",
            borderRadius: "4px",
            ".MuiSelect-select": {
              py: "8px",
              pl: "10px",
              pr: "32px",
              fontSize: "14px",
            },
          }}
          MenuProps={{
            id: "dataset-rows-per-page-select",
          }}
        >
          {rowsPerPageOptions.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};
