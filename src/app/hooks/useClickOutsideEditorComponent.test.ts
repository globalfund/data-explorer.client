import { fireEvent, renderHook } from "@testing-library/react";
import { useClickOutsideEditor } from "./useClickOutsideEditorComponent";

const el = (id: string) => document.getElementById(id) as HTMLElement;

beforeEach(() => {
  document.body.innerHTML = `
    <div id="main">
      <div id="chart-render"><span id="inside-chart"></span></div>
      <div id="chart-render"><span id="inside-other-chart"></span></div>
      <div id="chart-controller"><button id="inside-toolbar"></button></div>
      <div id="canvas-background"></div>
      <div id="extra"></div>
      <div class="rte-keep-open"><span id="keep-open"></span></div>
      <div class="MuiBackdrop-root" id="backdrop"></div>
    </div>
    <div class="MuiPopover-root"><li id="portal-menu-item"></li></div>
  `;
});

const setup = (extraIds?: string[]) => {
  const onOutsideClick = jest.fn();
  renderHook(() =>
    useClickOutsideEditor({
      editorId: "chart-render",
      toolbarId: "chart-controller",
      onOutsideClick,
      extraIds,
    }),
  );
  return onOutsideClick;
};

test("a click on the page outside the editor and toolbar deselects, without extraIds", () => {
  const onOutsideClick = setup();
  fireEvent.mouseDown(el("canvas-background"));
  expect(onOutsideClick).toHaveBeenCalledTimes(1);
});

test.each([
  "inside-chart",
  "inside-other-chart",
  "inside-toolbar",
  "keep-open",
  "backdrop",
  "portal-menu-item",
])("a click on %s keeps the selection", (id) => {
  const onOutsideClick = setup();
  fireEvent.mouseDown(el(id));
  expect(onOutsideClick).not.toHaveBeenCalled();
});

test("extra ids keep the selection", () => {
  const onOutsideClick = setup(["extra"]);
  fireEvent.mouseDown(el("extra"));
  expect(onOutsideClick).not.toHaveBeenCalled();
  fireEvent.mouseDown(el("canvas-background"));
  expect(onOutsideClick).toHaveBeenCalledTimes(1);
});

test("nothing happens while the controller panel is closed", () => {
  const onOutsideClick = setup();
  el("chart-controller").remove();
  fireEvent.mouseDown(el("canvas-background"));
  expect(onOutsideClick).not.toHaveBeenCalled();
});
