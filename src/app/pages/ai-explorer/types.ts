import { RBReportModel } from "app/state/api/action-reducers/report-builder/sync";

export type ReportPlacement = "inline" | "main_view";

export type FeatureStatus = "implemented" | "pipeline" | "not-planned";

export interface AiFeature {
  id: string;
  code: string;
  title: string;
  summary: string;
  datasets: string[];
  methodology: string;
  status: FeatureStatus;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  report?: RBReportModel;
  reportPlacement?: ReportPlacement;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}
