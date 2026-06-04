import { useEffect } from "react";

interface UseClickOutsideEditorOptions {
  editorId: string;
  toolbarId: string;
  modalId?: string;
  onOutsideClick: () => void;
  ignorePortalSelector?: string; // default: ".rte-keep-open"
  extraIds?: string[]; // array of additional element IDs to ignore clicks inside of
}

export function useClickOutsideEditor({
  editorId,
  toolbarId,
  modalId,
  onOutsideClick,
  ignorePortalSelector = ".rte-keep-open",
  extraIds = [],
}: UseClickOutsideEditorOptions) {
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const editorEls = document.querySelectorAll("#" + editorId);
      const toolbarEls = document.querySelectorAll("#" + toolbarId);
      const modalEl = modalId ? document.getElementById(modalId) : null;
      const extraEls = extraIds.map((id) => document.getElementById(id));

      if (!editorEls.length || !toolbarEls.length || !extraEls.length) return;

      const target = e.target as HTMLElement;

      const clickedInsideEditor = Array.from(editorEls).some((el) =>
        el.contains(target),
      );
      const clickedInsideToolbar = Array.from(toolbarEls).some((el) =>
        el.contains(target),
      );
      const clickedInsideModal = modalEl ? modalEl.contains(target) : false;
      const clickedInsideExtra = extraEls.some((el) => el?.contains(target));

      const insidePortal = !!target.closest(ignorePortalSelector);

      const isBackdrop =
        target.classList.contains("MuiBackdrop-root") ||
        target.classList.contains("MuiModal-backdrop");

      const shouldClose =
        !clickedInsideEditor &&
        !clickedInsideToolbar &&
        !clickedInsideModal &&
        !insidePortal &&
        !clickedInsideExtra &&
        !isBackdrop;

      if (shouldClose) {
        onOutsideClick();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [
    editorId,
    toolbarId,
    modalId,
    onOutsideClick,
    ignorePortalSelector,
    extraIds,
  ]);
}
