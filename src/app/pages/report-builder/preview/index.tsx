import React from "react";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { PageLoader } from "app/components/page-loader";
import { isReportItemComplete } from "app/pages/report-builder/component-registry/model";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetReport } from "app/hooks/queries/report-builder";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import {
  useStore,
  useStoreActions,
  useStoreState,
} from "app/state/store/hooks";
import { EmptyPreview } from "app/pages/report-builder/builder/components/empty-preview";
import ViewModeContainer from "app/pages/report-builder/builder/components/order-container/view";
import { ReportItemContent } from "app/pages/report-builder/component-registry/renderer";
import { ReportBuilderLoadError } from "app/pages/report-builder/components/load-error";

export const Component: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const reportQuery = useGetReport(id);
  const reportData = reportQuery?.data?.data;

  useTitle(`The Data Explorer - ${reportData?.name ?? "Report"}`);

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

  const store = useStore();

  React.useEffect(() => {
    // Edits saved on the way here may still be in flight, or fail. Like the
    // editor, keep this report's unsaved draft over the cached copy, so a
    // failed save doesn't lose them.
    const draft = store.getState().RBReportItemsState;
    if (reportData && !(draft.id === reportData.id && draft.dirty)) {
      hydrateActiveReport(reportData);
    }
    return () => {
      // An unsaved draft stays for the editor to save.
      if (!store.getState().RBReportItemsState.dirty) {
        resetReport();
      }
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
        padding: "50px 0",
        alignItems: "center",
        position: "relative",
        bgcolor: "#495057",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)",
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
        <React.Fragment>
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
            {items.length === 0 && <EmptyPreview id={id!} />}
            {items.map((item) => (
              <ViewModeContainer key={item.id}>
                <ReportItemContent item={item} viewMode />
              </ViewModeContainer>
            ))}
          </Box>
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
        </React.Fragment>
      )}
    </Box>
  );
};

const AuthenticatedComponent = withAuthenticationRequired(Component, {
  onRedirecting: () => {
    localStorage.setItem("redirectTo", window.location.pathname);
    return <PageLoader />;
  },
});

export { AuthenticatedComponent as ReportBuilderPreviewPage };
