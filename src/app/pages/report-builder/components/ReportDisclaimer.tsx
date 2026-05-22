import React from "react";
import { Typography } from "@mui/material";

// TODO: @Psami-wondah - Move content to CMS
export const REPORT_DISCLAIMER_TEXT =
  "The content produced using the The Global Fund Report Builder is prepared by the user and does not constitute an official output or " +
  "approved information from The Global Fund. TGF is not responsible for the accuracy or validity of the content generated through this tool.";

export const ReportDisclaimer: React.FC = () => {
  return (
    <Typography
      variant="body2"
      color="white"
      marginTop={"30px"}
      textAlign={"center"}
    >
      {REPORT_DISCLAIMER_TEXT}
    </Typography>
  );
};
