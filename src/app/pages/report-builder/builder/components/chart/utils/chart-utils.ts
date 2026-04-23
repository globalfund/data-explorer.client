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

// -------------------- your formatter (kept as-is) --------------------

export const valueFormatter3 = (params: any, isMonetaryValue: boolean) => {
  return `${params.name}: ${
    isMonetaryValue ? formatFinancialValue(params.value, true) : params.value
  }`;
};

type LegendItem = {
  name: string;
  color: string;
};

export function generateHeatmapLegends(
  data: { size: number }[],
  paletteColors: string[],
  options?: {
    suffix?: string; // e.g. "%"
    decimals?: number; // rounding precision
    includeNA?: boolean;
    includeOutlier?: boolean;
    outlierThreshold?: number;
  },
): LegendItem[] {
  const {
    suffix = "",
    decimals = 0,
    includeNA = true,
    includeOutlier = true,
    outlierThreshold = 1.2, // 120%
  } = options || {};

  const values = data.map((d) => d.size).filter((v) => typeof v === "number");

  if (!values.length) return [];

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  if (maxValue === minValue) {
    return [
      {
        name: `${maxValue.toFixed(decimals)}${suffix}`,
        color: paletteColors[Math.floor(paletteColors.length / 2)] || "#FFFFFF",
      },
    ];
  }

  const bucketCount = paletteColors.length;
  const step = (maxValue - minValue) / bucketCount;

  const legends: LegendItem[] = [];

  for (let i = 0; i < bucketCount; i++) {
    const start = minValue + step * i;
    const end = minValue + step * (i + 1);

    const formattedStart = start.toFixed(decimals);
    const formattedEnd = end.toFixed(decimals);

    let label: string;

    if (i === 0) {
      label = `< ${formattedEnd}${suffix}`;
    } else if (i === bucketCount - 1) {
      label = `> ${formattedStart}${suffix}`;
    } else {
      label = `${formattedStart}${suffix} - ${formattedEnd}${suffix}`;
    }

    legends.push({
      name: label,
      color: paletteColors[i],
    });
  }

  // Optional outlier
  if (includeOutlier) {
    legends.push({
      name: `> ${(maxValue * outlierThreshold).toFixed(decimals)}${suffix} outlier`,
      color: "#DADADA",
    });
  }

  // Optional N/A
  if (includeNA) {
    legends.push({
      name: "N/A",
      color: "#FFFFFF",
    });
  }

  return legends;
}
