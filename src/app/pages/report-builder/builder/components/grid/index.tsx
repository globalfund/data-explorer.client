import React from "react";
import Box from "@mui/material/Box";
import { Editor } from "@tiptap/react";
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
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";

const containerSx = {
  width: "100%",
  height: "100%",
  "> div": {
    height: "100%",
    "> div": {
      height: "100%",
    },
  },
};

const GridItem: React.FC<{
  index: number;
  setActiveRTE: (id: Editor | null) => void;
  id: string;
  type: null | "text" | "chart" | "table" | "image";
  viewMode?: boolean;
}> = ({ type, setActiveRTE, id, viewMode }) => {
  const content = React.useMemo(() => {
    switch (type) {
      case "text":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageText
              id={id}
              setEditor={setActiveRTE}
              viewMode={viewMode}
            />
          </Box>
        );
      case "chart":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageChart id={id} viewMode={viewMode} />
          </Box>
        );
      case "table":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageTable id={id} viewMode={viewMode} />
          </Box>
        );
      case "image":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageImage id={id} viewMode={viewMode} />
          </Box>
        );
      default:
        return viewMode ? null : (
          <React.Fragment>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                fill="#3154F4"
                d="M9 3.75C9.41421 3.75 9.75 4.08579 9.75 4.5V8.25H13.5C13.9142 8.25 14.25 8.58579 14.25 9C14.2499 9.4141 13.9141 9.75 13.5 9.75H9.75V13.5C9.74987 13.9141 9.41413 14.25 9 14.25C8.58595 14.2499 8.25013 13.914 8.25 13.5V9.75H4.5C4.08595 9.7499 3.75013 9.41404 3.75 9C3.75 8.58585 4.08587 8.2501 4.5 8.25H8.25V4.5C8.25 4.08585 8.58587 3.7501 9 3.75Z"
              />
            </svg>
            <Typography fontSize="16px" color="#3154f4">
              Click to add a component
            </Typography>
          </React.Fragment>
        );
    }
  }, [type]);

  return viewMode && !id ? null : (
    <Box
      sx={{
        gap: "10px",
        width: "100%",
        height: "100px",
        display: "flex",
        cursor: "pointer",
        borderRadius: "4px",
        alignItems: "center",
        bgcolor: "#d6ddfd",
        flexDirection: "row",
        position: "relative",
        padding: !type ? "10px" : 0,
        justifyContent: "flex-start",
        transition: "all 0.3s ease-in-out",
        border: `1px ${!type ? "dashed" : "none"} #3154f4`,
      }}
      onClick={() => {}}
    >
      {content}
    </Box>
  );
};

export const ReportBuilderPageGrid: React.FC<{
  id: string;
  columns: number;
  rows: number;
  setEditor: (id: Editor | null) => void;
  viewMode?: boolean;
}> = ({ id, columns, rows, setEditor, viewMode }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const items = useStoreState((state) => state.RBReportItemsState.items);

  const selectedItem = items.find((i) => i.id === id) as ReportItemOf<"grid">;

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

  return (
    <Box
      sx={{
        width: "100%",
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
          gap: "10px",
          width: "100%",
          display: "grid",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "4px",
          border: viewMode ? undefined : "1px dashed #3154f4",
          transition: "all 0.3s ease-in-out",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {Array(rows * columns)
          .fill(null)
          .map((_, i) => {
            const item = selectedItem.data.items?.[i];
            return (
              <GridItem
                key={i}
                index={i}
                id={item?.id}
                type={item?.type as any}
                setActiveRTE={setEditor}
                viewMode={viewMode}
              />
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
