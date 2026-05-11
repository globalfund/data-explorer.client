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
  slug?: string;
}

export type UseCaseTaskType =
  | "regression"
  | "classification"
  | "clustering"
  | "anomaly_detection"
  | "optimization"
  | "network_analysis"
  | "causal_inference";

export interface UseCaseSummary {
  slug: string;
  name: string;
  task_type: UseCaseTaskType;
  description: string;
  has_metrics?: boolean;
  has_interpretation?: boolean;
  has_hyperparameter_tuning?: boolean;
  supports_predict: boolean;
  has_result: boolean;
}

export interface UseCaseDetail extends UseCaseSummary {
  metrics: Record<string, unknown> | null;
  interpretation: string | null;
  hyperparameter_tuning: unknown[] | null;
  example_inputs: Record<string, unknown> | null;
  shap_summary?: Record<string, number> | null;
  business_question?: string | null;
  audience?: string | null;
  output_interpretation?: string | null;
  output_unit?: string | null;
  prediction_input?: Record<string, unknown> | null;
}

export interface PredictResponse {
  use_case: string;
  prediction: number;
  unit?: string;
  label?: string;
  probability?: number;
  optimal_allocations?: Record<string, number>;
  predicted_impact?: number;
  converged?: boolean;
}

export interface UseCaseResult {
  [key: string]: unknown;
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
