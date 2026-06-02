import { Box, Divider } from "@mui/material";
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
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const selectedItem = items.find(
    (i) => i.id === id,
  ) as ReportItemOf<"section_divider">;
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );

  const clearSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );

  useClickOutsideEditor({
    editorId: "section-divider-render",
    toolbarId: "section-divider-controller",
    modalId: "save-as-asset-modal",
    onOutsideClick: () => {
      clearSelectedItem();
    },
  });

  const {
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    borderWidth,
    borderColor,
    borderStyle,
    strokeLinecap,
    width,
  } = selectedItem?.options || {};

  return (
    <Box
      id="section-divider-render"
      sx={{
        width,
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
      }}
      onClick={() => {
        if (viewMode) return;
        editItem({
          ...selectedItem,
          id,
          type: "section_divider",
          open: true,
        });
        setSelectedController({
          id,
          type: "section_divider",
          open: true,
        });
      }}
    >
      <Divider
        sx={{
          width: "100%",
          borderWidth,
          borderStyle,
          borderColor,
          strokeLinecap,
          borderBottom: "none",
        }}
      />
    </Box>
  );
};

export default SectionDivider;
