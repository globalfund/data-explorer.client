import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { RichEditor } from "app/components/rich-text-editor";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";

export const ReportBuilderPageText: React.FC<{
  id: string;
  settings?: any;
  focus?: boolean;
  initialKey?: string;
  viewMode?: boolean;
}> = ({ id, settings, viewMode }) => {
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const selectedItem = items.find((i) => i.id === id) as ReportItemOf<"text">;
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
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
          },
        },
      }}
      onClick={() => {
        editItem({
          ...selectedItem,
          id,
          type: "text",
          open: true,
        });
        setSelectedController({ type: "text", open: true, id });
      }}
    >
      {!selectedItem?.open && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            padding: "10px",
            cursor: "pointer",
            borderRadius: "4px",
            flexDirection: "row",
            alignItems: "center",
            bgcolor: "#d6ddfd",
            border: "1px dashed #3154f4",
          }}
        >
          <Typography fontSize="16px" color="#3154f4">
            Click to start writing...
          </Typography>
        </Box>
      )}
      {selectedItem?.open && (
        <RichEditor
          itemId={id}
          visualSettings={settings}
          initialContent={undefined}
          viewMode={viewMode}
        />
      )}
    </Box>
  );
};
