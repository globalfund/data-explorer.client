import React from "react";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";

export const ReportBuilderItemMenu: React.FC<{
  handleClose: () => void;
  anchorEl: HTMLElement | null;
  menuItems: {
    label: string;
    disabled?: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
}> = (props) => {
  const items = React.useMemo(() => {
    const _items: JSX.Element[] = [];
    props.menuItems.forEach((item, index) => {
      _items.push(
        <MenuItem
          key={item.label}
          onClick={item.onClick}
          disabled={item.disabled}
        >
          {item.icon}
          {item.label}
        </MenuItem>,
      );
      if (index < props.menuItems.length - 1) {
        _items.push(<Divider key={item.label + "-divider"} />);
      }
    });
    return _items;
  }, [props.menuItems]);

  return (
    <Menu
      id="rb-item-menu"
      anchorEl={props.anchorEl}
      onClose={props.handleClose}
      open={Boolean(props.anchorEl)}
      aria-labelledby="rb-item-button"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        ".MuiMenu-paper": {
          minWidth: "150px",
          borderRadius: "4px",
          boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.30)",
        },
        ".MuiList-root": {
          padding: "0px",
        },
        ".MuiMenuItem-root": {
          gap: "8px",
          display: "flex",
          fontSize: "14px",
          padding: "8px 16px",
          "&:hover": { bgcolor: "#eff1fe" },
        },
        hr: {
          borderColor: "#98A1AA",
          width: "calc(100% - 32px)",
          margin: "0px auto !important",
        },
      }}
    >
      {items}
    </Menu>
  );
};
