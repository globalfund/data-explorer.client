export interface GridItem {
  id: number;
  title: string;
  titleFontSize: number;
  subtitle: string;
  text: string | React.ReactNode;
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

export const defaultGridItems: GridItem[] = [
  {
    id: 1,
    title: "$310.3M",
    titleFontSize: 36,
    subtitle: "Forecast landing 2026",
    text: "Total",
  },
  {
    id: 2,
    title: "$173.0M",
    titleFontSize: 36,
    subtitle: "Forecast landing 2026",
    text: "Workforce",
  },
  {
    id: 3,
    title: "$133.3M",
    titleFontSize: 36,
    subtitle: "Forecast landing 2026",
    text: "Non-workforce",
  },
  {
    id: 4,
    title: "$143.8M",
    titleFontSize: 36,
    subtitle: "Actuals to 30 June 2026",
    text: "Total",
    percentageValue: 46.3,
  },
  {
    id: 5,
    title: "$85.6M",
    titleFontSize: 36,
    subtitle: "Actuals to 30 June 2026",
    text: "Workforce",
    percentageValue: 48.4,
  },
  {
    id: 6,
    title: "$58.2M",
    titleFontSize: 36,
    subtitle: "Actuals to 30 June 2026",
    text: "Non-workforce",
    percentageValue: 43.7,
  },
];
