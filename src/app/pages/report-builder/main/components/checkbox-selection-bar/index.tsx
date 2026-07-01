import React from "react";
import Box from "@mui/system/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckboxChecked from "app/assets/vectors/CheckboxRB_halfchecked.svg?react";
import CheckboxUnchecked from "app/assets/vectors/CheckboxRB_notchecked.svg?react";
import { CheckboxSelectionBarProps } from "app/pages/report-builder/main/components/checkbox-selection-bar/data";
import {
  Folder,
  Backspace,
} from "app/pages/report-builder/builder/components/report-settings/icons";
import Close from "@mui/icons-material/Close";

export const CheckboxSelectionBar: React.FC<CheckboxSelectionBarProps> = ({
  checkedItems,
  setCheckedItems,
  onDeleteCheckedItems,
  onMoveToFolderCheckedItems,
}) => {
  const onCheckboxChange = () => {
    setCheckedItems([]);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        padding: "12px",
        borderRadius: "4px",
        flexDirection: "row",
        bgcolor: "#f8f9fa",
        alignItems: "center",
        marginBottom: "20px",
        border: "1px solid #98a1aa",
        justifyContent: "space-between",
        button: {
          padding: "4px 12px",
          borderRadius: "4px",
          bgcolor: "#ffffff",
          fontWeight: "normal",
          textTransform: "none",
          border: "1px solid #98a1aa",
        },
      }}
    >
      <Box
        sx={{
          gap: "20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              onChange={onCheckboxChange}
              icon={<CheckboxUnchecked />}
              checkedIcon={<CheckboxChecked />}
              checked={checkedItems.length > 0}
            />
          }
          label={`${checkedItems.length} selected`}
          checked={checkedItems.length > 0}
          sx={{
            marginLeft: "0px",
            marginRight: "0px",
            alignItems: "center",
            "& .MuiFormControlLabel-label": {
              zIndex: 0,
              fontSize: "14px",
              marginLeft: "5px",
            },
          }}
        />
        <Divider
          flexItem
          orientation="vertical"
          sx={{ borderColor: "#98a1aa" }}
        />
        <Button startIcon={<Folder />} onClick={onMoveToFolderCheckedItems}>
          Move to folder
        </Button>
        <Button
          startIcon={<Backspace />}
          onClick={onDeleteCheckedItems}
          sx={{ color: "#ea1541", borderColor: "#ea1541 !important" }}
        >
          Delete
        </Button>
      </Box>
      <Button startIcon={<Close />} onClick={onCheckboxChange}>
        Clear
      </Button>
    </Box>
  );
};
