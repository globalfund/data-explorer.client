export interface BarChartProps {
  max?: number;
  stack?: boolean;
  data: number[][];
  colors: string[];
  xAxisKeys: string[];
  categories: string[];
  customLegends?: boolean;
  tooltipTrigger?: "axis" | "item";
  yAxisFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  tooltipFormatter?: (
    params: any,
    tooltipValueFormatter?: (value: number) => string,
  ) => string;
  itemStyle?: {
    color: (params: any) => string;
  };
}
