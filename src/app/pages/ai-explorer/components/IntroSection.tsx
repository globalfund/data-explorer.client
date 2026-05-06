import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SectionAccordion } from "app/pages/ai-explorer/components/SectionAccordion";

const SECTION_LINKS = [
  { href: "#ai-explorer-datasets", label: "Datasets" },
  { href: "#ai-explorer-guardrails", label: "Guardrails" },
  { href: "#ai-explorer-features", label: "Features" },
  { href: "#ai-explorer-future-outlook", label: "Future Outlook" },
];

export const IntroSection: React.FC = () => (
  <SectionAccordion
    feedbackId="intro-section"
    feedbackLabel="About This Page"
    title="About This Page"
    subTitle="Introduction and important information for users."
    defaultExpanded
  >
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
        Welcome to the AI Explorer. You are on the AI-enhanced Data Explorer
        currently deployed to our staging environment. This is a secure,
        internal-only page accessible to authorised Global Fund users.
      </Typography>
      <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
        This tool gives you access to Global Fund data, as well as selected
        external sources including the World Health Organization (WHO) and World
        Bank. You can explore datasets, generate insights, and interact with the
        data through our AI-powered conversational interface.
      </Typography>
      <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
        For more information about available features and what is coming next,
        see the{" "}
        <Link href="#ai-explorer-features" underline="hover" color="primary">
          Features
        </Link>{" "}
        list. Each section on this page contains a feedback option, look for the
        small icon at the bottom-right corner of each section.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          bgcolor: "#f0f4ff",
          border: "1px solid #c8d8f5",
          borderRadius: 2,
          p: 2,
        }}
      >
        <InfoOutlinedIcon
          sx={{ color: "#002561", fontSize: 18, mt: "2px", flexShrink: 0 }}
        />
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            color="#002561"
            display="block"
            sx={{ mb: 0.5, textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            Important Notice
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
            All queries, interactions, and AI-generated outputs on this page are
            logged and retained by the Global Fund&quot;s Data &amp; Analytics
            team. We record this activity for three reasons: first, to protect
            the security and integrity of the Global Fund&quot;s data
            environment; second, to meet our internal audit and accountability
            obligations; and third, to continuously improve this tool based on
            real usage. Reviewing how you and your colleagues use the AI
            assistant helps us understand what is working, where outputs can be
            more accurate or useful, and how to prioritise new capabilities.
            Access to these logs is restricted to authorised staff, and no data
            is shared outside the Global Fund&quot;s systems.
          </Typography>
        </Box>
      </Box>

      <Box>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Jump to section
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
          {SECTION_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              underline="hover"
              color="primary"
              variant="body2"
              fontWeight={500}
            >
              {label}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  </SectionAccordion>
);
