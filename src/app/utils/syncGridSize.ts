import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && !Number.isNaN(value)) return value;

  if (typeof value === "string") {
    const parsed = parseFloat(value.replace("%", "").trim());
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
};

const toPercent = (value: number, dp = 4): string => {
  return `${Number(value.toFixed(dp))}%`;
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const round = (value: number, dp = 4) => Number(value.toFixed(dp));

const isSameNumber = (a?: number, b?: number, tolerance = 0.0001) => {
  if (a === undefined || b === undefined) return false;
  return Math.abs(a - b) < tolerance;
};

export const rebalanceDimension = (
  prev: RBReportItem[],
  next: RBReportItem[],
  key: "width" | "height",
): RBReportItem[] => {
  if (next.length === 0) return [];

  const prevMap = new Map(prev.map((item) => [item.id, item]));

  const meta = next.map((item) => {
    const prevItem = prevMap.get(item.id);

    const prevValue = toNumber(prevItem?.options?.[key]) ?? 0;
    const nextValue = toNumber(item?.options?.[key]);

    const existedBefore = !!prevItem;

    const changed =
      existedBefore &&
      nextValue !== undefined &&
      !isSameNumber(prevValue, nextValue);

    return {
      item,
      prevValue,
      nextValue: nextValue ?? prevValue,
      changed,
    };
  });

  const fixed = meta.filter((m) => m.changed);
  const flexible = meta.filter((m) => !m.changed);

  // total before
  const prevTotalFlexible = flexible.reduce((sum, m) => sum + m.prevValue, 0);

  // total after for fixed
  const fixedTotal = fixed.reduce((sum, m) => sum + clamp(m.nextValue), 0);

  const remaining = Math.max(0, 100 - fixedTotal);

  let result: RBReportItem[];

  if (prevTotalFlexible === 0) {
    // fallback → equal distribution
    const share = flexible.length > 0 ? remaining / flexible.length : 0;

    result = meta.map((m) => ({
      ...m.item,
      options: {
        ...(m.item.options ?? {}),
        [key]: toPercent(round(m.changed ? m.nextValue : share)),
      },
    }));
  } else {
    // 🔥 proportional scaling
    const scale = remaining / prevTotalFlexible;

    result = meta.map((m) => {
      const value = m.changed ? m.nextValue : m.prevValue * scale;

      return {
        ...m.item,
        options: {
          ...(m.item.options ?? {}),
          [key]: toPercent(round(clamp(value))),
        },
      };
    });
  }

  // 🔧 final correction (rounding drift)
  const total = result.reduce(
    (sum, item) => sum + (toNumber(item.options?.[key]) ?? 0),
    0,
  );

  const diff = round(100 - total);

  if (Math.abs(diff) > 0.0001 && result.length > 0) {
    const targetIndex = result.length - 1;
    const current = toNumber(result[targetIndex].options?.[key]) ?? 0;

    result[targetIndex] = {
      ...result[targetIndex],
      options: {
        ...(result[targetIndex].options ?? {}),
        [key]: toPercent(round(clamp(current + diff))),
      },
    };
  }

  return result;
};

export const syncGridSize = (
  prev: RBReportItem[],
  next: RBReportItem[],
): RBReportItem[] => {
  let result = rebalanceDimension(prev, next, "width");
  result = rebalanceDimension(prev, result, "height");
  return result;
};
