export interface LineChartDataItem {
  name: string;
  data: (number | null)[];
  symbol?: "circle" | "rect" | "triangle" | "diamond";
  itemStyle?: {
    color: string;
    borderType?: "solid" | "dotted" | "dashed";
  };
  areaStyle?: {
    color: string;
    opacity?: number;
  };
}

export interface LineChartProps {
  height?: string;
  xAxisKeys: string[];
  showLegend?: boolean;
  yAxisValues?: number[];
  data: LineChartDataItem[];
  cumulativeLineValue?: number;
  xAxisSubLabels?: string[];
}

export const xAxisKeys = Array.from(
  { length: 2026 - 2017 + 1 },
  (_, i) => `${2017 + i}`,
);
