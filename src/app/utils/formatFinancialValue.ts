export function formatFinancialValue(
  value: number | bigint,
  noCurrency?: boolean,
): string {
  if (!value) return `${!noCurrency ? "US$ " : ""}0`;
  return `${!noCurrency ? "US$ " : ""}${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatCompactNumber(value: number, decimals = 1): string {
  if (value == null || isNaN(value)) return "";

  const abs = Math.abs(value);

  const format = (num: number, suffix: string) =>
    `${parseFloat(num.toFixed(decimals))}${suffix}`;

  if (abs >= 1_000_000_000_000) {
    return format(value / 1_000_000_000_000, "T");
  }
  if (abs >= 1_000_000_000) {
    return format(value / 1_000_000_000, "B");
  }
  if (abs >= 1_000_000) {
    return format(value / 1_000_000, "M");
  }
  if (abs >= 1_000) {
    return format(value / 1_000, "K");
  }

  return value.toString();
}
