import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams, useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetAsset } from "app/hooks/queries/report-builder";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import ViewModeContainer from "app/pages/report-builder/builder/components/order-container/view";
import { ReportItemContent } from "app/pages/report-builder/component-registry/renderer";
import { isReportItemComplete } from "app/pages/report-builder/component-registry/model";
import { ReportBuilderLoadError } from "app/pages/report-builder/components/load-error";

export const ReportBuilderAssetExportViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [searchParams] = useSearchParams();

  const thumbnail = searchParams.get("screenshot") === "true";

  const assetQuery = useGetAsset(id);
  const assetData = assetQuery?.data?.data;

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

  React.useEffect(() => {
    if (assetData) {
      hydrateActiveReport({
        id: assetData.id,
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
            initialized: false,
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
      {assetQuery.isError && (
        <ReportBuilderLoadError error={assetQuery.error} itemType="asset" />
      )}
      {!assetQuery.isLoading && !assetQuery.isError && (
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
