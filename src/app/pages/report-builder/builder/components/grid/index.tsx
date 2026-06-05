import React from "react";
import Box from "@mui/material/Box";
import Close from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVert from "@mui/icons-material/MoreVert";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ReportBuilderPageText } from "app/pages/report-builder/builder/components/text";
import { ReportBuilderPageChart } from "app/pages/report-builder/builder/components/chart";
import { ReportBuilderPageImage } from "app/pages/report-builder/builder/components/image";
import { ReportBuilderPageTable } from "app/pages/report-builder/builder/components/table";
import { ReportBuilderPageItemMenu } from "app/pages/report-builder/builder/components/item-menu";
import {
  RBReportItem,
  RBReportItemController,
  ReportItemOf,
} from "app/state/api/action-reducers/report-builder/sync";
import { ActionCreator } from "easy-peasy";
import { useClickOutsideEditor } from "app/hooks/useClickOutsideEditorComponent";
import KPIBox from "../kpi";

const GridItem: React.FC<{
  index: number;
  item: RBReportItem;
  viewMode?: boolean;
  setSelectedController: ActionCreator<RBReportItemController>;
  parentItem: RBReportItem;
}> = ({ item, viewMode, setSelectedController, parentItem }) => {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const active = selectedController?.id === item.id;

  const containerSx = {
    width: "100%",
    height: "100%",
    "> div": {
      height: "100%",
      "> div": {
        height: "100%",
      },
    },
    border:
      active && !viewMode ? "0.5px solid #3154F4" : "0.5px solid transparent",
    borderRadius: "4px",
  };

  const empty = (
    <Box
      onClick={() => {
        setSelectedController({
          id: item.id,
          type: "unknown",
          open: true,
          parent: {
            id: parentItem.id,
            type: parentItem.type as "grid" | "column",
            open: true,
          },
        });
      }}
      sx={{
        gap: "10px",
        width: "100%",
        height: "100%",
        display: "flex",
        cursor: "pointer",
        borderRadius: "4px",
        alignItems: "center",
        bgcolor: "#d6ddfd",
        flexDirection: "row",
        position: "relative",
        padding: "10px",
        justifyContent: "flex-start",
        transition: "all 0.3s ease-in-out",
        border: `1px dashed #3154f4`,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          fill="#3154F4"
          d="M9 3.75C9.41421 3.75 9.75 4.08579 9.75 4.5V8.25H13.5C13.9142 8.25 14.25 8.58579 14.25 9C14.2499 9.4141 13.9141 9.75 13.5 9.75H9.75V13.5C9.74987 13.9141 9.41413 14.25 9 14.25C8.58595 14.2499 8.25013 13.914 8.25 13.5V9.75H4.5C4.08595 9.7499 3.75013 9.41404 3.75 9C3.75 8.58585 4.08587 8.2501 4.5 8.25H8.25V4.5C8.25 4.08585 8.58587 3.7501 9 3.75Z"
        />
      </svg>
      <Typography fontSize="16px" color="#3154f4">
        Click to add a component
      </Typography>
    </Box>
  );

  const content = React.useMemo(() => {
    switch (item.type) {
      case "text":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageText
              id={item.id}
              viewMode={viewMode}
              parent={{
                id: parentItem.id,
                type: parentItem.type as "grid" | "column",
              }}
            />
          </Box>
        );
      case "chart":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageChart
              id={item.id}
              viewMode={viewMode}
              parent={{
                id: parentItem.id,
                type: parentItem.type as "grid" | "column",
              }}
            />
          </Box>
        );
      case "table":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageTable
              id={item.id}
              viewMode={viewMode}
              parent={{
                id: parentItem.id,
                type: parentItem.type as "grid" | "column",
              }}
            />
          </Box>
        );
      case "image":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageImage
              id={item.id}
              viewMode={viewMode}
              parent={{
                id: parentItem.id,
                type: parentItem.type as "grid" | "column",
              }}
            />
          </Box>
        );
      case "kpi_box":
        return (
          <Box sx={containerSx}>
            <KPIBox
              id={item.id}
              viewMode={viewMode}
              parent={{
                id: parentItem.id,
                type: parentItem.type as "grid" | "column",
              }}
            />
          </Box>
        );
      default:
        return viewMode ? null : empty;
    }
  }, [item.type, active, viewMode, parentItem.id]);

  if (viewMode && item.type === "unknown") {
    return null;
  }

  if (item.type === "unknown") {
    return empty;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
      onClick={() => {
        if (!viewMode) {
          setSelectedController({
            id: item.id,
            type: item.type,
            open: true,
            parent: {
              id: parentItem.id,
              type: parentItem.type as "grid" | "column",
              open: false,
            },
          });
        }
      }}
    >
      {content}
    </Box>
  );
};

export const ReportBuilderPageGrid: React.FC<{
  id: string;
  columns: number;
  rows: number;
  viewMode?: boolean;
}> = ({ id, columns, rows, viewMode }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const items = useStoreState((state) => state.RBReportItemsState.items);

  const selectedItem = items.find((i) => i.id === id) as ReportItemOf<
    "grid" | "column"
  >;

  const removeItem = useStoreActions(
    (actions) => actions.RBReportItemsState.removeItem,
  );

  const handleMoreVertClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteItem = () => {
    removeItem(id);
    handleClose();
  };

  const gridReady = React.useMemo(
    () => items.some((item) => item !== null),
    [items],
  );

  const clearSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );

  useClickOutsideEditor({
    editorId: "grid-container",
    toolbarId: "rte-toolbar",
    modalId: "save-as-asset-modal",
    onOutsideClick: () => {
      clearSelectedController();
    },
  });

  return (
    <Box
      id="grid-container"
      sx={{
        width: selectedItem?.options?.width || "100%",
        height: selectedItem?.options?.height || "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        "&:hover": {
          ".top-right-actions": {
            display: "flex",
            height: "fit-content",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: `10px`,
          padding: `10px`,
          boxSizing: "border-box",
          transition: "all 0.3s ease-in-out",
          ...selectedItem?.options,
          width: "100%",
          height: "100%",
        }}
      >
        {Array.from({ length: rows * columns }).map((_, i) => {
          const item = selectedItem.data.items?.[i];

          return (
            <Box
              key={i}
              sx={{
                width: `calc(${item?.options?.width} - ${((columns - 1) * 10) / columns}px)`,
                height: `calc(${item?.options?.height} - ${((rows - 1) * 10) / rows}px)`,
                minWidth: 0,
              }}
            >
              <GridItem
                index={i}
                item={item}
                viewMode={viewMode}
                setSelectedController={setSelectedController}
                parentItem={selectedItem}
              />
            </Box>
          );
        })}
      </Box>
      {viewMode ? null : (
        <Box className="top-right-actions">
          {gridReady && (
            <React.Fragment>
              <IconButton onClick={handleMoreVertClick}>
                <MoreVert fontSize="small" />
              </IconButton>
              <ReportBuilderPageItemMenu
                itemId={id}
                anchorEl={anchorEl}
                deleteItem={handleDeleteItem}
                handleClose={() => setAnchorEl(null)}
              />
            </React.Fragment>
          )}
          {!gridReady && (
            <IconButton onClick={handleDeleteItem}>
              <Close fontSize="small" htmlColor="#ea1541" />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};
