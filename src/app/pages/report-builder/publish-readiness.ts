import {
  RBReportItem,
  ReportItemOf,
} from "app/state/api/action-reducers/report-builder/sync";
import { isReportItemComplete } from "app/pages/report-builder/component-registry/model";
import {
  chartTypes,
  datasetItems,
} from "app/pages/report-builder/builder/components/chart/data";

export interface PublishReadinessIssue {
  /** The item to fix, and the grid or column it's in, if any. */
  itemId: string;
  parent?: { id: string; type: "grid" | "column" };
  /** Names the item for the author, e.g. "Bar Chart of Allocations". */
  label: string;
  message: string;
}

const describeChart = (item: ReportItemOf<"chart">) => {
  const type =
    chartTypes.find((chartType) => chartType.id === item.data?.chartType)
      ?.chartType ?? "Chart";
  const dataset = datasetItems.find(
    (datasetItem) => datasetItem.id === item.data?.dataset,
  )?.name;
  return dataset ? `${type} of ${dataset}` : type;
};

/**
 * What has to be fixed before the report is shared, in report order. Only what
 * readers would see counts: unfinished items are left out of the report, and a
 * chart whose title is hidden needs none.
 *
 * `getChartTitle` gives the title a chart shows, its author's or the one from
 * its data.
 */
export const getPublishReadinessIssues = (
  items: RBReportItem[],
  getChartTitle: (item: ReportItemOf<"chart">) => string,
): PublishReadinessIssue[] => {
  const issues: PublishReadinessIssue[] = [];

  const check = (
    item: RBReportItem | undefined,
    parent?: PublishReadinessIssue["parent"],
  ) => {
    if (!item) return;
    if (item.type === "grid" || item.type === "column") {
      item.data?.items?.forEach((child) =>
        check(child, { id: item.id, type: item.type }),
      );
      return;
    }
    if (item.type !== "chart" || !isReportItemComplete(item)) return;
    if (item.options?.showChartName === false) return;
    if (getChartTitle(item).trim()) return;

    issues.push({
      itemId: item.id,
      parent,
      label: describeChart(item),
      message: "needs a title",
    });
  };

  items.forEach((item) => check(item));
  return issues;
};
