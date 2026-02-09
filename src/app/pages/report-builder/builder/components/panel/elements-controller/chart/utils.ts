import {
  IChartDimension,
  MappedDimension,
} from "app/state/api/action-reducers/report-builder/sync";

import BAR_OPTIONS from "../chart/data/default-visual-options/bar";
import LINE_OPTIONS from "../chart/data/default-visual-options/line";
import PIE_OPTIONS from "../chart/data/default-visual-options/pie";
import SANKEY_OPTIONS from "../chart/data/default-visual-options/sankey";
import SCATTER_OPTIONS from "../chart/data/default-visual-options/scatter";
import GEOMAP_OPTIONS from "../chart/data/default-visual-options/geomap";
import TREEMAP_OPTIONS from "../chart/data/default-visual-options/treemap";

import { charts } from "./data/chartsBase";

type OptionType =
  | "boolean"
  | "text"
  | "color"
  | "fontFamily"
  | "fontWeight"
  | "fontSize"
  | "advancedOptions"
  | "colorPaletteCategorical"
  | "colorPaletteSequential"
  | "slider";

type DisableCondition = Record<string, any>;

export interface BaseVisualOption {
  type: OptionType;
  default?: any;
  label?: string;
  tab?: string;
  group?: string;
  column?: string;
  options?: readonly string[];
  disabled?: DisableCondition;
  placeholder?: string;
  advancedOptions?: IDefaultChartVisualOptions;
}

export type IDefaultChartVisualOptions = Record<string, BaseVisualOption>;

export const DEFAULT_VISUAL_OPTIONS: Record<
  string,
  IDefaultChartVisualOptions
> = {
  bar: BAR_OPTIONS,
  line: LINE_OPTIONS,
  pie: PIE_OPTIONS,
  sankey: SANKEY_OPTIONS,
  scatter: SCATTER_OPTIONS,
  geomap: GEOMAP_OPTIONS,
  treemap: TREEMAP_OPTIONS,
};

export const getDimensions = (chartType: string): IChartDimension[] => {
  const chart = charts[chartType];
  if (!chart) return [];
  return chart.dimensions as IChartDimension[];
};

export const checkValidDimensionMapping = (
  chartType: string,
  mapping: MappedDimension | undefined,
): boolean => {
  const dimensions = getDimensions(chartType);
  if (dimensions.length === 0) return true;

  for (const dimension of dimensions) {
    if (dimension.required) {
      const mappedDimension = mapping ? mapping[dimension.id] : undefined;
      if (!mappedDimension || !mappedDimension.value) {
        return false;
      }
    }
  }
  return true;
};

export const getDefaultVisualOptions = (
  chartType: string,
): Record<string, any> => {
  const chartVisualOptions =
    DEFAULT_VISUAL_OPTIONS?.[chartType as keyof typeof DEFAULT_VISUAL_OPTIONS];
  if (!chartVisualOptions) return {};
  const defaultOptionsValues = Object.keys(chartVisualOptions).reduce(
    (acc, key) => {
      const option = chartVisualOptions[key];
      if (option.default !== undefined) {
        acc[key] = option.default;
      }
      if (!option.default && option.type === "advancedOptions") {
        Object.entries(option.advancedOptions || {}).forEach(
          ([advKey, advOption]) => {
            if (advOption.default !== undefined) {
              acc[`${key}.${advKey}`] = advOption.default;
            }
          },
        );
      }
      return acc;
    },
    {} as Record<string, any>,
  );
  return defaultOptionsValues;
};

export const getVisualOptionsToDisplay = (
  chartType: string,
): IDefaultChartVisualOptions => {
  const chartVisualOptions =
    DEFAULT_VISUAL_OPTIONS?.[chartType as keyof typeof DEFAULT_VISUAL_OPTIONS];
  if (!chartVisualOptions) return {};
  return chartVisualOptions;
};
