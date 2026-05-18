import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinearProgress from "@mui/material/LinearProgress";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PinIcon from "@mui/icons-material/Pin";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { ColumnProfile } from "./types";

interface ColumnDetailCardProps {
  columnName: string;
  column: ColumnProfile;
  type: "text" | "numeric" | "datetime" | "boolean" | "categorical";
}

const formatNumber = (
  num: number | undefined,
  decimals: number = 2,
): string => {
  if (num === undefined || num === null) return "N/A";
  if (Math.abs(num) >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (Math.abs(num) >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (Math.abs(num) >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
  return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
};

const formatCurrency = (num: number | undefined): string => {
  if (num === undefined || num === null) return "N/A";
  return `$${formatNumber(num)}`;
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "text":
      return <TextFieldsIcon sx={{ fontSize: 18 }} />;
    case "numeric":
      return <PinIcon sx={{ fontSize: 18 }} />;
    case "datetime":
      return <CalendarMonthIcon sx={{ fontSize: 18 }} />;
    default:
      return <TextFieldsIcon sx={{ fontSize: 18 }} />;
  }
};

const getTypeColor = (type: string): string => {
  switch (type) {
    case "text":
      return "#2563EB";
    case "numeric":
      return "#059669";
    case "datetime":
      return "#7C3AED";
    case "boolean":
      return "#D97706";
    case "categorical":
      return "#DB2777";
    default:
      return "#6B7280";
  }
};

interface StatRowProps {
  label: string;
  value: string | number | React.ReactNode;
}

const StatRow: React.FC<StatRowProps> = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value}
    </Typography>
  </Box>
);

interface TopValueBarProps {
  label: string;
  count: number;
  percentage: number;
}

const TopValueBar: React.FC<TopValueBarProps> = ({
  label,
  count,
  percentage,
}) => (
  <Box sx={{ mb: 1 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
      <Typography
        variant="body2"
        noWrap
        sx={{ maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {count} ({percentage.toFixed(1)}%)
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={percentage}
      sx={{
        height: 6,
        borderRadius: 3,
        bgcolor: "grey.100",
        "& .MuiLinearProgress-bar": {
          bgcolor: "primary.main",
          borderRadius: 3,
        },
      }}
    />
  </Box>
);

export const ColumnDetailCard: React.FC<ColumnDetailCardProps> = ({
  columnName,
  column,
  type,
}) => {
  const typeColor = getTypeColor(type);
  const topValues = column.top_values
    ? Object.entries(column.top_values).slice(0, 5)
    : [];
  const maxTopValue =
    topValues.length > 0 ? Math.max(...topValues.map(([, v]) => v)) : 1;

  const isNumeric = type === "numeric" && column.mean !== undefined;

  return (
    <Accordion sx={{ mb: 1, border: "1px solid", borderColor: "grey.200" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: typeColor,
              color: "white",
              borderRadius: 1,
              p: 0.5,
              minWidth: 28,
            }}
          >
            {getTypeIcon(type)}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {columnName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {column.dtype} • {column.subtype || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                Unique
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {column.num_unique}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                Missing
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {column.num_na} ({(column.num_missing_pct ?? 0).toFixed(1)}%)
              </Typography>
            </Box>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {type === "text" && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Text Overview
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5 }}>
                <StatRow
                  label="Avg length"
                  value={
                    column.avg_length != null
                      ? `${column.avg_length.toFixed(1)} chars`
                      : "N/A"
                  }
                />
                <StatRow
                  label="Length range"
                  value={
                    column.min_length != null && column.max_length != null
                      ? `${column.min_length}-${column.max_length} chars`
                      : "N/A"
                  }
                />
                <StatRow
                  label="Cardinality"
                  value={column.cardinality_level}
                />
                {column.text_quality && (
                  <>
                    <StatRow
                      label="Special chars"
                      value={`${(column.text_quality.special_char_ratio * 100).toFixed(1)}%`}
                    />
                    <StatRow
                      label="Duplicates"
                      value={`${(column.text_quality.duplicate_ratio * 100).toFixed(1)}%`}
                    />
                  </>
                )}
              </Paper>
            </Box>
          )}

          {isNumeric && (
            <>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Summary Statistics
                </Typography>
                <Paper variant="outlined" sx={{ p: 1.5 }}>
                  <StatRow label="Mean" value={formatCurrency(column.mean)} />
                  <StatRow
                    label="Median"
                    value={formatCurrency(column.median)}
                  />
                  <StatRow label="Std Dev" value={formatCurrency(column.std)} />
                  <StatRow label="Min" value={formatCurrency(column.min)} />
                  <StatRow label="Max" value={formatCurrency(column.max)} />
                  {column.q25 !== undefined && column.q75 !== undefined && (
                    <StatRow
                      label="IQR"
                      value={`${formatCurrency(column.q25)} - ${formatCurrency(column.q75)}`}
                    />
                  )}
                </Paper>
              </Box>
              {(column.skew !== undefined || column.kurtosis !== undefined) && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 1 }}
                  >
                    Distribution
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 1.5 }}>
                    {column.skew !== undefined && (
                      <StatRow
                        label="Skewness"
                        value={`${column.skew.toFixed(2)} ${
                          Math.abs(column.skew) > 1
                            ? "(highly skewed)"
                            : column.skew > 0.5
                              ? "(right-skewed)"
                              : ""
                        }`}
                      />
                    )}
                    {column.kurtosis !== undefined && (
                      <StatRow
                        label="Kurtosis"
                        value={`${column.kurtosis.toFixed(2)} ${
                          column.kurtosis > 3 ? "(heavy tails)" : ""
                        }`}
                      />
                    )}
                  </Paper>
                </Box>
              )}
              {column.outlier_percentage_iqr !== undefined &&
                column.outlier_percentage_iqr > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ mb: 1 }}
                    >
                      Outliers
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderColor:
                          column.outlier_percentage_iqr > 10
                            ? "warning.main"
                            : "grey.200",
                        bgcolor:
                          column.outlier_percentage_iqr > 10
                            ? "warning.light"
                            : "transparent",
                      }}
                    >
                      <StatRow
                        label="Outliers (IQR)"
                        value={`${column.outlier_count_iqr} (${column.outlier_percentage_iqr.toFixed(1)}%)`}
                      />
                      {column.outlier_percentage_iqr > 10 && (
                        <Typography variant="caption" color="warning.dark">
                          High outlier percentage - consider using log scale or
                          separate outlier view
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                )}
            </>
          )}

          {topValues.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Top Values
              </Typography>
              {topValues.map(([value, count]) => (
                <TopValueBar
                  key={value}
                  label={value}
                  count={count}
                  percentage={(count / maxTopValue) * 100}
                />
              ))}
            </Box>
          )}

          {type === "text" &&
            column.text_preprocessing_needs?.needs_preprocessing && (
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Text Quality
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderColor: "warning.main",
                    bgcolor: "warning.light",
                  }}
                >
                  <Typography variant="body2" color="warning.dark">
                    Preprocessing recommended:{" "}
                    {column.text_preprocessing_needs.recommendations.join(", ")}
                  </Typography>
                </Paper>
              </Box>
            )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
