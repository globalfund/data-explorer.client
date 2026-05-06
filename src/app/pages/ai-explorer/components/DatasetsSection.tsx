import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Dataset, DatasetGroup } from "app/pages/ai-explorer/types";
import { GLOBAL_FUND_DATASET_GROUPS } from "app/pages/ai-explorer/datasets";
import { SectionAccordion } from "app/pages/ai-explorer/components/SectionAccordion";

const DatasetCard: React.FC<{ dataset: Dataset }> = ({ dataset }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="body2" fontWeight={500}>
        {dataset.name}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
        {dataset.description}
      </Typography>
    </AccordionDetails>
  </Accordion>
);

const DatasetGroupSection: React.FC<{ group: DatasetGroup }> = ({ group }) => (
  <SectionAccordion
    feedbackId={`dataset-group-${group.id}`}
    feedbackLabel={group.label}
    title={group.label}
    titleVariant="body2"
    detailsSx={{ p: 0 }}
    defaultExpanded
  >
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {group.datasets.map((ds) => (
        <DatasetCard key={ds.id} dataset={ds} />
      ))}
    </Box>
  </SectionAccordion>
);

const GlobalFundSection: React.FC = () => (
  <SectionAccordion
    feedbackId="datasets-global-fund"
    feedbackLabel="Global Fund"
    title="Global Fund"
    titleVariant="body2"
    subTitle="The Global Fund datasets currently available in these features."
    detailsSx={{ p: 0 }}
    defaultExpanded
  >
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {GLOBAL_FUND_DATASET_GROUPS.map((group) => (
        <DatasetGroupSection key={group.id} group={group} />
      ))}
    </Box>
  </SectionAccordion>
);

const ExternalSourcesSection: React.FC = () => (
  <SectionAccordion
    feedbackId="datasets-external-sources"
    feedbackLabel="External Sources"
    title="External Sources"
    titleVariant="body2"
    defaultExpanded
  >
    <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
      In a future release, the AI Explorer will also support data from external
      sources including the World Health Organization (WHO), World Bank, and
      others. You will also be able to bring your own data and combine it with
      Global Fund datasets for richer, more contextual analysis. Stay tuned for
      updates.
    </Typography>
  </SectionAccordion>
);

export const DatasetsSection: React.FC = () => (
  <SectionAccordion
    id="ai-explorer-datasets"
    feedbackId="datasets-section"
    feedbackLabel="Datasets"
    title="Datasets"
    subTitle="Information about available data."
    detailsSx={{ p: 0 }}
    defaultExpanded
  >
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <GlobalFundSection />
      <ExternalSourcesSection />
    </Box>
  </SectionAccordion>
);
