import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SectionAccordion } from "app/pages/ai-explorer/components/SectionAccordion";
import { FUTURE_OUTLOOK_ITEMS } from "app/pages/ai-explorer/data";

export const FutureOutlookSection: React.FC = () => (
  <SectionAccordion
    id="ai-explorer-future-outlook"
    feedbackId="future-outlook-section"
    feedbackLabel="Future Outlook"
    title="Future Outlook"
    subTitle="Planned features, improvements, and next steps for the AI Explorer based on user feedback and project roadmap. Feel free to suggest any features or improvements you'd like to see!"
    defaultExpanded
  >
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      {FUTURE_OUTLOOK_ITEMS.map((item, i) => (
        <Box key={i} sx={{ display: "flex", gap: 1.5 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ minWidth: 18, fontWeight: 600 }}
          >
            {i + 1}.
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  </SectionAccordion>
);
