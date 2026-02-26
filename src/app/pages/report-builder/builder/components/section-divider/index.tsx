import { Close } from "@mui/icons-material";
import { Box, Divider, IconButton } from "@mui/material";
import { useClickOutsideEditor } from "app/hooks/useClickOutsideEditorComponent";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import React from "react";

interface Props {
  id: string;
  viewMode?: boolean;
}

const SectionDivider = ({ id, viewMode }: Readonly<Props>) => {
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const selectedItem = items.find(
    (i) => i.id === id,
  ) as ReportItemOf<"section_divider">;

  console.log(
    selectedItem,
    selectedItemController,
    setSelectedController,
    viewMode,
  );

  const removeItem = useStoreActions(
    (actions) => actions.RBReportItemsState.removeItem,
  );

  const clearSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );

  useClickOutsideEditor({
    editorId: "section-divider-render",
    toolbarId: "section-divider-controller",
    onOutsideClick: () => {
      clearSelectedItem();
    },
  });
  return (
    <Box
      id="section-divider-render"
      sx={{
        width: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        ".top-right-actions": {
          top: -19,
          right: -45,
          display: "flex",
          height: "fit-content",
        },
      }}
    >
      <Divider key={id} flexItem />
      <Box className="top-right-actions">
        <IconButton onClick={() => removeItem(id)}>
          <Close fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SectionDivider;
