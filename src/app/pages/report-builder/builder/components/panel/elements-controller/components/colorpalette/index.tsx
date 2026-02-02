import React from "react";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { Box, Button, MenuItem, Menu, Typography } from "@mui/material";
import Check from "@mui/icons-material/Check";

import {
  colorPaletteCategoricalData,
  colorPaletteSequentialData,
} from "../../common/data";

interface ColorPaletteProps {
  label?: React.ReactNode;
  type?: "categorical" | "sequential";
  value?: string;
  onChange?: (value: string) => void;
}

export function ColorPalette(props: Readonly<ColorPaletteProps>) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const colorPaletteData =
    props.type === "categorical"
      ? colorPaletteCategoricalData
      : colorPaletteSequentialData;

  const handleSelectPalette = (paletteName: string) => {
    props.onChange?.(paletteName);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const activePalette = colorPaletteData.find((p) => p.name === props.value);

  const isMenuOpen = Boolean(anchorEl);
  return (
    <Box>
      {props.label ? (
        <Typography fontSize={"14px"} color="#373D43" marginBottom={"8px"}>
          {props.label}
        </Typography>
      ) : null}
      <Button
        variant="text"
        onClick={(event) => handleOpenMenu(event)}
        sx={{
          fontWeight: "400",
          textTransform: "none",
          color: "#000",
          bgcolor: "#fff",
          width: "100%",
          height: "40px",
          justifyContent: "space-between",
          borderRadius: "4px",
          border: "0.5px solid #98A1AA",
          padding: "11px 16px",
        }}
      >
        <Typography color="#161616" fontSize={"14px"}>
          {activePalette ? activePalette.label : props.label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {activePalette?.colors.slice(0, 5).map((color) => (
            <Box
              key={color}
              sx={{
                width: "18px",
                height: "18px",
                borderRadius: "3.2px",
                backgroundColor: color,
              }}
            />
          ))}
          {isMenuOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </Box>
      </Button>
      <Menu
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        keepMounted
        disableScrollLock
        transformOrigin={{
          vertical: -2,
          horizontal: "left",
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "4px",
            border: "1px solid #98A1AA",
            boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.30)",
            width: "284px",
          },
          "& .MuiList-root": {
            padding: "0px",
          },
        }}
        classes={{ paper: "rte-keep-open" }}
      >
        {colorPaletteData.map((option, i) => {
          return (
            <MenuItem
              key={option.name}
              value={option.label}
              onClick={() => handleSelectPalette(option.name)}
              id={`styled-menu-item-${option.name}`}
              title={option.label}
              sx={{
                position: "relative",
                padding: "0px 16px",
                fontWeight: 400,
                fontSize: "14px",
                background:
                  option.name === props.value ? "#F8F9FA" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                borderTop:
                  option.name === props.value ? "1px solid #E0E0E0" : "none",
                borderBottom: "none",
              }}
            >
              <Button
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 0",
                  borderRadius: "0px",
                  borderBottom:
                    i < colorPaletteData.length - 1
                      ? "1px solid #98A1AA"
                      : "none",
                }}
              >
                <Typography>{option.label}</Typography>
                {option.name === props.value && (
                  <Check fontSize="small" htmlColor="#495057" />
                )}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {option.colors.map((color) => (
                    <Box
                      key={color}
                      sx={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "3.2px",
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </Box>
              </Button>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
