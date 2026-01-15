import { useMemo, useCallback } from "react";
import { useBoundingClientRect } from "../hooks/useBoundingClientRect";
import { useInteractive } from "../hooks/useInteractive";
import { IColor } from "../types";
import { ColorService } from "../utils/color";

interface UseHueOptions {
  color: IColor;
  disabled?: boolean;
  onChange: (color: IColor) => void;
  onChangeComplete?: (color: IColor) => void;
}

export function useHue({
  color,
  disabled,
  onChange,
  onChangeComplete,
}: UseHueOptions) {
  const [ref, { width }] = useBoundingClientRect<HTMLDivElement>();

  // Current cursor position (x coordinate on the hue bar)
  const position = useMemo(() => {
    const x = (color.hsv.h / 360) * width;
    return { x };
  }, [color.hsv.h, width]);

  const updateColor = useCallback(
    (final: boolean, x: number) => {
      const nextColor = ColorService.convert("hsv", {
        ...color.hsv,
        h: (x / width) * 360,
      });

      onChange(nextColor);
      if (final) onChangeComplete?.(nextColor);
    },
    [color.hsv, width, onChange, onChangeComplete],
  );

  const { getProps: getInteractiveProps, ref: interactiveRef } = useInteractive(
    {
      onCoordinateChange: updateColor,
      disabled,
      axis: "x", // hue only moves horizontally
    },
  );

  const hsl = useMemo(
    () => [color.hsv.h, "100%", "50%"].join(" "),
    [color.hsv.h],
  );

  return {
    ref,
    width,
    hsl,
    position,
    getInteractiveProps,
    interactiveRef,
  };
}
