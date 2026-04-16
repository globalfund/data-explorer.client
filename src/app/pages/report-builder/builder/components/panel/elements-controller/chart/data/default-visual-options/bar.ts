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
    default: "Bar Chart",
  },
  chartOrientation: {
    type: "text",
    options: ["horizontal", "vertical"],
    default: "vertical",
    label: "Orientation",
    tab: "layout",
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
    type: "colorPaletteCategorical",
    default: "default",
    label: "Color Palette",
    tab: "style",
    group: "Bar Style",
  },
  customBarWidth: {
    type: "boolean",
    default: true,
    label: "Custom Bar Width",
    tab: "style",
    group: "Bar Style",
  },
  barWidth: {
    type: "slider",
    default: 30,
    tab: "style",
    group: "Bar Style",
    disabled: {
      customBarWidth: false,
    },
  },
  ...borderAndFillOptions,
  logarithmicYAxis: {
    type: "boolean",
    default: true,
    label: "Logarithmic Y Axis",
    tab: "advanced",
  },
  realTimeSort: {
    tab: "advanced",
    type: "boolean",
    default: false,
    label: "Real-time Sort",
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
