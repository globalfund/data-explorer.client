import { IDefaultChartVisualOptions } from "../../utils";
import {
  borderAndFillOptions,
  legendOptions,
  paddingOptions,
  titleOptions,
} from "./base";

const options: IDefaultChartVisualOptions = {
  minAxisRange: {
    type: "text",
    default: "0",
    label: "Min",
    tab: "layout",
    group: "Axis Range",
    column: "span 1",
  },
  maxAxisRange: {
    type: "text",
    default: "auto",
    label: "Max (auto if empty)",
    tab: "layout",
    group: "Axis Range",
    column: "span 1",
  },
  gridCircles: {
    type: "slider",
    default: 5,
    label: "Grid Circles",
    tab: "layout",
    group: "Axis Range",
  },
  startAngle: {
    type: "slider",
    default: 90,
    label: "Start Angle",
    tab: "layout",
    group: "Axis Range",
  },
  ...titleOptions,
  chartTitle: {
    ...titleOptions.chartTitle,
    default: "Radar Chart",
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
  lineTension: {
    type: "text",
    default: "straight",
    label: "Line Tension",
    options: ["straight", "curved"],
    tab: "style",
  },
  fillOpacity: {
    type: "slider",
    default: 50,
    label: "Fill Opacity",
    tab: "style",
  },
  showPointMarkers: {
    type: "boolean",
    default: true,
    label: "Show Point Markers",
    tab: "style",
  },
  colorPalette: {
    type: "colorPaletteCategorical",
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
