import { useCallback, useMemo } from "react";
import { useBoundingClientRect } from "../hooks/useBoundingClientRect";
import { useInteractive } from "../hooks/useInteractive";
import { IColor } from "../types";
import { ColorService } from "../utils/color";

interface UseAlphaOptions {
  color: IColor;
  disabled?: boolean;
  onChange: (color: IColor) => void;
  onChangeComplete?: (color: IColor) => void;
}

export function useAlpha({
  color,
  disabled,
  onChange,
  onChangeComplete,
}: UseAlphaOptions) {
  const [ref, { width }] = useBoundingClientRect<HTMLDivElement>();

  // Cursor position along X
  const position = useMemo(() => {
    const x = color.hsv.a * width;
    return { x };
  }, [color.hsv.a, width]);

  const updateColor = useCallback(
    (final: boolean, x: number) => {
      const nextColor = ColorService.convert("hsv", {
        ...color.hsv,
        a: x / width,
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
      axis: "x",
    },
  );

  const rgb = useMemo(
    () => [color.rgb.r, color.rgb.g, color.rgb.b].join(" "),
    [color.rgb.r, color.rgb.g, color.rgb.b],
  );

  const rgba = useMemo(
    () => [rgb, color.rgb.a].join(" / "),
    [rgb, color.rgb.a],
  );

  return {
    ref,
    position,
    rgb,
    rgba,
    width,
    getInteractiveProps,
    interactiveRef,
  };
}
