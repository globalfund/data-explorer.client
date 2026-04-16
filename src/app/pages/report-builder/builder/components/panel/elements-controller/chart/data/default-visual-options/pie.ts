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
    default: "Pie Chart",
  },
  showLabel: {
    type: "boolean",
    default: true,
    label: "Show Label",
    tab: "layout",
  },
  labelPosition: {
    type: "text",
    default: "outside",
    options: ["inside", "outside", "center"],
    tab: "layout",
    disabled: {
      showLabel: false,
    },
  },
  labelTextOptions: {
    tab: "layout",
    type: "advancedOptions",
    label: "Expand label text options",
    advancedOptions: {
      fontFamily: {
        type: "fontFamily",
        default: "IBM Plex Sans",
        label: "Font Family",
      },
      fontWeight: {
        type: "fontWeight",
        default: "600",
        label: "Font Weight",
        column: "span 1",
      },
      fontSize: {
        type: "fontSize",
        default: "16",
        label: "Font Size",
        column: "span 1",
      },
      textColor: {
        type: "color",
        default: "#161616",
        label: "Text Color",
        column: "span 1",
      },
      backgroundColor: {
        type: "color",
        default: "#FFFFFF",
        label: "Highlight Color",
        column: "span 1",
      },
    },
    disabled: {
      showLabel: false,
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
  drawAsDonuts: {
    type: "boolean",
    default: false,
    label: "Draw as Donuts",
    tab: "style",
  },
  donutThickness: {
    type: "slider",
    default: 50,
    tab: "style",
    label: "Donut Thickness Percentage",
    disabled: {
      drawAsDonuts: false,
    },
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
};

export default options;
