import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import { useStoreActions } from "app/state/store/hooks";
import { useParams } from "react-router-dom";
import { useGetReport } from "app/hooks/queries/report-builder";
import { ReportCanvas } from "app/pages/report-builder/preview/ReportCanvas";
import { GlobalFundLogo } from "app/pages/report-builder/components/GlobalFundLogo";
import { ReportDisclaimer } from "app/pages/report-builder/components/ReportDisclaimer";

export const ReportBuilderPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const reportQuery = useGetReport(id);
  const reportData = reportQuery?.data?.data;

  const setActiveReport = useStoreActions(
    (actions) => actions.RBReportItemsState.setReport,
  );
  const resetReport = useStoreActions(
    (actions) => actions.RBReportItemsState.resetReport,
  );

  useEffect(() => {
    if (reportData) {
      setActiveReport(reportData);
    }
    return () => {
      resetReport();
    };
  }, [reportData]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <GlobalFundLogo />

      {reportQuery.isLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!reportQuery.isLoading && reportData && (
        <ReportCanvas
          settings={reportData.settings}
          sx={{ minHeight: "calc(100% - 200px)" }}
        />
      )}

      <ReportDisclaimer />
    </Box>
  );
};
