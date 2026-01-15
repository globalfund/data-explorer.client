import React from "react";
import Box from "@mui/material/Box";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { extensions } from "app/components/rich-text-editor/extensions";
import { Editor, useEditor, EditorContent } from "@tiptap/react";
import { useClickOutsideEditor } from "app/hooks/useClickOutsideEditorComponent";

export const RichEditor: React.FC<{
  itemId: string;
  visualSettings: any;
  initialContent?: string;
  setEditor: (editor: Editor | null) => void;
}> = ({ setEditor, itemId }) => {
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find((i) => i.id === itemId);
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const clearSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );

  const editor = useEditor({
    extensions,
    autofocus: true,
    content: selectedItem?.extra?.text?.rte || "",

    onUpdate: ({ editor }) => {
      if (selectedItem) {
        editItem({
          ...selectedItem,
          extra: {
            ...selectedItem.extra,
            text: {
              rte: editor.getJSON(),
            },
          },
        });
      }
    },
  });

  useClickOutsideEditor({
    editorId: "rte-editor",
    toolbarId: "rte-toolbar",
    onOutsideClick: () => {
      setEditor(null);
      clearSelectedItem();
    },
  });
  const setEditorStateAndController = () => {
    setEditor(editor);
  };

  return (
    <Box
      id="rte-editor"
      sx={{
        ...selectedItem?.settings,
        "*": { margin: "0 !important" },
        blockquote: { margin: "0 40px !important" },
      }}
      onFocus={() => setEditorStateAndController()}
      onClick={() => setEditorStateAndController()}
    >
      <EditorContent editor={editor} width="100%" />
    </Box>
  );
};
