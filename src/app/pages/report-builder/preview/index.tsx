import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { Empty } from "app/pages/report-builder/builder/components/empty";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { ReportBuilderPageGrid } from "app/pages/report-builder/builder/components/grid";
import { ReportBuilderPageText } from "app/pages/report-builder/builder/components/text";
import { ReportBuilderPageChart } from "app/pages/report-builder/builder/components/chart";
import { ReportBuilderPageTable } from "app/pages/report-builder/builder/components/table";
import { ReportBuilderPageImage } from "app/pages/report-builder/builder/components/image";

import { useParams } from "react-router-dom";
import { useGetReport, usePatchReport } from "app/hooks/queries/report-builder";
import { useDebounce } from "react-use";
import KPIBox from "../builder/components/kpi";

export const ReportBuilderPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const reportQuery = useGetReport(id);
  const reportData = reportQuery?.data?.data;

  const updateReport = usePatchReport(id);

  const setActiveReport = useStoreActions(
    (actions) => actions.RBReportItemsState.setReport,
  );

  const resetReport = useStoreActions(
    (actions) => actions.RBReportItemsState.resetReport,
  );

  const reportState = useStoreState((state) => state.RBReportItemsState);
  const items = reportState.items;
  const setActiveRTE = useStoreActions(
    (actions) => actions.RBReportRTEState.setActiveRTE,
  );
  const addedItemRef = React.useRef(items.length > 0);

  useEffect(() => {
    if (reportData) {
      setActiveReport(reportData);
    }
    return () => {
      resetReport();
    };
  }, [reportData]);

  useDebounce(
    () => {
      updateReport.mutate({
        items: reportState.items,
        description: reportState.description,
        settings: reportState.settings,
        name: reportState.name,
      });
    },
    2000,
    [
      reportState.items,
      reportState.description,
      reportState.settings,
      reportState.name,
    ],
  );

  const getItemByType = (item: RBReportItem) => {
    switch (item.type) {
      case "text":
        return (
          <ReportBuilderPageText
            id={item.id}
            setEditor={setActiveRTE}
            settings={item.options}
            focus={item.focus}
            initialKey={item.key}
            viewMode
          />
        );
      case "chart":
        return <ReportBuilderPageChart id={item.id} viewMode />;
      case "table":
        return <ReportBuilderPageTable id={item.id} viewMode />;
      case "image":
        return <ReportBuilderPageImage id={item.id} viewMode />;
      case "grid":
        return (
          <ReportBuilderPageGrid
            columns={item.data.columns}
            rows={item.data.rows}
            id={item.id}
            setEditor={setActiveRTE}
            viewMode
          />
        );
      case "kpi_box":
        return <KPIBox id={item.id} viewMode />;
      case "column":
        return (
          <ReportBuilderPageGrid
            rows={1}
            columns={item.data.columns}
            id={item.id}
            setEditor={setActiveRTE}
            viewMode
          />
        );
      case "section_divider":
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              position: "relative",
              flexDirection: "column",
              ".top-right-actions": {
                top: -19,
                right: -45,
                display: "flex",
                height: "fit-content",
              },
            }}
          >
            <Divider key={item.id} flexItem />
          </Box>
        );
      default:
        return <React.Fragment />;
    }
  };

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
      }}
    >
      <Box
        sx={{
          maxWidth: "100%",
          overflow: "overlay",
          bgcolor: "#ffffff",
          height: "fit-content",
          paddingBottom: "40px",
          boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60)",
        }}
      >
        <Box
          id="report-builder-canvas"
          sx={{
            gap: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: `${reportData?.settings.width}px`,
            // height: `${reportData?.settings.height}px`,
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
          {items.length === 0 && <Empty />}
          {items.map((item) => (
            <React.Fragment key={item.id}>{getItemByType(item)}</React.Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
