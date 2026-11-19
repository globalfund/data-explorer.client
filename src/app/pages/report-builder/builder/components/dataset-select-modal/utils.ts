import {
  DataType,
  RBExternalSource,
} from "app/state/api/action-reducers/report-builder/sync";

export type DatasetColumn = {
  name: string;
  id: string;
  type: DataType;
};

export type DatasetRowsPerPage = "5" | "10" | "25" | "50";

export const getDatasetLatestUpdateKey = (id: string) => {
  switch (id) {
    case "gf_results":
      return "results";
    case "gf_pledges_contributions":
      return "pledges-contributions";
    case "gf_eligibility":
      return "eligibility";
    case "gf_allocations":
      return "allocations";
    case "gf_grant_implementation":
      return "grants";
    case "gf_grant_commitments":
      return "commitments";
    case "gf_grant_disbursements":
      return "disbursements";
    default:
      return "";
  }
};

export const getColumnType = (value?: string | { type?: string }): DataType => {
  const type = typeof value === "string" ? value : value?.type;
  if (type === "number") return "number";
  if (type === "date") return "date";
  if (type === "date-time") return "date-time";
  if (type === "boolean") return "boolean";
  if (type === "geographical") return "geographical";
  return "string";
};

export const formatNumber = (value?: number) =>
  typeof value === "number" ? value.toLocaleString("en-US") : "-";

export const formatCellValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "number") return value.toLocaleString("en-US");
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export type DatasetSourceId = "global-fund" | "who" | "kaggle" | "my-datasets";

/** The sources that are searched on the server, by their name in the API. */
export const externalSources: Partial<
  Record<DatasetSourceId, RBExternalSource>
> = {
  who: "WHO",
  kaggle: "Kaggle",
};

export const uploadFileExtensions = [
  ".csv",
  ".tsv",
  ".json",
  ".xlsx",
  ".xlsm",
  ".parquet",
];

/** Identifies a search result, and the dataset it was connected as. */
export const getExternalDatasetKey = (dataset: {
  url?: string;
  sourceUrl?: string;
  name?: string;
  externalName?: string;
}) =>
  `${dataset.sourceUrl ?? dataset.url}|${dataset.externalName ?? dataset.name}`;

export const formatDatasetDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  return [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join("-");
};

/** The message of an API error, which the API sends as `{error: {message}}`. */
export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const message = (
    error as { response?: { data?: { error?: { message?: unknown } } } }
  )?.response?.data?.error?.message;
  return typeof message === "string" && message ? message : fallback;
};
