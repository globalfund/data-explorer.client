import React from "react";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import { useStoreActions } from "app/state/store/hooks";
import { ComponentOptions } from "app/pages/report-builder/builder/components/header/data";
import { ReportBuilderSelectGridModal } from "app/pages/report-builder/main/components/select-grid-modal";
import { ReportBuilderSelectColumnModal } from "app/pages/report-builder/main/components/select-column-modal";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";
import useMediaQuery from "@mui/system/useMediaQuery";
import {
  createReportItem,
  isCreatableReportItemType,
} from "app/pages/report-builder/component-registry/model";

export default function AddComponent({
  onOpenAssets,
}: {
  onOpenAssets: () => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const cmsData = useCMSData({ returnData: true });
  const isMobile = useMediaQuery("(max-width: 600px)");
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
    addItem(createReportItem("grid", { rows, columns }));
  };

  const selectColumn = (columns: number) => {
    addItem(createReportItem("column", { columns }));
  };

  const handleMenuItemClick = (value: string) => {
    if (value === "grid") {
      setGridModalOpen(true);
      return;
    }

    if (value === "column") {
      setColumnModalOpen(true);
      return;
    }

    if (value === "saved_asset") {
      setAnchorEl(null);
      onOpenAssets();
      return;
    }

    if (isCreatableReportItemType(value)) {
      addItem(createReportItem(value));
    }
  };

  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <Button
        data-cy="rb-add-component"
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
        {isMobile
          ? "Add"
          : getCMSDataField(
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
            data-cy={`rb-add-${option.value}`}
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
