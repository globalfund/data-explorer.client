import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DatasetProfile } from "./types";

interface DataDictionaryPanelProps {
  profile: DatasetProfile;
}

const DataDictionaryItem: React.FC<{
  columnName: string;
  column: DatasetProfile["cols"][string];
}> = ({ columnName, column }) => {
  const topValues = column.top_values
    ? Object.entries(column.top_values).slice(0, 3)
    : [];

  const getInterpretation = () => {
    if (column.cardinality_level === "low") {
      return "Low cardinality - suitable for categorical analysis";
    }
    if (column.cardinality_level === "medium") {
      return "Medium cardinality - categorical with many levels";
    }
    if (column.cardinality_level === "high") {
      return "High cardinality - consider grouping or encoding";
    }
    return "Unknown";
  };

  return (
    <Accordion sx={{ mb: 1, border: "1px solid", borderColor: "grey.200" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            pr: 2,
          }}
        >
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {columnName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {column.dtype}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {column.num_unique} unique
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {(column.num_missing_pct ?? 0).toFixed(1)}% missing
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Statistics
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="body2">
                  Total: {column.num_unique + column.num_na}
                </Typography>
                <Typography variant="body2">
                  Missing: {column.num_na} ({column.num_missing_pct.toFixed(1)}
                  %)
                </Typography>
                <Typography variant="body2">
                  Unique: {column.num_unique}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Interpretation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getInterpretation()}
              </Typography>
            </Box>
          </Box>

          {topValues.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Example Values
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {column.example_values.slice(0, 5).map((val, idx) => (
                  <Paper
                    key={idx}
                    variant="outlined"
                    sx={{ px: 1, py: 0.5, bgcolor: "grey.50" }}
                  >
                    <Typography variant="body2">{val}</Typography>
                  </Paper>
                ))}
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Top Values
                </Typography>
                {topValues.map(([value, count]) => (
                  <Box key={value} sx={{ display: "flex", gap: 1, py: 0.5 }}>
                    <Typography variant="body2" sx={{ minWidth: 150 }} noWrap>
                      {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {count} (
                      {(
                        (count / (column.num_unique + column.num_na)) *
                        100
                      ).toFixed(1)}
                      %)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export const DataDictionaryPanel: React.FC<DataDictionaryPanelProps> = ({
  profile,
}) => {
  const columnNames = Object.keys(profile.cols);

  if (columnNames.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        Data Dictionary
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {columnNames.map((colName) => (
          <DataDictionaryItem
            key={colName}
            columnName={colName}
            column={profile.cols[colName]}
          />
        ))}
      </Box>
    </Box>
  );
};
