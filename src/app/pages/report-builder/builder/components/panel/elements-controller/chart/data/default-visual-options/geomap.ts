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
    default: "Geomap Chart",
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
  mapRoaming: {
    type: "boolean",
    default: false,
    label: "Map Roaming",
    tab: "layout",
  },
  roamOption: {
    type: "text",
    default: "scale",
    options: ["scale", "move", "both"],
    tab: "layout",
    disabled: {
      mapRoaming: false,
    },
  },
  showAntarctica: {
    type: "boolean",
    default: false,
    label: "Show Antarctica",
    tab: "layout",
  },
  scaleLimitMin: {
    type: "text",
    default: "0.5",
    label: "Min",
    tab: "layout",
    group: "Scale Limit",
    disabled: {
      mapRoaming: false,
    },
    column: "span 1",
  },
  scaleLimitMax: {
    type: "text",
    default: "2",
    label: "Max",
    group: "Scale Limit",
    tab: "layout",
    disabled: {
      mapRoaming: false,
    },
    column: "span 1",
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
    default: "700px",
    label: "Height",
    tab: "layout",
    group: "Size",
    column: "span 1",
  },
  colorPalette: {
    type: "colorPaletteSequential",
    default: "blue",
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
};

export default options;
