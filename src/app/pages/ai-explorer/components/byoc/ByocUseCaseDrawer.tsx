import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  CustomUseCaseDetail,
  CustomUseCaseSummary,
  PredictResponse,
  UseCaseTaskType,
} from "app/pages/ai-explorer/types";
import {
  useCustomUseCaseDelete,
  useCustomUseCaseDetail,
  useCustomUseCasePredict,
} from "app/pages/ai-explorer/hooks/useModelPipeline";
import { InterpretationPanel } from "app/pages/ai-explorer/components/model-insights/InterpretationPanel";
import { MetricsTable } from "app/pages/ai-explorer/components/model-insights/MetricsTable";

const TASK_TYPE_COLORS: Record<string, string> = {
  regression: "#1565C0",
  classification: "#6A1B9A",
  clustering: "#00695C",
  anomaly_detection: "#D84315",
  optimization: "#F9A825",
  network_analysis: "#2E7D32",
  causal_inference: "#37474F",
};

const RUN_RESULT_LABELS: Record<string, string> = {
  mean_cv_score: "Mean CV Score",
  test_r2: "R²",
  test_mae: "MAE",
  test_rmse: "RMSE",
  test_accuracy: "Accuracy",
  test_f1: "F1 Score",
  silhouette: "Silhouette",
  n_clusters: "Clusters",
};

function inferType(value: unknown): "number" | "string" {
  return typeof value === "number" ? "number" : "string";
}

function formatPrediction(
  result: PredictResponse,
  taskType: UseCaseTaskType,
): string {
  if (taskType === "classification") {
    const label = result.label ?? String(result.prediction);
    const prob =
      result.probability != null
        ? ` (${(result.probability * 100).toFixed(0)}% confidence)`
        : "";
    return `${label}${prob}`;
  }
  return result.prediction.toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
}

interface ByocPredictFormProps {
  detail: CustomUseCaseDetail;
}

