import React from "react";
import Typography from "@mui/material/Typography";
import { SectionAccordion } from "app/pages/ai-explorer/components/SectionAccordion";

export const GuardrailsSection: React.FC = () => (
  <SectionAccordion
    id="ai-explorer-guardrails"
    feedbackId="guardrails-section"
    feedbackLabel="Guardrails"
    title="Guardrails"
    subTitle="The Global Fund internal guardrails and AI guardrails and governance"
  >
    <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
      This section will document the AI guardrails in place for this project,
      including response boundaries, data access controls, and any topic or
      behaviour restrictions defined by the Global Fund. Content will be updated
      as guardrails are formally established based on hard context and
      governance requirements provided by the Global Fund.
    </Typography>
  </SectionAccordion>
);
