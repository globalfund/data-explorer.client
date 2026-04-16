import { IDefaultChartVisualOptions } from "../../utils";
import {
  borderAndFillOptions,
  legendOptions,
  paddingOptions,
  titleOptions,
} from "./base";

const options: IDefaultChartVisualOptions = {
  cellSize: {
    type: "slider",
    default: 50,
    label: "Cell Size",
    tab: "layout",
  },
  cellPadding: {
    type: "slider",
    default: 50,
    label: "Cell Padding",
    tab: "layout",
  },
  sortXAxis: {
    type: "text",
    default: "ascending",
    label: "Sort X Axis",
    options: ["ascending", "descending"],
    tab: "layout",
    group: "Sorting",
    column: "span 1",
  },
  sortYAxis: {
    type: "text",
    default: "ascending",
    label: "Sort Y Axis",
    options: ["ascending", "descending"],
    tab: "layout",
    group: "Sorting",
    column: "span 1",
  },
  emptyCells: {
    type: "text",
    default: "show as zero",
    label: "Empty Cells",
    options: ["show as zero", "show as N/A", "hide"],
    tab: "layout",
    group: "Sorting",
    column: "span 1",
  },
  ...titleOptions,
  chartTitle: {
    ...titleOptions.chartTitle,
    default: "Heatmap Chart",
  },
  ...legendOptions,
  showLegend: {
    ...legendOptions.showLegend,
    tab: "layout",
  },
  legendPosition: {
    ...legendOptions.legendPosition,
    tab: "layout",
  },
  legendTextOptions: {
    ...legendOptions.legendTextOptions,
    tab: "layout",
  },
  ...paddingOptions,
  width: {
    type: "text",
    default: "100%",
    label: "Width",
    tab: "layout",
    group: "Size",
    column: "span 1",
  },
  height: {
    type: "text",
    default: "400px",
    label: "Height",
    tab: "layout",
    group: "Size",
    column: "span 1",
  },
  colorPalette: {
    type: "colorPaletteSequential",
    default: "default",
    label: "Color Palette",
    tab: "style",
    group: "Bar Style",
  },
  ...borderAndFillOptions,
  autoNormalize: {
    tab: "advanced",
    type: "boolean",
    default: false,
    label: "Auto-Normalize",
  },
  showValues: {
    tab: "advanced",
    type: "boolean",
    default: false,
    label: "Show Values",
  },
  showTooltip: {
    tab: "advanced",
    type: "boolean",
    default: true,
    label: "Show Tooltip",
  },
  monetaryValueTooltip: {
    tab: "advanced",
    type: "boolean",
    default: false,
    label: "Make tooltip monetary value",
  },
  rotateXlabels: {
    tab: "advanced",
    type: "boolean",
    default: false,
    label: "Rotate X-Labels",
  },
  truncateLongLabels: {
    tab: "advanced",
    type: "boolean",
    default: false,
    label: "Truncate long labels",
  },
};

export default options;
