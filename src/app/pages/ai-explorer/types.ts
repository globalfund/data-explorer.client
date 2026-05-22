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
  slug: string;
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

export interface CustomUseCaseRunResult {
  mean_cv_score?: number;
  test_r2?: number;
  test_mae?: number;
  test_rmse?: number;
  test_accuracy?: number;
  test_f1?: number;
  silhouette?: number;
  n_clusters?: number;
}

export interface CustomUseCaseConfig {
  task_type: UseCaseTaskType;
  target_column?: string;
  numerical_features?: string[];
  categorical_features?: string[];
}

export interface CustomUseCaseSummary {
  slug: string;
  name: string;
  task_type: UseCaseTaskType;
  description?: string;
  has_metrics?: boolean;
  config?: CustomUseCaseConfig;
  run_result?: CustomUseCaseRunResult;
}

export interface CustomUseCaseDetail extends CustomUseCaseSummary {
  supports_predict?: boolean;
  has_result?: boolean;
  audience?: string | null;
  business_question?: string | null;
  output_interpretation?: string | null;
  output_unit?: string | null;
  example_inputs?: Record<string, unknown> | null;
  interpretation?: string | null;
  metrics?: Record<string, unknown> | null;
  shap_summary?: Record<string, number> | null;
  hyperparameter_tuning?: unknown[] | null;
  prediction_input?: Record<string, unknown> | null;
}

export interface CustomUseCaseCreateResponse {
  name: string;
  slug: string;
  task_type: UseCaseTaskType;
  target_column: string;
  config: CustomUseCaseConfig;
  run_result: CustomUseCaseRunResult;
}

export interface ByocAmbiguousError {
  error: string;
  candidates: string[];
}
