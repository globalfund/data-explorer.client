export interface GridItem {
  id: number;
  title: string;
  titleFontSize: number;
  subtitle: string;
  text: string;
  percentageValue?: number;
}

export const simpleFormatter = (value: number) => {
  const isNegative = value < 0;
  value = Math.abs(value);
  if (value === 0) {
    return "";
  }
  if (value >= 1e9) {
    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e9).toFixed(1)}B`.replace(
      ".0",
      "",
    );
  }
  if (value >= 1e6) {
    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e6).toFixed(1)}M`.replace(
      ".0",
      "",
    );
  }
  if (value >= 1e3) {
    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e3).toFixed(1)}K`.replace(
      ".0",
      "",
    );
  }
  return `${isNegative ? "-" : ""}$${Math.abs(value)}`;
};

export const gridItems: GridItem[] = [
  {
    id: 1,
    title: "$338.8M",
    titleFontSize: 36,
    subtitle: "2026 full-year budget",
    text: "Forecast $330.5M",
  },
  {
    id: 2,
    title: "$156.1M",
    titleFontSize: 36,
    subtitle: "Total actuals to 30 June 2026",
    text: "46% of full-year budget",
  },
  {
    id: 3,
    title: "$97.9M",
    titleFontSize: 36,
    subtitle: "Workforce actuals to 30 June 2026",
    text: "48% of $202.0M budget",
  },
  {
    id: 4,
    title: "$58.1M",
    titleFontSize: 36,
    subtitle: "Non-workforce actuals to 30 June 2026",
    text: "43% of $136.8M budget",
  },
  {
    id: 5,
    title: "+11.1%",
    titleFontSize: 24,
    subtitle: "$297.6M → $330.5M",
    text: "Growth 2017 → 2026",
  },
  {
    id: 6,
    title: "$2.85B",
    titleFontSize: 24,
    subtitle: "of $2.89B budget absorbed",
    text: "Cumulative total, 2017-25",
    percentageValue: 98.4,
  },
  {
    id: 7,
    title: "$1.55B",
    titleFontSize: 24,
    subtitle: "of $1.56B budget absorbed",
    text: "Cumulative workforce, 2017-25",
    percentageValue: 98.4,
  },
  {
    id: 8,
    title: "$1.29B ",
    titleFontSize: 24,
    subtitle: "of $1.33B budget absorbed",
    text: "Cumulative non-workforce, 2017-25",
    percentageValue: 98.4,
  },
];
