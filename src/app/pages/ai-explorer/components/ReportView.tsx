import React from "react";
import Box from "@mui/material/Box";
import { RBReportModel } from "app/state/api/action-reducers/report-builder/sync";
import { StatelessReportCanvas } from "app/pages/report-builder/preview/StatelessReportCanvas";
import { ReportViewToolbar } from "app/pages/ai-explorer/components/ReportViewToolbar";

interface ReportViewProps {
  report: RBReportModel;
}

export const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  return (
    <Box
      className="scrollbar"
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "100%",
      }}
    >
      <ReportViewToolbar report={report} />
      <StatelessReportCanvas report={report} />
    </Box>
  );
};
