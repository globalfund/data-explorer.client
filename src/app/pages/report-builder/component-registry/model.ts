import {
  RBReportItem,
  RBReportItemTypes,
  ReportItemOf,
} from "app/state/api/action-reducers/report-builder/sync";
import { uniqueId } from "app/utils/uniqueId";
import { DEFAULT_TABLE_OPTIONS } from "../builder/components/table/options";

export type CreatableReportItemType = Exclude<RBReportItemTypes, "unknown">;

export interface CreateReportItemOptions {
  id?: string;
  context?: "report" | "grid";
  initialized?: boolean;
  rows?: number;
  columns?: number;
  options?: Record<string, any>;
}

const createUnknownItem = (
  width: string,
  height: string,
): ReportItemOf<"unknown"> => ({
  id: uniqueId(),
  type: "unknown",
  initialized: false,
  data: null,
  options: { width, height },
});

const commonContainerOptions = {
  paddingTop: "10px",
  paddingLeft: "10px",
  paddingRight: "10px",
  paddingBottom: "10px",
  borderColor: "#98A1AA",
  borderRadius: "4px",
  borderStyle: "solid",
  backgroundColor: "#ffffff",
  width: "100%",
};

type ItemFactory = (options: CreateReportItemOptions) => RBReportItem;

const itemFactories: Record<CreatableReportItemType, ItemFactory> = {
  text: ({ id, initialized, options }) => ({
    id: id ?? uniqueId(),
    type: "text",
    initialized: initialized ?? false,
    data: { rte: null },
    options: {
      ...commonContainerOptions,
      borderWidth: "0px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "transparent",
      ...options,
    },
  }),
  chart: ({ id, context, initialized, options }) => ({
    id: id ?? uniqueId(),
    type: "chart",
    initialized: initialized ?? false,
    data: {
      dataset: null,
      chartType: undefined,
      mapping: {},
    },
    options: {
      ...commonContainerOptions,
      borderWidth: context === "grid" ? "0px" : "0",
      height: context === "grid" ? "100%" : "500px",
      justifyContent: "start",
      orderList: ["title", "chart", "legend"],
      ...options,
    },
  }),
  table: ({ id, initialized, options }) => ({
    id: id ?? uniqueId(),
    type: "table",
    initialized: initialized ?? false,
    data: {
      dataset: null,
      columns: [],
    },
    options: {
      ...DEFAULT_TABLE_OPTIONS,
      ...options,
    },
  }),
  image: ({ id, context, initialized, options }) => ({
    id: id ?? uniqueId(),
    type: "image",
    initialized: initialized ?? false,
    data: {
      src: "",
      cropCoordinates: {
        left: 0,
        top: 0,
        width: 1000,
        height: 1000,
      },
      transformCoordinates: {
        scale: 1,
        positionX: 0,
        positionY: 0,
      },
    },
    options: {
      paddingTop: "10px",
      paddingLeft: "10px",
      paddingRight: "10px",
      paddingBottom: "10px",
      borderStyle: "solid",
      width: "100%",
      height: context === "grid" ? "100%" : "400px",
      imgOpacity: 1,
      ...(context === "grid" ? {} : { imgNormHeight: "400px" }),
      imgBorderWidth: "0px",
      imgBorderColor: "#98A1AA",
      imgBorderRadius: "0px",
      imgBackgroundColor: "#ffffff",
      sizingMode: "fit-proportional",
      enableCrop: true,
      ...options,
    },
  }),
  kpi_box: ({ id, context, initialized, options }) => ({
    id: id ?? uniqueId(),
    type: "kpi_box",
    initialized: initialized ?? false,
    data: {
      topLabel: {
        value: "Top Label",
        fontFamily: "Arial",
        fontWeightLabel: "400",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "14px",
        color: "#70777E",
        bgColor: "#ffffff",
        enabled: true,
      },
      bigNumberText: {
        value: "BN",
        fontFamily: "Arial",
        fontWeight: "700",
        fontWeightLabel: "400",
        fontStyle: "normal",
        fontSize: "44px",
        color: "#000000",
        bgColor: "#ffffff",
        enabled: true,
      },
      bottomLabel: {
        value: "Bottom Label",
        fontFamily: "Arial",
        fontWeightLabel: "400",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "16px",
        color: "#70777E",
        bgColor: "#ffffff",
        enabled: true,
      },
      optionalText: {
        value: "Optional Text",
        fontFamily: "Arial",
        fontWeightLabel: "400",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "14px",
        color: "#70777E",
        bgColor: "#ffffff",
        enabled: true,
      },
      dataset: null,
      datasetColumn: null,
      source: "manual",
      aggregation: "sum",
    },
    options: {
      ...commonContainerOptions,
      borderWidth: "0.5px",
      height: context === "grid" ? "100%" : "141px",
      justifyContent: "start",
      alignItems: "center",
      alignVertical: "middle",
      alignHorizontal: "left",
      innerLine: {
        type: "line",
        borderWidth: "0.5px",
        borderColor: "#98A1AA",
      },
      ...options,
    },
  }),
  grid: ({ id, initialized, rows = 1, columns = 1, options }) => ({
    id: id ?? uniqueId(),
    type: "grid",
    initialized: initialized ?? false,
    data: {
      rows,
      columns,
      items: Array.from({ length: rows * columns }, () =>
        createUnknownItem(
          `${Math.floor(100 / columns)}%`,
          `${Math.floor(100 / rows)}%`,
        ),
      ),
    },
    options: {
      ...commonContainerOptions,
      height: `${rows * 280}px`,
      borderWidth: "0px",
      ...options,
    },
  }),
  column: ({ id, initialized, columns = 1, options }) => ({
    id: id ?? uniqueId(),
    type: "column",
    initialized: initialized ?? false,
    data: {
      columns,
      items: Array.from({ length: columns }, () =>
        createUnknownItem(`${Math.floor(100 / columns)}%`, "100%"),
      ),
    },
    options: {
      ...commonContainerOptions,
      height: "280px",
      borderWidth: "0px",
      ...options,
    },
  }),
  section_divider: ({ id, initialized, options }) => ({
    id: id ?? uniqueId(),
    type: "section_divider",
    initialized: initialized ?? false,
    data: null,
    options: {
      paddingLeft: "10px",
      paddingTop: "10px",
      paddingRight: "10px",
      paddingBottom: "10px",
      width: "100%",
      borderWidth: "1px",
      borderRadius: "1px",
      borderColor: "#373D43",
      borderStyle: "solid",
      strokeLinecap: "round",
      ...options,
    },
  }),
};

export const isCreatableReportItemType = (
  type: string,
): type is CreatableReportItemType =>
  Object.prototype.hasOwnProperty.call(itemFactories, type);

export const createReportItem = <T extends CreatableReportItemType>(
  type: T,
  options: CreateReportItemOptions = {},
): ReportItemOf<T> => itemFactories[type](options) as ReportItemOf<T>;

export const isReportItemComplete = (item: RBReportItem): boolean => {
  switch (item.type) {
    case "text":
      return !!item.data.rte;
    case "chart":
      return (
        !!item.data.chartType &&
        !!item.data.dataset &&
        !!item.data.renderedChartData
      );
    case "kpi_box":
      return item.initialized;
    case "table":
      return !!item.data.dataset;
    case "grid":
    case "column":
      return item.data.items.some(isReportItemComplete);
    case "image":
      return !!item.data.src;
    case "section_divider":
      return true;
    case "unknown":
      return false;
  }
};
