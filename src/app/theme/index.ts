import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const colors = {
  primary: {
    blue: "#002561",
    gray: "#F8F8F8",
    black: "#000000",
    white: "#FFFFFF",
    lightBlue: "#82C9F0",
    lightBlueGray: "#4F6797",
  },
  secondary: {
    blueGrayLight: "#ECF1FA",
    blueGrayDark: "#BCC6D6",
    grayDark: "#888888",
    grayLight: "#E3E3E3",
    darkBlueGray: "#4F6797",
    midnightBlue: "#013B82",
  },
  graph: {
    green: {
      900: "#475A51",
      800: "#526B5F",
      700: "#5F8070",
      600: "#6E9884",
      500: "#85AF9B",
      400: "#A4C3B4",
      300: "#BAD2C7",
      200: "#CCDDD5",
      100: "#E2ECE7",
    },
    burgundy: {
      900: "#26131C",
      800: "#2E1521",
      700: "#381727",
      600: "#44192E",
      500: "#561735",
      400: "#A52C67",
      300: "#CF4D8C",
      200: "#DB7AA9",
      100: "#E49BBE",
      50: "#EBB4CF",
    },
    sand: {
      900: "#765E4B",
      800: "#8E6E55",
      700: "#A78164",
      600: "#BB997F",
      500: "#D4B59E",
      400: "#DFC8B6",
      300: "#E7D6C8",
      200: "#EDE0D6",
      100: "#F1E8E0",
    },
    graphite: {
      900: "#060E13",
      800: "#071017",
      700: "#07131C",
      600: "#071722",
      500: "#041C2C",
      400: "#0E5F96",
      300: "#1592E5",
      200: "#4CAEEF",
      100: "#79C2F3",
      50: "#9BD1F6",
    },
    warmYellow: {
      900: "#936429",
      800: "#B4762A",
      700: "#D98B2C",
      600: "#E7A14B",
      500: "#FCBB6D",
      400: "#FDCD92",
      300: "#FDD9AD",
      200: "#FEE3C1",
      100: "#FEEAD1",
    },
    darkGreen: {
      900: "#071716",
      800: "#071D1A",
      700: "#072320",
      600: "#062B27",
      500: "#023833",
      400: "#06A595",
    },
    purple: {
      900: "#201D2C",
      800: "#252135",
      700: "#2B263F",
      600: "#322A4C",
      500: "#382D5E",
      400: "#5D4B9D",
      300: "#8272BC",
      200: "#A195CC",
      100: "#B9B0D9",
    },
    lilac: {
      900: "#635266",
      800: "#765F79",
      700: "#8C6E91",
      600: "#A186A6",
      500: "#BBA1BF",
      400: "#CCB8CF",
      300: "#D9CADB",
      200: "#E2D7E4",
      100: "#E9E1EB",
    },
    coral: {
      900: "#964835",
      800: "#B65138",
      700: "#D06448",
      600: "#E0826A",
      500: "#F4A490",
      400: "#F7BBAC",
      300: "#F9CCC1",
      200: "#FAD9D0",
      100: "#FCE2DC",
    },
    darkGrey: {
      900: "#202020",
      800: "#252525",
      700: "#2C2C2C",
      600: "#343434",
      500: "#3D3D3D",
      400: "#6D6D6D",
      300: "#929292",
      200: "#ADADAD",
      100: "#C2C2C2",
      50: "#D1D1D1",
    },
  },
  shadows: {
    main: "0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
    inner: "0px 3px 3px 0px rgba(0, 0, 0, 0.1) inset",
    section:
      "0px 1.446765661239624px 2.893531322479248px 0px rgba(97, 97, 97, 0.2)",
  },
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.blue,
    },
    secondary: {
      main: colors.secondary.blueGrayLight,
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontSize: "64px",
      fontWeight: "700",
      color: colors.primary.black,
    },
    h2: {
      fontSize: "44px",
      fontWeight: "700",
      color: colors.primary.black,
    },
    h3: {
      fontSize: "36px",
      fontWeight: "700",
      color: colors.primary.black,
    },
    h4: {
      fontSize: "24px",
      fontWeight: "700",
      color: colors.primary.black,
    },
    h5: {
      fontSize: "14px",
      fontWeight: "700",
      color: colors.primary.black,
    },
    h6: {
      fontSize: "12px",
      fontWeight: "700",
      color: colors.primary.black,
    },
    subtitle1: {
      fontSize: "16px",
      fontWeight: "700",
      color: colors.primary.black,
    },
    subtitle2: {
      fontSize: "14px",
      fontWeight: "400",
      color: colors.primary.black,
    },
    body1: {
      fontSize: "16px",
      fontWeight: "400",
      color: colors.primary.black,
    },
    body2: {
      fontSize: "14px",
      fontWeight: "400",
      color: colors.primary.black,
    },
    button: {
      fontSize: "14px",
      fontWeight: "700",
      color: colors.primary.black,
    },
    overline: {
      fontSize: "12px",
      fontWeight: "400",
      textTransform: "none",
      color: colors.primary.black,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          background: colors.primary.white,
          borderBottom: "1px solid #CFD4DA",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          height: "57px",
          display: "flex",
          flexDirection: "row",
          minHeight: "57px !important",
          justifyContent: "space-between",
          background: colors.primary.white,
          "@media (min-width: 920px)": {
            padding: 0,
          },
          "@media (max-width: 1280px)": {
            width: "100vw",
          },
          "@media (max-width: 920px)": {
            padding: "0 48px",
          },
          "@media (max-width: 768px)": {
            padding: "0 24px",
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          zIndex: 1400,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (min-width: 1200px)": {
            maxWidth: "100%",
          },
          "@media (min-width: 1440px)": {
            maxWidth: "1440px",
          },
          "@media (min-width: 1200px) and (max-width: 1490px)": {
            padding: "0 50px",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          width: "100%",
          borderRadius: 0,
          boxShadow: "none",
          borderBottom: "1px solid #CFD4DA",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: 0,
            paddingBottom: "10px",
          },
          "&:last-of-type": {
            borderBottomStyle: "none",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: 0,
          minHeight: "30px",
          maxHeight: "50px",
          flexDirection: "row",
          "&.Mui-expanded": {
            minHeight: "30px",
            maxHeight: "30px",
          },
        },
        content: {
          margin: 0,
          "&.Mui-expanded": {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          margin: 0,
          padding: 0,
          display: "flex",
          ".MuiGrid-container": {
            width: "calc(100% - 50px)",
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          padding: "4px 0",
          alignItems: "flex-start",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#000 !important",
          padding: "0 4px 0 0",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "*": {
            borderColor: colors.secondary.grayLight,
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          padding: "10px 16px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "10px 16px",
        },
        head: {
          cursor: "pointer",
          fontWeight: "700",
          textWrap: "nowrap",
          borderStyle: "none",
          position: "relative",
          color: colors.primary.blue,
        },
        body: {
          color: colors.primary.blue,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          display: "flex",
          borderStyle: "none",
          padding: "10px 16px",
          justifyContent: "flex-start",
        },
        toolbar: {
          marginLeft: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: colors.primary.black,
        },
        outlined: {
          fontWeight: "400",
          padding: "4px 12px",
          textTransform: "none",
          borderColor: "#98A1AA",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: colors.primary.white,
        },
        tooltip: {
          fontSize: "12px",
          fontWeight: "400",
          fontFamily: "Inter",
          borderRadius: "4px",
          color: colors.primary.black,
          background: colors.primary.white,
          boxShadow: "0px 2px 7px 0px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        colorPrimary: {
          color: colors.primary.black,
        },
      },
    },
  },
});

