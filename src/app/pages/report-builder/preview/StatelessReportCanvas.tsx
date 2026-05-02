import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {
  RBReportModel,
  RBReportItem,
  AdvancedTextFormatting,
  RBRKPIBoxField,
} from "app/state/api/action-reducers/report-builder/sync";
import ChartComponent from "app/pages/report-builder/builder/components/chart/chart-component";
import { checkEmptyItem } from "app/pages/report-builder/components/checkEmptyItem";
import { GeneratedComponentBlock } from "app/pages/report-builder/preview/GeneratedComponentBlock";
import { DEFAULT_VISUAL_OPTIONS } from "app/pages/report-builder/builder/components/panel/elements-controller/chart/utils";

/**
 * Resolve visual options for a chart based on its type and any specific options provided in the report item.
 *
 * @param chartType - The type of the chart (e.g., "bar", "line", "geomap") to determine the default visual options schema
 * @param itemOptions - The specific visual options provided in the report item, which may override the defaults
 * @returns An object containing the resolved visual options for the chart, combining defaults and item-specific overrides
 */
function resolveVisualOptions(
  chartType: string,
  itemOptions: Record<string, any> | undefined,
): Record<string, any> {
  const schema = DEFAULT_VISUAL_OPTIONS[chartType] ?? {};
  const defaults = Object.fromEntries(
    Object.entries(schema).map(([k, v]) => {
      if (v.type === "advancedOptions" && v.advancedOptions) {
        const nested = Object.fromEntries(
          Object.entries(v.advancedOptions).map(([nk, nv]: [string, any]) => [
            nk,
            nv.default,
          ]),
        );
        return [k, nested];
      }
      return [k, v.default];
    }),
  );
  return { ...defaults, ...(itemOptions ?? {}) };
}

let cachedGeoJSON: any = null;

/**
 * Load preload geoJSON to be able to render the geomap chart in static preview.
 *
 * @returns A promise that resolves to the loaded geoJSON data
 */
async function loadGeoJSON(): Promise<any> {
  if (cachedGeoJSON) return cachedGeoJSON;
  const res = await fetch("/static/simple.geo.json");
  cachedGeoJSON = await res.json();
  return cachedGeoJSON;
}

interface StatelessReportCanvasProps {
  report: RBReportModel;
  compact?: boolean;
}

/**
 * Tiptap JSON static renderer
 *
 * @param text - The text content to render
 * @param marks - An array of mark objects defining text formatting
 * @returns A React element representing the formatted text
 */
function renderTextMarks(text: string, marks: any[] = []): React.ReactNode {
  let node: React.ReactNode = text;
  for (const mark of marks) {
    if (mark.type === "bold") node = <strong key={text}>{node}</strong>;
    if (mark.type === "italic") node = <em key={text}>{node}</em>;
    if (mark.type === "underline") node = <u key={text}>{node}</u>;
  }
  return node;
}

/**
 * Recursive renderer for Tiptap JSON content.
 * Covers a subset of node types used in the builder's RTE.
 *
 * @param node - The Tiptap JSON node to render
 * @param idx - The index of the node in its parent content array
 * @returns A React element representing the node, or null if unsupported
 */
function renderTiptapNode(node: any, idx: number): React.ReactNode {
  if (!node) return null;
  switch (node.type) {
    case "doc":
      return (
        <React.Fragment key={idx}>
          {node.content?.map((n: any, i: number) => renderTiptapNode(n, i))}
        </React.Fragment>
      );
    case "paragraph":
      return (
        <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
          {node.content?.map((n: any, i: number) => renderTiptapNode(n, i)) ??
            " "}
        </Typography>
      );
    case "heading": {
      const level = node.attrs?.level ?? 1;
      const variantMap: Record<number, "h5" | "h6" | "subtitle1"> = {
        1: "h5",
        2: "h6",
        3: "subtitle1",
      };
      return (
        <Typography
          key={idx}
          variant={variantMap[level] ?? "subtitle1"}
          fontWeight={600}
          sx={{ mt: 1, mb: 0.5 }}
        >
          {node.content?.map((n: any, i: number) => renderTiptapNode(n, i))}
        </Typography>
      );
    }
    case "bulletList":
      return (
        <Box key={idx} component="ul" sx={{ pl: 2, my: 0.5 }}>
          {node.content?.map((n: any, i: number) => renderTiptapNode(n, i))}
        </Box>
      );
    case "listItem":
      return (
        <Box key={idx} component="li">
          <Typography variant="body2">
            {node.content?.map((n: any, i: number) => renderTiptapNode(n, i))}
          </Typography>
        </Box>
      );
    case "text":
      return (
        <React.Fragment key={idx}>
          {renderTextMarks(node.text ?? "", node.marks)}
        </React.Fragment>
      );
    default:
      return null;
  }
}

