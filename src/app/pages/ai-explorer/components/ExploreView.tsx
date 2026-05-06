import React from "react";
import Box from "@mui/material/Box";
import { IntroSection } from "app/pages/ai-explorer/components/IntroSection";
import { DatasetsSection } from "app/pages/ai-explorer/components/DatasetsSection";
import { GuardrailsSection } from "app/pages/ai-explorer/components/GuardrailsSection";
import { FeatureSection } from "app/pages/ai-explorer/components/FeatureSection";
import { FutureOutlookSection } from "app/pages/ai-explorer/components/FutureOutlookSection";

export const ExploreView: React.FC = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <IntroSection />
    <DatasetsSection />
    <GuardrailsSection />
    <FeatureSection />
    <FutureOutlookSection />
  </Box>
);
