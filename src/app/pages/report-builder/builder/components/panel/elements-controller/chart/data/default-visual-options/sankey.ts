import { IDefaultChartVisualOptions } from "../../utils";
import { charts } from "../chartsBase";
import { borderAndFillOptions, paddingOptions, titleOptions } from "./base";

const options: IDefaultChartVisualOptions = {
  ...titleOptions,
  chartTitle: {
    ...titleOptions.chartTitle,
    default: "Sankey Chart",
  },
  nodeWidth: {
    type: "slider",
    default: 15,
    label: "Node Width",
    tab: "layout",
    group: "Nodes",
  },
  nodePadding: {
    type: "slider",
    default: 10,
    label: "Node Padding",
    tab: "layout",
    group: "Nodes",
  },
  linkOpacity: {
    type: "slider",
    default: 50,
    label: "Link Opacity",
    tab: "layout",
    group: "Nodes",
  },
  chartOrientation: {
    type: "text",
    options: ["horizontal", "vertical"],
    default: "horizontal",
    label: "Orientation",
    tab: "layout",
    column: "span 1",
    group: "Nodes",
  },
  flowAlignment: {
    type: "text",
    options: ["justify", "left", "right", "center"],
    default: "justify",
    label: "Flow Alignment",
    tab: "layout",
    column: "span 1",
    group: "Nodes",
  },
  draggableNodes: {
    type: "boolean",
    default: false,
    label: "Draggable Nodes",
    tab: "layout",
    group: "Nodes",
  },
  showEdgeLabels: {
    type: "boolean",
    default: false,
    label: "Show Edge Labels",
    tab: "layout",
    group: "Labels",
  },
  showNodeLabels: {
    type: "boolean",
    default: true,
    label: "Show Node Labels",
    tab: "layout",
    group: "Labels",
  },
  labelPosition: {
    ...charts["sankey"].visualOptions.labelPosition,
    type: "text",
    label: "Label Position",
    tab: "layout",
    column: "span 1",
    group: "Labels",
    disabled: {
      showNodeLabels: false,
    },
  },
  labelRotation: {
    type: "text",
    label: "Label Rotation",
    default: "0",
    tab: "layout",
    column: "span 1",
    group: "Labels",
    disabled: {
      showNodeLabels: false,
    },
  },
  labelTextOptions: {
    tab: "layout",
    type: "advancedOptions",
    label: "Expand label text options",
    group: "Labels",
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
      showNodeLabels: false,
    },
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
