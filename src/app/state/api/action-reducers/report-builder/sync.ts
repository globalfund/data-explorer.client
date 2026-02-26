import { Editor } from "@tiptap/react";
import { action, Action } from "easy-peasy";
import { uniqueId } from "app/utils/uniqueId";

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

export type ChartType =
  | "line"
  | "bar"
  | "pie"
  | "sankey"
  | "treemap"
  | "geomap";

export type ChartProperty = "dataset" | "chartType";

export type AlignHorizontal = "left" | "center" | "right";

export type AlignVertical = "top" | "middle" | "bottom";

export interface AdvancedTextFormatting {
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
  topLabel?: AdvancedTextFormatting;
  bigNumberText?: AdvancedTextFormatting;
  bottomLabel?: AdvancedTextFormatting;
  optionalText?: AdvancedTextFormatting;
}

export interface MappedDimension {
  [key: string]: {
    value: string[];
    mappedType: string[];
    config?: {
      aggregation: string[];
    };
  };
}

type RBReportItemDataByType = {
  text: {
    rte: any;
  };

  image: {
    src?: string;
    cropCoordinates?: {
      top: number;
      left: number;
      width: number;
      height: number;
    };
  };

  kpi_box: RBRKPIBoxField;

  chart: {
    dataset?: string | null;
    chartType?: ChartType;
    mapping?: MappedDimension;
    appliedFilters?: Record<string, any[]>;
    renderedChartData?: RBRenderedChartData | null;
  };

  table: null;

  grid: {
    rows: number;
    columns: number;
    items: Record<string, RBReportItem>;
  };

  column: { columns: number; items: Record<string, RBReportItem> };

  section_divider: null;
  null: null;
};

// 2) Base fields shared by every item
type RBReportItemBase<T extends RBReportItemTypes> = {
  id: string;
  type: T;
  open: boolean;
  focus?: boolean;
  key?: string;
  options?: Record<string, any>;
};

// 3) Discriminated union: RBReportItem is now “type-aware”
export type RBReportItem = {
  [T in RBReportItemTypes]: RBReportItemBase<T> & {
    data: RBReportItemDataByType[T];
  };
}[RBReportItemTypes];

export type ReportItemOf<T extends RBReportItemTypes> = Extract<
  RBReportItem,
  { type: T }
>;

export interface RBReportItemController {
  open: boolean;
  type: RBReportItemTypes | null;
  id: string;
  parent?: {
    id: string;
    type: RBReportItemTypes | null;
  } | null;
  extra?: {
    chart?: {
      listToDisplay?: ChartProperty | null;
      showDatasetTable?: {
        datasetId: string;
        open: boolean;
      };
    };
  };
}

export interface RBReportItemControllerModel {
  item: RBReportItemController | null;
  clearItem: Action<RBReportItemControllerModel>;
  setItem: Action<RBReportItemControllerModel, RBReportItemController>;
}

export interface RBReportItemsModel {
  items: RBReportItem[];
  settings: {
    width: string;
    height: string;
    stroke: string;
    strokeColor: string;
    padding: string[];
    backgroundColor: string;
    borderRadius: string;
  };
  name: string;
  description: string;
  clearItems: Action<RBReportItemsModel>;
  addItem: Action<RBReportItemsModel, RBReportItem>;
  removeItem: Action<RBReportItemsModel, string>;
  setItems: Action<RBReportItemsModel, RBReportItem[]>;
  editItem: Action<RBReportItemsModel, RBReportItem>;
  duplicateItem: Action<RBReportItemsModel, string>;
  resetSettings: Action<RBReportItemsModel>;
  resetReport: Action<RBReportItemsModel>;
  setReport: Action<RBReportItemsModel, RBReportModel>;
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
  padding: string[];
  setPadding: Action<RBReportSettingsModel, string[]>;
  stroke: string;
  setStroke: Action<RBReportSettingsModel, string>;
  strokeColor: string;
  setStrokeColor: Action<RBReportSettingsModel, string>;
  backgroundColor: string;
  setBackgroundColor: Action<RBReportSettingsModel, string>;
  borderRadius: string;
  setBorderRadius: Action<RBReportSettingsModel, string>;
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

export interface IChartDimension {
  id: string;
  name: string;
  validTypes: string[];
  required: boolean;
  description: string;
  aggregation?: boolean;
  aggregationDefault?: string | { [key: string]: string };
  multiple?: boolean;
  minValues?: number;
}

export interface FilterGroupOptionModel {
  label: string;
  value: string;
  count?: number;
  subOptions?: FilterGroupOptionModel[];
}

export interface FilterGroupModel {
  name: string;
  options: FilterGroupOptionModel[];
}

export interface RBRenderChartDataRequest {
  chartType: ChartType | undefined;
  mapping: any;
  vizOptions: any;
  appliedFilters: any;
  datasetId: string;
}

export interface RBReportModel {
  id?: string;
  items: RBReportItem[];
  settings: RBReportItemsModel["settings"];
  name: string;
  description: string;
  updatedDate?: string;
  createdDate?: string;
}
export interface RBRenderedChartData {
  renderedContent: string;
  appliedFilters: any;
  filterOptionGroups: FilterGroupModel[];
  dataTypes: Record<string, { dateFormat: string; type: string } | string>;
  mappedData: any;
  dimensions: IChartDimension[];
  ssr: false;
}

export interface RBChartModel {
  id: string;
  name: string;
  nameLower: string;
  public: boolean;
  baseline: boolean;
  isMappingValid: boolean;
  isAIAssisted: boolean;
  vizType: string;
  datasetId: string;
  mapping: object;
  vizOptions: object;
  appliedFilters: object;
  enabledFilterOptionGroups: string[];
  owner: string;
  createdDate: string;
  updatedDate: string;
  settings: object;
}

interface IStat {
  data: { name: string; value: number }[];
  type: string;
  name: string;
}

export type DataType =
  | "string"
  | "date"
  | "number"
  | "geographical"
  | "date-time"
  | "boolean";

export interface RBSampledDatasetResponse {
  data: {
    code: number;
    result: {
      count: number;
      dataTypes: Record<
        string,
        { dateFormat: string; type: DataType } | DataType
      >;
      filterOptionGroups: string[];
      stats: IStat[];
      sample: any[];
    };
  };
}

export interface RBDatasetResponse {
  data: {
    code: number;
    result: {
      count: number;
      data: any[];
    };
  };
}

export const RBReportItemsState: RBReportItemsModel = {
  items: [],
  settings: {
    width: "0",
    height: "0",
    padding: ["50", "50", "50", "50"],
    stroke: "0",
    strokeColor: "#000000",
    backgroundColor: "#FFFFFF",
    borderRadius: "0",
  },
  name: "",
  description: "",
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
  resetSettings: action((state) => {
    state.settings = {
      width: "0",
      height: "0",
      padding: ["50", "50", "50", "50"],
      stroke: "0",
      strokeColor: "#000000",
      backgroundColor: "#FFFFFF",
      borderRadius: "0",
    };
  }),
  setReport: action((state, payload) => {
    state.settings = payload.settings;
    state.name = payload.name;
    state.description = payload.description;
    state.items = payload.items;
  }),
  resetReport: action((state) => {
    state.items = [];
    state.name = "";
    state.description = "";
    state.settings = {
      width: "0",
      height: "0",
      padding: ["50", "50", "50", "50"],
      stroke: "0",
      strokeColor: "#000000",
      backgroundColor: "#FFFFFF",
      borderRadius: "0",
    };
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
