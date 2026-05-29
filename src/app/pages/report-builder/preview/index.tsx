import React from "react";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetReport } from "app/hooks/queries/report-builder";
import KPIBox from "app/pages/report-builder/builder/components/kpi";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { ReportBuilderPageGrid } from "app/pages/report-builder/builder/components/grid";
import { ReportBuilderPageText } from "app/pages/report-builder/builder/components/text";
import SectionDivider from "app/pages/report-builder/builder/components/section-divider";
import { ReportBuilderPageChart } from "app/pages/report-builder/builder/components/chart";
import { ReportBuilderPageTable } from "app/pages/report-builder/builder/components/table";
import { ReportBuilderPageImage } from "app/pages/report-builder/builder/components/image";
import ViewModeContainer from "app/pages/report-builder/builder/components/order-container/view";

export const ReportBuilderPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const reportQuery = useGetReport(id);
  const reportData = reportQuery?.data?.data;

  useTitle(`The Data Explorer - ${reportData?.name ?? "Report"}`);

  const setActiveReport = useStoreActions(
    (actions) => actions.RBReportItemsState.setReport,
  );

  const resetReport = useStoreActions(
    (actions) => actions.RBReportItemsState.resetReport,
  );

  const reportState = useStoreState((state) => state.RBReportItemsState);

  const checkEmptyItem = (item: RBReportItem): boolean => {
    if (item.type === "unknown") return false;
    switch (item.type) {
      case "text":
        return !!item.data.rte;
      case "chart":
        return (
          !!item.data.chartType &&
          !!item.data.dataset &&
          !!item.data.renderedChartData
        );
      case "kpi_box":
        return item.open;
      case "table":
        return false; // tables are not supported in preview currently
      case "grid":
        return item.data.items.some((child) => checkEmptyItem(child));
      case "column":
        return item.data.items.some((child) => checkEmptyItem(child));
      case "image":
        return !!item.data.src;
      default:
        return false;
    }
  };

  const getItemByType = (item: RBReportItem) => {
    switch (item.type) {
      case "text":
        return (
          <ViewModeContainer>
            <ReportBuilderPageText
              id={item.id}
              focus={item.focus}
              initialKey={item.key}
              viewMode
            />
          </ViewModeContainer>
        );
      case "chart":
        return (
          <ViewModeContainer>
            <ReportBuilderPageChart id={item.id} viewMode />
          </ViewModeContainer>
        );
      case "table":
        return (
          <ViewModeContainer>
            <ReportBuilderPageTable id={item.id} viewMode />
          </ViewModeContainer>
        );
      case "image":
        return (
          <ViewModeContainer>
            <ReportBuilderPageImage id={item.id} viewMode />
          </ViewModeContainer>
        );
      case "grid":
        return (
          <ViewModeContainer>
            <ReportBuilderPageGrid
              columns={item.data.columns}
              rows={item.data.rows}
              id={item.id}
              viewMode
            />
          </ViewModeContainer>
        );
      case "kpi_box":
        return (
          <ViewModeContainer>
            <KPIBox id={item.id} viewMode />
          </ViewModeContainer>
        );
      case "column":
        return (
          <ViewModeContainer>
            <ReportBuilderPageGrid
              rows={1}
              columns={item.data.columns}
              id={item.id}
              viewMode
            />
          </ViewModeContainer>
        );
      case "section_divider":
        return (
          <ViewModeContainer>
            <SectionDivider id={item.id} viewMode />
          </ViewModeContainer>
        );
      default:
        return <React.Fragment />;
    }
  };

  const items = React.useMemo(() => {
    return reportState.items.filter((item) => {
      return checkEmptyItem(item);
    });
  }, [reportState.items]);

  const addedItemRef = React.useRef(items.length > 0);

  React.useEffect(() => {
    if (reportData) {
      setActiveReport(reportData);
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
      {!reportQuery.isLoading && (
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
            {items.map((item) => (
              <React.Fragment key={item.id}>
                {getItemByType(item)}
              </React.Fragment>
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
