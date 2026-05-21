import React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import { uniqueId } from "app/utils/uniqueId";
import IconButton from "@mui/material/IconButton";
import { useStoreActions } from "app/state/store/hooks";
import UndoIcon from "app/assets/vectors/Undo.svg?react";
import RedoIcon from "app/assets/vectors/Redo.svg?react";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { ComponentOptions } from "app/pages/report-builder/builder/components/toolbar/data";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export const ReportBuilderPageToolbar: React.FC = () => {
  const [nameValue, setNameValue] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const cmsData = useCMSData({ returnData: true });

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
          data: { rte: null },
          options: {
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            borderWidth: "0px",
            borderColor: "#98A1AA",
            borderRadius: "4px",
            borderStyle: "solid",
            backgroundColor: "#ffffff",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          },
        };
        break;
      case "chart":
        newItem = {
          id: uniqueId(),
          type: "chart",
          open: false,
          options: {
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            borderWidth: "0",
            borderColor: "#98A1AA",
            borderRadius: "4px",
            backgroundColor: "#ffffff",
            borderStyle: "solid",
            width: "100%",
            height: "500px",
            justifyContent: "start",
          },
          data: {
            dataset: null,
            chartType: undefined,
            mapping: {},
          },
        };
        break;
      case "table":
        newItem = { id: uniqueId(), type: "table", open: false, data: null };
        break;
      case "image":
        newItem = {
          id: uniqueId(),
          type: "image",
          open: false,
          options: {
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            borderStyle: "solid",
            width: "100%",
            height: "400px",
            imgOpacity: 1,
            imgNormHeight: "400px",
            imgBorderWidth: "0px",
            imgBorderColor: "#98A1AA",
            imgBorderRadius: "0px",
            imgBackgroundColor: "#ffffff",
            sizingMode: "fit-proportional",
            enableCrop: true,
          },
          data: {
            src: "",
            cropCoordinates: {
              left: 0,
              top: 0,
              width: 1000,
              height: 1000,
            },
            transformCoordinates: {
              scale: 1,
              positionX: 0,
              positionY: 0,
            },
          },
        };
        break;
      case "section_divider":
        newItem = {
          id: uniqueId(),
          type: "section_divider",
          open: false,
          data: null,
          options: {
            paddingLeft: "10px",
            paddingTop: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            width: "100%",
            borderWidth: "1px",
            borderRadius: "1px",
            borderColor: "#373D43",
            borderStyle: "solid",
            strokeLinecap: "round",
          },
        };
        break;
      case "kpi_box":
        newItem = {
          id: uniqueId(),
          type: "kpi_box",
          open: false,
          data: {
            topLabel: {
              value: "Top Label",
              fontFamily: "Arial",
              fontWeightLabel: "400",
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "14px",
              color: "#70777E",
              bgColor: "#ffffff",
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
              bgColor: "#ffffff",
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
              bgColor: "#ffffff",
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
              bgColor: "#ffffff",
              enabled: true,
            },
          },
          options: {
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            borderWidth: "0.5px",
            borderColor: "#98A1AA",
            borderRadius: "4px",
            backgroundColor: "#ffffff",
            borderStyle: "solid",
            width: "100%",
            height: "141px",
            justifyContent: "start",
            alignVertical: "middle",
            alignHorizontal: "left",
            innerLine: {
              type: "line",
              borderWidth: "0.5px",
              borderColor: "#98A1AA",
            },
          },
        };
        break;
      case "grid":
        return;
      case "column":
        return;
      default:
        break;
    }
    if (newItem) {
      addItem(newItem);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ zIndex: 1400, flexGrow: 1, top: 71, position: "sticky" }}>
      <Toolbar
        sx={{
          gap: "10px",
          height: "63px",
          padding: "10px 20px !important",
          justifyContent: "justify-content",
          borderBottom: "1px solid #cfd4da",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            input: {
              width: "100%",
              fontSize: "20px",
              borderStyle: "none",
              padding: "10px 16px",
              background: "transparent",
              borderBottom: `1px solid #98a1aa`,
            },
          }}
        >
          <input
            type="text"
            id="report-title"
            value={nameValue}
            placeholder={getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.untitledReportPlaceholder",
              "Untitled Report",
            )}
            onChange={(e) => setNameValue(e.target.value)}
          />
        </Box>
        <Box
          sx={{
            gap: "10px",
            display: "flex",
            flexDirection: "row",
            ".MuiIconButton-root": {
              borderRadius: "4px",
              padding: "10px 12px",
              border: "1px solid #dfe3e5",
              "&:hover": {
                background: "#f1f3f5",
                borderColor: "#000000",
              },
            },
          }}
        >
          <IconButton>
            <UndoIcon />
          </IconButton>
          <IconButton>
            <RedoIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              fontWeight: "400",
              color: "#ffffff",
              textTransform: "none",
              background: open ? "#000" : "#3154f4",
            }}
            onClick={handleClick}
          >
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderBuilder.addComponentButton",
              "Add a Component",
            )}
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
                {getCMSDataField(
                  cmsData,
                  `componentsRBComponentOptions.${option.cmsKey}`,
                  option.label,
                )}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </Box>
  );
};
