export function formatFinancialValue(
  value: number | bigint,
  noCurrency?: boolean,
): string {
  if (!value) return `${!noCurrency ? "US$" : ""}0`;
  return `${!noCurrency ? "US$" : ""}${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
