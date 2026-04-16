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
    default: "Scatter Chart",
  },
  symbolSize: {
    type: "slider",
    default: 10,
    label: "Symbol Size",
    tab: "layout",
  },
  showDataZoom: {
    type: "boolean",
    default: true,
    label: "Show Data Zoom",
    tab: "layout",
  },
  showTrendline: {
    type: "boolean",
    default: false,
    label: "Show Trendline",
    tab: "layout",
  },
  trendlineType: {
    type: "text",
    options: ["None", "Exponential", "Linear", "Logarithmic", "Polynomial"],
    default: "Exponential",
    tab: "layout",
    disabled: {
      showTrendline: false,
    },
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
  symbolColor: {
    type: "color",
    default: "#013E77",
    label: "Symbol Color",
    tab: "style",
  },
  colorPalette: {
    type: "colorPaletteCategorical",
    default: "default",
    label: "Color Palette",
    tab: "style",
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
};

export default options;
