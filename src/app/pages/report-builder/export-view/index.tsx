import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams, useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetReport } from "app/hooks/queries/report-builder";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import ViewModeContainer from "app/pages/report-builder/builder/components/order-container/view";
import { isReportItemComplete } from "app/pages/report-builder/component-registry/model";
import { ReportItemContent } from "app/pages/report-builder/component-registry/renderer";
import { ReportBuilderLoadError } from "app/pages/report-builder/components/load-error";

export const ReportBuilderExportViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [searchParams] = useSearchParams();

  const thumbnail = searchParams.get("screenshot") === "true";

  const reportQuery = useGetReport(id);
  const reportData = reportQuery?.data?.data;

  const hydrateActiveReport = useStoreActions(
    (actions) => actions.RBReportItemsState.hydrateReport,
  );

  const resetReport = useStoreActions(
    (actions) => actions.RBReportItemsState.resetReport,
  );

  const reportState = useStoreState((state) => state.RBReportItemsState);

  const items = React.useMemo(() => {
    return reportState.items.filter((item) => {
      return isReportItemComplete(item);
    });
  }, [reportState.items]);

  const addedItemRef = React.useRef(items.length > 0);

  React.useEffect(() => {
    if (reportData) {
      hydrateActiveReport(reportData);
    }
    return () => {
      resetReport();
    };
  }, [reportData]);

  React.useEffect(() => {
    if (items.length === 0) {
      addedItemRef.current = false;
    } else {
      addedItemRef.current = true;
    }
  }, [items.length]);

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
      {reportQuery.isLoading && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {reportQuery.isError && (
        <ReportBuilderLoadError error={reportQuery.error} itemType="report" />
      )}
      {!reportQuery.isLoading && !reportQuery.isError && (
        <Box
          id="items-container"
          className="scrollbar"
          sx={{
            gap: "10px",
            flexGrow: 1,
            display: "flex",
            maxWidth: "100%",
            overflow: "overlay",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            minHeight: "calc(100% - 200px)",
            width: reportData?.settings.width
              ? `${reportData?.settings.width}px`
              : "100%",
            bgcolor: reportData?.settings?.backgroundColor,
            borderRadius: `${reportData?.settings.borderRadius}px`,
            p: reportData?.settings?.padding
              ?.map((p: string) => `${p}px`)
              .join(" "),
            border: `${reportData?.settings?.stroke}px solid ${reportData?.settings?.strokeColor}`,
            ".top-right-actions": {
              top: 4,
              right: 4,
              position: "absolute",
              ".MuiIconButton-root": {
                width: "38px",
                height: "38px",
                bgcolor: "#fff",
                borderRadius: "4px",
                border: "1px solid #cfd4da",
                "&:hover": {
                  bgcolor: "#f8f8f8",
                  borderColor: "#000000",
                },
              },
            },
          }}
        >
          {items.map((item) => (
            <ViewModeContainer key={item.id}>
              <ReportItemContent item={item} viewMode />
            </ViewModeContainer>
          ))}
        </Box>
      )}
      {thumbnail ? null : (
        <Box
          sx={{
            display: "flex",
            bgcolor: "#f8f9fa",
            alignItems: "center",
            justifyContent: "space-between",
            width: reportData?.settings.width
              ? `${reportData?.settings.width}px`
              : "100%",
            p: reportData?.settings?.padding
              ?.map((p: string) => `${p}px`)
              .join(" "),
            pt: "10px",
            pb: "10px",
          }}
        >
          <Typography fontSize="14px" color="#646668">
            Built with Global Fund Report Builder
          </Typography>
          <Box
            sx={{
              p: "6px 8px",
              fontSize: "14px",
              borderRadius: "4px",
              bgcolor: "#dfe3e5",
            }}
          >
            User-generated
          </Box>
        </Box>
      )}
    </Box>
  );
};
