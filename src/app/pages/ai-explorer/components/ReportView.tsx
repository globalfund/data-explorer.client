import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { useStoreActions } from "app/state/store/hooks";
import { RBReportModel } from "app/state/api/action-reducers/report-builder/sync";
import { ReportCanvas } from "app/pages/report-builder/preview/ReportCanvas";
import { ReportViewToolbar } from "app/pages/ai-explorer/components/ReportViewToolbar";

interface ReportViewProps {
  report: RBReportModel;
}

export const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const setReport = useStoreActions(
    (actions) => actions.RBReportItemsState.setReport,
  );
  const resetReport = useStoreActions(
    (actions) => actions.RBReportItemsState.resetReport,
  );

  useEffect(() => {
    setReport(report);
    return () => {
      resetReport();
    };
  }, [report]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <ReportViewToolbar report={report} />
      <ReportCanvas settings={report.settings} />
    </Box>
  );
};
