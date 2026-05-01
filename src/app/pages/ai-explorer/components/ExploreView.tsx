import React from "react";
import Box from "@mui/material/Box";
import { IntroSection } from "app/pages/ai-explorer/components/IntroSection";
import { FeatureSection } from "app/pages/ai-explorer/components/FeatureSection";

export const ExploreView: React.FC = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <IntroSection />
    <FeatureSection />
  </Box>
);
