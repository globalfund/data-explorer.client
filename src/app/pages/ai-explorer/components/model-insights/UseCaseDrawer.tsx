import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import { UseCaseSummary } from "app/pages/ai-explorer/types";
import {
  useUseCaseDetail,
  useUseCaseResult,
  useUseCasePredict,
} from "app/pages/ai-explorer/hooks/useModelPipeline";
import { MetricsTable } from "app/pages/ai-explorer/components/model-insights/MetricsTable";
import { InterpretationPanel } from "app/pages/ai-explorer/components/model-insights/InterpretationPanel";
import { PredictForm } from "app/pages/ai-explorer/components/model-insights/PredictForm";
import {
  ResultViewer,
  ShapChart,
} from "app/pages/ai-explorer/components/model-insights/ResultViewer";

const TASK_TYPE_COLORS: Record<string, string> = {
  regression: "#1565C0",
  classification: "#6A1B9A",
  clustering: "#00695C",
  anomaly_detection: "#D84315",
  optimization: "#F9A825",
  network_analysis: "#2E7D32",
  causal_inference: "#37474F",
};

interface UseCaseDrawerProps {
  useCase: UseCaseSummary | null;
  onClose: () => void;
}

export const UseCaseDrawer: React.FC<UseCaseDrawerProps> = ({
  useCase,
  onClose,
}) => {
  const detail = useUseCaseDetail(useCase?.slug ?? "");
  const resultApi = useUseCaseResult(useCase?.slug ?? "");
  const predictApi = useUseCasePredict(useCase?.slug ?? "");

  useEffect(() => {
    if (!useCase) return;
    detail.fetch();
    if (useCase.has_result) resultApi.fetch();
  }, [useCase?.slug]);

  const isOpen = !!useCase;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
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
          {/* Header */}
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
                <Typography variant="caption" color="text.secondary">
                  {useCase.slug}
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={700} color="#002561">
                {useCase.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {useCase.description}
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              aria-label="Close drawer"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
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
            {detail.loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}
            {detail.error && <Alert severity="error">{detail.error}</Alert>}

            {detail.data && (
              <>
                {/* Business context */}
                {(detail.data.business_question ||
                  detail.data.audience ||
                  detail.data.output_interpretation) && (
                  <>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {detail.data.business_question && (
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
                            {detail.data.business_question}
                          </Typography>
                        </Box>
                      )}
                      {detail.data.audience && (
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
                            {detail.data.audience}
                          </Typography>
                        </Box>
                      )}
                      {detail.data.output_interpretation && (
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
                            {detail.data.output_interpretation}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Divider />
                  </>
                )}

                {/* Result visualization */}
                {useCase.has_result && (
                  <>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="text.secondary"
                          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                        >
                          Model Results
                        </Typography>
                        {detail.data?.output_unit &&
                          detail.data.output_unit !== "raw" && (
                            <Chip
                              label={detail.data.output_unit}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: 10, height: 18 }}
                            />
                          )}
                      </Box>
                      {resultApi.loading && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 2,
                          }}
                        >
                          <CircularProgress size={24} />
                        </Box>
                      )}
                      {resultApi.error && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {resultApi.error}
                        </Alert>
                      )}
                      {resultApi.data && (
                        <Box sx={{ mt: 1 }}>
                          <ResultViewer
                            taskType={useCase.task_type}
                            result={resultApi.data}
                          />
                        </Box>
                      )}
                    </Box>
                    <Divider />
                  </>
                )}

                {/* Predict form */}
                {useCase.supports_predict && detail.data.example_inputs && (
                  <>
                    <PredictForm
                      detail={detail.data}
                      onPredict={predictApi.predict}
                      loading={predictApi.loading}
                      error={predictApi.error}
                      result={predictApi.data}
                    />
                    <Divider />
                  </>
                )}

                {/* Interpretation */}
                {detail.data.interpretation && (
                  <InterpretationPanel markdown={detail.data.interpretation} />
                )}

                {/* Metrics */}
                {detail.data.metrics && (
                  <>
                    <MetricsTable
                      metrics={detail.data.metrics as Record<string, unknown>}
                    />
                    <Divider />
                  </>
                )}

                {/* SHAP (absorption_driver_analysis) */}
                {detail.data.shap_summary && (
                  <>
                    <ShapChart
                      shapSummary={
                        detail.data.shap_summary as Record<string, number>
                      }
                    />
                    <Divider />
                  </>
                )}
              </>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
};
