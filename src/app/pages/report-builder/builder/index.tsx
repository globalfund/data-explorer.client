import React from "react";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import { DndProvider } from "react-dnd";
import { uniqueId } from "app/utils/uniqueId";
import { HTML5Backend } from "react-dnd-html5-backend";
import SectionDivider from "./components/section-divider";
import { useParams, useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetReport } from "app/hooks/queries/report-builder";
import KPIBox from "app/pages/report-builder/builder/components/kpi";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { Empty } from "app/pages/report-builder/builder/components/empty";
import { ReportBuilderPageReportSettings } from "./components/report-settings";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { ReportBuilderPageGrid } from "app/pages/report-builder/builder/components/grid";
import { ReportBuilderPageText } from "app/pages/report-builder/builder/components/text";
import { ReportBuilderPageChart } from "app/pages/report-builder/builder/components/chart";
import { ReportBuilderPageTable } from "app/pages/report-builder/builder/components/table";
import { ReportBuilderPageImage } from "app/pages/report-builder/builder/components/image";
import { ItemComponent } from "app/pages/report-builder/builder/components/order-container";
import ElementsController from "app/pages/report-builder/builder/components/panel/elements-controller";

export const ReportBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const reportQuery = useGetReport(id);
  const reportData = reportQuery?.data?.data;

  useTitle(`The Data Explorer - ${reportData?.name ?? "Report"}`);

  const setActiveReport = useStoreActions(
    (actions) => actions.RBReportItemsState.setReport,
  );
  const reportState = useStoreState((state) => state.RBReportItemsState);
  const items = reportState.items;
  const addedItemRef = React.useRef(items.length > 0);

  const setNotes = useStoreActions(
    (actions) => actions.RBReportNotesState.setValue,
  );
  const addItem = useStoreActions(
    (actions) => actions.RBReportItemsState.addItem,
  );

  React.useEffect(() => {
    const assetToInsert = localStorage.getItem("assetToInsert");
    if (reportData) {
      if (assetToInsert) {
        const { asset, reportId } = JSON.parse(assetToInsert);
        if (reportId === reportData.id) {
          setActiveReport({
            ...reportData,
            items: [
              ...reportData.items,
              { ...asset, open: false, id: uniqueId() },
            ],
          });
        } else {
          setActiveReport(reportData);
        }
        localStorage.removeItem("assetToInsert");
      } else {
        setActiveReport(reportData);
      }
    }
  }, [reportData]);

  const getItemByType = (item: RBReportItem, index: number) => {
    switch (item.type) {
      case "text":
        return (
          <ItemComponent id={item.id} index={index} childrenData={[]}>
            <ReportBuilderPageText
              id={item.id}
              focus={item.focus}
              initialKey={item.key}
            />
          </ItemComponent>
        );
      case "chart":
        return (
          <ItemComponent id={item.id} index={index} childrenData={[]}>
            <ReportBuilderPageChart id={item.id} />
          </ItemComponent>
        );
      case "table":
        return (
          <ItemComponent id={item.id} index={index} childrenData={[]}>
            <ReportBuilderPageTable id={item.id} />
          </ItemComponent>
        );
      case "image":
        return (
          <ItemComponent id={item.id} index={index} childrenData={[]}>
            <ReportBuilderPageImage id={item.id} />
          </ItemComponent>
        );
      case "grid":
        return (
          <ItemComponent id={item.id} index={index} childrenData={[]}>
            <ReportBuilderPageGrid
              columns={item.data.columns}
              rows={item.data.rows}
              id={item.id}
            />
          </ItemComponent>
        );
      case "kpi_box":
        return (
          <ItemComponent id={item.id} index={index} childrenData={[]}>
            <KPIBox id={item.id} />
          </ItemComponent>
        );
      case "column":
        return (
          <ItemComponent id={item.id} index={index} childrenData={[]}>
            <ReportBuilderPageGrid
              rows={1}
              columns={item.data.columns}
              id={item.id}
            />
          </ItemComponent>
        );
      case "section_divider":
        return (
          <ItemComponent id={item.id} index={index} childrenData={[]}>
            <SectionDivider id={item.id} />
          </ItemComponent>
        );
      default:
        return <React.Fragment />;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !addedItemRef.current &&
      /^[a-zA-Z0-9]$/.test(e.key) &&
      document.activeElement?.tagName !== "INPUT"
    ) {
      addItem({
        id: uniqueId(),
        type: "text",
        open: true,
        focus: true,
        key: e.key,
        data: { rte: null },
        options: {
          paddingTop: "10px",
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingBottom: "10px",
          borderWidth: "0px",
          borderColor: "#000000",
          borderRadius: "8px",
          backgroundColor: "#ffffff00",
          width: "100%",
        },
      });
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
        <DndProvider backend={HTML5Backend}>
          {!reportQuery.isLoading && (
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
                <React.Fragment key={item.id}>
                  {getItemByType(item, index)}
                </React.Fragment>
              ))}
            </Box>
          )}
        </DndProvider>
      </Box>
    </React.Fragment>
  );
};
