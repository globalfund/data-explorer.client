import { DataType } from "app/state/api/action-reducers/report-builder/sync";

export type TableRowsPerPage = "5" | "10" | "25" | "50";
export type TableSortDirection = "ascending" | "descending";
export type TableDisplay = "table" | "list";
export type TableRowStripping = "zebra" | "none";
export type TableSize = "compact" | "large";
export type TableColorPalette = "default" | "blue" | "green";

export type TableColumn = {
  id: string;
  name: string;
  type?: DataType | string;
};

export interface TableOptions {
  rowsPerPage: TableRowsPerPage;
  showRowNumbers: boolean;
  paddingLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  width: string;
  height: string;
  size: TableSize;
  display: TableDisplay;
  rowStripping: TableRowStripping;
  colorPalette: TableColorPalette;
  sortBy: string;
  sortDirection: TableSortDirection;
  limitToTop: boolean;
  limitToTopValue: string;
  groupRemainderAsOther: boolean;
}

export const DEFAULT_TABLE_OPTIONS: TableOptions = {
  rowsPerPage: "10",
  showRowNumbers: true,
  paddingLeft: "10px",
  paddingTop: "10px",
  paddingRight: "10px",
  paddingBottom: "10px",
  width: "100%",
  height: "auto",
  size: "compact",
  display: "table",
  rowStripping: "zebra",
  colorPalette: "default",
  sortBy: "",
  sortDirection: "ascending",
  limitToTop: true,
  limitToTopValue: "6",
  groupRemainderAsOther: true,
};

export const defaultTableColumns: TableColumn[] = [
  { id: "DonorName", name: "DonorName", type: "string" },
  { id: "GeographyName", name: "GeographyName", type: "string" },
  { id: "DonorType1", name: "DonorType1", type: "string" },
  { id: "DonorType", name: "DonorType", type: "string" },
  { id: "Pledge", name: "Pledge", type: "number" },
];

export const tablePaletteOptions: Record<
  TableColorPalette,
  {
    label: string;
    headerBg: string;
    headerText: string;
    oddRowBg: string;
    evenRowBg: string;
    oddIndexBg: string;
    evenIndexBg: string;
    swatches: string[];
  }
> = {
  default: {
    label: "Default Theme",
    headerBg: "#252C34",
    headerText: "#FFFFFF",
    oddRowBg: "#F8F9FA",
    evenRowBg: "#FFFFFF",
    oddIndexBg: "#F1F3F5",
    evenIndexBg: "#F8F9FA",
    swatches: ["#0A2840", "#F1F3F5"],
  },
  blue: {
    label: "Blue Theme",
    headerBg: "#0A2840",
    headerText: "#FFFFFF",
    oddRowBg: "#EFF1FE",
    evenRowBg: "#FFFFFF",
    oddIndexBg: "#D6DDFD",
    evenIndexBg: "#EFF1FE",
    swatches: ["#0A2840", "#D6DDFD"],
  },
  green: {
    label: "Green Theme",
    headerBg: "#0E6027",
    headerText: "#FFFFFF",
    oddRowBg: "#F1F8F3",
    evenRowBg: "#FFFFFF",
    oddIndexBg: "#D9F2DF",
    evenIndexBg: "#F1F8F3",
    swatches: ["#0E6027", "#D9F2DF"],
  },
};

const sizeOptions = ["compact", "large"];
const displayOptions = ["table", "list"];
const rowStrippingOptions = ["zebra", "none"];
const colorPaletteOptions = Object.keys(tablePaletteOptions);

export const getTableOptions = (
  options?: Record<string, any>,
): TableOptions => {
  const tableOptions = {
    ...DEFAULT_TABLE_OPTIONS,
    ...(options ?? {}),
  } as TableOptions;

  if (!["5", "10", "25", "50"].includes(tableOptions.rowsPerPage)) {
    tableOptions.rowsPerPage = DEFAULT_TABLE_OPTIONS.rowsPerPage;
  }

  const size = tableOptions.size as string;
  if (!sizeOptions.includes(size)) {
    tableOptions.size =
      size === "regular" || size === "spacious"
        ? "large"
        : DEFAULT_TABLE_OPTIONS.size;
  }

  const display = tableOptions.display as string;
  if (!displayOptions.includes(display)) {
    tableOptions.display = DEFAULT_TABLE_OPTIONS.display;
  }

  const rowStripping = tableOptions.rowStripping as string;
  if (!rowStrippingOptions.includes(rowStripping)) {
    tableOptions.rowStripping = DEFAULT_TABLE_OPTIONS.rowStripping;
  }

  const colorPalette = tableOptions.colorPalette as string;
  if (!colorPaletteOptions.includes(colorPalette)) {
    tableOptions.colorPalette = DEFAULT_TABLE_OPTIONS.colorPalette;
  }

  return tableOptions;
};

export const normalizeTableColumns = (columns?: Partial<TableColumn>[]) => {
  if (!columns?.length) return defaultTableColumns;

  return columns
    .filter((column) => column.id || column.name)
    .map((column) => {
      const id = column.id || column.name || "";
      return {
        id,
        name: column.name || id,
        type: column.type,
      };
    });
};

export const getTableRowLimit = (options: TableOptions) => {
  const parsed = Number(
    options.limitToTop
      ? options.limitToTopValue
      : DEFAULT_TABLE_OPTIONS.limitToTopValue,
  );
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return Math.floor(parsed);
};

export const getTableRowsPerPageSize = (options: TableOptions) =>
  Number(options.rowsPerPage);

export const getTableCellSizing = (size: TableSize) => {
  switch (size) {
    case "large":
      return { height: "48px", padding: "12px" };
    default:
      return { height: "31px", padding: "8px" };
  }
};

export const getRowValue = (row: Record<string, any>, column: TableColumn) =>
  row?.[column.id] ?? row?.[column.name];

export const formatTableCellValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "number") return value.toLocaleString("en-US");
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};
