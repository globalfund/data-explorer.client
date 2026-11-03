import React from "react";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import { move } from "@dnd-kit/helpers";
import Button from "@mui/material/Button";
import { uniqueId } from "app/utils/uniqueId";
import Typography from "@mui/material/Typography";
import { DragDropProvider } from "@dnd-kit/react";
import { PageLoader } from "app/components/page-loader";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetReport } from "app/hooks/queries/report-builder";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { Empty } from "app/pages/report-builder/builder/components/empty";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ReportBuilderPageReportSettings } from "./components/report-settings";
import CopyIcon from "app/assets/vectors/report-builder-responsive/copy.svg?react";
import MonitorIcon from "app/assets/vectors/report-builder-responsive/monitor.svg?react";
import { ItemComponent } from "app/pages/report-builder/builder/components/order-container";
import ElementsController from "app/pages/report-builder/builder/components/panel/elements-controller";
import { ReportBuilderMobileBottomBar } from "app/pages/report-builder/main/components/mobile-bottom-bar";
import { createReportItem } from "app/pages/report-builder/component-registry/model";
import { ReportItemContent } from "app/pages/report-builder/component-registry/renderer";
import { ReportBuilderLoadError } from "app/pages/report-builder/components/load-error";

const ReportBuilderDesktopPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [searchParams] = useSearchParams();

  const reportQuery = useGetReport(id);
  const reportData = reportQuery?.data?.data;

  // Public and template reports can be opened by anyone, but only the owner's
  // changes are saved, so everyone else gets the read-only view.
  const isOwner = !reportData || !user?.sub || reportData.owner === user.sub;

  React.useEffect(() => {
    if (!isOwner) {
      navigate(`/report-builder/reports/${id}`, { replace: true });
    }
  }, [isOwner, id, navigate]);

  useTitle(`The Data Explorer - ${reportData?.name ?? "Report"}`);

  const hydrateActiveReport = useStoreActions(
    (actions) => actions.RBReportItemsState.hydrateReport,
  );
  const reportState = useStoreState((state) => state.RBReportItemsState);
  const items = reportState.items;
  const addedItemRef = React.useRef(items.length > 0);

  const setItems = useStoreActions(
    (actions) => actions.RBReportItemsState.setItems,
  );

  const setNotes = useStoreActions(
    (actions) => actions.RBReportNotesState.setValue,
  );
  const addItem = useStoreActions(
    (actions) => actions.RBReportItemsState.addItem,
  );

  const hydratedReportIdRef = React.useRef<string>();

  React.useEffect(() => {
    if (!reportData || reportQuery.isFetching || !isOwner) return;
    if (hydratedReportIdRef.current === reportData.id) return;

    hydratedReportIdRef.current = reportData.id;

    const hasMatchingDirtyDraft =
      reportState.id === reportData.id && reportState.dirty;

    if (!hasMatchingDirtyDraft) {
      hydrateActiveReport(reportData);
    }
  }, [
    reportData,
    reportQuery.isFetching,
    isOwner,
    reportState.id,
    reportState.dirty,
    hydrateActiveReport,
  ]);

  React.useEffect(() => {
    const assetToInsert = localStorage.getItem("assetToInsert");
    if (reportState.id) {
      if (assetToInsert) {
        const { asset, reportId } = JSON.parse(assetToInsert);
        if (reportId === reportState.id) {
          addItem({ ...asset, initialized: true, id: uniqueId() });
          localStorage.removeItem("assetToInsert");
        }
      }
    }
  }, [reportState.id, addItem]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !addedItemRef.current &&
      /^[a-zA-Z0-9]$/.test(e.key) &&
      document.activeElement?.tagName !== "INPUT"
    ) {
      addItem(
        createReportItem("text", {
          initialized: true,
          options: {
            borderColor: "#000000",
            borderRadius: "8px",
            backgroundColor: "#ffffff00",
          },
        }),
      );
      addedItemRef.current = true;
    }
  };

  // const onSave = () => {
  //   if (id) {
  //     updateReport.mutate({
  //       reportId: id,
  //       ...reportData.data?.data,
  //     });
  //   }
  // };

  const thumbnail = React.useMemo(() => {
    return searchParams.get("screenshot") === "true";
  }, [searchParams]);

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      setNotes("");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    if (items.length === 0) {
      addedItemRef.current = false;
    } else {
      addedItemRef.current = true;
    }
  }, [items.length]);

  return (
    <React.Fragment>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          bgcolor: "#495057",
          position: "relative",
          justifyContent: "center",
          paddingTop: thumbnail ? "0px" : "50px",
          paddingBottom: thumbnail ? "0px" : "50px",
          minHeight: thumbnail ? undefined : "calc(100vh - 60px)",
        }}
      >
        <Box
          sx={{
            zIndex: 2,
            top: "130px",
            left: "10px",
            width: "220px",
            position: "fixed",
            borderRadius: "8px",
            flexDirection: "column",
            bgcolor: colors.primary.white,
            boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60)",
          }}
        >
          <ReportBuilderPageReportSettings />
        </Box>
        <Box
          sx={{
            zIndex: 2,
            top: "130px",
            right: "10px",
            position: "fixed",
          }}
        >
          <ElementsController />
        </Box>
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
        <DragDropProvider
          onDragOver={(event) => {
            setItems(move(items, event));
          }}
        >
          {!reportQuery.isLoading && !reportQuery.isError && isOwner && (
            <Box
              id="items-container"
              className="scrollbar"
              sx={{
                gap: "10px",
                display: "flex",
                overflow: "overlay",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: reportState?.settings.width
                  ? `${reportState?.settings.width}px`
                  : "100%",
                bgcolor: reportState?.settings.backgroundColor,
                borderRadius: `${reportState?.settings.borderRadius}px`,
                p: reportState?.settings.padding
                  .map((p: string) => `${p}px`)
                  .join(" "),
                border: `${reportState?.settings.stroke}px solid ${reportState?.settings.strokeColor}`,
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
              {items.length === 0 && <Empty />}
              {items.map((item, index) => (
                <ItemComponent
                  key={item.id}
                  id={item.id}
                  index={index}
                  childrenData={[]}
                >
                  <ReportItemContent item={item} />
                </ItemComponent>
              ))}
            </Box>
          )}
        </DragDropProvider>
      </Box>
    </React.Fragment>
  );
};

