import React from "react";
import { appColors } from "app/theme";
import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu, { MenuProps } from "@mui/material/Menu";
import Check from "@mui/icons-material/CheckOutlined";
import ChevronDown from "app/assets/vectors/ChevronDown.svg?react";
import { RBDropdownProps } from "app/pages/report-builder/components/dropdown/data";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    autoFocus={false}
    {...props}
  />
))({
  "& .MuiPaper-root": {
    width: "200px",
    borderRadius: "4px",
    border: `1px solid #98A1AA`,
    boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.30)",
    background: appColors.SEARCH.DROPDOWN_BACKGROUND_COLOR,
    "&::-webkit-scrollbar": {
      width: 5,
      borderRadius: 2,
      background: appColors.SEARCH.DROPDOWN_SCROLLBAR_BACKGROUND_COLOR,
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: 2,
      background: appColors.SEARCH.DROPDOWN_SCROLLBAR_TRACK_BACKGROUND_COLOR,
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: 2,
      background: appColors.SEARCH.DROPDOWN_SCROLLBAR_THUMB_BACKGROUND_COLOR,
    },
  },
  "& .MuiMenu-list": {
    padding: "0px",
    maxHeight: "280px",
  },
});

const StyledMenuItem = styled(MenuItem)(() => ({
  width: "100%",
  display: "flex",
  fontSize: "16px",
  padding: "12px 16px",
  justifyContent: "space-between",
  "&:hover": {
    background: "#eff1fe",
  },
  "@media (max-width: 767px)": {
    height: "auto",
    minHeight: "32px",
  },
}));

export const RBDropdown: React.FC<RBDropdownProps> = (props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (value: string) => () => {
    props.handleDropdownChange(value);
    handleClose();
  };

  const selectedItem = React.useMemo(() => {
    return props.dropdownItems.find(
      (item) => item.value === props.dropdownSelected,
    );
  }, [props.dropdownItems, props.dropdownSelected]);

  return (
    <React.Fragment>
      <Button
        disableTouchRipple
        onClick={handleClick}
        sx={{
          gap: "8px",
          display: "flex",
          fontSize: "14px",
          padding: "9px 12px",
          borderRadius: "4px",
          textTransform: "capitalize",
          width: props.width ?? "134px",
          maxWidth: "calc(50vw - 32px)",
          justifyContent: "space-between",
          maxHeight: props.height ?? "35px",
          color: appColors.SEARCH.DROPDOWN_BUTTON_TEXT_COLOR,
          border: `1px solid ${anchorEl ? "#3154f4" : "#dfe3e5"}`,
          background: anchorEl
            ? "#eff1fe"
            : appColors.SEARCH.DROPDOWN_BUTTON_BACKGROUND_COLOR,
          "&:hover": {
            borderColor: "#3154f4",
          },
          ".MuiButton-label": {
            justifyContent: "space-between",
          },
          "> span": {
            fontWeight: "400",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          },
          "svg:nth-of-type(2)": {
            transform: `rotate(${anchorEl ? -180 : 0}deg);`,
          },
        }}
      >
        {props.fixedIcon}
        <span
          style={{ letterSpacing: "0", fontSize: props.fontSize ?? "14px" }}
        >
          {selectedItem?.label}
        </span>
        <ChevronDown />
      </Button>
      <StyledMenu
        keepMounted
        disableScrollLock
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        data-cy="rb-dropdown-menu"
        anchorOrigin={{
          vertical: (props.height ?? 32) + 8,
          horizontal: "left",
        }}
        sx={{
          "& .MuiPaper-root": {
            width: props.width,
            "@media (max-width: 767px)": {
              width: props.width ?? "180px",
            },
          },
        }}
      >
        {props.dropdownItems.map((item) => (
          <StyledMenuItem
            disableRipple
            key={item.label}
            disableTouchRipple
            onClick={handleItemClick(item.value)}
            sx={{
              background:
                selectedItem?.value === item.value ? "#eff1fe" : "transparent",
            }}
          >
            <span>{item.label}</span>
            {selectedItem?.value === item.value && <Check fontSize="small" />}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </React.Fragment>
  );
};
