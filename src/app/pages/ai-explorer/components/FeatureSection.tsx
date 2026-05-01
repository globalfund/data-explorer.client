import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AiFeature } from "app/pages/ai-explorer/types";
import { FEATURE_CHECKLIST } from "app/pages/ai-explorer/data";

const FeatureCard: React.FC<{ feature: AiFeature }> = ({ feature }) => (
  <Accordion data-testid="feature-accordion">
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography variant="body1" fontWeight={600}>
          {feature.code} — {feature.title}
        </Typography>
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="body2">{feature.summary}</Typography>
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

export const FeatureSection: React.FC = () => {
  const implemented = FEATURE_CHECKLIST.filter(
    (f) => f.status === "implemented",
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        Implemented Features
      </Typography>
      {implemented.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </Box>
  );
};