export default theme;

// COMMON
const WHITE = "#fff";
const BLACK = "#000";

const PRIMARY_COLOR_1 = "#262C34";
const PRIMARY_COLOR_2 = "#495057";

const SECONDARY_COLOR_1 = "#373D43";
const SECONDARY_COLOR_2 = "#70777E";
const SECONDARY_COLOR_3 = "#868E96";
const SECONDARY_COLOR_4 = "#98A1AA";
const SECONDARY_COLOR_5 = "#ADB5BD";
const SECONDARY_COLOR_6 = "#CFD4DA";
const SECONDARY_COLOR_7 = "#DFE3E6";
const SECONDARY_COLOR_10 = "#F5F5F7";
const SECONDARY_COLOR_11 = "#C7CDD1";
const SECONDARY_COLOR_12 = "#595c70";
const SECONDARY_COLOR_13 = "#13183F";
const SECONDARY_COLOR_14 = "#ACAFBC";
const SECONDARY_COLOR_15 = "#C4C4C4";
const SECONDARY_COLOR_17 = "#1B2127";
const SECONDARY_COLOR_18 = "#2E4063";
const SECONDARY_COLOR_19 = "#525252";

const GRAPH_COLOR_1 = "#B1BCC8";
const GRAPH_COLOR_2 = "#D7D8DD";
const GRAPH_COLOR_3 = "#F1ECEC";
const GRAPH_COLOR_4 = "#FFFFFF";
const GRAPH_COLOR_5 = "#E4EBF8";
const GRAPH_COLOR_6 = "#D9D4FA";
const GRAPH_COLOR_7 = "#C3C9EC";
const GRAPH_COLOR_8 = "#CBD1D7";
const GRAPH_COLOR_9 = "#D7D8DD";
const GRAPH_COLOR_10 = "#ECE9E9";
const GRAPH_COLOR_11 = "#F2F2F2";
const GRAPH_COLOR_12 = "#E0E5ED";
const GRAPH_COLOR_13 = "#DFDDF0";
const GRAPH_COLOR_14 = "#D4D7E9";
const GRAPH_COLOR_15 = "#FA7355";
const GRAPH_COLOR_16 = "#FA9A55";
const GRAPH_COLOR_17 = "#FFAA46";
const GRAPH_COLOR_18 = "#FFD646";
const GRAPH_COLOR_19 = "#DAFF46";
const GRAPH_COLOR_20 = "#97FF46";
const GRAPH_COLOR_21 = "#60FF46";
const GRAPH_COLOR_22 = "#73D3CD";
const GRAPH_COLOR_23 = "#11AD6B";

