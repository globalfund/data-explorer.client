import React from "react";
import Box from "@mui/material/Box";
import { useStoreActions } from "app/state/store/hooks";
import { extensions } from "app/components/rich-text-editor/extensions";
import { useEditor, EditorContent } from "@tiptap/react";
import { useClickOutsideEditor } from "app/hooks/useClickOutsideEditorComponent";
import {
  RBReportItem,
  ReportItemOf,
} from "app/state/api/action-reducers/report-builder/sync";
import { ActionCreator } from "easy-peasy";

export const RichEditor: React.FC<{
  itemId: string;
  initialContent?: string;
  viewMode?: boolean;
  editItem: (payload: RBReportItem) => void;
  selectedItem: ReportItemOf<"text">;
  clearSelectedController: ActionCreator<void>;
  hasParent?: boolean;
}> = ({
  clearSelectedController,
  viewMode,
  editItem,
  selectedItem,
  hasParent,
}) => {
  const setActiveRTE = useStoreActions(
    (actions) => actions.RBReportRTEState.setActiveRTE,
  );

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
    modalId: "save-as-asset-modal",
    onOutsideClick: () => {
      setActiveRTE(null);
      clearSelectedController();
    },
  });
  const setEditorStateAndController = () => {
    setActiveRTE(editor);
  };

  return (
    <Box
      id="rte-editor"
      sx={{
        ...selectedItem?.options,
        "*": { margin: "0 !important" },
        blockquote: { margin: "0 40px !important" },
        ...(hasParent
          ? {
              width: "100%",
              height: "100%",
            }
          : {}),
      }}
      onFocus={() => setEditorStateAndController()}
      onClick={() => setEditorStateAndController()}
    >
      <EditorContent editor={editor} width="100%" style={{ width: "100%" }} />
    </Box>
  );
};
