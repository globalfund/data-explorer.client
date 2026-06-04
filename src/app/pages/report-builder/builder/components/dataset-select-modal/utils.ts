import { DataType } from "app/state/api/action-reducers/report-builder/sync";

export type DatasetColumn = {
  name: string;
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
