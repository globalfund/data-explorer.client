import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Check from "@mui/icons-material/Check";
import { Typography } from "@mui/material";

export interface StyledMenuOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  sx?: any;
}

interface StyledMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  options: StyledMenuOption[];
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
  width,
}: Readonly<StyledMenuProps>) {
  const activeIndex = options.findIndex((o) => o.value === activeValue);

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
        const isActive = activeValue === option.value;
        const lastIndex = i === options.length - 1;
        const isPrevItem = i === activeIndex - 1;

        return (
          <MenuItem
            key={option.label}
            value={option.value}
            onClick={() => onSelect(option.value)}
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
              }}
            >
              {option.label}
            </Typography>
            {isActive && <Check fontSize="small" htmlColor="#495057" />}
          </MenuItem>
        );
      })}
    </Menu>
  );
}
