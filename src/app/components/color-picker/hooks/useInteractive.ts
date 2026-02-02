import { useCallback } from "react";
import { clamp, isTouch } from "../utils/formatter";
import { useBoundingClientRect } from "../hooks/useBoundingClientRect";
import { IInteractiveProps, TMoveEvent, TInteractionEvent } from "../types";

interface UseInteractiveOptions extends IInteractiveProps {
  keyboardStep?: number;
  axis?: "x" | "y" | "both";
}

export function useInteractive({
  onCoordinateChange,
  disabled,
  keyboardStep = 1,
  axis = "both",
}: UseInteractiveOptions) {
  const [ref, { width, height }, getPosition] =
    useBoundingClientRect<HTMLDivElement>();

  // Store latest x,y so keyboard adjustments can reference them
  let lastCoords = { x: 0, y: 0 };

  const move = useCallback(
    (event: TMoveEvent, final = false) => {
      const { left, top } = getPosition();

      const x = clamp(event.clientX - left, 0, width);
      const y = clamp(event.clientY - top, 0, height);

      lastCoords = { x, y };
      onCoordinateChange(final, x, y);
    },
    [width, height, getPosition, onCoordinateChange],
  );

  const moveTo = useCallback(
    (x: number, y: number, final = false) => {
      x = clamp(x, 0, width);
      y = clamp(y, 0, height);
      lastCoords = { x, y };
      onCoordinateChange(final, x, y);
    },
    [width, height, onCoordinateChange],
  );

  const onStart = useCallback(
    (event: TInteractionEvent) => {
      if (disabled) return;
      if (!isTouch(event) && event.button !== 0) return;

      const onMove = (e: TInteractionEvent) => {
        move(isTouch(e) ? e.touches[0] : e);
      };

      const onEnd = (e: TInteractionEvent) => {
        move(isTouch(e) ? e.changedTouches[0] : e, true);

        document.removeEventListener(
          isTouch(e) ? "touchmove" : "mousemove",
          onMove,
        );
        document.removeEventListener(
          isTouch(e) ? "touchend" : "mouseup",
          onEnd,
        );
      };

      onMove(event);

      document.addEventListener(
        isTouch(event) ? "touchmove" : "mousemove",
        onMove,
      );
      document.addEventListener(isTouch(event) ? "touchend" : "mouseup", onEnd);
    },
    [move, disabled],
  );

  // Keyboard navigation
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      let { x, y } = lastCoords;
      let handled = true;

      switch (event.key) {
        case "ArrowUp":
          if (axis === "y" || axis === "both") y -= keyboardStep;
          break;
        case "ArrowDown":
          if (axis === "y" || axis === "both") y += keyboardStep;
          break;
        case "ArrowLeft":
          if (axis === "x" || axis === "both") x -= keyboardStep;
          break;
        case "ArrowRight":
          if (axis === "x" || axis === "both") x += keyboardStep;
          break;
        case "Enter":
        case " ":
          onCoordinateChange(true, x, y);
          break;
        default:
          handled = false;
      }

      if (handled) {
        event.preventDefault();
        moveTo(x, y);
      }
    },
    [axis, keyboardStep, disabled, moveTo, onCoordinateChange],
  );

  const getProps = useCallback(
    () => ({
      onMouseDown: onStart,
      onTouchStart: onStart,
      onKeyDown,
      tabIndex: disabled ? -1 : 0,
      role: "slider", // makes it discoverable by assistive tech
      "aria-disabled": disabled,
      "aria-valuenow": undefined, // consumer can override for specific ranges
    }),
    [onStart, onKeyDown, disabled],
  );

  return { ref, getProps, moveTo };
}
