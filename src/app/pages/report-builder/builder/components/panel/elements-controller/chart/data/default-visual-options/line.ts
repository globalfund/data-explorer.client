import { IDefaultChartVisualOptions } from "../../utils";
import {
  borderAndFillOptions,
  legendOptions,
  paddingOptions,
  titleOptions,
} from "./base";

const options: IDefaultChartVisualOptions = {
  ...titleOptions,
  chartTitle: {
    ...titleOptions.chartTitle,
    default: "Line Chart",
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
  lineWidth: {
    type: "text",
    default: "2",
    label: "Line Width",
    tab: "style",
    group: "Line Style",
    column: "span 1",
  },
  lineType: {
    type: "text",
    default: "solid",
    options: ["solid", "dashed", "dotted"],
    tab: "style",
    label: "Line Type",
    group: "Line Style",
    column: "span 1",
  },
  smoothLine: {
    type: "boolean",
    default: false,
    label: "Smooth Line",
    tab: "style",
    group: "Line Style",
  },
  colorPalette: {
    type: "colorPaletteCategorical",
    default: "default",
    label: "Color Palette",
    tab: "style",
    group: "Line Style",
  },
  ...borderAndFillOptions,
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
  customYAxisName: {
    tab: "advanced",
    label: "Custom Y Axis Name",
    type: "boolean",
    default: false,
  },
  yAxisName: {
    tab: "advanced",
    type: "text",
    default: "",
    placeholder: "(default axis name here)",
  },
  customXAxisName: {
    tab: "advanced",
    label: "Custom X Axis Name",
    type: "boolean",
    default: false,
  },
  xAxisName: {
    tab: "advanced",
    type: "text",
    default: "",
    placeholder: "(default axis name here)",
  },
};

export default options;