/**
 * Per-type stateless block renderers
 *
 * @param data - The data for the text block, expected to contain Tiptap JSON in `rte`
 * @returns A React element rendering the text content, or null if no content
 */
function StatelessTextBlock({ data }: { data: { rte: any } | null }) {
  if (!data?.rte) return null;
  return (
    <Box sx={{ width: "100%", px: 1 }}>{renderTiptapNode(data.rte, 0)}</Box>
  );
}

/**
 * Stateless renderer for chart blocks.
 * TODO: @Psami-wondah - "Chart data not available" from CMS
 *
 * @param item - The chart report item to render
 * @param compact - Whether to use compact sizing (for previews/thumbnails)
 * @returns A React element rendering the chart, placeholder if no data
 */
function StatelessChartBlock({
  item,
  compact,
}: {
  item: RBReportItem & { type: "chart" };
  compact?: boolean;
}) {
  const data = item.data;
  const renderedWithData = data?.renderedChartData as
    | (typeof data.renderedChartData & { mappedData?: any })
    | undefined;

  const instanceId = React.useId().replace(/:/g, "");
  const chartId = `stateless-${item.id}-${instanceId}`;

  const visualOptions = React.useMemo(
    () => resolveVisualOptions(data?.chartType ?? "", item.options),
    [data?.chartType, item.options],
  );

  const [chartData, setChartData] = React.useState<any>(
    renderedWithData?.mappedData ?? null,
  );

  React.useEffect(() => {
    if (data?.chartType !== "geomap" || !renderedWithData?.mappedData) return;
    if (renderedWithData.mappedData.geoJSON) {
      setChartData(renderedWithData.mappedData);
      return;
    }
    loadGeoJSON().then((geoJSON) => {
      setChartData({ ...renderedWithData.mappedData, geoJSON });
    });
  }, [data?.chartType, renderedWithData?.mappedData]);

  if (!data?.chartType || !chartData) {
    return (
      <Box
        sx={{
          width: "100%",
          height: compact ? 160 : 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 1,
          color: "text.disabled",
        }}
      >
        <Typography variant="caption">Chart data not available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: visualOptions.width ?? "100%",
        height: visualOptions.height ?? (compact ? 220 : 320),
        position: "relative",
      }}
    >
      <ChartComponent
        data={chartData}
        chartType={data.chartType}
        mapping={data.mapping}
        visualOptions={visualOptions}
        id={chartId}
        readOnly
      />
    </Box>
  );
}

/**
 * Stateless renderer for KPI Box blocks.
 * Renders each field based on its formatting settings.
 *
 * @param data - The KPI Box data containing formatted fields
 * @returns A React element rendering the KPI Box, or null if not open
 */
function StatelessKpiBox({ data }: { data: RBRKPIBoxField | null }) {
  if (!data) return null;

  const renderField = (field: AdvancedTextFormatting | undefined) => {
    if (!field?.enabled || !field.value) return null;
    return (
      <Typography
        sx={{
          fontFamily: field.fontFamily || "inherit",
          fontWeight: field.fontWeight || "normal",
          fontSize: field.fontSize || "inherit",
          fontStyle: field.fontStyle || "normal",
          color: field.color || "inherit",
          bgcolor: field.bgColor || "transparent",
        }}
      >
        {field.value}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        gap: 0.5,
        width: "100%",
      }}
    >
      {renderField(data.topLabel)}
      {renderField(data.bigNumberText)}
      {renderField(data.bottomLabel)}
      {renderField(data.optionalText)}
    </Box>
  );
}

/**
 * Stateless renderer for Image blocks.
 * Renders an image if a valid `src` is provided in the data.
 *
 * @param data - The image block data, expected to contain a `src` URL
 * @returns A React element rendering the image, or null if no valid `src`
 */
