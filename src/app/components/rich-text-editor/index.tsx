import React from "react";
import Box from "@mui/material/Box";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { extensions } from "app/components/rich-text-editor/extensions";
import { useEditor, EditorContent } from "@tiptap/react";
import { useClickOutsideEditor } from "app/hooks/useClickOutsideEditorComponent";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";

export const RichEditor: React.FC<{
  itemId: string;
  visualSettings: any;
  initialContent?: string;
  viewMode?: boolean;
}> = ({ itemId, viewMode }) => {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find(
    (i) => i.id === itemId,
  ) as ReportItemOf<"text">;

  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const clearSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );

  const setActiveRTE = useStoreActions(
    (actions) => actions.RBReportRTEState.setActiveRTE,
  );

  const active = selectedController?.id === itemId;

  const editor = useEditor({
    extensions,
    autofocus: true,
    content: selectedItem?.data?.rte || "",
    editable: !viewMode,
    onUpdate: ({ editor }) => {
      if (selectedItem) {
        editItem({
          ...selectedItem,
          data: {
            ...selectedItem.data,
            rte: editor.getJSON(),
          },
        });
      }
    },
  });

  useClickOutsideEditor({
    editorId: "rte-editor",
    toolbarId: "rte-toolbar",
    onOutsideClick: () => {
      setActiveRTE(null);
      clearSelectedItem();
    },
  });
  const setEditorStateAndController = () => {
    setActiveRTE(editor);
  };

  return (
    <Box
      sx={{
        border: viewMode ? "none" : "solid",
        borderWidth: "0.5px",
        borderColor: active ? "#3154F4" : "#98A1AA",
        borderRadius: selectedItem?.options?.borderRadius || "4px",
      }}
    >
      <Box
        id="rte-editor"
        sx={{
          ...selectedItem?.options,
          "*": { margin: "0 !important" },
          blockquote: { margin: "0 40px !important" },
        }}
        onFocus={() => setEditorStateAndController()}
        onClick={() => setEditorStateAndController()}
      >
        <EditorContent editor={editor} width="100%" />
      </Box>
    </Box>
  );
};
