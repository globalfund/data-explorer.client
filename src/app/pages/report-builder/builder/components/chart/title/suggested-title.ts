import { getDimensions } from "app/pages/report-builder/builder/components/panel/elements-controller/chart/utils";
import {
  ChartTitleSource,
  deriveChartTitle,
  getChartTitle,
} from "app/pages/report-builder/builder/components/chart/title/chart-title";

/** The title a chart's data suggests, or "" until its mapping is complete. */
export const getSuggestedChartTitle = (
  data: ChartTitleSource | null | undefined,
): string => deriveChartTitle(data ?? {}, getDimensions(data?.chartType ?? ""));

/** The title a chart item shows: its author's, or the one from its data. */
export const getChartItemTitle = (item: {
  data?: ChartTitleSource | null;
  options?: Record<string, any>;
}): string => getChartTitle(item.options, getSuggestedChartTitle(item.data));
