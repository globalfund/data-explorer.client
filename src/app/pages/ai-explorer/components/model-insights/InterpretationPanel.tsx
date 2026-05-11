import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";

interface InterpretationPanelProps {
  markdown: string;
}

export const InterpretationPanel: React.FC<InterpretationPanelProps> = ({
  markdown,
}) => (
  <Box>
    <Typography
      variant="caption"
      fontWeight={700}
      color="text.secondary"
      sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
    >
      Interpretation
    </Typography>
    <Box
      sx={{
        mt: 1,
        p: 1.5,
        bgcolor: "grey.50",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "grey.200",
        maxHeight: 320,
        overflowY: "auto",
        "& h1, & h2, & h3, & h4": {
          mt: 2,
          mb: 0.5,
          fontFamily: "inherit",
          fontWeight: 700,
        },
        "& h1": { fontSize: "1.1rem" },
        "& h2": { fontSize: "1rem" },
        "& h3": { fontSize: "0.9rem" },
        "& p": { fontSize: "0.875rem", mb: 1, lineHeight: 1.6 },
        "& ul, & ol": { pl: 2.5, mb: 1 },
        "& li": { fontSize: "0.875rem", mb: 0.25 },
        "& strong": { fontWeight: 700 },
        "& em": { fontStyle: "italic" },
        "& code": {
          fontFamily: "monospace",
          fontSize: "0.8rem",
          bgcolor: "grey.200",
          px: 0.5,
          borderRadius: 0.5,
        },
        "& pre": {
          bgcolor: "grey.200",
          p: 1.5,
          borderRadius: 1,
          overflowX: "auto",
          fontSize: "0.8rem",
          mb: 1,
        },
        "& blockquote": {
          borderLeft: "3px solid",
          borderColor: "grey.400",
          pl: 1.5,
          ml: 0,
          color: "text.secondary",
          fontStyle: "italic",
        },
        "& hr": { borderColor: "grey.300", my: 1.5 },
        "& a": { color: "#002561" },
      }}
    >
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </Box>
  </Box>
);
