import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Editor } from "@tiptap/react";
import { extensions } from "app/components/rich-text-editor/extensions";
import {
  normalisePastedHTML,
  normalisePastedSlice,
} from "app/components/rich-text-editor/paste";
import { RTEToolbar } from ".";

// Store-bound and canvas-bound children aren't under test here.
jest.mock("./align-buttons", () => () => null);
jest.mock("app/components/color-picker/example", () => ({
  ColorPicker: () => null,
}));
jest.mock("app/components/color-picker/utils/color", () => ({
  ColorService: { convert: (_format: string, value: string) => value },
}));

beforeAll(() => {
  // jsdom has no layout; ProseMirror scrolls the selection into view on paste.
  const rect = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    toJSON() {},
  };
  Range.prototype.getClientRects = () => [] as unknown as DOMRectList;
  Range.prototype.getBoundingClientRect = () => rect;
  document.elementFromPoint = () => null;
});

const setup = (clipboardHTML: string) => {
  const editor = new Editor({
    element: document.createElement("div"),
    extensions,
    editorProps: {
      transformPastedHTML: normalisePastedHTML,
      transformPasted: normalisePastedSlice,
    },
  });
  // jsdom has no ClipboardEvent, which pasteHTML would otherwise construct.
  editor.view.pasteHTML(clipboardHTML, new Event("paste") as ClipboardEvent);
  const select = (word: string) => {
    let from = -1;
    editor.state.doc.descendants((node, pos) => {
      if (from === -1 && node.text?.includes(word)) {
        from = pos + node.text.indexOf(word);
      }
    });
    act(() => {
      editor.commands.setTextSelection({ from, to: from + word.length });
    });
  };
  render(<RTEToolbar editor={editor} />);
  return { editor, select, weight: () => screen.getByLabelText("Weight") };
};
test("pasted <strong> shows as bold in the Weight dropdown", () => {
  const { select, weight } = setup(
    `<p><strong>BoldWord</strong> plainword</p>`,
  );
  select("BoldWord");
  expect(weight()).toHaveValue("Extra Bold");
  select("plainword");
  expect(weight()).toHaveValue("Light");
});
test.each([
  ["500", "Medium"],
  ["600", "Bold"],
  ["700", "Extra Bold"],
])(
  "pasted inline font-weight %s shows as %s without an extra <strong>",
  (fontWeight, label) => {
    const { editor, select, weight } = setup(
      `<p><span style="font-weight:${fontWeight}">BoldWord</span> plainword</p>`,
    );
    select("BoldWord");
    expect(weight()).toHaveValue(label);
    expect(editor.getHTML()).not.toContain("<strong>");
  },
);
test("pasted bold italic tracks italic changes in the Weight dropdown", () => {
  const { select, weight } = setup(
    `<p><strong><em>BoldWord</em></strong><strong> plainword</strong></p>`,
  );
  select("BoldWord");
  expect(weight()).toHaveValue("Extra Bold Italic");
  select("plainword");
  expect(weight()).toHaveValue("Extra Bold");
});
test("choosing a weight removes a pasted bold mark", async () => {
  const { editor, select, weight } = setup(
    `<p><strong>BoldWord</strong> plainword</p>`,
  );
  select("BoldWord");
  await userEvent.click(weight());
  await userEvent.click(screen.getByRole("option", { name: "Light" }));
  expect(editor.getHTML()).not.toContain("<strong>");
  expect(weight()).toHaveValue("Light");
});
test("Google Docs paste keeps plain text plain", () => {
  const { editor, select, weight } = setup(
    `<meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-abc"><p><span style="font-size:11pt">plainword</span></p></b>`,
  );
  select("plainword");
  expect(editor.getHTML()).not.toContain("<strong>");
  expect(weight()).toHaveValue("Light");
});
