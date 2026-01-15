import React from "react";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import { uniqueId } from "app/utils/uniqueId";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { ComponentOptions } from "app/pages/report-builder/builder/components/toolbar/data";
import { useStoreActions } from "app/state/store/hooks";

export default function AddComponent() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const addItem = useStoreActions(
    (actions) => actions.RBReportItemsState.addItem,
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value: string) => {
    let newItem: RBReportItem | null = null;
    switch (value) {
      case "text":
        newItem = {
          id: uniqueId(),
          type: "text",
          open: false,
          settings: {
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            borderWidth: "0.5px",
            borderColor: "#98A1AA",
            borderRadius: "4px",
            borderStyle: "solid",
            backgroundColor: "#ffffff00",
            width: "100%",
            height: "100%",
          },
        };
        break;
      case "chart":
        newItem = { id: uniqueId(), type: "chart", open: false };
        break;
      case "table":
        newItem = { id: uniqueId(), type: "table", open: false };
        break;
      case "image":
        newItem = {
          id: uniqueId(),
          type: "image",
          open: false,
          settings: {
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            borderWidth: "0.5px",
            borderColor: "#98A1AA",
            borderRadius: "4px",
            backgroundColor: "#ffffff00",
            borderStyle: "solid",
            width: "100%",
            height: "400px",
            img: {
              objectFit: "contain",
              opacity: 1,
            },
          },
          extra: {
            image: {
              sizingMode: "fit-proportional",
            },
          },
        };
        break;
      case "section_divider":
        newItem = { id: uniqueId(), type: "section_divider", open: false };
        break;
      case "kpi_box":
        newItem = {
          id: uniqueId(),
          type: "kpi_box",
          open: false,
          settings: {
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            borderWidth: "0.5px",
            borderColor: "#98A1AA",
            borderRadius: "4px",
            backgroundColor: "#ffffff00",
            borderStyle: "solid",
            width: "100%",
            height: "141px",
            justifyContent: "start",
          },
          extra: {
            kpi_box: {
              options: {
                alignVertical: "middle",
                alignHorizontal: "left",
                innerLine: {
                  type: "line",
                  borderWidth: "0.5px",
                  borderColor: "#98A1AA",
                },
              },
              field: {
                topLabel: {
                  value: "Top Label",
                  fontFamily: "Arial",
                  fontWeightLabel: "400",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "14px",
                  color: "#70777E",
                  bgColor: "#ffffff00",
                  enabled: true,
                },
                bigNumberText: {
                  value: "BN",
                  fontFamily: "Arial",
                  fontWeight: "700",
                  fontWeightLabel: "400",
                  fontStyle: "normal",
                  fontSize: "44px",
                  color: "#000000",
                  bgColor: "#ffffff00",
                  enabled: true,
                },
                bottomLabel: {
                  value: "Bottom Label",
                  fontFamily: "Arial",
                  fontWeightLabel: "400",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "16px",
                  color: "#70777E",
                  bgColor: "#ffffff00",
                  enabled: true,
                },
                optionalText: {
                  value: "Optional Text",
                  fontFamily: "Arial",
                  fontWeightLabel: "400",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "14px",
                  color: "#70777E",
                  bgColor: "#ffffff00",
                  enabled: true,
                },
              },
            },
          },
        };
        break;
      case "grid":
        newItem = { id: uniqueId(), type: "grid", open: false };
        break;
      case "column":
        newItem = { id: uniqueId(), type: "column", open: false };
        break;
      default:
        break;
    }
    if (newItem) {
      addItem(newItem);
    }
  };

  const open = Boolean(anchorEl);
  return (
    <React.Fragment>
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{
          fontWeight: "400",
          color: "#ffffff",
          textTransform: "none",
          background: open ? "#000" : "#3154f4",
          borderRadius: "4px",
          padding: "9px 12px",
          height: "35px",
        }}
        onClick={handleClick}
      >
        Add a Component
      </Button>
      <Menu
        open={open}
        keepMounted
        disableScrollLock
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: -5,
          horizontal: "left",
        }}
        sx={{
          zIndex: 1400,
          "& .MuiPaper-root": {
            borderRadius: "4px",
            border: "1px solid #dfe3e5",
          },
          "& .MuiList-root": {
            padding: "0px",
          },
          "& .MuiMenuItem-root": {
            gap: "5px",
            display: "flex",
            padding: "12px 16px",
            alignItems: "center",
            borderBottom: "1px solid #c6c6c6",
            "&:last-of-type": { borderBottomStyle: "none" },
          },
        }}
      >
        {ComponentOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleMenuItemClick(option.value)}
          >
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}
