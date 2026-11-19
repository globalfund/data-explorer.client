export interface LineChart2DataItem {
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

export interface LineChart2Props {
  height?: string;
  xAxisKeys: string[];
  data: LineChart2DataItem[];
}

export const colors = [
  "#007B50",
  "#00B5AE",
  "#144BC0",
  "#C08A2D",
  "#C0567E",
  "#0A2840",
];
