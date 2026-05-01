import React, { useMemo } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { useStoreState } from "app/state/store/hooks";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { ReportBuilderPageGrid } from "app/pages/report-builder/builder/components/grid";
import { ReportBuilderPageText } from "app/pages/report-builder/builder/components/text";
import { ReportBuilderPageChart } from "app/pages/report-builder/builder/components/chart";
import { ReportBuilderPageTable } from "app/pages/report-builder/builder/components/table";
import { ReportBuilderPageImage } from "app/pages/report-builder/builder/components/image";
import { checkEmptyItem } from "app/pages/report-builder/components/checkEmptyItem";
import KPIBox from "app/pages/report-builder/builder/components/kpi";
import SectionDivider from "app/pages/report-builder/builder/components/section-divider";
import ViewModeContainer from "app/pages/report-builder/builder/components/order-container/view";

export interface ReportCanvasSettings {
  width: string;
  height: string;
  stroke: string;
  strokeColor: string;
  padding: string[];
  backgroundColor: string;
  borderRadius: string;
}

interface ReportCanvasProps {
  settings: ReportCanvasSettings;
  sx?: BoxProps["sx"];
}

function getItemByType(item: RBReportItem) {
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
}

export const ReportCanvas: React.FC<ReportCanvasProps> = ({ settings, sx }) => {
  const reportState = useStoreState((state) => state.RBReportItemsState);

  const items = useMemo(
    () => reportState.items.filter(checkEmptyItem),
    [reportState.items],
  );

  return (
    <Box
      id="items-container"
      className="scrollbar"
      sx={{
        gap: "10px",
        display: "flex",
        maxWidth: "100%",
        overflow: "overlay",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: settings.width ? `${settings.width}px` : "100%",
        bgcolor: settings.backgroundColor,
        borderRadius: `${settings.borderRadius}px`,
        p: settings.padding?.map((p: string) => `${p}px`).join(" "),
        border: `${settings.stroke}px solid ${settings.strokeColor}`,
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
        ...sx,
      }}
    >
      {items.map((item) => (
        <React.Fragment key={item.id}>{getItemByType(item)}</React.Fragment>
      ))}
    </Box>
  );
};
