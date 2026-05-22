import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {
  CustomUseCaseSummary,
  CustomUseCaseCreateResponse,
  UseCaseTaskType,
} from "app/pages/ai-explorer/types";
import { useCustomUseCaseList } from "app/pages/ai-explorer/hooks/useModelPipeline";
import { SectionAccordion } from "app/pages/ai-explorer/components/SectionAccordion";
import { ByocUploadForm } from "app/pages/ai-explorer/components/byoc/ByocUploadForm";
import { ByocResultsCard } from "app/pages/ai-explorer/components/byoc/ByocResultsCard";
import { ByocUseCaseCard } from "app/pages/ai-explorer/components/byoc/ByocUseCaseCard";
import { ByocUseCaseDrawer } from "app/pages/ai-explorer/components/byoc/ByocUseCaseDrawer";

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

function groupByTaskType(
  useCases: CustomUseCaseSummary[],
): [UseCaseTaskType, CustomUseCaseSummary[]][] {
  const map = new Map<UseCaseTaskType, CustomUseCaseSummary[]>();
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

interface ByocUseCaseListProps {
  items: CustomUseCaseSummary[];
  onSelect: (uc: CustomUseCaseSummary) => void;
}

const ByocUseCaseList: React.FC<ByocUseCaseListProps> = ({
  items,
  onSelect,
}) => {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No custom use cases yet. Upload a dataset above to get started.
      </Typography>
    );
  }

  const groups = groupByTaskType(items);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {groups.map(([taskType, useCases]) => (
        <Box key={taskType}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
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
              <ByocUseCaseCard key={uc.slug} useCase={uc} onSelect={onSelect} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const ByocSection: React.FC = () => {
  const listApi = useCustomUseCaseList();
  const [latestResult, setLatestResult] =
    useState<CustomUseCaseCreateResponse | null>(null);
  const [selected, setSelected] = useState<CustomUseCaseSummary | null>(null);

  useEffect(() => {
    listApi.fetch();
  }, []);

  const handleCreated = (result: CustomUseCaseCreateResponse) => {
    setLatestResult(result);
    listApi.fetch();
  };

  const handleDeleted = (slug: string) => {
    listApi.fetch();
    if (latestResult?.slug === slug) setLatestResult(null);
  };

  return (
    <SectionAccordion
      feedbackId="byoc-section"
      feedbackLabel="Bring Your Own Use Case"
      title="Bring Your Own Use Case"
      subTitle="Upload any tabular dataset and define your use case, this results in a trained machine learning model. No code required."
      defaultExpanded={true}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            Upload Dataset
          </Typography>
          <Box sx={{ mt: 1.5 }}>
            <ByocUploadForm onCreated={handleCreated} />
          </Box>
        </Box>

        {latestResult && <ByocResultsCard result={latestResult} />}

        <Divider />

        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            Your Custom Use Cases
          </Typography>
          <Box sx={{ mt: 1.5 }}>
            {listApi.loading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  Loading…
                </Typography>
              </Box>
            )}
            {listApi.error && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Alert severity="error">{listApi.error}</Alert>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={listApi.fetch}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Retry
                </Button>
              </Box>
            )}
            {listApi.data && (
              <ByocUseCaseList items={listApi.data} onSelect={setSelected} />
            )}
          </Box>
        </Box>
      </Box>

      <ByocUseCaseDrawer
        useCase={selected}
        onClose={() => setSelected(null)}
        onDeleted={handleDeleted}
      />
    </SectionAccordion>
  );
};
