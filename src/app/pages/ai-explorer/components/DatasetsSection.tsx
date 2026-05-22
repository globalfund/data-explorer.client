import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import BarChartIcon from "@mui/icons-material/BarChart";
import { DatasetGroup } from "app/pages/ai-explorer/types";
import { GLOBAL_FUND_DATASET_GROUPS } from "app/pages/ai-explorer/datasets";
import { SectionAccordion } from "app/pages/ai-explorer/components/SectionAccordion";
import { DatasetCard } from "app/pages/ai-explorer/components/dataset-profile";
import { ProfileDatasetModal } from "app/pages/datasets/common/profile-modal";

const DatasetGroupSection: React.FC<{ group: DatasetGroup }> = ({ group }) => (
  <SectionAccordion
    feedbackId={`dataset-group-${group.id}`}
    feedbackLabel={group.label}
    title={group.label}
    titleVariant="body2"
    detailsSx={{ p: 0 }}
    defaultExpanded
  >
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
    subTitle="The Global Fund datasets partially available in these features."
    detailsSx={{ p: 0 }}
    defaultExpanded
  >
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
      updates. Currently, you can profile your own datasets using the "Profile your dataset"
      button above, which will generate a dataset profile that you can use to explore and analyze your data in the AI Explorer.
    </Typography>
  </SectionAccordion>
);

export const DatasetsSection: React.FC = () => {
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  return (
    <SectionAccordion
      id="ai-explorer-datasets"
      feedbackId="datasets-section"
      feedbackLabel="Datasets"
      title="Datasets"
      subTitle="Information about available data."
      detailsSx={{ p: 0 }}
      defaultExpanded
      headerRightContent={
        <Button
          size="small"
          variant="outlined"
          startIcon={<BarChartIcon fontSize="small" />}
          onClick={(e) => {
            e.stopPropagation();
            setProfileModalOpen(true);
          }}
          data-cy="profile-dataset-btn"
        >
          Profile your dataset
        </Button>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <GlobalFundSection />
        <ExternalSourcesSection />
      </Box>

      <ProfileDatasetModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </SectionAccordion>
  );
};
