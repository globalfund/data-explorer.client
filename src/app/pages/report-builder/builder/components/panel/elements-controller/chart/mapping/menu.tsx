import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import { MappingData, MappingTypeIcons } from "./data";

interface StyledMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  options: Partial<MappingData>[];
  activeValue: string;
  onSelect: (value: any) => void;
  width?: number | string;
}

export default function StyledMenu({
  open,
  anchorEl,
  onClose,
  options,
  activeValue,
  onSelect,
}: Readonly<StyledMenuProps>) {
  const getBackgroundColor = (option: Partial<MappingData>) => {
    if (option.value === activeValue) {
      if (option.type === "number") {
        return "#0E6027";
      } else {
        return "#3154F4";
      }
    } else if (option.type === "number") {
      return "#A7F0BA";
    } else {
      return "#D6DDFD";
    }
  };
  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      keepMounted
      disableScrollLock
      transformOrigin={{
        vertical: -2,
        horizontal: "left",
      }}
      MenuListProps={{
        sx: {
          // maxHeight: 360,
          overflowY: "auto",
          //style scrollbar
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#000",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#F0F0F0",
          },
        },
      }}
      sx={{
        "& .MuiPaper-root": {
          width: anchorEl ? anchorEl.clientWidth : undefined,
          borderRadius: "4px",
          border: "1px solid #98A1AA",
          background: "#F8F9FA",
          boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60);",
        },
        "& .MuiList-root": {
          paddingBottom: "0px",
          paddingTop: "0px",
          padding: "8px",
        },
      }}
      classes={{ paper: "rte-keep-open" }}
    >
      {options.map((option) => {
        return (
          <MenuItem
            key={option.id}
            value={option.value}
            onClick={() => onSelect(option.value)}
            id={`styled-menu-item-${option.value}`}
            sx={{
              position: "relative",
              padding: "0 0",
              fontWeight: 400,
              height: "100%",
              fontSize: "14px",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "none",
              marginBottom: "8px",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            {option.type !== undefined && MappingTypeIcons[option.type]}
            <Typography
              title={option.value}
              component={"span"}
              sx={{
                padding: "4px 8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: option.value === activeValue ? "#FFF" : "#000",
                fontSize: "14px",
                width: "100%",
                borderRadius: "14px",
                backgroundColor: getBackgroundColor(option),
              }}
            >
              {option.value}
            </Typography>
          </MenuItem>
        );
      })}
    </Menu>
  );
}
