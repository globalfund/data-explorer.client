import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { aggregationOptions } from "./data";

interface AggregationProps {
  setSelectedValue: (value: string) => void;
  selectedValue: string;
}

export default function Aggregation({
  selectedValue,
  setSelectedValue,
}: AggregationProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    handleCloseMenu();
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ color: "#373D43", fontSize: "14px", mb: "8px" }}>
        Aggregation*
      </Typography>
      <Box
        onClick={handleOpenMenu}
        sx={{
          fontWeight: "400",
          textTransform: "none",
          color: "#000",
          bgcolor: "#fff",
          width: "100%",
          height: "35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "4px",
          border: "0.5px solid #98A1AA",
          py: "6.5px",
          px: "8px",
          gap: "16px",
          ".MuiIconButton-root": {
            backgroundColor: "#FFFFFF",
            borderRadius: "4px",
            border: "none",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ":hover": { backgroundColor: "transparent" },
          },
        }}
      >
        <Typography fontSize={"14px"} color="#000" textTransform={"uppercase"}>
          {aggregationOptions.find((option) => option.value === selectedValue)
            ?.label || ""}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "17px",
            gap: "8px",
          }}
        >
          <IconButton onClick={handleOpenMenu}>
            {anchorEl ? (
              <KeyboardArrowUp htmlColor="#000" />
            ) : (
              <KeyboardArrowDown htmlColor="#000" />
            )}
          </IconButton>
        </Box>
      </Box>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        keepMounted
        disableScrollLock
        transformOrigin={{
          vertical: -2,
          horizontal: "left",
        }}
        sx={{
          "& .MuiPaper-root": {
            width: anchorEl ? anchorEl.clientWidth : undefined,
            borderRadius: "4px",
            border: "1px solid #98A1AA",
            background: "#F8F9FA",
            boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.30)",
          },
          "& .MuiList-root": {
            paddingBottom: "0px",
            paddingTop: "0px",
            padding: "0px 16px",
          },
        }}
        classes={{ paper: "rte-keep-open" }}
      >
        {aggregationOptions.map((option, index) => {
          return (
            <MenuItem
              key={option.id}
              value={option.value}
              onClick={() => handleSelect(option.value)}
              id={`styled-menu-item-${option.value}`}
              sx={{
                position: "relative",
                padding: "0 0",
                fontWeight: 400,
                height: "32px",
                fontSize: "14px",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <Typography
                title={option.label}
                component={"span"}
                sx={{
                  padding: "4px 8px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "#000",
                  fontSize: "14px",
                  width: "100%",
                  height: "100%",
                  borderBottom:
                    index < aggregationOptions.length - 1
                      ? "1px solid  #98A1AA"
                      : "none",
                  textTransform: "uppercase",
                }}
              >
                {option.label}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
