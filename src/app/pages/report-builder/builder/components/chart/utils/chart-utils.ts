import { formatFinancialValue } from "app/utils/formatFinancialValue";

// -------------------- reusable parsing/normalization helpers --------------------

type NumOrString = number | string | undefined | null;

/**
 * Parse a pixel-like value into a number.
 * Accepts: 12, "12", "12px", " 12.5px "
 * Rejects: "10%", "2em", "auto", etc. -> fallback
 */
export function parseCssPx(v: NumOrString, fallback: number): number {
  if (v == null) return fallback;
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;

  if (typeof v === "string") {
    const s = v.trim().toLowerCase();

    // "12" or "12px"
    const m = s.match(/^(-?\d+(\.\d+)?)(px)?$/);
    if (m) {
      const n = Number(m[1]);
      return Number.isFinite(n) ? n : fallback;
    }

    return fallback;
  }

  return fallback;
}

/**
 * For ECharts layout fields that accept:
 * - numbers (pixels)
 * - percent strings like "10%"
 * - keywords like "left", "center", "middle"
 * Also accepts "12px" and converts to 12 for convenience.
 */
export function parseEchartsLayout(
  v: NumOrString,
  fallback: number | string,
): number | string {
  if (v == null) return fallback;
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;

  if (typeof v === "string") {
    const s = v.trim();

    if (/^-?\d+(\.\d+)?%$/.test(s)) return s;

    const lower = s.toLowerCase();
    if (["left", "right", "top", "bottom", "center", "middle"].includes(lower))
      return lower;

    // numeric as px
    if (/^-?\d+(\.\d+)?$/.test(lower)) return Number(lower);

    // "12px" -> 12
    if (/^-?\d+(\.\d+)?px$/.test(lower)) return Number.parseFloat(lower);

    return fallback;
  }

  return fallback;
}

/**
 * For ECharts fontSize fields (expects a number).
 * Accepts number, "14", "14px". Rejects "1em", "100%", etc.
 */
export function parseFontSize(v: NumOrString, fallback: number): number {
  return parseCssPx(v, fallback);
}

/**
 * For ECharts barWidth: number or undefined (auto sizing).
 * Accepts number, "50", "50px". If user typed "auto" returns undefined.
 */
export function parseBarWidth(
  v: NumOrString,
  fallback?: number,
): number | undefined {
  if (v == null) return fallback;
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;

  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "auto") return undefined;
    // allow "50" / "50px"
    return parseCssPx(s, fallback ?? 0);
  }

  return fallback;
}

export function resolveLegendPosition(pos?: string) {
  switch ((pos ?? "").toLowerCase()) {
    case "top":
      return { top: 0, left: "center" as const };
    case "bottom":
      return { bottom: 0, left: "center" as const };
    case "left":
      return { left: 0, top: "middle" as const, orient: "vertical" as const };
    case "right":
      return {
        right: 0,
        top: "middle" as const,
        orient: "vertical" as const,
      };
    default:
      return { top: 0, left: "center" as const };
  }
}

// -------------------- your formatter (kept as-is) --------------------

export const valueFormatter3 = (params: any, isMonetaryValue: boolean) => {
  return `${params.name}: ${
    isMonetaryValue ? formatFinancialValue(params.value, true) : params.value
  }`;
};
