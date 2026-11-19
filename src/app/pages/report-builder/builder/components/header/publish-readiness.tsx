import React from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { PublishReadinessIssue } from "app/pages/report-builder/publish-readiness";

interface PublishReadinessPopoverProps {
  anchorEl: HTMLElement | null;
  issues: PublishReadinessIssue[];
  onClose: () => void;
  /** Takes the author to the item to fix it. */
  onFix: (issue: PublishReadinessIssue) => void;
}

/** Shown instead of the share options while the report isn't ready to share. */
export const PublishReadinessPopover: React.FC<
  PublishReadinessPopoverProps
> = ({ anchorEl, issues, onClose, onFix }) => (
  <Popover
    open={!!anchorEl && issues.length > 0}
    anchorEl={anchorEl}
    onClose={onClose}
    disableScrollLock
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: -5, horizontal: "right" }}
    slotProps={{
      paper: {
        sx: {
          width: "320px",
          borderRadius: "4px",
          border: "1px solid #dfe3e5",
          boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.30)",
        },
      },
    }}
    sx={{ zIndex: 1400 }}
  >
    <Box
      role="dialog"
      aria-labelledby="rb-publish-readiness-title"
      data-cy="rb-publish-readiness"
    >
      <Box sx={{ p: "16px 16px 12px" }}>
        <Typography
          id="rb-publish-readiness-title"
          fontSize="16px"
          fontWeight={700}
          color="#000"
        >
          Not ready to share
        </Typography>
        <Typography fontSize="14px" color="#373D43" mt="4px">
          {issues.length === 1
            ? "A chart in this report has no title. Give it one before sharing."
            : `${issues.length} charts in this report have no title. Give them one before sharing.`}
        </Typography>
      </Box>
      <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
        {issues.map((issue) => (
          <li key={issue.itemId}>
            <ButtonBase
              data-cy="rb-publish-readiness-issue"
              data-id={issue.itemId}
              onClick={() => onFix(issue)}
              sx={{
                gap: "8px",
                width: "100%",
                display: "flex",
                textAlign: "left",
                padding: "11px 16px",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid #dfe3e5",
                "&:hover, &.Mui-focusVisible": { bgcolor: "#EFF1FE" },
              }}
            >
              <Typography component="span" fontSize="14px" color="#000">
                <Box component="span" fontWeight={700}>
                  {issue.label}
                </Box>{" "}
                {issue.message}
              </Typography>
              <Box
                component="span"
                sx={{
                  gap: "2px",
                  flexShrink: 0,
                  display: "flex",
                  fontSize: "14px",
                  color: "#3154F4",
                  alignItems: "center",
                }}
              >
                Fix
                <ChevronRight fontSize="small" />
              </Box>
            </ButtonBase>
          </li>
        ))}
      </Box>
    </Box>
  </Popover>
);
