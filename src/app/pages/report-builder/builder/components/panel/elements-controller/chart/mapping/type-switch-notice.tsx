import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";
import {
  ChartTypeSwitch,
  joinWithAnd,
  MissingDimension,
} from "./switch-mapping";

interface Props {
  change: ChartTypeSwitch;
  /** The chart's required dimensions that are still empty. */
  missing: MissingDimension[];
  onDismiss?: () => void;
}

/** Says what switching the chart's type did to its fields, and what's left. */
export function TypeSwitchNotice({
  change,
  missing,
  onDismiss,
}: Readonly<Props>) {
  const lines = [
    change.kept.length > 0 &&
      `Kept ${joinWithAnd(
        change.kept.map(({ field, to }) => `${field} as ${to}`),
      )}.`,
    change.removed.length > 0 &&
      `Removed ${joinWithAnd(
        change.removed.map(({ field, from }) => `${field} (${from})`),
      )}.`,
    missing.length > 0 &&
      `Still needed: ${joinWithAnd(
        missing.map(({ dimension }) => dimension.name),
      )}.`,
  ].filter(Boolean) as string[];

  return (
    <Box
      role="status"
      data-cy="rb-type-switch-notice"
      sx={{
        gap: "4px",
        display: "flex",
        padding: "8px",
        borderRadius: "4px",
        flexDirection: "column",
        bgcolor: "#EFF1FE",
        border: "0.5px solid #3154F4",
      }}
    >
      <Box
        sx={{
          gap: "8px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Typography fontSize="14px" fontWeight={700} color="#252C34">
          Switched from {change.from} to {change.to}
        </Typography>
        {onDismiss ? (
          <IconButton
            aria-label="Dismiss"
            onClick={onDismiss}
            sx={{ padding: "2px", marginTop: "-1px" }}
          >
            <Close sx={{ fontSize: "16px" }} htmlColor="#252C34" />
          </IconButton>
        ) : null}
      </Box>
      {lines.map((line) => (
        <Typography key={line} fontSize="12px" color="#373D43">
          {line}
        </Typography>
      ))}
    </Box>
  );
}
