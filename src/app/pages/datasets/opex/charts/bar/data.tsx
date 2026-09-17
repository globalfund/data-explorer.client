export interface BarChartProps {
  max?: number;
  stack?: boolean;
  data: number[][];
  colors: string[];
  xAxisKeys: string[];
  categories: string[];
  customLegends?: boolean;
  yAxisFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  itemStyle?: {
    color: (params: any) => string;
  };
}
