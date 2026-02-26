import React from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import CardIcon from "app/assets/vectors/Card.svg?react";
import ListIcon from "app/assets/vectors/List.svg?react";
import InputAdornment from "@mui/material/InputAdornment";
import NewFolderIcon from "app/assets/vectors/NewFolder.svg?react";
import { RBDropdown } from "app/pages/report-builder/components/dropdown";
import SettingsIcon from "app/assets/vectors/Settings_ButtonIcon.svg?react";

const dropdownItems = [
  { label: "Date Created DESC", value: "createdDate DESC" },
  { label: "Date Created ASC", value: "createdDate ASC" },
  { label: "Title ASC", value: "name ASC" },
  { label: "Title DESC", value: "name DESC" },
];

export const ReportBuilderToolbar: React.FC<{
  search: string;
  selectedSort: string;
  onNewFolderClick: () => void;
  onNewReportClick: () => void;
  selectedView: "cards" | "list";
  setSearch: (search: string) => void;
  setSelectedSort: (sort: string) => void;
  setSelectedView: (view: "cards" | "list") => void;
}> = ({
  search,
  setSearch,
  selectedView,
  setSelectedView,
  selectedSort,
  setSelectedSort,
  onNewFolderClick,
  onNewReportClick,
}) => {
  return (
    <Box
      sx={{
        gap: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        button: {
          fontSize: "16px",
          textTransform: "none",
        },
      }}
    >
      <Input
        value={search}
        disableUnderline
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <Search fontSize="small" />
          </InputAdornment>
        }
        sx={{
          flexGrow: 1,
          fontSize: "14px",
          padding: "5px 8px",
          borderRadius: "4px",
          background: "#f1f3f5",
          border: "1px solid #98a1aa",
        }}
      />
      <Box
        sx={{
          gap: "1px",
          display: "flex",
          button: {
            borderRadius: 0,
            fontWeight: "400",
            padding: "8px 12px",
          },
        }}
      >
        <Button
          endIcon={<CardIcon />}
          onClick={() => setSelectedView("cards")}
          sx={{
            borderBottom: `2px solid ${selectedView === "cards" ? "#0f62fe" : "#cfd4da"}`,
          }}
        >
          Card
        </Button>
        <Button
          endIcon={<ListIcon />}
          onClick={() => setSelectedView("list")}
          sx={{
            borderBottom: `2px solid ${selectedView === "list" ? "#0f62fe" : "#cfd4da"}`,
          }}
        >
          List
        </Button>
      </Box>
      <RBDropdown
        height={45}
        width={220}
        fontSize="16px"
        fixedIcon={<SettingsIcon />}
        dropdownItems={dropdownItems}
        dropdownSelected={selectedSort}
        handleDropdownChange={(value) => setSelectedSort(value)}
      />
      <IconButton
        sx={{
          borderRadius: "4px",
          padding: "12px 14px",
          border: "1px solid #dfe3e5",
          "&:hover": {
            background: "#f1f3f5",
            borderColor: "#000000",
          },
        }}
        onClick={onNewFolderClick}
      >
        <NewFolderIcon />
      </IconButton>
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{
          fontWeight: "400",
          color: "#ffffff",
          background: "#3154f4",
        }}
        onClick={onNewReportClick}
      >
        New Report
      </Button>
    </Box>
  );
};
