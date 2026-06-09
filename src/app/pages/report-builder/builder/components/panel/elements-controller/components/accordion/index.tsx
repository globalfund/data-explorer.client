import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const accordionSx = {
  m: 0,
  boxShadow: "none",
  bgcolor: "transparent",
  borderRadius: "0px",
  borderBottom: "none",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    m: 0,
  },
};

const accordionSummarySx = {
  px: "8px",
  py: "7px",
  minHeight: "40px",
  borderBottom: "0.5px solid #98A1AA",
  "&.Mui-expanded": {
    minHeight: "40px",
  },
  ".MuiAccordionSummary-content": {
    m: 0,
    alignItems: "center",
  },
  ".MuiAccordionSummary-content.Mui-expanded": {
    m: 0,
  },
  ".MuiAccordionSummary-expandIconWrapper": {
    color: "#373D43",
  },
};

const ControlAccordion = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Accordion defaultExpanded sx={accordionSx}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
      <Typography fontSize="14px" fontWeight={700} color="#000">
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ p: 0 }}>{children}</AccordionDetails>
  </Accordion>
);

export default ControlAccordion;
