import React from "react";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import SelectField from "../../components/selectfield";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import { useStoreState } from "app/state/store/hooks";
import {
  getTableOptions,
  TableColorPalette,
  TableOptions,
  tablePaletteOptions,
} from "app/pages/report-builder/builder/components/table/options";

const sizeOptions = [
  { label: "Compact", value: "compact" },
  { label: "Large", value: "large" },
];

const displayOptions = [
  { label: "Table", value: "table" },
  { label: "List", value: "list" },
];

const rowStrippingOptions = [
  { label: "Zebra", value: "zebra" },
  { label: "None", value: "none" },
];

const PaletteField = ({
  value,
  onChange,
}: {
  value: TableColorPalette;
  onChange: (value: TableColorPalette) => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const activePalette = tablePaletteOptions[value];
  const menuOpen = Boolean(anchorEl);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography fontSize="14px" color="#373D43" mb="8px">
        Color Palette
      </Typography>
      <Button
        variant="text"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          gap: "4px",
          px: "10px",
          py: "8px",
          height: "35px",
          display: "flex",
          color: "#161616",
          bgcolor: "#fff",
          borderRadius: "4px",
          alignItems: "center",
          textTransform: "none",
          border: "0.5px solid #98A1AA",
          justifyContent: "space-between",
          "&:hover": {
            bgcolor: "#fff",
            borderColor: "#98A1AA",
          },
          width: "100%",
        }}
      >
        <Typography
          fontSize="14px"
          color="#161616"
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textAlign: "left",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {activePalette.label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {activePalette.swatches.map((color) => (
            <Box
              key={color}
              sx={{
                width: 18,
                height: 18,
                flexShrink: 0,
                bgcolor: color,
                borderRadius: "3.2px",
                border: color === "#FFFFFF" ? "0.5px solid #CFD4DA" : 0,
              }}
            />
          ))}
          {menuOpen ? (
            <KeyboardArrowUp sx={{ width: 16, height: 16, color: "#373D43" }} />
          ) : (
            <KeyboardArrowDown
              sx={{ width: 16, height: 16, color: "#373D43" }}
            />
          )}
        </Box>
      </Button>
      <Menu
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        keepMounted
        disableScrollLock
        transformOrigin={{
          vertical: -2,
          horizontal: "left",
        }}
        sx={{
          width: "100%",
          "& .MuiPaper-root": {
            width: anchorEl?.clientWidth,
            borderRadius: "4px",
            border: "1px solid #98A1AA",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.30)",
          },
          "& .MuiList-root": {
            p: 0,
          },
        }}
        slotProps={{ paper: { id: "table-palette-menu" } }}
      >
        {Object.entries(tablePaletteOptions).map(([key, palette]) => (
          <MenuItem
            key={key}
            selected={key === value}
            onClick={() => {
              onChange(key as TableColorPalette);
              setAnchorEl(null);
            }}
            sx={{
              px: "10px",
              py: "8px",
              gap: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography fontSize="14px" color="#161616">
              {palette.label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {palette.swatches.map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 18,
                    height: 18,
                    bgcolor: color,
                    borderRadius: "3.2px",
                    border: color === "#FFFFFF" ? "0.5px solid #CFD4DA" : 0,
                  }}
                />
              ))}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default function Customise() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem, editItem } = useGetReportItemState<"table">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });
  const tableOptions = getTableOptions(selectedItem?.options);

  const updateOptions = (options: Partial<TableOptions>) => {
    if (!selectedItem) return;
    editItem({
      ...selectedItem,
      id: selectedController?.id || "",
      type: "table",
      open: selectedItem.open || false,
      options: {
        ...tableOptions,
        ...options,
      },
    });
  };

  return (
    <Box
      sx={{
        gap: "16px",
        p: "8px",
        display: "flex",
        maxHeight: "500px",
        overflowY: "auto",
        flexDirection: "column",
        bgcolor: "#F8F9FA",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        ".MuiButton-root": {
          minHeight: "35px",
          py: "7px",
        },
      }}
    >
      <SelectField
        label="Size"
        value={tableOptions.size}
        options={sizeOptions}
        onChange={(value) => updateOptions({ size: value })}
        width="100%"
      />
      <SelectField
        label="Display"
        value={tableOptions.display}
        options={displayOptions}
        onChange={(value) => updateOptions({ display: value })}
        width="100%"
      />
      <SelectField
        label="Row Stripping"
        value={tableOptions.rowStripping}
        options={rowStrippingOptions}
        onChange={(value) => updateOptions({ rowStripping: value })}
        width="100%"
      />
      <PaletteField
        value={tableOptions.colorPalette}
        onChange={(colorPalette) => updateOptions({ colorPalette })}
      />
    </Box>
  );
}
