import React from "react";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import { uniqueId } from "app/utils/uniqueId";
import { useStoreActions } from "app/state/store/hooks";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { ComponentOptions } from "app/pages/report-builder/builder/components/header/data";
import { ReportBuilderSelectGridModal } from "app/pages/report-builder/main/components/select-grid-modal";
import { ReportBuilderSelectColumnModal } from "app/pages/report-builder/main/components/select-column-modal";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { DEFAULT_TABLE_OPTIONS } from "../table/options";

export default function AddComponent() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const cmsData = useCMSData({ returnData: true });
  const addItem = useStoreActions(
    (actions) => actions.RBReportItemsState.addItem,
  );
  const [gridModalOpen, setGridModalOpen] = React.useState(false);
  const [columnModalOpen, setColumnModalOpen] = React.useState(false);

  const handleCloseGridModal = () => {
    setGridModalOpen(false);
  };

  const handleCloseColumnModal = () => {
    setColumnModalOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectGrid = (rows: number, columns: number) => {
    const height = rows * 280;
    const newItem: RBReportItem = {
      id: uniqueId(),
      type: "grid",
      open: false,
      data: {
        rows,
        columns,
        items: Array.from({ length: rows * columns }, () => ({
          id: uniqueId(),
          type: "unknown",
          open: false,
          data: null,
          options: {
            width: `${Math.floor(100 / columns)}%`,
            height: `${Math.floor(100 / rows)}%`,
          },
        })),
      },
      options: {
        width: "100%",
        height: `${height}px`,
        paddingTop: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingBottom: "10px",
        borderWidth: "0px",
        borderColor: "#98A1AA",
        borderRadius: "4px",
        borderStyle: "solid",
        backgroundColor: "#ffffff",
      },
    };
    addItem(newItem);
  };

  const selectColumn = (columns: number) => {
    const newItem: RBReportItem = {
      id: uniqueId(),
      type: "column",
      open: false,
      data: {
        columns,
        items: Array.from({ length: columns }, () => ({
          id: uniqueId(),
          type: "unknown",
          open: false,
          data: null,
          options: {
            width: `${Math.floor(100 / columns)}%`,
            height: "100%",
          },
        })),
      },
      options: {
        width: "100%",
        height: "280px",
        paddingTop: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingBottom: "10px",
        borderWidth: "0px",
        borderColor: "#98A1AA",
        borderRadius: "4px",
        borderStyle: "solid",
        backgroundColor: "#ffffff",
      },
    };
    addItem(newItem);
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
        newItem = {
          id: uniqueId(),
          type: "table",
          open: false,
          options: DEFAULT_TABLE_OPTIONS,
          data: {
            dataset: null,
            columns: [],
          },
        };
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
        setGridModalOpen(true);
        return;
      case "column":
        setColumnModalOpen(true);
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
      <ReportBuilderSelectGridModal
        onSelect={selectGrid}
        open={gridModalOpen}
        onClose={handleCloseGridModal}
      />
      <ReportBuilderSelectColumnModal
        onSelect={selectColumn}
        open={columnModalOpen}
        onClose={handleCloseColumnModal}
      />
    </React.Fragment>
  );
}
