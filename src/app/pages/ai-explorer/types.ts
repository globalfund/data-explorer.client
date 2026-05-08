import { RBReportModel } from "app/state/api/action-reducers/report-builder/sync";

export interface ProgressEvent {
  event: string;
  data: Record<string, unknown>;
}

export type ReportPlacement = "inline" | "main_view";

export type FeatureStatus = "implemented" | "pipeline" | "not-planned";

export type FeatureCategory =
  | "chat"
  | "forecasting"
  | "classification"
  | "clustering"
  | "nlp"
  | "anomaly"
  | "optimization"
  | "geospatial"
  | "causal";

export interface AiFeature {
  id: string;
  code: string;
  title: string;
  summary: string;
  datasets: string[];
  methodology: string;
  status: FeatureStatus;
  category: FeatureCategory;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
}

export interface DatasetGroup {
  id: string;
  label: string;
  datasets: Dataset[];
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  report?: RBReportModel;
  reportPlacement?: ReportPlacement;
  progressLog?: ProgressEvent[];
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}