const CHART_COLOR_1 = "#0A2840";
const CHART_COLOR_2 = "#013E77";
const CHART_COLOR_3 = "#00B5AE";
const CHART_COLOR_4 = "#C3EDFD";
const CHART_COLOR_5 = "#D9D9D9";
const CHART_COLOR_6 = "#108E09";
const CHART_COLOR_7 = "#144BC0";
const CHART_COLOR_8 = "#06432A";
const CHART_COLOR_9 = "#008A85";
const CHART_COLOR_10 = "#007B50";

export const appColors = {
  COMMON: {
    WHITE,
    BLACK,
    PRIMARY_COLOR_1,
    PRIMARY_COLOR_2,
    SECONDARY_COLOR_1,
    SECONDARY_COLOR_2,
    SECONDARY_COLOR_3,
    SECONDARY_COLOR_4,
    SECONDARY_COLOR_5,
    SECONDARY_COLOR_6,
    SECONDARY_COLOR_7,
    SECONDARY_COLOR_10,
    SECONDARY_COLOR_11,
    SECONDARY_COLOR_12,
    SECONDARY_COLOR_13,
    SECONDARY_COLOR_14,
    SECONDARY_COLOR_15,
    SECONDARY_COLOR_17,
    SECONDARY_COLOR_18,
    SECONDARY_COLOR_19,
    COMMON_ICON_COLOR: WHITE,
    PAGE_BACKGROUND_COLOR_1: WHITE,
    PAGE_BACKGROUND_COLOR_2: SECONDARY_COLOR_10,
    SELECTED_ITEM_VALUE_COLOR: "#E2E2E2",
  },
  GRAPH_COLORS: {
    GRAPH_COLOR_1,
    GRAPH_COLOR_2,
    GRAPH_COLOR_3,
    GRAPH_COLOR_4,
    GRAPH_COLOR_5,
    GRAPH_COLOR_6,
    GRAPH_COLOR_7,
    GRAPH_COLOR_8,
    GRAPH_COLOR_9,
    GRAPH_COLOR_10,
    GRAPH_COLOR_11,
    GRAPH_COLOR_12,
    GRAPH_COLOR_13,
    GRAPH_COLOR_14,
    GRAPH_COLOR_15,
    GRAPH_COLOR_16,
    GRAPH_COLOR_17,
    GRAPH_COLOR_18,
    GRAPH_COLOR_19,
    GRAPH_COLOR_20,
    GRAPH_COLOR_21,
    GRAPH_COLOR_22,
    GRAPH_COLOR_23,
  },
  BREADCRUMBS: {
    ITEM_BUTTON_BACKGROUND_COLOR: SECONDARY_COLOR_3,
    ITEM_BUTTON_SELECTED_BACKGROUND_COLOR: PRIMARY_COLOR_2,
    ITEM_BUTTON_COLOR: WHITE,
    ITEM_ARROW_COLOR: PRIMARY_COLOR_2,
  },
  APPBAR: {
    MOBILE_HEADER_CHEVRON_ICON_COLOR: WHITE,
    DATASETS_MENU_SCROLLBAR_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    DATASETS_MENU_SCROLLBAR_TRACK_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    DATASETS_MENU_SCROLLBAR_THUMB_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    DATASETS_MENU_ITEM_COLOR: PRIMARY_COLOR_1,
    DATASETS_MENU_ITEM_BORDER_BOTTOM_COLOR: SECONDARY_COLOR_7,
    LINK_COLOR: SECONDARY_COLOR_7,
    LINK_ACTIVE_COLOR: WHITE,
    SEARCH_ICON_COLOR: PRIMARY_COLOR_1,
    SEARCH_CLOSE_ICON_COLOR: WHITE,
    SEARCH_ICON_BACKGROUND_COLOR: SECONDARY_COLOR_7,
  },
  BUDGETS_FLOW: {
    NODE_STROKE_HOVER_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_BACKGROUND_COLOR: SECONDARY_COLOR_10,
    MOBILE_TOOLTIP_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_BACKGROUND_COLOR: WHITE,
    MOBILE_TOOLTIP_CLOSE_ICON_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_DRILLDOWN_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_DRILLDOWN_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    MOBILE_TOOLTIP_DRILLDOWN_BACKGROUND_HOVER_COLOR: SECONDARY_COLOR_7,
  },
  TIME_CYCLE: {
    NODE_STROKE_HOVER_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_BACKGROUND_COLOR: SECONDARY_COLOR_10,
    MOBILE_TOOLTIP_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_BACKGROUND_COLOR: WHITE,
    MOBILE_TOOLTIP_CLOSE_ICON_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_DRILLDOWN_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_DRILLDOWN_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    MOBILE_TOOLTIP_DRILLDOWN_BACKGROUND_HOVER_COLOR: SECONDARY_COLOR_7,
    PLEDGE_COLOR: "#0A2840",
    CONTRIBUTION_COLOR: "#00B5AE",
    AXIS_COLOR: "#ADB5BD",
    X_AXIS_TEXT_COLOR: "#868E96",
    Y_AXIS_TEXT_COLOR: PRIMARY_COLOR_1,
    LEGEND_TEXT_COLOR: PRIMARY_COLOR_1,
    AXIS_GRID_COLOR: "#ADB5BD",
    AXIS_TEXT_COLOR: PRIMARY_COLOR_2,
    BAR_COLOR_1: "#0A2840",
    BAR_COLOR_2: "#013E77",
    BAR_COLOR_3: "#00B5AE",
    BAR_COLOR_4: "#C3EDFD",
    BAR_COLOR_5: "#D9D9D9",
  },
  TREEMAP: {
    TEXT_COLOR: WHITE,
    TOOLTIP_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_BACKGROUND_COLOR: SECONDARY_COLOR_10,
    TOOLTIP_BORDER_COLOR: SECONDARY_COLOR_7,
    BACKGROUND_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_PROGRESS_BAR_COLOR: SECONDARY_COLOR_1,
    TOOLTIP_PROGRESS_BAR_BACKGROUND_COLOR: SECONDARY_COLOR_11,
    MOBILE_TOOLTIP_BACKGROUND_COLOR: WHITE,
    MOBILE_NODE_BACKGROUND_COLOR: SECONDARY_COLOR_12,
    MOBILE_NODE_COLOR: WHITE,
    CHILD_NODE_COLOR: WHITE,
    NODE_COLOR: PRIMARY_COLOR_1,
    NODE_COLOR_1: "#0A2840",
    NODE_COLOR_2: "#013E77",
    NODE_COLOR_3: "#00B5AE",
    NODE_COLOR_4: "#C3EDFD",
    NODE_COLOR_5: "#F3F5F4",
    SUB_NODE_COLOR_1: "#164366",
    SUB_NODE_COLOR_2: "#0B5191",
    SUB_NODE_COLOR_3: "#18CCC5",
    SUB_NODE_COLOR_4: "#B3D7E5",
    SUB_NODE_COLOR_5: "#DDDDDD",
  },
  GEOMAP: {
    TOOLTIP_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_BACKGROUND_COLOR: SECONDARY_COLOR_10,
    TOOLTIP_BORDER_COLOR: SECONDARY_COLOR_7,
    TOOLTIP_PROGRESS_BAR_COLOR: SECONDARY_COLOR_1,
    TOOLTIP_PROGRESS_BAR_BACKGROUND_COLOR: SECONDARY_COLOR_11,
    MOBILE_TOOLTIP_BACKGROUND_COLOR: WHITE,
    LINE_COLOR: SECONDARY_COLOR_13,
    NO_DATA_LAYER_COLOR: "#F7FAFF",
    NO_DATA_BORDER_COLOR: SECONDARY_COLOR_11,
    DATA_LAYER_COLOR_1: "#CDD4DF",
    DATA_LAYER_COLOR_2: "#C0C7D2",
    DATA_LAYER_COLOR_3: "#AFB6C1",
    DATA_LAYER_COLOR_4: "#A0A7B1",
    DATA_LAYER_COLOR_5: "#939AA4",
    DATA_LAYER_COLOR_6: "#868D96",
    DATA_LAYER_COLOR_7: "#787F88",
    DATA_LAYER_COLOR_8: "#6B727B",
    DATA_LAYER_COLOR_9: "#575E67",
    DATA_LAYER_COLOR_10: "#444B53",
    DATA_LAYER_COLOR_11: "#343B43",
    DATA_LAYER_COLOR_12: PRIMARY_COLOR_1,
  },
  GRANTS: {
    DETAIL_LINK_COLOR: "#000",
    TEXT_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_BACKGROUND_COLOR: SECONDARY_COLOR_10,
    TOOLTIP_BORDER_COLOR: SECONDARY_COLOR_7,
    MOBILE_TOOLTIP_BACKGROUND_COLOR: WHITE,
    MOBILE_TOOLTIP_BUTTON_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_BUTTON_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    MOBILE_TOOLTIP_BUTTON_BACKGROUND_HOVER_COLOR: SECONDARY_COLOR_7,
    ITEM_LINE_COLOR: PRIMARY_COLOR_1,
    LATEST_RATING_COLOR_1: "#3B873E",
    LATEST_RATING_COLOR_2: "#7BC67E",
    LATEST_RATING_COLOR_3: GRAPH_COLOR_17,
    LATEST_RATING_COLOR_4: GRAPH_COLOR_16,
    LATEST_RATING_COLOR_5: GRAPH_COLOR_15,
    OUTLINE_COLOR: "#60647e",
    COMPONENT_DIVIDER_COLOR: SECONDARY_COLOR_11,
  },
  ELIGIBILITY: {
    DOT_CHART_BORDER_COLOR: SECONDARY_COLOR_14,
    ELIGIBLE_COLOR: GRAPH_COLOR_23,
    NOT_ELIGIBLE_COLOR: GRAPH_COLOR_15,
    TRANSITION_FUNDING_COLOR: GRAPH_COLOR_18,
    ITEM_BORDER_COLOR: SECONDARY_COLOR_17,
    AXIS_TEXT_COLOR: PRIMARY_COLOR_1,
    AXIS_GRID_COLOR: SECONDARY_COLOR_5,
    DISEASE_BURDEN_COLORS: [
      "#FA7355",
      "#FA9A55",
      "#ECC854",
      "#8CCD81",
      "#11AD6B",
      "#5E8A78",
    ],
  },
  NETWORK: {
    GRAPH_LINK_COLOR: SECONDARY_COLOR_7,
    ACHIEVEMENT_RATE_COLOR_1: GRAPH_COLOR_15,
    ACHIEVEMENT_RATE_COLOR_2: GRAPH_COLOR_16,
    ACHIEVEMENT_RATE_COLOR_3: GRAPH_COLOR_17,
    ACHIEVEMENT_RATE_COLOR_4: GRAPH_COLOR_18,
    ACHIEVEMENT_RATE_COLOR_5: GRAPH_COLOR_19,
    ACHIEVEMENT_RATE_COLOR_6: GRAPH_COLOR_20,
    ACHIEVEMENT_RATE_COLOR_7: GRAPH_COLOR_21,
    ACHIEVEMENT_RATE_COLOR_8: GRAPH_COLOR_23,
    EXPANDED_VIEW_SELECTOR_COLOR: PRIMARY_COLOR_1,
    TABLE_BORDER_COLOR: SECONDARY_COLOR_5,
    TABLE_ROW_COLOR: "transparent",
    TABLE_ROW_SELECTED_COLOR: SECONDARY_COLOR_6,
    EXPANDED_VIEW_TABS_LIST_SCROLLBAR_BACKGROUND_COLOR: "#ededf6",
    EXPANDED_VIEW_TABS_LIST_SCROLLBAR_TRACK_BACKGROUND_COLOR: "#ededf6",
    EXPANDED_VIEW_TABS_LIST_SCROLLBAR_THUMB_BACKGROUND_COLOR: "#2e4063",
    EXPANDED_VIEW_TAB_ITEM_COLOR: SECONDARY_COLOR_13,
    EXPANDED_VIEW_TAB_ITEM_ACTIVE_COLOR: WHITE,
    EXPANDED_VIEW_TAB_ITEM_HOVER_COLOR: WHITE,
    EXPANDED_VIEW_TAB_ITEM_BACKGROUND_COLOR: SECONDARY_COLOR_11,
    EXPANDED_VIEW_TAB_ITEM_BACKGROUND_ACTIVE_COLOR: PRIMARY_COLOR_1,
    EXPANDED_VIEW_TAB_ITEM_BACKGROUND_HOVER_COLOR: PRIMARY_COLOR_1,
    TABLE_CIRCLE_INDICATOR_BACKGROUND_COLOR:
      "repeating-linear-gradient(-45deg, #262c34 0 0.5px, #fff 1.5px 2px)",
    TOOLTIP_BUTTON_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    TOOLTIP_BUTTON_TEXT_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_CONTAINER_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_CONTAINER_BACKGROUND_COLOR_1: PRIMARY_COLOR_1,
    TOOLTIP_CONTAINER_BACKGROUND_COLOR_2: WHITE,
    TOOLTIP_BOTTOM_BUTTON_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    TOOLTIP_BOTTOM_BUTTON_TEXT_COLOR: WHITE,
    TOOLTIP_BOTTOM_BUTTON_BORDER_COLOR: WHITE,
  },
  PERFORMANCE_RATING: {
    NODE_COLOR: SECONDARY_COLOR_17,
    AXIS_COLOR: SECONDARY_COLOR_3,
    AXIS_TEXT_COLOR: PRIMARY_COLOR_1,
    AXIS_GRID_COLOR: SECONDARY_COLOR_3,
  },
  ALLOCATIONS: {
    TEXT_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_BACKGROUND_COLOR: WHITE,
    MOBILE_TOOLTIP_BORDER_COLOR: SECONDARY_COLOR_7,
    MOBILE_TOOLTIP_CLOSE_ICON_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_DRILLDOWN_COLOR: PRIMARY_COLOR_1,
    MOBILE_TOOLTIP_DRILLDOWN_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    MOBILE_TOOLTIP_DRILLDOWN_BACKGROUND_HOVER_COLOR: SECONDARY_COLOR_7,
    RADIAL_TRACK_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    RADIAL_DATA_LABELS_COLOR: PRIMARY_COLOR_1,
    RADIAL_CENTER_LABEL_HOVER_COLOR: SECONDARY_COLOR_6,
  },
  MOBILE_VIEWS_CONTROL: {
    MENU_PAPER_BORDER_COLOR: "#d3d4d5",
    MENU_SCROLLBAR_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    MENU_SCROLLBAR_TRACK_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    MENU_SCROLLBAR_THUMB_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    MENU_ITEM_BORDER_COLOR: SECONDARY_COLOR_7,
    MENU_ITEM_COLOR: PRIMARY_COLOR_1,
    BUTTON_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    BUTTON_BACKGROUND_HOVER_COLOR: SECONDARY_COLOR_7,
    LINK_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    LINK_BACKGROUND_SELECTED_COLOR: PRIMARY_COLOR_1,
    LINK_ICON_COLOR: "#868A9D",
    LINK_ICON_SELECTED_COLOR: WHITE,
    BUTTON_COLOR: SECONDARY_COLOR_7,
    BUTTON_SELECTED_COLOR: WHITE,
    BUTTON_BACKGROUND_SELECTED_COLOR: WHITE,
  },
  MOBILE_FILTER_BAR: {
    CHIP_COLOR: PRIMARY_COLOR_1,
    CHIP_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    CHIP_DELETE_BUTTON_COLOR: PRIMARY_COLOR_1,
    CONTAINER_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    LABEL_COLOR: WHITE,
    SCROLLBAR_BACKGROUND_COLOR: "#ededf6",
    SCROLLBAR_TRACK_BACKGROUND_COLOR: WHITE,
    SCROLLBAR_THUMB_BACKGROUND_COLOR: PRIMARY_COLOR_1,
  },
  TABS: {
    SCROLLBAR_BACKGROUND_COLOR: "#ededf6",
    SCROLLBAR_TRACK_BACKGROUND_COLOR: "#ededf6",
    SCROLLBAR_THUMB_BACKGROUND_COLOR: "#2e4063",
    ITEM_BACKGROUND_COLOR: SECONDARY_COLOR_11,
    ITEM_BACKGROUND_ACTIVE_COLOR: PRIMARY_COLOR_1,
    ITEM_BACKGROUND_HOVER_COLOR: PRIMARY_COLOR_1,
    LINK_COLOR: SECONDARY_COLOR_13,
    LINK_ACTIVE_COLOR: WHITE,
    LINK_HOVER_COLOR: WHITE,
  },
  PAGE_HEADER: {
    CONTAINER_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    TITLE_COLOR: PRIMARY_COLOR_1,
  },
  SEARCH: {
    CONTAINER_BACKGROUND: "#F8F8F8",
    TAB_TEXT_COLOR: PRIMARY_COLOR_1,
    TAB_BORDER_COLOR: "transparent",
    TAB_BORDER_ACTIVE_COLOR: PRIMARY_COLOR_1,
    TAB_BORDER_HOVER_COLOR: PRIMARY_COLOR_1,
    MOBILE_TAB_ACTIVE_COLOR: WHITE,
    MOBILE_TAB_ACTIVE_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    MOBILE_TAB_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    RESULTS_CONTAINER_BACKGROUND_COLOR: WHITE,
    RESULT_BORDER_COLOR: SECONDARY_COLOR_7,
    RESULT_HOVER_BACKGROUND_COLOR: BLACK,
    RESULT_HOVER_TEXT_COLOR: WHITE,
    RESULT_TEXT_COLOR: BLACK,
    CATEGORY_ICONS_COLOR: BLACK,
    DROPDOWN_BACKGROUND_COLOR: WHITE,
    DROPDOWN_SCROLLBAR_BACKGROUND_COLOR: "transparent",
    DROPDOWN_SCROLLBAR_TRACK_BACKGROUND_COLOR: "transparent",
    DROPDOWN_SCROLLBAR_THUMB_BACKGROUND_COLOR: BLACK,
    DROPDOWN_ITEM_COLOR: BLACK,
    DROPDOWN_ITEM_HOVER_COLOR: BLACK,
    DROPDOWN_ITEM_ACTIVE_COLOR: BLACK,
    DROPDOWN_ITEM_HOVER_BACKGROUND_COLOR: "#F8F9FA",
    DROPDOWN_ITEM_ACTIVE_BACKGROUND_COLOR: "#EFF1FE",
    DROPDOWN_BUTTON_BACKGROUND_COLOR: "transparent",
    DROPDOWN_BUTTON_BORDER_COLOR: "#98A1AA",
    DROPDOWN_BUTTON_TEXT_HOVER_COLOR: WHITE,
    DROPDOWN_BUTTON_BACKGROUND_HOVER_COLOR: BLACK,
    DROPDOWN_BUTTON_TEXT_COLOR: BLACK,
    CONTAINER_BORDER_COLOR: PRIMARY_COLOR_1,
    INPUT_COLOR: BLACK,
    INPUT_BACKGROUND_COLOR: "#F8F8F8",
  },
  TABLE: {
    BORDER_BOTTOM_COLOR: SECONDARY_COLOR_7,
    ROW_BACKGROUND_COLOR_1: WHITE,
    ROW_BACKGROUND_COLOR_2: SECONDARY_COLOR_10,
    ROW_BACKGROUND_HOVER_COLOR: PRIMARY_COLOR_1,
    ROW_TEXT_HOVER_COLOR: WHITE,
    ROW_TEXT_COLOR: PRIMARY_COLOR_1,
    DOWNLOAD_ICON_COLOR: PRIMARY_COLOR_2,
    TOOLBAR_BACKGROUND_COLOR: SECONDARY_COLOR_10,
    TOOLBAR_ICON_BUTTON_HOVER_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    TOOLBAR_ICON_BUTTON_HOVER_COLOR: WHITE,
    TOOLBAR_SEARCH_TEXT_COLOR: PRIMARY_COLOR_1,
    TOOLBAR_SEARCH_BACKGROUND_COLOR: WHITE,
    TOOLBAR_ICON_COLOR: PRIMARY_COLOR_1,
  },
  TOOLBOX: {
    SECTION_BORDER_BOTTOM_COLOR: SECONDARY_COLOR_7,
    FILTERS_SCROLLBAR_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    FILTERS_SCROLLBAR_TRACK_BACKGROUND_COLOR: SECONDARY_COLOR_10,
    FILTERS_SCROLLBAR_THUMB_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    VIEWS_ICON_COLOR: "#868A9D",
    VIEWS_ICON_ACTIVE_COLOR: SECONDARY_COLOR_13,
    MENU_EXPORT_BORDER_COLOR: "#d3d4d5",
    MENU_EXPORT_TEXT_COLOR: PRIMARY_COLOR_1,
    REPORTING_PERIODS_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    FILTERS_EXPANDED_GROUP_SEARCH_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    FILTERS_EXPANDED_GROUP_SEARCH_ICON_COLOR: SECONDARY_COLOR_4,
    FILTERS_EXPANDED_GROUP_SEARCH_TEXT_COLOR: PRIMARY_COLOR_1,
    FILTERS_EXPANDED_GROUP_APPLY_BUTTON_TEXT_COLOR: WHITE,
    FILTERS_EXPANDED_GROUP_APPLY_BUTTON_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    FILTER_PILL_TEXT_COLOR: PRIMARY_COLOR_1,
    FILTER_PILL_BACKGROUND_COLOR: WHITE,
    BACKGROUND_COLOR: SECONDARY_COLOR_10,
    BUTTON_COLOR: WHITE,
    BUTTON_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    BUTTON_BACKGROUND_HOVER_COLOR: SECONDARY_COLOR_13,
  },
  LOCATION: {
    OVERVIEW_VISUALISATION_COLORS: ["#727F95", "#21262B", "#595C70"],
  },
  GRANT_LIST: {
    DIVIDER: SECONDARY_COLOR_7,
    PROGRESS_BAR_COLOR: SECONDARY_COLOR_1,
    PROGRESS_BAR_BACKGROUND_COLOR: SECONDARY_COLOR_11,
    ITEM_TEXT_COLOR: PRIMARY_COLOR_1,
    ITEM_BACKGROUND_COLOR: SECONDARY_COLOR_10,
    ITEM_BACKGROUND_HOVER_COLOR: SECONDARY_COLOR_13,
    ITEM_TEXT_HOVER_COLOR: WHITE,
    SEARCH_CONTAINER_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    SEARCH_INPUT_COLOR: PRIMARY_COLOR_1,
    SEARCH_INPUT_BACKGROUND_COLOR: SECONDARY_COLOR_7,
  },
  DATASETS_GRID: {
    ITEM_TEXT_COLOR: PRIMARY_COLOR_1,
    ITEM_BACKGROUND_COLOR: WHITE,
    ITEM_BORDER_HOVER_COLOR: SECONDARY_COLOR_13,
    ICON_LINK_COLOR: "#868a9d",
    ICON_LINK_HOVER_COLOR: SECONDARY_COLOR_13,
  },
  RESULTS_LIST: {
    ITEM_TEXT_COLOR: PRIMARY_COLOR_1,
    ITEM_BACKGROUND_COLOR: SECONDARY_COLOR_10,
    ITEM_BACKGROUND_HOVER_COLOR: SECONDARY_COLOR_13,
    ITEM_TEXT_HOVER_COLOR: WHITE,
    ITEM_ACTIVE_COLOR: SECONDARY_COLOR_11,
    ITEM_ACTIVE_BORDER_COLOR: SECONDARY_COLOR_13,
    ITEM_BUTTON_UP_COLOR: WHITE,
    ITEM_BUTTON_DOWN_COLOR: PRIMARY_COLOR_1,
    ITEM_BUTTON_UP_BACKGROUND_COLOR: PRIMARY_COLOR_1,
    ITEM_BUTTON_DOWN_BACKGROUND_COLOR: "transparent",
    ITEM_BUTTON_BORDER_COLOR: SECONDARY_COLOR_7,
    LOCATION_LIST_ITEM_COLOR: WHITE,
    LOCATION_LIST_BACKGROUND_COLOR: PRIMARY_COLOR_1,
  },
  RANGE_SLIDER: {
    TRACK_BACKGROUND_COLOR: "linear-gradient(to right,#fff,#7e8a96,#0a0b0c)",
    THUMB_BOX_SHADOW_COLOR: "#AAA",
  },
  ABOUT_PAGE: {
    LINK_COLOR: "#000",
    LINK_BACKGROUND_COLOR: SECONDARY_COLOR_7,
    LINK_BORDER_COLOR: SECONDARY_COLOR_7,
  },
  HEATMAP: {
    CHART_TEXT_COLOR: BLACK,
    CHART_BG_COLOR: WHITE,
    CHART_ROW_BORDER_COLOR: "#DFE3E5",
    CHART_PERCENTAGE_COLORS: [
      "#5BA053",
      "#8CCD81",
      "#ECC854",
      "#EE5D52",
      "#DADADA",
    ],
    CHART_ELIGIBILITY_COLORS: ["#00B5AE", "#ABC7E7", "#013E77", "#CFD4DA"],
  },
  LINE_CHART: {
    AXIS_COLOR: "#6E7079",
    CHART_TEXT_COLOR: "#6E7079",
    CHART_BG_COLOR: SECONDARY_COLOR_10,
    CHART_LINE_COLORS: ["#EC1642", "#FAC858", "#5470C6", "#575757"],
    CHART_LINE_COLORS_1: [
      "#0A2840",
      "#DEE1E7",
      "#00B5AE",
      "#013E77",
      "#D9D9D9",
      "#C3EDFD",
    ],
  },
  RADIAL_CHART: {
    ITEM_COLORS: ["#0A2840", "#013E77", "#00B5AE", "#C3EDFD", "#F3F5F4"],
  },
  RADAR_CHART: {
    AXIS_NAME_COLOR: "#373D43",
    COLORS: ["#013E77", "#00B5AE"],
  },
  SANKEY_CHART: {
    NODE_COLOR: "#252C34",
    LINK_COLORS: ["#0A2840", "#013E77", "#00B5AE"],
  },
  TOOLTIP: {
    TEXT_COLOR: "#262C34",
    BORDER_COLOR: "#98A1AA",
    BACKGROUND_COLOR: WHITE,
  },
  PIE_CHART: {
    ITEM_COLORS: ["#0A2840", "#013E77", "#00B5AE", "#C3EDFD", "#F3F5F4"],
  },
  CHART_BLOCK_CYCLES: {
    BUTTON_TEXT_COLOR: BLACK,
    BUTTON_BACKGROUND_COLOR: WHITE,
    BUTTON_ACTIVE_TEXT_COLOR: BLACK,
    BUTTON_ACTIVE_BACKGROUND_COLOR: "#EFF1FE",
    BUTTON_HOVER_BACKGROUND_COLOR: "#F8F9FA",
    BUTTON_BORDER_COLOR: SECONDARY_COLOR_7,
  },
  SUNBURST: {
    ITEM_COLORS: [
      "#DEE1E7",
      "#013E77",
      "#D9D9D9",
      "#2196F3",
      "#00B5AE",
      "#C3EDFD",
      "#0A2840",
    ],
  },
  TARGETS_RESULTS: {
    PERFORMANCE_COLORS: ["#DE4A33", "#F08C31", "#F2C22C", "#368F41", "#4BB858"],
    PERCENTAGE_TEXT_COLORS: [
      "#FFFFFF",
      "#000000",
      "#000000",
      "#FFFFFF",
      "#000000",
    ],
  },
  CHART_COLORS: [
    CHART_COLOR_1,
    CHART_COLOR_2,
    CHART_COLOR_3,
    CHART_COLOR_4,
    CHART_COLOR_5,
    CHART_COLOR_6,
    CHART_COLOR_7,
    CHART_COLOR_8,
    CHART_COLOR_9,
    CHART_COLOR_10,
  ],
};
