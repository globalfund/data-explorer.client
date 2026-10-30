import React from "react";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { ReportBuilderPageText } from "../builder/components/text";
import { ReportBuilderPageChart } from "../builder/components/chart";
import { ReportBuilderPageTable } from "../builder/components/table";
import { ReportBuilderPageImage } from "../builder/components/image";
import KPIBox from "../builder/components/kpi";
import SectionDivider from "../builder/components/section-divider";
import { ReportItemErrorBoundary } from "./error-boundary";

export interface ReportItemContentProps {
  item: RBReportItem;
  viewMode?: boolean;
  parent?: {
    id: string;
    type: "grid" | "column";
  };
}

type ItemRenderer = (props: ReportItemContentProps) => React.ReactNode;

const contentRegistry: Partial<Record<RBReportItem["type"], ItemRenderer>> = {
  text: ({ item, viewMode, parent }) => (
    <ReportBuilderPageText id={item.id} viewMode={viewMode} parent={parent} />
  ),
  chart: ({ item, viewMode, parent }) => (
    <ReportBuilderPageChart id={item.id} viewMode={viewMode} parent={parent} />
  ),
  table: ({ item, viewMode, parent }) => (
    <ReportBuilderPageTable id={item.id} viewMode={viewMode} parent={parent} />
  ),
  image: ({ item, viewMode, parent }) => (
    <ReportBuilderPageImage id={item.id} viewMode={viewMode} parent={parent} />
  ),
  kpi_box: ({ item, viewMode, parent }) => (
    <KPIBox id={item.id} viewMode={viewMode} parent={parent} />
  ),
  section_divider: ({ item, viewMode }) => (
    <SectionDivider id={item.id} viewMode={viewMode} />
  ),
};

export const ReportItemContent: React.FC<ReportItemContentProps> = (props) => {
  const render = contentRegistry[props.item.type];
  if (!render) return null;
  return (
    <ReportItemErrorBoundary
      itemId={props.item.id}
      itemType={props.item.type}
      resetKey={props.item}
      viewMode={props.viewMode}
    >
      {render(props)}
    </ReportItemErrorBoundary>
  );
};
