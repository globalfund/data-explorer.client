import { useEffect } from "react";

interface UseClickOutsideEditorOptions {
  editorId: string;
  toolbarId: string;
  onOutsideClick: () => void;
  ignorePortalSelector?: string; // default: ".rte-keep-open"
}

export function useClickOutsideEditor({
  editorId,
  toolbarId,
  onOutsideClick,
  ignorePortalSelector = ".rte-keep-open",
}: UseClickOutsideEditorOptions) {
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const editorEls = document.querySelectorAll("#" + editorId);
      const toolbarEl = document.getElementById(toolbarId);

      if (!editorEls.length || !toolbarEl) return;

      const target = e.target as HTMLElement;

      const clickedInsideEditor = editorEls
        .entries()
        .some(([, el]) => el.contains(target));
      const clickedInsideToolbar = toolbarEl.contains(target);

      const insidePortal = !!target.closest(ignorePortalSelector);

      const isBackdrop =
        target.classList.contains("MuiBackdrop-root") ||
        target.classList.contains("MuiModal-backdrop");

      const shouldClose =
        !clickedInsideEditor &&
        !clickedInsideToolbar &&
        !insidePortal &&
        !isBackdrop;

      if (shouldClose) {
        onOutsideClick();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [editorId, toolbarId, onOutsideClick, ignorePortalSelector]);
}
