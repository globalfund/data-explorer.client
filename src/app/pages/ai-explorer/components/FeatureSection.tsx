import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AiFeature, FeatureCategory } from "app/pages/ai-explorer/types";
import {
  FEATURE_CHECKLIST,
  FEATURE_CATEGORY_LABELS,
  FEATURE_CATEGORY_ORDER,
} from "app/pages/ai-explorer/data";
import { SectionAccordion } from "app/pages/ai-explorer/components/SectionAccordion";
import { FeedbackWidget } from "app/pages/ai-explorer/components/FeedbackWidget";
import { ModelInsightsSection } from "app/pages/ai-explorer/components/model-insights/ModelInsightsSection";

const FeatureCard: React.FC<{ feature: AiFeature }> = ({ feature }) => (
  <Accordion data-testid="feature-accordion">
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="body2" fontWeight={600}>
        {feature.code} - {feature.title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FeedbackWidget
          candidateId={feature.id}
          label={`${FEATURE_CATEGORY_LABELS[feature.category]} - ${feature.title}`}
        />
        <Typography variant="body2" color="text.secondary">
          {feature.summary}
        </Typography>
        <Box>
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            DATASETS USED
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.5 }}>
            {feature.datasets.map((d) => (
              <Chip key={d} label={d} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            METHODOLOGY
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {feature.methodology}
          </Typography>
        </Box>
      </Box>
    </AccordionDetails>
  </Accordion>
);

const PipelineRow: React.FC<{ feature: AiFeature }> = ({ feature }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 0.75 }}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 36 }}>
      {feature.code}
    </Typography>
    <Box>
      <Typography variant="body2">{feature.title}</Typography>
      <Typography variant="caption" color="text.secondary">
        {feature.summary}
        <br />
        {feature.methodology}
      </Typography>
    </Box>
  </Box>
);

function groupByCategory(
  features: AiFeature[],
): [FeatureCategory, AiFeature[]][] {
  const map = new Map<FeatureCategory, AiFeature[]>();
  for (const f of features) {
    if (!map.has(f.category)) map.set(f.category, []);
    map.get(f.category)!.push(f);
  }
  return FEATURE_CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => [
    c,
    map.get(c)!,
  ]);
}

const ImplementedSubSection: React.FC = () => {
  const implemented = FEATURE_CHECKLIST.filter(
    (f) => f.status === "implemented",
  );
  const groups = groupByCategory(implemented);

  return (
    <SectionAccordion
      feedbackId="features-implemented"
      feedbackLabel="Implemented Features"
      title={`Implemented Features (${implemented.length})`}
      titleVariant="body1"
      subTitle="Features that have been implemented and are currently available in the AI Explorer."
      defaultExpanded
      detailsSx={{ p: 0 }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {groups.map(([category, features]) => (
          <Box key={category} sx={{ px: 2, pb: 1 }}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{
                display: "block",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                pt: 2,
                pb: 0.5,
              }}
            >
              {FEATURE_CATEGORY_LABELS[category]}
            </Typography>
            {features.map((f) => (
              <FeatureCard key={f.id} feature={f} />
            ))}
          </Box>
        ))}
      </Box>
    </SectionAccordion>
  );
};

const PipelineSubSection: React.FC = () => {
  const pipeline = FEATURE_CHECKLIST.filter((f) => f.status === "pipeline");
  const groups = groupByCategory(pipeline);

  return (
    <SectionAccordion
      feedbackId="features-pipeline"
      feedbackLabel="Feature Pipeline"
      title={`Feature Pipeline (${pipeline.length})`}
      titleVariant="body1"
      defaultExpanded
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {groups.map(([category, features]) => (
          <Box key={category}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{
                display: "block",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                mb: 0.5,
              }}
            >
              {FEATURE_CATEGORY_LABELS[category]}
            </Typography>
            {features.map((f) => (
              <PipelineRow key={f.id} feature={f} />
            ))}
          </Box>
        ))}
      </Box>
    </SectionAccordion>
  );
};

export const FeatureSection: React.FC = () => (
  <SectionAccordion
    id="ai-explorer-features"
    feedbackId="features-section"
    feedbackLabel="Features"
    title="Features"
    subTitle="The list of features currently implemented and in the pipeline for the AI Explorer."
    defaultExpanded
    detailsSx={{ p: 0 }}
  >
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <ModelInsightsSection />
      <ImplementedSubSection />
      <PipelineSubSection />
    </Box>
  </SectionAccordion>
);
