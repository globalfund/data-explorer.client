import { IDefaultChartVisualOptions } from "../../utils";

export const titleOptions: IDefaultChartVisualOptions = {
  showChartName: {
    type: "boolean",
    default: true,
    label: "Show Chart Name",
    tab: "layout",
  },
  // Edited on the chart itself and in the Data Settings tab, not with the
  // generic options, so neither has a tab. The title follows the chart's data
  // (see chart/title/chart-title.ts) until the author writes their own.
  chartTitle: {
    type: "text",
    default: "",
  },
  chartTitleAuto: {
    type: "boolean",
    default: true,
  },
  chartTitleOptions: {
    tab: "layout",
    type: "advancedOptions",
    label: "Expand chart title text options",
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
      position: {
        type: "text",
        options: ["top", "bottom"],
        default: "top",
        label: "Position",
        column: "span 1",
      },
      align: {
        type: "text",
        options: ["left", "center", "right"],
        default: "left",
        label: "Alignment",
        column: "span 1",
      },
    },
    disabled: {
      showChartName: false,
    },
  },
};

export const legendOptions: IDefaultChartVisualOptions = {
  showLegend: {
    type: "boolean",
    default: true,
    label: "Show Legend",
    tab: "layout",
  },
  legendPosition: {
    type: "text",
    options: ["top", "bottom"],
    default: "bottom",
    tab: "layout",
    disabled: {
      showLegend: false,
    },
  },
  legendTextOptions: {
    type: "advancedOptions",
    label: "Expand legend text options",
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
        default: "12",
        label: "Font Size",
        column: "span 1",
      },
      textColor: {
        type: "color",
        default: "#6F6F6F",
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
      showLegend: false,
    },
    tab: "layout",
  },
};

export const paddingOptions: IDefaultChartVisualOptions = {
  paddingLeft: {
    type: "number",
    default: "10px",
    label: "{arrowLeft} Left",
    tab: "layout",
    group: "Padding",
    column: "span 1",
  },
  paddingTop: {
    type: "number",
    default: "10px",
    label: "{arrowUp} Top",
    tab: "layout",
    group: "Padding",
    column: "span 1",
  },
  paddingRight: {
    type: "number",
    default: "10px",
    label: "{arrowRight} Right",
    tab: "layout",
    group: "Padding",
    column: "span 1",
  },
  paddingBottom: {
    type: "number",
    default: "10px",
    label: "{arrowDown} Bottom",
    tab: "layout",
    group: "Padding",
    column: "span 1",
  },
};

export const borderAndFillOptions: IDefaultChartVisualOptions = {
  strokeWidth: {
    type: "number",
    default: "0px",
    label: "Stroke",
    tab: "style",
    group: "Border & Fill",
    column: "span 1",
  },
  strokeColor: {
    type: "color",
    default: "#000000",
    label: "Stroke Color",
    tab: "style",
    group: "Border & Fill",
    column: "span 1",
  },
  cornerRadius: {
    type: "number",
    default: "0px",
    label: "Corner Radius",
    tab: "style",
    group: "Border & Fill",
    column: "span 1",
  },
  background: {
    type: "color",
    default: "#FFFFFF",
    label: "Background",
    tab: "style",
    group: "Border & Fill",
    column: "span 1",
  },
};
