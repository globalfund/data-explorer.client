import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { RichEditor } from "app/components/rich-text-editor";
import { useStoreActions } from "app/state/store/hooks";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

export const ReportBuilderPageText: React.FC<{
  id: string;
  focus?: boolean;
  initialKey?: string;
  viewMode?: boolean;
  parent?: {
    id: string;
    type: "grid" | "column";
  };
}> = ({ id, viewMode, parent }) => {
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const clearSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );

  const { selectedItem, editItem } = useGetReportItemState<"text">({
    id,
    parent,
  });

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
        if (parent?.id) {
          setSelectedController({
            type: "text",
            open: true,
            id,
            parent: {
              id: parent.id,
              open: false,
              type: parent.type,
            },
          });
        } else {
          setSelectedController({
            type: "text",
            open: true,
            id,
          });
        }
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
          initialContent={undefined}
          viewMode={viewMode}
          editItem={editItem}
          selectedItem={selectedItem}
          clearSelectedController={clearSelectedController}
          hasParent={!!parent?.id}
        />
      )}
    </Box>
  );
};
