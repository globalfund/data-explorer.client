const locale = "en-US";

export function formatLocale(value: number | bigint): string {
  if (!value) return "";
  return `US$${Number(value)
    .toLocaleString(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace("$", "")}`;
}

export function formatLocaleN(value: number | bigint): string {
  if (!value) return "0";
  return Number(value).toLocaleString(locale);
}
