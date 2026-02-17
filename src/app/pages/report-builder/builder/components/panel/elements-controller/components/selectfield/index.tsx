import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Check from "@mui/icons-material/Check";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

export interface SelectFieldOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  sx?: any;
}

interface SelectFieldProps {
  options: SelectFieldOption[];
  value: string;
  onChange: (value: any) => void;
  width?: number | string;
  label?: React.ReactNode;
  disabled?: boolean;
}

export default function SelectField({
  options,
  value,
  onChange,
  width,
  label,
  disabled,
}: Readonly<SelectFieldProps>) {
  const activeIndex = options.findIndex((o) => o.value === value);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {label ? (
        <Typography
          sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
        >
          {label}
        </Typography>
      ) : null}

      <Button
        variant="text"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        endIcon={anchorEl ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        sx={{
          fontWeight: "400",
          textTransform: "none",
          color: "#000",
          bgcolor: "#fff",
          width: "100%",
          justifyContent: "space-between",
          borderRadius: "4px",
          border: "0.5px solid #98A1AA",
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? "none" : "auto",
          "&:hover": {
            bgcolor: "#fff",
            borderColor: "#98A1AA",
          },
        }}
      >
        {options.find((o) => o.value === value)?.label || "Select..."}
      </Button>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        keepMounted
        disableScrollLock
        transformOrigin={{
          vertical: -2,
          horizontal: "left",
        }}
        MenuListProps={{
          sx: {
            maxHeight: 360,
            overflowY: "auto",
            /* Hide scrollbar for Chrome, Safari, Edge */
            "&::-webkit-scrollbar": {
              display: "none",
            },

            /* Hide scrollbar for Firefox */
            scrollbarWidth: "none",
          },
        }}
        sx={{
          "& .MuiPaper-root": {
            width: width ?? (anchorEl ? anchorEl.clientWidth : undefined),
            borderRadius: "4px",
            border: "1px solid #98A1AA",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.30)",
          },
          "& .MuiList-root": {
            paddingBottom: "0px",
            paddingTop: "0px",
          },
        }}
        classes={{ paper: "rte-keep-open" }}
      >
        {options.map((option, i) => {
          const isActive = value === option.value;
          const lastIndex = i === options.length - 1;
          const isPrevItem = i === activeIndex - 1;

          return (
            <MenuItem
              key={option.label}
              value={option.value}
              onClick={() => onChange(option.value)}
              id={`styled-menu-item-${option.value}`}
              sx={{
                position: "relative",
                padding: "11px 16px",
                fontWeight: 400,
                fontSize: "14px",
                background: isActive ? "#F8F9FA" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                borderTop: isActive ? "1px solid #E0E0E0" : "none",
                borderBottom: "none",

                "&::after":
                  !isActive && !isPrevItem && !lastIndex
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: isActive ? 0 : "90%",
                        height: "1px",
                        backgroundColor:
                          isPrevItem || lastIndex ? "transparent" : "#E0E0E0",
                      }
                    : {},

                ...option.sx,
              }}
            >
              {option?.icon ?? null}
              <Typography
                title={option.label}
                component={"span"}
                sx={{
                  maxWidth: "calc(100% - 24px)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "14px",
                }}
              >
                {option.label}
              </Typography>
              {isActive && <Check fontSize="small" htmlColor="#495057" />}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
