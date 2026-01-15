import { Editor } from "@tiptap/react";
import { uniqueId } from "app/utils/uniqueId";
import { action, Action } from "easy-peasy";

export type RBReportItemTypes =
  | "text"
  | "chart"
  | "table"
  | "image"
  | "kpi_box"
  | "grid"
  | "column"
  | "section_divider";

export type ObjectFitTypes =
  | "contain"
  | "cover"
  | "fill"
  | "none"
  | "scale-down";
export interface RBRKPIFieldFormatting {
  value: string;
  fontFamily: string;
  fontWeight: string;
  fontWeightLabel: string;
  fontSize: string;
  fontStyle: string;
  color: string;
  bgColor: string;
  enabled: boolean;
}
export interface RBRKPIBoxField {
  topLabel?: RBRKPIFieldFormatting;
  bigNumberText?: RBRKPIFieldFormatting;
  bottomLabel?: RBRKPIFieldFormatting;
  optionalText?: RBRKPIFieldFormatting;
}
export interface RBReportItem {
  id: string;
  type: RBReportItemTypes;
  open: boolean;
  extra?: {
    focus?: boolean;
    key?: string;
    text?: {
      rte: any;
    };
    image?: {
      src?: string;
      sizingMode?: "fit-proportional" | "fill" | "crop" | "auto";
      alignVertical?: "top" | "middle" | "bottom";
      alignHorizontal?: "left" | "center" | "right";
    };
    kpi_box?: {
      field?: RBRKPIBoxField;
      options?: {
        alignVertical?: "top" | "middle" | "bottom";
        alignHorizontal?: "left" | "center" | "right";
        innerLine?: {
          type?: "line" | "box" | "simple";
          borderWidth?: string;
          borderColor?: string;
        };
      };
    };
  };
  settings?: {
    width?: string;
    height?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    borderWidth?: string;
    borderColor?: string;
    borderRadius?: string;
    borderStyle?: string;
    backgroundColor?: string;
    display?: string;
    alignItems?: string;
    justifyContent?: string;
    img?: {
      opacity?: number;
      objectFit?: ObjectFitTypes;
      width?: string;
    };
  };
}

export interface RBReportItemController {
  open: boolean;
  type: RBReportItemTypes | null;
  id: string;
}
export interface RBReportItemControllerModel {
  item: RBReportItemController | null;
  clearItem: Action<RBReportItemControllerModel>;
  setItem: Action<RBReportItemControllerModel, RBReportItemController>;
}
export interface RBReportItemsModel {
  items: RBReportItem[];
  clearItems: Action<RBReportItemsModel>;
  addItem: Action<RBReportItemsModel, RBReportItem>;
  removeItem: Action<RBReportItemsModel, string>;
  setItems: Action<RBReportItemsModel, RBReportItem[]>;
  editItem: Action<RBReportItemsModel, RBReportItem>;
  duplicateItem: Action<RBReportItemsModel, string>;
}

export interface RBReportRTEModel {
  content: string;
  setContent: Action<RBReportRTEModel, string>;
  activeRTE: Editor | null;
  setActiveRTE: Action<RBReportRTEModel, Editor | null>;
}

export interface RBReportItemOrderModel {
  isDragging: boolean;
  itemId: string | null;
  setIsDragging: Action<
    RBReportItemOrderModel,
    { isDragging: boolean; rowId: string | null }
  >;
}

export interface RBReportSettingsModel {
  width: string;
  setWidth: Action<RBReportSettingsModel, string>;
  height: string;
  setHeight: Action<RBReportSettingsModel, string>;
  vPadding: string;
  setVPadding: Action<RBReportSettingsModel, string>;
  hPadding: string;
  setHPadding: Action<RBReportSettingsModel, string>;
  stroke: string;
  setStroke: Action<RBReportSettingsModel, string>;
  strokeColor: string;
  setStrokeColor: Action<RBReportSettingsModel, string>;
  resetSettings: Action<RBReportSettingsModel>;
}

export interface RBReportNotesModel {
  value: string;
  setValue: Action<RBReportNotesModel, string>;
}

export interface RBReportTooltipModel {
  tooltip: {
    visible: boolean;
    id: string | null;
  };
  setValue: Action<
    RBReportTooltipModel,
    { visible: boolean; id: string | null }
  >;
}

export const RBReportItemsState: RBReportItemsModel = {
  items: [],
  addItem: action((state, payload) => {
    state.items.push(payload);
  }),
  removeItem: action((state, payload) => {
    state.items = state.items.filter((item) => item.id !== payload);
  }),
  setItems: action((state, payload) => {
    state.items = payload;
  }),
  clearItems: action((state) => {
    state.items = [];
  }),
  editItem: action((state, payload) => {
    const index = state.items.findIndex((item) => item.id === payload.id);
    if (index !== -1) {
      state.items[index] = payload;
    }
  }),
  duplicateItem: action((state, payload) => {
    const index = state.items.findIndex((item) => item.id === payload);
    if (index !== -1) {
      const newItem = {
        ...state.items[index],
        id: uniqueId(),
      };
      state.items.splice(index + 1, 0, newItem);
    }
  }),
};

export const RBReportItemsControllerState: RBReportItemControllerModel = {
  item: null,
  setItem: action((state, payload) => {
    state.item = payload;
  }),
  clearItem: action((state) => {
    state.item = null;
  }),
};

export const RBReportRTEState: RBReportRTEModel = {
  content: "",
  setContent: action((state, payload) => {
    state.content = payload;
  }),
  activeRTE: null,
  setActiveRTE: action((state, payload) => {
    state.activeRTE = payload;
  }),
};

export const RBReportItemOrderState: RBReportItemOrderModel = {
  itemId: null,
  isDragging: false,
  setIsDragging: action((state, payload) => {
    state.itemId = payload.rowId;
    state.isDragging = payload.isDragging;
  }),
};

export const RBReportSettings: RBReportSettingsModel = {
  width: "0",
  setWidth: action((state, payload) => {
    state.width = payload;
  }),
  height: "0",
  setHeight: action((state, payload) => {
    state.height = payload;
  }),
  vPadding: "50",
  setVPadding: action((state, payload) => {
    state.vPadding = payload;
  }),
  hPadding: "50",
  setHPadding: action((state, payload) => {
    state.hPadding = payload;
  }),
  stroke: "0",
  setStroke: action((state, payload) => {
    state.stroke = payload;
  }),
  strokeColor: "#000000",
  setStrokeColor: action((state, payload) => {
    state.strokeColor = payload;
  }),
  resetSettings: action((state) => {
    state.width = "0";
    state.height = "0";
    state.vPadding = "50";
    state.hPadding = "50";
    state.stroke = "0";
    state.strokeColor = "#000000";
  }),
};

export const RBReportNotesState: RBReportNotesModel = {
  value: "",
  setValue: action((state, payload) => {
    state.value = payload;
  }),
};

export const RBTooltipTriggerState: RBReportTooltipModel = {
  tooltip: {
    visible: false,
    id: null,
  },
  setValue: action((state, payload) => {
    state.tooltip = payload;
  }),
};