const MobileReportBuilderHandoff: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const editUrl = `${window.location.origin}/report-builder/reports/${id}/edit`;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 62px)",
        px: "20px",
        pb: "96px",
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        bgcolor: "#f8f9fa",
      }}
    >
      <Box sx={{ width: 55, height: 55, mb: "26px" }}>
        <MonitorIcon width={55} height={55} />
      </Box>
      <Typography fontSize="20px" fontWeight={700} mb="14px">
        Best built on a bigger screen
      </Typography>
      <Typography fontSize="16px" lineHeight="20px" mb="32px">
        Report editing works best on tablet and desktop. Copy the link to pick
        up where you left off on another device.
      </Typography>
      <Box sx={{ width: "100%", display: "flex", gap: "16px" }}>
        <Box
          sx={{
            height: "42px",
            flex: 1,
            px: "8px",
            display: "block",
            overflow: "hidden",
            fontSize: "14px",
            lineHeight: "40px",
            textAlign: "left",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            border: "1px solid #98a1aa",
          }}
        >
          {editUrl}
        </Box>
        <Button
          variant="outlined"
          startIcon={<CopyIcon width={18} height={18} />}
          onClick={() => navigator.clipboard.writeText(editUrl)}
          sx={{ minWidth: "94px", color: "#252c34", textTransform: "none" }}
        >
          Copy
        </Button>
      </Box>
      <Typography
        width="100%"
        mt="8px"
        mb="32px"
        fontSize="14px"
        textAlign="left"
        color="#59616a"
      >
        Open this link on your desktop or tablet to edit.
      </Typography>
      <Button
        fullWidth
        variant="contained"
        onClick={() => navigate(`/report-builder/reports/${id}`)}
        sx={{
          height: "42px",
          maxWidth: "248px",
          mb: "16px",
          fontSize: "16px",
          bgcolor: "#3154f4",
          textTransform: "none",
          color: "#fff",
        }}
      >
        View report (read-only)
      </Button>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => navigate("/report-builder")}
        sx={{
          height: "42px",
          maxWidth: "248px",
          fontSize: "16px",
          color: "#252c34",
          textTransform: "none",
        }}
      >
        Back to Dashboard
      </Button>
      <ReportBuilderMobileBottomBar
        value="allReports"
        onChange={(value) => {
          navigate(
            value === "allReports"
              ? "/report-builder"
              : `/report-builder?section=${value}`,
          );
        }}
      />
    </Box>
  );
};

export const Component: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  return isMobile ? (
    <MobileReportBuilderHandoff />
  ) : (
    <ReportBuilderDesktopPage />
  );
};

const AuthenticatedComponent = withAuthenticationRequired(Component, {
  onRedirecting: () => {
    localStorage.setItem("redirectTo", window.location.pathname);
    return <PageLoader />;
  },
});

export { AuthenticatedComponent as ReportBuilderPage };
