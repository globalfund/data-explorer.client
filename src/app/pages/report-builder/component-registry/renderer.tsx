import React from "react";
import { ReportBuilderPageGrid } from "../builder/components/grid";
import {
  ReportItemContent as LeafReportItemContent,
  ReportItemContentProps,
} from "./content";
import { ReportItemErrorBoundary } from "./error-boundary";

export const ReportItemContent: React.FC<ReportItemContentProps> = (props) => {
  const { item, viewMode } = props;

  if (item.type === "grid" || item.type === "column") {
    // Grid children get their own boundaries from the leaf renderer; this one
    // covers the grid itself.
    return (
      <ReportItemErrorBoundary
        itemId={item.id}
        itemType={item.type}
        resetKey={item}
        viewMode={viewMode}
      >
        <ReportBuilderPageGrid
          id={item.id}
          rows={item.type === "grid" ? item.data.rows : 1}
          columns={item.data.columns}
          viewMode={viewMode}
        />
      </ReportItemErrorBoundary>
    );
  }

  return <LeafReportItemContent {...props} />;
};
