import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useStoreActions } from "app/state/store/hooks";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

export const ReportBuilderPageTable: React.FC<{
  id: string;
  extRemoveItem?: (e: React.MouseEvent) => void;
  viewMode?: boolean;
  parent?: {
    id: string;
    type: "grid" | "column";
  };
}> = ({ id, viewMode, parent }) => {
  const { selectedItem, editItem } = useGetReportItemState<"table">({
    id,
    parent,
  });
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
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
    >
      <Box
        sx={{
          gap: "10px",
          width: "100%",
          display: "flex",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "4px",
          alignItems: "center",
          bgcolor: "#d6ddfd",
          flexDirection: "column",
          justifyContent: "center",
          border: "1px dashed #3154f4",
          transition: "all 0.3s ease-in-out",
          height: "330px",
        }}
        onClick={() => {
          if (!viewMode) {
            editItem({
              ...selectedItem,
              id,
              type: "table",
              open: true,
            });
            if (parent?.id) {
              setSelectedController({
                type: "table",
                open: true,
                id,
                parent: {
                  id: parent.id,
                  type: parent.type,
                  open: false,
                },
              });
            } else {
              setSelectedController({
                type: "table",
                open: true,
                id,
              });
            }
          }
        }}
      >
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
          <path
            d="M12 3.5V21.5M3 9.5H21M3 15.5H21M5 3.5H19C20.1046 3.5 21 4.39543 21 5.5V19.5C21 20.6046 20.1046 21.5 19 21.5H5C3.89543 21.5 3 20.6046 3 19.5V5.5C3 4.39543 3.89543 3.5 5 3.5Z"
            stroke="#3154F4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Typography fontSize="16px" color="#3154f4">
          Click to add a table
        </Typography>
      </Box>
    </Box>
  );
};
