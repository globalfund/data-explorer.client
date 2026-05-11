import React from "react";
import Box from "@mui/material/Box";
import { RBReportModel } from "app/state/api/action-reducers/report-builder/sync";
import { StatelessReportCanvas } from "app/pages/report-builder/preview/StatelessReportCanvas";
import { ReportViewToolbar } from "app/pages/ai-explorer/components/ReportViewToolbar";
import { FeedbackWidget } from "app/pages/ai-explorer/components/FeedbackWidget";

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
      <FeedbackWidget candidateId="report-view" label="Report View" />
      <ReportViewToolbar report={report} />
      <StatelessReportCanvas report={report} id="stateless-report-canvas" />
    </Box>
  );
};
