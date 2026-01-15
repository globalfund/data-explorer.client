import { useCallback, useEffect, useRef, useState } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";
type TooltipCoords = { top: number; left: number; height?: number };

interface UseTooltipOptions {
  hideAfter?: number; // ms
  position?: TooltipPosition;
}

export function useTooltip(options: UseTooltipOptions = {}) {
  const { hideAfter = 2000, position = "top" } = options;

  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords | null>(null);

  const anchorRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Assign anchor element
   */
  const setAnchor = useCallback((el: HTMLElement | null) => {
    anchorRef.current = el;
  }, []);

  /**
   * Compute tooltip position relative to the anchor
   */
  const computeCoords = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = rect.top - 8; // offset
        left = rect.left + rect.width / 2;
        break;

      case "bottom":
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
        break;

      case "left":
        top = rect.top + rect.height / 2;
        left = rect.right - rect.width / 2;
        break;

      case "right":
        top = rect.top + rect.height / 2;
        left = rect.right + 8;
        break;
    }

    setCoords({ top, left, height: rect.height });
  }, [position]);

  /**
   * Show tooltip
   */
  const triggerTooltip = useCallback(() => {
    computeCoords();
    setVisible(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, hideAfter);
  }, [hideAfter, computeCoords]);

  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    visible,
    coords,
    triggerTooltip,
    setAnchor,
  };
}
