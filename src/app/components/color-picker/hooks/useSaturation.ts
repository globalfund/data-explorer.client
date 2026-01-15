import { useCallback, useMemo } from "react";
import { useBoundingClientRect } from "../hooks/useBoundingClientRect";
import { useInteractive } from "../hooks/useInteractive";
import { IColor } from "../types";
import { ColorService } from "../utils/color";

interface UseSaturationOptions {
  height: number;
  color: IColor;
  disabled?: boolean;
  onChange: (color: IColor) => void;
  onChangeComplete?: (color: IColor) => void;
}

export function useSaturation({
  height,
  color,
  disabled,
  onChange,
  onChangeComplete,
}: UseSaturationOptions) {
  const [ref, { width }] = useBoundingClientRect<HTMLDivElement>();

  // Compute thumb (cursor) position from HSV
  const position = useMemo(() => {
    const x = (color.hsv.s / 100) * width;
    const y = ((100 - color.hsv.v) / 100) * height;
    return { x, y };
  }, [color.hsv.s, color.hsv.v, width, height]);

  // Update HSV when dragging or interacting
  const updateColor = useCallback(
    (final: boolean, x: number, y: number) => {
      const nextColor = ColorService.convert("hsv", {
        ...color.hsv,
        s: (x / width) * 100,
        v: 100 - (y / height) * 100,
      });
      onChange(nextColor);
      if (final) onChangeComplete?.(nextColor);
    },
    [color.hsv, width, height, onChange, onChangeComplete],
  );

  // Use headless interaction logic (mouse/touch/keyboard)
  const { getProps: getInteractiveProps, ref: interactiveRef } = useInteractive(
    {
      onCoordinateChange: updateColor,
      disabled,
      axis: "both", // Saturation + Value both move in X and Y
    },
  );

  // Derived colors for UI rendering
  const hsl = useMemo(
    () => [color.hsv.h, "100%", "50%"].join(" "),
    [color.hsv.h],
  );

  const rgb = useMemo(
    () => [color.rgb.r, color.rgb.g, color.rgb.b].join(" "),
    [color.rgb.r, color.rgb.g, color.rgb.b],
  );

  return {
    ref,
    position,
    hsl,
    rgb,
    getInteractiveProps,
    height,
    interactiveRef,
  };
}
