import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams, useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetAsset } from "app/hooks/queries/report-builder";
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

export const ReportBuilderAssetExportViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [searchParams] = useSearchParams();

  const thumbnail = searchParams.get("screenshot") === "true";

  const assetQuery = useGetAsset(id);
  const assetData = assetQuery?.data?.data;

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
        return !!item.data?.dataset;
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

  React.useEffect(() => {
    if (assetData) {
      setActiveReport({
        name: assetData.name,
        description: assetData.description,
        settings: {
          width: (window.innerWidth > 1440
            ? 1392
            : window.innerWidth - 32
          ).toString(),
          height: (window.innerHeight - 160).toString(),
          padding: ["50", "50", "50", "50"],
          stroke: "0",
          strokeColor: "#000000",
          backgroundColor: "#ffffff",
          borderRadius: "0",
        },
        items: [
          {
            ...assetData,
            open: false,
          },
        ],
      });
    }
    return () => {
      resetReport();
    };
  }, [assetData]);

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
      {assetQuery.isLoading && (
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
      {!assetQuery.isLoading && (
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
            width: reportState?.settings.width
              ? `${reportState?.settings.width}px`
              : "100%",
            bgcolor: reportState?.settings?.backgroundColor,
            borderRadius: `${reportState?.settings.borderRadius}px`,
            p: reportState?.settings?.padding
              ?.map((p: string) => `${p}px`)
              .join(" "),
            border: `${reportState?.settings?.stroke}px solid ${reportState?.settings?.strokeColor}`,
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
            <React.Fragment key={item.id}>{getItemByType(item)}</React.Fragment>
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
            width: reportState?.settings.width
              ? `${reportState?.settings.width}px`
              : "100%",
            p: reportState?.settings?.padding
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