const ByocPredictForm: React.FC<ByocPredictFormProps> = ({ detail }) => {
  const exampleInputs = detail.example_inputs ?? {};
  const fields = Object.entries(exampleInputs);

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(([k, v]) => [k, String(v)])),
  );

  const predictApi = useCustomUseCasePredict(detail.slug);

  const handleSubmit = () => {
    const features: Record<string, unknown> = {};
    for (const [key, rawVal] of Object.entries(values)) {
      features[key] =
        inferType(exampleInputs[key]) === "number"
          ? Number.parseFloat(rawVal)
          : rawVal;
    }
    predictApi.predict({ features });
  };

  if (fields.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        No example inputs available. Use the predict API endpoint directly.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        Interactive Prediction
      </Typography>
      <Box
        sx={{
          mt: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 1.5,
        }}
      >
        {fields.map(([key]) => (
          <TextField
            key={key}
            label={key}
            size="small"
            value={values[key] ?? ""}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, [key]: e.target.value }))
            }
            type={inferType(exampleInputs[key]) === "number" ? "number" : "text"}
          />
        ))}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit}
          disabled={predictApi.loading}
          sx={{ bgcolor: "#002561", "&:hover": { bgcolor: "#013B82" } }}
        >
          {predictApi.loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            "Run Prediction"
          )}
        </Button>
      </Box>
      {predictApi.error && (
        <Alert severity="error" sx={{ mt: 1.5 }}>
          {predictApi.error}
        </Alert>
      )}
      {predictApi.data && !predictApi.error && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: "grey.50",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Typography variant="caption" fontWeight={700} color="text.secondary">
            PREDICTION RESULT
          </Typography>
          {detail.task_type === "classification" ? (
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={formatPrediction(predictApi.data, detail.task_type)}
                size="small"
              />
            </Box>
          ) : (
            <Typography
              variant="h6"
              fontWeight={700}
              color="#002561"
              sx={{ mt: 0.5 }}
            >
              {formatPrediction(predictApi.data, detail.task_type)}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

interface DrawerContentProps {
  summary: CustomUseCaseSummary;
  onDelete: () => void;
  deleteLoading: boolean;
  deleteError: string | null;
}

const DrawerContent: React.FC<DrawerContentProps> = ({
  summary,
  onDelete,
  deleteLoading,
  deleteError,
}) => {
  const detailApi = useCustomUseCaseDetail(summary.slug);

  useEffect(() => {
    detailApi.fetch();
  }, [summary.slug]);

  const detail = detailApi.data;

  const runResult = detail?.run_result ?? summary.run_result;
  const runResultEntries = runResult
    ? Object.entries(runResult).filter(([, v]) => v != null)
    : [];

  const hasBusinessContext =
    detail &&
    (detail.business_question || detail.audience || detail.output_interpretation);

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: 3,
        py: 2,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {detailApi.loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {detailApi.error && <Alert severity="error">{detailApi.error}</Alert>}

      {detail && (
        <>
          {/* Business context */}
          {hasBusinessContext && (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {detail.business_question && (
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      Business Question
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {detail.business_question}
                    </Typography>
                  </Box>
                )}
                {detail.audience && (
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      Intended Audience
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {detail.audience}
                    </Typography>
                  </Box>
                )}
                {detail.output_interpretation && (
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      How to Read the Output
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {detail.output_interpretation}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Divider />
            </>
          )}

          {/* Training run metrics (from run_result) */}
          {runResultEntries.length > 0 && (
            <>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Training Metrics
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: 1,
                  }}
                >
                  {runResultEntries.map(([key, value]) => (
                    <Box
                      key={key}
                      sx={{
                        p: 1.5,
                        bgcolor: "grey.50",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {RUN_RESULT_LABELS[key] ?? key}
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {typeof value === "number"
                          ? value.toLocaleString(undefined, {
                              maximumFractionDigits: 4,
                            })
                          : String(value)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Divider />
            </>
          )}

          {/* Predict form */}
          {detail.supports_predict && detail.example_inputs && (
            <>
              <ByocPredictForm detail={detail} />
              <Divider />
            </>
          )}

          {/* Interpretation */}
          {detail.interpretation && (
            <>
              <InterpretationPanel markdown={detail.interpretation} />
              <Divider />
            </>
          )}

          {/* Model metrics table */}
          {detail.metrics && (
            <>
              <MetricsTable
                metrics={detail.metrics as Record<string, unknown>}
              />
              <Divider />
            </>
          )}
        </>
      )}

      {/* Delete */}
      <Box>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={onDelete}
          disabled={deleteLoading}
        >
          Delete use case
        </Button>
        {deleteError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {deleteError}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

interface ByocUseCaseDrawerProps {
  useCase: CustomUseCaseSummary | null;
  onClose: () => void;
  onDeleted: (slug: string) => void;
}

export const ByocUseCaseDrawer: React.FC<ByocUseCaseDrawerProps> = ({
  useCase,
  onClose,
  onDeleted,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteApi = useCustomUseCaseDelete();

  const handleDelete = async () => {
    if (!useCase) return;
    try {
      await deleteApi.remove(useCase.slug);
      setConfirmOpen(false);
      onDeleted(useCase.slug);
      onClose();
    } catch {
      // error shown via deleteApi.error
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={!!useCase}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100vw", sm: 600 },
            p: 0,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {useCase && (
          <>
            <Box
              sx={{
                px: 3,
                py: 2,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
                >
                  <Chip
                    label={useCase.task_type.replace(/_/g, " ")}
                    size="small"
                    sx={{
                      bgcolor: TASK_TYPE_COLORS[useCase.task_type] ?? "#555",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    label={useCase.has_metrics ? "Trained" : "Pending"}
                    size="small"
                    color={useCase.has_metrics ? "success" : "default"}
                    variant="outlined"
                    sx={{ fontSize: 10 }}
                  />
                </Box>
                <Typography variant="h6" fontWeight={700} color="#002561">
                  {useCase.name}
                </Typography>
                {useCase.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {useCase.description}
                  </Typography>
                )}
              </Box>
              <IconButton
                onClick={onClose}
                size="small"
                aria-label="Close drawer"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <DrawerContent
              summary={useCase}
              onDelete={() => setConfirmOpen(true)}
              deleteLoading={deleteApi.loading}
              deleteError={deleteApi.error}
            />
          </>
        )}
      </Drawer>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete &ldquo;{useCase?.name}&rdquo;?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will permanently remove the model, config, dataset copy, and
            all metrics. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={handleDelete}
            disabled={deleteApi.loading}
          >
            {deleteApi.loading ? <CircularProgress size={16} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
