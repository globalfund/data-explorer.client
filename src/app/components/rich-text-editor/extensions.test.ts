import { Editor } from "@tiptap/core";
import { extensions } from "./extensions";
import { normalisePastedHTML, normalisePastedSlice } from "./paste";

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

const setup = (content = "") =>
  new Editor({
    element: document.createElement("div"),
    extensions,
    content,
    editorProps: {
      transformPastedHTML: normalisePastedHTML,
      transformPasted: normalisePastedSlice,
    },
  });
const blocks = (editor: Editor) => {
  const names: string[] = [];
  editor.state.doc.forEach((node) => names.push(node.type.name));
  return names;
};
test("pasting a bold heading doesn't leave an empty line after it", () => {
  const editor = setup();
  // jsdom has no ClipboardEvent, which pasteHTML would otherwise construct.
  editor.view.pasteHTML(
    `<meta charset='utf-8'><h1 style="font-weight: 700;">Bold title</h1>`,
    new Event("paste") as ClipboardEvent,
  );
  expect(blocks(editor)).toEqual(["heading"]);
});
test("applying the Title style doesn't add an empty line after it", () => {
  const editor = setup("<p>Report title</p>");
  editor.commands.setTextSelection(2);
  editor.commands.setHeading({ level: 10 as 1 });
  expect(blocks(editor)).toEqual(["heading"]);
});
test("Enter at the end of a heading still starts a new paragraph", () => {
  const editor = setup("<h1>Bold title</h1>");
  editor.commands.setTextSelection(editor.state.doc.content.size - 1);
  editor.commands.keyboardShortcut("Enter");
  expect(blocks(editor)).toEqual(["heading", "paragraph"]);
});
