import { IColor } from "../types";

/**
 * Utility function to clamp a number between a minimum and maximum value.
 */
const clamp = (num: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, num));

// --- Color Utility Functions ---

/**
 * Converts a color value of any model (hex, rgb, or hsv) into a complete IColor object
 * containing all three representations.
 * @param model The color model of the input color (e.g., 'hex', 'rgb').
 * @param color The color value based on the specified model.
 * @returns A complete IColor object.
 */
export function convert<M extends keyof IColor, C extends IColor[M]>(
  model: M,
  color: C,
): IColor {
  let hex: IColor["hex"] = toHex("#000000");
  let rgb: IColor["rgb"] = hex2rgb(hex);
  let hsv: IColor["hsv"] = rgb2hsv(rgb);
  if (model === "hex") {
    const value = color as IColor["hex"];

    hex = toHex(value);
    rgb = hex2rgb(hex);

    if (hex.startsWith("rgba")) {
      rgb = toRgb(hex);
      hex = rgb2hex(rgb);
    }

    hsv = rgb2hsv(rgb);
  } else if (model === "rgb") {
    const value = color as IColor["rgb"];

    rgb = value;
    hex = rgb2hex(rgb);
    hsv = rgb2hsv(rgb);
  } else if (model === "hsv") {
    const value = color as IColor["hsv"];

    hsv = value;
    rgb = hsv2rgb(hsv);
    hex = rgb2hex(rgb);
  }

  return { hex, rgb, hsv };
}

/**
 * Ensures the input string is a valid hex color format.
 * Can handle named colors (using a canvas context temporarily) and shorthand hex codes.
 * @param value The raw color string (named, short hex, or full hex).
 * @returns A normalized hex string (e.g., "#RRGGBB").
 */
export function toHex(value: string): IColor["hex"] {
  if (!value?.startsWith("#")) {
    // Attempt to convert named color to hex using canvas context
    const ctx = document.createElement("canvas").getContext("2d");

    if (!ctx)
      throw new Error("2d context not supported or canvas already initialized");

    ctx.fillStyle = value;

    return ctx.fillStyle;
  } else if (value.length === 4 || value.length === 5) {
    // Convert shorthand hex (e.g., #f0c) to full hex (e.g., #ff00cc)
    value = value
      .split("")
      .map((v, i) =>
        i ? (i < 4 ? v + v : v === "f" ? undefined : v + v) : "#",
      )
      .join("");

    return value;
  } else if (value.length === 7) {
    // #RRGGBB
    return value;
  } else if (value.length === 9) {
    // #RRGGBBAA - if alpha is 'ff', slice it off
    return value.endsWith("ff") ? value.slice(0, 7) : value;
  }

  return "#000000";
}

/**
 * Parses an RGB or RGBA string (e.g., "rgb(255, 0, 128, 0.5)") into an RGB object.
 * Clamps values to the expected ranges.
 * @param value The CSS color string.
 * @returns An RGB color object.
 */
export function toRgb(value: string): IColor["rgb"] {
  const rgb: string[] = value.match(/\d+(\.\d+)?/gu) ?? [];

  const [r, g, b, a] = Array.from({ length: 4 }).map((_, i) =>
    clamp(+(rgb[i] ?? (i < 3 ? 0 : 1)), 0, i < 3 ? 255 : 1),
  );

  return { r, g, b, a };
}

/**
 * Parses an HSV or HSVA string (e.g., "hsv(180, 50%, 50%, 0.8)") into an HSV object.
 * Clamps values to the expected ranges.
 * @param value The HSV color string.
 * @returns An HSV color object.
 */
export function toHsv(value: string): IColor["hsv"] {
  const hsv: string[] = value.match(/\d+(\.\d+)?/gu) ?? [];

  // h (0-360), s (0-100), v (0-100), a (0-1)
  const [h, s, v, a] = Array.from({ length: 4 }).map((_, i) =>
    clamp(+(hsv[i] ?? (i < 3 ? 0 : 1)), 0, i ? (i < 3 ? 100 : 1) : 360),
  );

  return { h, s, v, a };
}

/**
 * Converts a hex string (e.g., "#FF0080") to an RGB object.
 * @param hex The hex color string.
 * @returns An RGB color object.
 */
export function hex2rgb(hex: IColor["hex"]): IColor["rgb"] {
  hex = hex.slice(1);

  // eslint-disable-next-line prefer-const
  let [r, g, b, a] = Array.from({ length: 4 }).map((_, i) =>
    parseInt(hex.slice(i * 2, i * 2 + 2), 16),
  );

  // If alpha is NaN (i.e., short hex #RRGGBB), default to 1
  a = Number.isNaN(a) ? 1 : a / 255;

  return { r, g, b, a };
}

/**
 * Converts an RGB object to an HSV object.
 * @param rgb The RGB color object.
 * @returns An HSV color object.
 */
export function rgb2hsv({ r, g, b, a }: IColor["rgb"]): IColor["hsv"] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h: number;
  if (d) {
    if (max === r) {
      h = (g - b) / d;
      if (g < b) {
        h += 6;
      }
      h *= 60;
    } else if (max === g) {
      h = 2 + (b - r) / d;
      h *= 60;
    } else {
      h = 4 + (r - g) / d;
      h *= 60;
    }
  } else {
    h = 0;
  }
  const s = max ? (d / max) * 100 : 0;
  const v = max * 100;

  return { h, s, v, a };
}

/**
 * Converts an HSV object to an RGB object.
 * @param hsv The HSV color object.
 * @returns An RGB color object.
 */
export function hsv2rgb({ h, s, v, a }: IColor["hsv"]): IColor["rgb"] {
  s /= 100;
  v /= 100;

  const i = Math.trunc(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));
  const index = i % 6;

  const r = [v, q, p, p, t, v][index] * 255;
  const g = [t, v, v, q, p, p][index] * 255;
  const b = [p, p, t, v, v, q][index] * 255;

  return { r, g, b, a };
}

/**
 * Converts an RGB object to a hex string. Uses #RRGGBB format if alpha is 1,
 * otherwise uses #RRGGBBAA format.
 * @param rgb The RGB color object.
 * @returns A hex color string.
 */
export function rgb2hex({ r, g, b, a }: IColor["rgb"]): IColor["hex"] {
  const [rr, gg, bb, aa] = [r, g, b, a].map((v, i) =>
    Math.round(i < 3 ? v : v * 255)
      .toString(16)
      .padStart(2, "0"),
  );

  return ["#", rr, gg, bb, aa === "ff" ? undefined : aa].join("");
}

/**
 * The final exported utility object, mimicking the original class instance export.
 */
export const ColorService = {
  convert,
  toHex,
  toRgb,
  toHsv,
  hex2rgb,
  rgb2hsv,
  hsv2rgb,
  rgb2hex,
};
