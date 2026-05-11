import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import PsychologyIcon from "@mui/icons-material/Psychology";
import BarChartIcon from "@mui/icons-material/BarChart";
import { UseCaseSummary, UseCaseTaskType } from "app/pages/ai-explorer/types";
import { useUseCaseList } from "app/pages/ai-explorer/hooks/useModelPipeline";
import { UseCaseDrawer } from "app/pages/ai-explorer/components/model-insights/UseCaseDrawer";
import { SectionAccordion } from "app/pages/ai-explorer/components/SectionAccordion";

const TASK_TYPE_LABELS: Record<UseCaseTaskType, string> = {
  regression: "Forecasting",
  classification: "Classification",
  clustering: "Clustering",
  anomaly_detection: "Anomaly Detection",
  optimization: "Optimization",
  network_analysis: "Network Analysis",
  causal_inference: "Causal Inference",
};

const TASK_TYPE_ORDER: UseCaseTaskType[] = [
  "regression",
  "classification",
  "clustering",
  "anomaly_detection",
  "optimization",
  "network_analysis",
  "causal_inference",
];

const TASK_TYPE_COLORS: Record<UseCaseTaskType, string> = {
  regression: "#1565C0",
  classification: "#6A1B9A",
  clustering: "#00695C",
  anomaly_detection: "#D84315",
  optimization: "#E65100",
  network_analysis: "#2E7D32",
  causal_inference: "#37474F",
};

const UseCaseCard: React.FC<{
  useCase: UseCaseSummary;
  onSelect: (uc: UseCaseSummary) => void;
}> = ({ useCase, onSelect }) => (
  <Card
    variant="outlined"
    sx={{
      "&:hover": { boxShadow: 2 },
      transition: "box-shadow 0.2s",
      height: "100%",
    }}
  >
    <CardActionArea
      onClick={() => onSelect(useCase)}
      sx={{
        height: "100%",
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flex: 1, width: "100%" }}>
        <Box sx={{ display: "flex", gap: 0.5, mb: 1, flexWrap: "wrap" }}>
          {useCase.supports_predict && (
            <Chip
              icon={<PsychologyIcon sx={{ fontSize: 12 }} />}
              label="Interactive"
              size="small"
              variant="outlined"
              sx={{ fontSize: 10, height: 20 }}
            />
          )}
          {useCase.has_result && (
            <Chip
              icon={<BarChartIcon sx={{ fontSize: 12 }} />}
              label="Results"
              size="small"
              variant="outlined"
              sx={{ fontSize: 10, height: 20 }}
            />
          )}
        </Box>
        <Typography variant="body2" fontWeight={700} gutterBottom>
          {useCase.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {useCase.description}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

function groupByTaskType(
  useCases: UseCaseSummary[],
): [UseCaseTaskType, UseCaseSummary[]][] {
  const map = new Map<UseCaseTaskType, UseCaseSummary[]>();
  for (const uc of useCases) {
    const tt = uc.task_type;
    if (!map.has(tt)) map.set(tt, []);
    map.get(tt)!.push(uc);
  }
  return TASK_TYPE_ORDER.filter((tt) => map.has(tt)).map((tt) => [
    tt,
    map.get(tt)!,
  ]);
}

const ModelInsightsContent: React.FC = () => {
  const { data, loading, error, fetch } = useUseCaseList();
  const [selected, setSelected] = useState<UseCaseSummary | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          size="small"
          onClick={fetch}
          sx={{ alignSelf: "flex-start" }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No model pipeline use cases available.
      </Typography>
    );
  }

  const groups = groupByTaskType(data);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {groups.map(([taskType, useCases]) => (
          <Box key={taskType}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: TASK_TYPE_COLORS[taskType],
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
              >
                {TASK_TYPE_LABELS[taskType]}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 1.5,
              }}
            >
              {useCases.map((uc) => (
                <UseCaseCard
                  key={uc.slug}
                  useCase={uc}
                  onSelect={setSelected}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <UseCaseDrawer useCase={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export const ModelInsightsSection: React.FC = () => (
  <SectionAccordion
    id="model-insights"
    feedbackId="model-insights-section"
    feedbackLabel="Model Insights"
    title="Model Insights"
    subTitle="Interactive ML models built on Global Fund datasets — click any card to explore metrics, results, and run live predictions."
    defaultExpanded
    detailsSx={{ p: 2 }}
  >
    <ModelInsightsContent />
  </SectionAccordion>
);
