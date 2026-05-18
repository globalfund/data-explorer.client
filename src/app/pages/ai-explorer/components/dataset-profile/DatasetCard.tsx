import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import {
  DatasetProfile,
  DatasetProfileHeader,
  HealthOverviewCards,
  ColumnTypePills,
  ColumnDetailCard,
  DataDictionaryPanel,
} from "app/pages/ai-explorer/components/dataset-profile";

interface Dataset {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface DatasetCardProps {
  dataset: Dataset;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 2 }}>
    {value === index && children}
  </Box>
);

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  const [expanded, setExpanded] = useState(false);
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleAccordionChange = async (
    _: React.SyntheticEvent,
    isExpanded: boolean,
  ) => {
    setExpanded(isExpanded);
    if (isExpanded && !profile) {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API;
        const response = await fetch(
          `${apiUrl}/dataset-profile?dataset=${dataset.slug}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const data = await response.json();
        setProfile(data.profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      sx={{
        "&:before": { display: "none" },
        border: "1px solid",
        borderColor: "grey.200",
        mb: 1,
        borderRadius: expanded ? 1 : 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: "grey.50",
          "&:hover": { bgcolor: "grey.100" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            pr: 2,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {dataset.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {dataset.description}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {profile && (
          <Box>
            <DatasetProfileHeader
              datasetName={dataset.name}
              profile={profile}
            />

            <HealthOverviewCards profile={profile} />

            <ColumnTypePills profile={profile} />

            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                aria-label="column details tabs"
              >
                <Tab label="Column Details" />
                <Tab label="Data Dictionary" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {profile.text_columns
                  .filter((colName) => profile.cols[colName])
                  .map((colName) => (
                    <ColumnDetailCard
                      key={colName}
                      columnName={colName}
                      column={profile.cols[colName]}
                      type="text"
                    />
                  ))}
                {profile.numeric_columns
                  .filter((colName) => profile.cols[colName])
                  .map((colName) => (
                    <ColumnDetailCard
                      key={colName}
                      columnName={colName}
                      column={profile.cols[colName]}
                      type="numeric"
                    />
                  ))}
                {profile.datetime_columns
                  .filter((colName) => profile.cols[colName])
                  .map((colName) => (
                    <ColumnDetailCard
                      key={colName}
                      columnName={colName}
                      column={profile.cols[colName]}
                      type="datetime"
                    />
                  ))}
                {profile.boolean_columns
                  .filter((colName) => profile.cols[colName])
                  .map((colName) => (
                    <ColumnDetailCard
                      key={colName}
                      columnName={colName}
                      column={profile.cols[colName]}
                      type="boolean"
                    />
                  ))}
                {profile.categorical_columns
                  .filter((colName) => profile.cols[colName])
                  .map((colName) => (
                    <ColumnDetailCard
                      key={colName}
                      columnName={colName}
                      column={profile.cols[colName]}
                      type="categorical"
                    />
                  ))}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <DataDictionaryPanel profile={profile} />
            </TabPanel>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default DatasetCard;
