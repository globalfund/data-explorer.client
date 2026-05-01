import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  FEATURE_CHECKLIST,
  AVAILABLE_DATASETS,
} from "app/pages/ai-explorer/data";
import { AiFeature } from "app/pages/ai-explorer/types";

const implemented = FEATURE_CHECKLIST.filter((f) => f.status === "implemented");
const pipeline = FEATURE_CHECKLIST.filter((f) => f.status === "pipeline");

const FeatureRow: React.FC<{ feature: AiFeature; done: boolean }> = ({
  feature,
  done,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 1.5,
      py: 0.75,
    }}
  >
    {done ? (
      <CheckCircleOutlineIcon
        sx={{ color: "#002561", mt: "2px", fontSize: 18, flexShrink: 0 }}
      />
    ) : (
      <RadioButtonUncheckedIcon
        sx={{ color: "#888888", mt: "2px", fontSize: 18, flexShrink: 0 }}
      />
    )}
    <Box>
      <Typography variant="body2" fontWeight={done ? 600 : 400}>
        {feature.code} — {feature.title}
      </Typography>
      {done && (
        <Typography variant="caption" color="text.secondary">
          {feature.summary}
        </Typography>
      )}
    </Box>
  </Box>
);

export const IntroSection: React.FC = () => (
  <Accordion defaultExpanded>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6" fontWeight={600}>
        About This Page
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Available Datasets
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {AVAILABLE_DATASETS.map((d) => (
              <Chip key={d} label={d} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Implemented Features ({implemented.length})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {implemented.map((f) => (
              <FeatureRow key={f.id} feature={f} done />
            ))}
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            In the Pipeline ({pipeline.length})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {pipeline.map((f) => (
              <FeatureRow key={f.id} feature={f} done={false} />
            ))}
          </Box>
        </Box>
      </Box>
    </AccordionDetails>
  </Accordion>
);