function StatelessImageBlock({ data }: { data: { src?: string } | null }) {
  if (!data?.src) return null;
  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Box
        component="img"
        src={data.src}
        sx={{ maxWidth: "100%", height: "auto", borderRadius: 1 }}
      />
    </Box>
  );
}

/**
 * Stateless renderer for Grid and Column blocks.
 * Renders child items in a CSS grid layout based on the specified number of columns.
 * Expects child items to be fully rendered by the backend, so it simply dispatches to the item renderer for each child.
 * Handles both "grid" and "column" types, as they share the same structure and rendering logic.
 * The backend is responsible for ensuring that the `items` array contains only non-empty items, so this renderer does not perform additional checks on child items.
 *
 * @param item - The grid or column report item to render, containing child items and layout settings
 * @param compact - Whether to use compact sizing (for previews/thumbnails)
 * @returns A React element rendering the grid layout with child items, or null if no child items
 */
function StatelessGridBlock({
  item,
  compact,
}: {
  item: RBReportItem & { type: "grid" | "column" };
  compact?: boolean;
}) {
  const data = item.data as {
    rows?: number;
    columns: number;
    items: RBReportItem[];
  };
  const cols = data.columns ?? 1;
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 1,
        width: "100%",
      }}
    >
      {data.items?.map((child) => (
        <StatelessItemRenderer key={child.id} item={child} compact={compact} />
      ))}
    </Box>
  );
}

/**
 * Stateless renderer for individual report items.
 * Determines the appropriate block renderer to use based on the item's type.
 * Expects each item to be fully rendered by the backend, so it simply dispatches to the specific block renderer for each type.
 * TODO: @Psami-wondah - Handle unsupported item types instead of a returning null
 *
 * @param item - The report item to render, containing type and data for the specific block
 * @param compact - Whether to use compact sizing (for previews/thumbnails)
 * @returns A React element rendering the report item based on its type, or null if the type is unsupported or data is missing
 */
function StatelessItemRenderer({
  item,
  compact,
}: {
  item: RBReportItem;
  compact?: boolean;
}) {
  switch (item.type) {
    case "text":
      return <StatelessTextBlock data={item.data} />;
    case "chart":
      return (
        <StatelessChartBlock
          item={item as RBReportItem & { type: "chart" }}
          compact={compact}
        />
      );
    case "kpi_box":
      return <StatelessKpiBox data={item.data} />;
    case "image":
      return <StatelessImageBlock data={item.data} />;
    case "section_divider":
      return <Divider sx={{ width: "100%", my: 1 }} />;
    case "grid":
    case "column":
      return (
        <StatelessGridBlock
          item={item as RBReportItem & { type: "grid" | "column" }}
          compact={compact}
        />
      );
    case "generated_component":
      return <GeneratedComponentBlock data={item.data} compact={compact} />;
    default:
      return null;
  }
}

/**
 * StatelessReportCanvas is a recursive renderer for the entire report.
 * It receives a report model and renders each item using the appropriate block renderer.
 * The `compact` prop can be used to adjust spacing and sizing for preview or thumbnail contexts.
 *
 * @param report - The report model to render, containing items and settings for the report
 * @param compact - Whether to use compact sizing (for previews/thumbnails)
 * @returns A React element rendering the entire report
 */
export const StatelessReportCanvas: React.FC<StatelessReportCanvasProps> = ({
  report,
  compact,
}) => {
  const visibleItems = React.useMemo(
    () => report.items.filter(checkEmptyItem),
    [report.items],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: compact ? "8px" : "10px",
        width: "100%",
        bgcolor: report.settings.backgroundColor ?? "#ffffff",
        borderRadius: `${report.settings.borderRadius ?? 0}px`,
        p: compact
          ? "16px"
          : (report.settings.padding?.map((p) => `${p}px`).join(" ") ?? "50px"),
        border: `${report.settings.stroke ?? 0}px solid ${report.settings.strokeColor ?? "#000"}`,
      }}
    >
      {visibleItems.map((item) => (
        <StatelessItemRenderer key={item.id} item={item} compact={compact} />
      ))}
    </Box>
  );
};
