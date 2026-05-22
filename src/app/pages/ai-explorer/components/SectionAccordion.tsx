import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SxProps } from "@mui/material/styles";
import { FeedbackWidget } from "app/pages/ai-explorer/components/FeedbackWidget";

interface SectionAccordionProps {
  feedbackId: string;
  feedbackLabel: string;
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  titleVariant?: "h4" | "h6" | "body1" | "body2";
  defaultExpanded?: boolean;
  id?: string;
  detailsSx?: SxProps;
  headerRightContent?: React.ReactNode;
  children: React.ReactNode;
}

export const SectionAccordion: React.FC<SectionAccordionProps> = ({
  feedbackId,
  feedbackLabel,
  title,
  subTitle = "",
  titleVariant = "h4",
  defaultExpanded = false,
  id,
  detailsSx,
  headerRightContent,
  children,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box id={id} sx={{ position: "relative" }}>
      {expanded && (
        <FeedbackWidget candidateId={feedbackId} label={feedbackLabel} />
      )}
      <Accordion
        expanded={expanded}
        onChange={(_, v) => setExpanded(v)}
        sx={{ "& .MuiAccordionDetails-root": { px: 2, pb: 2 } }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              pr: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "2px",
                py: "4px",
              }}
            >
              <Typography variant={titleVariant} fontWeight={600}>
                {title}
              </Typography>
              {subTitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={400}
                >
                  {subTitle}
                </Typography>
              )}
            </Box>
            {headerRightContent}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ ...detailsSx, mt: 2 }}>
          {children}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
