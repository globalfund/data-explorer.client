import { ChatMessage, ReportPlacement } from "app/pages/ai-explorer/types";
import { RBReportModel } from "app/state/api/action-reducers/report-builder/sync";

const SIMULATED_REPORT_TEMPLATE: RBReportModel = {
  name: "Q1 2024 Disbursement Overview (Demo)",
  description:
    "Simulated report showcasing KPIs, narrative text, a chart, and section dividers.",
  settings: {
    width: "1200px",
    height: "auto",
    padding: ["50", "50", "50", "50"],
    stroke: "0",
    strokeColor: "#000000",
    backgroundColor: "#ffffff",
    borderRadius: "0",
  },
  items: [
    {
      id: "sim_heading_1",
      type: "text",
      open: false,
      focus: false,
      data: {
        rte: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Disbursement Overview" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This simulated report demonstrates how the AI Explorer renders a generated report inside the chat panel. The data shown here is illustrative only.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      id: "sim_kpi_1",
      type: "kpi_box",
      open: true,
      focus: false,
      data: {
        topLabel: {
          enabled: true,
          value: "Total Disbursements",
          fontWeight: "normal",
          fontWeightLabel: "Normal",
          fontSize: "14px",
          fontFamily: "inherit",
          fontStyle: "normal",
          color: "#555555",
          bgColor: "transparent",
        },
        bigNumberText: {
          enabled: true,
          value: "$3.2B",
          fontWeight: "bold",
          fontWeightLabel: "Bold",
          fontSize: "36px",
          fontFamily: "inherit",
          fontStyle: "normal",
          color: "#002561",
          bgColor: "transparent",
        },
        bottomLabel: {
          enabled: true,
          value: "Q1 2024",
          fontWeight: "normal",
          fontWeightLabel: "Normal",
          fontSize: "13px",
          fontFamily: "inherit",
          fontStyle: "normal",
          color: "#777777",
          bgColor: "transparent",
        },
        optionalText: {
          enabled: false,
          value: "",
          fontWeight: "normal",
          fontWeightLabel: "Normal",
          fontSize: "12px",
          fontFamily: "inherit",
          fontStyle: "normal",
          color: "#999999",
          bgColor: "transparent",
        },
      },
    },
    {
      id: "sim_divider_1",
      type: "section_divider",
      open: false,
      focus: false,
      data: null,
    },
    {
      id: "sim_heading_2",
      type: "text",
      open: false,
      focus: false,
      data: {
        rte: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [
                { type: "text", text: "Allocations by Geography" },
              ],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Top recipient regions for the cycle, ranked by total committed amount.",
                },
              ],
            },
          ],
        },
      },
    },
    {
      id: "sim_chart_1",
      type: "chart",
      open: false,
      focus: false,
      data: {
        dataset: "gf_allocations",
        chartType: "bar",
        mapping: {
          bars: {
            value: ["Continent1"],
            mappedType: ["string"],
          },
          size: {
            value: ["AllocationAmountReferenceRate"],
            mappedType: ["number"],
            config: { aggregation: ["sum"] },
          },
        },
        appliedFilters: {},
        // mappedData is excluded from the stored TypeScript type (it's stripped before
        // persisting to the server). For demo purposes we include it inline via cast so
        // StatelessChartBlock can render without a live API call.
        renderedChartData: {
          renderedContent: "",
          appliedFilters: {},
          filterOptionGroups: [
            {
              name: "Continent1",
              enabled: true,
              options: [
                { label: "Africa", value: "Africa", count: 432 },
                { label: "Americas", value: "Americas", count: 112 },
                { label: "Asia", value: "Asia", count: 183 },
                { label: "Europe", value: "Europe", count: 35 },
                { label: "Oceania", value: "Oceania", count: 15 },
              ],
            },
            {
              name: "AllocationCycle",
              enabled: true,
              options: [
                { label: "2017-2019", value: "2017-2019", count: 270 },
                { label: "2020-2022", value: "2020-2022", count: 259 },
                { label: "2023-2025", value: "2023-2025", count: 266 },
              ],
            },
            {
              name: "Component",
              enabled: true,
              options: [
                { label: "HIV/AIDS", value: "HIV/AIDS", count: 314 },
                { label: "Malaria", value: "Malaria", count: 201 },
                { label: "Tuberculosis", value: "Tuberculosis", count: 280 },
              ],
            },
          ],
          dataTypes: {
            Continent1: "string",
            AllocationAmountReferenceRate: "number",
            AllocationCycle: "string",
            Component: "string",
          },
          dimensions: [
            {
              id: "bars",
              name: "Bars",
              validTypes: ["number", "string", "date"],
              required: true,
              description:
                "The different categories or subgroups represented by each bar.",
            },
            {
              id: "size",
              name: "Size",
              validTypes: ["number"],
              required: false,
              description:
                "The values corresponding to each category.",
            },
          ],
          // Real data fetched from POST /report/render-chart-data (all allocation cycles)
          mappedData: [
            { bars: "Africa", size: 27350880216.48 },
            { bars: "Asia", size: 6656594865 },
            { bars: "Americas", size: 1071555598 },
            { bars: "Europe", size: 554796860.2 },
            { bars: "Oceania", size: 221584885 },
          ],
          ssr: false,
        } as any,
      },
    },
    {
      id: "sim_divider_2",
      type: "section_divider",
      open: false,
      focus: false,
      data: null,
    },
    {
      id: "sim_footer",
      type: "text",
      open: false,
      focus: false,
      data: {
        rte: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "End of simulated report. Use 'Open in Report Builder' to convert this demo into an editable report.",
                },
              ],
            },
          ],
        },
      },
    },
  ],
};

export function buildSimulatedAssistantMessage(
  placement: ReportPlacement,
): ChatMessage {
  const report = structuredClone(SIMULATED_REPORT_TEMPLATE);

  // Give each item a fresh UUID so re-triggering produces unique React keys.
  report.items = report.items.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
  }));

  const content =
    placement === "main_view"
      ? "Here is a simulated Q1 2024 disbursement overview — rendered in the main view. (Demo)"
      : "Here is a simulated Q1 2024 disbursement overview. (Demo)";

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
    createdAt: Date.now(),
    report,
    reportPlacement: placement,
  };
}
