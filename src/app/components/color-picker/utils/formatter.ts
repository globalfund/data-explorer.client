import { IColor } from "app/components/color-picker/types";

export function isTouch<T>(
  event: any,
): event is React.TouchEvent<T> | TouchEvent {
  return "touches" in event;
}

export function clamp(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value;
}

export function isFieldHide(
  hideInput: (keyof IColor)[] | boolean,
  field: keyof IColor,
) {
  return Array.isArray(hideInput) ? hideInput.includes(field) : hideInput;
}

export function formatRgb({ r, g, b, a }: IColor["rgb"]) {
  const rgb: any[] = [Math.round(r), Math.round(g), Math.round(b)];
  const alpha = float(a, 3);

  if (alpha < 1) rgb.push(alpha);

  return rgb.join(", ");
}

export function float(value: number, decimalPlaces: number) {
  return Math.round(value * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

export function formatHsv({ h, s, v, a }: IColor["hsv"]) {
  const hsv: any[] = [
    `${Math.round(h)}°`,
    `${Math.round(s)}%`,
    `${Math.round(v)}%`,
  ];
  const alpha = float(a, 3);

  if (alpha < 1) hsv.push(alpha);

  return hsv.join(", ");
}
