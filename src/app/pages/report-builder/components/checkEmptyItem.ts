import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";

/**
 * Checks item has sufficient data to be rendered meaningfully.
 * Criteria for "emptiness" depend on item type:
 * - Text: Must have non-empty rich text content
 * - Chart: Must have defined chart type, dataset, and rendered data
 * - KPI Box: Must be marked as open
 * - Table: Considered empty (requires user action to populate)
 * - Grid/Column: Considered empty if all child items are empty (recursive check)
 * - Image: Must have a source URL defined
 * - Section Divider: Never considered empty (always renders if present)
 *
 * @param item - The report item to check for emptiness
 * @returns True if the item has sufficient data to be rendered, false otherwise
 */
export function checkEmptyItem(item: RBReportItem): boolean {
  if (item.type === "unknown") return false;

  switch (item.type) {
    case "text":
      return !!item.data?.rte;
    case "chart":
      return (
        !!item.data?.chartType &&
        !!item.data?.dataset &&
        !!item.data?.renderedChartData
      );
    case "kpi_box":
      return item.open;
    case "table":
      return false;
    case "grid":
    case "column":
      return item.data?.items?.some((child) => checkEmptyItem(child)) ?? false;
    case "image":
      return !!item.data?.src;
    case "section_divider":
      return true;
    case "generated_component":
      return !!item.data?.component_code;
    default:
      return false;
  }
}
