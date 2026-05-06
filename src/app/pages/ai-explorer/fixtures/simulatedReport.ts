import { ChatMessage, ReportPlacement } from "app/pages/ai-explorer/types";
import { RBReportModel } from "app/state/api/action-reducers/report-builder/sync";

// Shared chart data blocks (reused across the main items and the grid/column)
const BAR_CHART_RENDERED_DATA = {
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
  ],
  dataTypes: { Continent1: "string", AllocationAmountReferenceRate: "number" },
  dimensions: [
    {
      id: "bars",
      name: "Bars",
      validTypes: ["number", "string", "date"],
      required: true,
      description: "Categories on each bar.",
    },
    {
      id: "size",
      name: "Size",
      validTypes: ["number"],
      required: false,
      description: "Height of each bar.",
    },
  ],
  // Real data: POST /report/render-chart-data, gf_allocations, bar, bars=Continent1, size=AllocationAmountReferenceRate(sum)
  mappedData: [
    { bars: "Africa", size: 27350880216.48 },
    { bars: "Asia", size: 6656594865 },
    { bars: "Americas", size: 1071555598 },
    { bars: "Europe", size: 554796860.2 },
    { bars: "Oceania", size: 221584885 },
  ],
  ssr: false,
} as any;

const LINE_CHART_RENDERED_DATA = {
  renderedContent: "",
  appliedFilters: {},
  filterOptionGroups: [
    {
      name: "Year",
      enabled: true,
      options: [
        { label: "2002", value: "2002", count: 108 },
        { label: "2022", value: "2022", count: 108 },
      ],
    },
  ],
  dataTypes: { Year: "number", AmountReferenceRate: "number" },
  dimensions: [
    {
      id: "x",
      name: "X Axis",
      validTypes: ["number", "string", "date"],
      required: true,
      description: "Horizontal axis (time).",
    },
    {
      id: "y",
      name: "Y Axis",
      validTypes: ["number"],
      required: true,
      multiple: true,
      aggregation: true,
      aggregationDefault: "sum",
      description: "Vertical axis values.",
    },
  ],
  // Real data: POST /report/render-chart-data, gf_pledges_contributions, line, x=Year, y=AmountReferenceRate(sum)
  mappedData: {
    xAxisValues: [
      "2002",
      "2003",
      "2004",
      "2005",
      "2006",
      "2007",
      "2008",
      "2009",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026",
    ],
    series: [
      {
        name: "AmountReferenceRate",
        values: {
          "2002": 1913909367.86,
          "2003": 1871372999.42,
          "2004": 3056103650.94,
          "2005": 2869496280.52,
          "2006": 4232805562.01,
          "2007": 5320753248.48,
          "2008": 6165319597.14,
          "2009": 6592901995.3,
          "2010": 6920246169.89,
          "2011": 6074001109.84,
          "2012": 7374059050.43,
          "2013": 19488597224.25,
          "2014": 4121469941.67,
          "2015": 3003107250.65,
          "2016": 16250626832.7,
          "2017": 3526843309.17,
          "2018": 3764186913.53,
          "2019": 17721606776.84,
          "2020": 5190659788.23,
          "2021": 9394638176.65,
          "2022": 23362123660.01,
          "2023": 4447961672.94,
          "2024": 4873923445.39,
          "2025": 15857910991.51,
          "2026": 1647810506.14,
        },
      },
    ],
  },
  ssr: false,
} as any;

const PIE_CHART_RENDERED_DATA = {
  renderedContent: "",
  appliedFilters: {},
  filterOptionGroups: [
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
  dataTypes: { Component: "string", AllocationAmountReferenceRate: "number" },
  dimensions: [
    {
      id: "category",
      name: "Category",
      validTypes: ["number", "string", "date"],
      required: true,
      description: "Pie slice label.",
    },
    {
      id: "value",
      name: "Value",
      validTypes: ["number"],
      required: true,
      aggregation: true,
      aggregationDefault: { number: "sum" },
      description: "Slice proportion.",
    },
  ],
  // Real data: POST /report/render-chart-data, gf_allocations, pie, category=Component, value=AllocationAmountReferenceRate(sum)
  mappedData: [
    { name: "HIV/AIDS", value: 17992600018.64 },
    { name: "Malaria", value: 11534468620.26 },
    { name: "Tuberculosis", value: 6506784295.78 },
  ],
  ssr: false,
} as any;

const SCATTER_CHART_RENDERED_DATA = {
  renderedContent: "",
  appliedFilters: {},
  filterOptionGroups: [
    { name: "Year", enabled: true, options: [] },
    { name: "DonorType1", enabled: true, options: [] },
  ],
  dataTypes: { Year: "number", AmountReferenceRate: "number" },
  dimensions: [
    {
      id: "x",
      name: "X Axis",
      validTypes: ["number", "date"],
      required: true,
      description: "Horizontal position.",
    },
    {
      id: "y",
      name: "Y Axis",
      validTypes: ["number", "date"],
      required: true,
      description: "Vertical position.",
    },
    {
      id: "size",
      name: "Size",
      validTypes: ["number"],
      required: false,
      description: "Bubble size.",
    },
    {
      id: "label",
      name: "Label",
      validTypes: ["number", "date", "string"],
      required: false,
      description: "Point label.",
    },
  ],
  // Real data: POST /report/render-chart-data, gf_pledges_contributions, scatter, x=Year, y=AmountReferenceRate
  mappedData: {
    All: [
      { x: 2002, y: 9835000, size: 2721 },
      { x: 2002, y: 137064385, size: 2721 },
      { x: 2002, y: 78215277.51, size: 2721 },
      { x: 2003, y: 106541600, size: 2721 },
      { x: 2003, y: 50000000, size: 2721 },
      { x: 2004, y: 2000000, size: 2721 },
      { x: 2004, y: 12299000.01, size: 2721 },
      { x: 2005, y: 23561558.43, size: 2721 },
      { x: 2005, y: 49452149.4, size: 2721 },
      { x: 2006, y: 75000, size: 2721 },
      { x: 2006, y: 39877.18, size: 2721 },
      { x: 2007, y: 43551.45, size: 2721 },
      { x: 2007, y: 3000000, size: 2721 },
      { x: 2008, y: 3000000, size: 2721 },
      { x: 2008, y: 2000000, size: 2721 },
      { x: 2009, y: 83472000, size: 2721 },
      { x: 2009, y: 100000000, size: 2721 },
      { x: 2010, y: 1083265.02, size: 2721 },
      { x: 2010, y: 246870005, size: 2721 },
      { x: 2011, y: 47700.29, size: 2721 },
      { x: 2011, y: 1000000, size: 2721 },
      { x: 2012, y: 20022024.23, size: 2721 },
      { x: 2012, y: 1141270.82, size: 2721 },
      { x: 2013, y: 815439000, size: 2721 },
      { x: 2013, y: 20000000, size: 2721 },
      { x: 2014, y: 679532.5, size: 2721 },
      { x: 2014, y: 250000, size: 2721 },
      { x: 2015, y: 104721246.21, size: 2721 },
      { x: 2015, y: 5000000, size: 2721 },
      { x: 2016, y: 1200000000, size: 2721 },
      { x: 2016, y: 50000000, size: 2721 },
      { x: 2017, y: 5000000, size: 2721 },
      { x: 2017, y: 300000000, size: 2721 },
      { x: 2018, y: 1000000, size: 2721 },
      { x: 2019, y: 1026477.5, size: 2721 },
      { x: 2019, y: 2000000000, size: 2721 },
      { x: 2020, y: 75000000, size: 2721 },
      { x: 2021, y: 250000000, size: 2721 },
      { x: 2022, y: 8000000, size: 2721 },
      { x: 2022, y: 1000000, size: 2721 },
    ],
  },
  ssr: false,
} as any;

const GEOMAP_RENDERED_DATA = {
  renderedContent: "",
  appliedFilters: {},
  filterOptionGroups: [
    { name: "Continent1", enabled: true, options: [] },
    { name: "Component", enabled: true, options: [] },
  ],
  dataTypes: {
    GeographyName1: "string",
    AllocationAmountReferenceRate: "number",
  },
  dimensions: [
    {
      id: "country",
      name: "Country",
      validTypes: ["string"],
      required: true,
      description: "Country name for choropleth.",
    },
    {
      id: "size",
      name: "Size",
      validTypes: ["number"],
      required: true,
      aggregation: true,
      aggregationDefault: "sum",
      description: "Value displayed on map.",
    },
  ],
  // Real data: POST /report/render-chart-data, gf_allocations, geomap, country=GeographyName1, size=AllocationAmountReferenceRate(sum)
  // Note: geoJSON is loaded at runtime from /static/simple.geo.json. Without it the canvas renders blank.
  mappedData: {
    results: [
      { name: "Nigeria", value: 2484440731 },
      { name: "Mozambique", value: 2024937380 },
      { name: "Congo (Democratic Republic)", value: 1872576079 },
      { name: "Tanzania (United Republic)", value: 1769743640 },
      { name: "Uganda", value: 1631186508 },
      { name: "India", value: 1500000000 },
      { name: "Zimbabwe", value: 1489215093 },
      { name: "Malawi", value: 1480560562 },
      { name: "South Africa", value: 1426128244 },
      { name: "Ethiopia", value: 1247733383.59 },
      { name: "Kenya", value: 1163931089 },
      { name: "Zambia", value: 928410043 },
      { name: "Indonesia", value: 836647327 },
      { name: "Pakistan", value: 764007691 },
      { name: "Cameroon", value: 748328396.22 },
      { name: "Côte d'Ivoire", value: 697147462.36 },
      { name: "Ghana", value: 654724671 },
      { name: "Burkina Faso", value: 608626968.33 },
      { name: "Myanmar", value: 594494243 },
      { name: "Rwanda", value: 572354015 },
    ],
  },
  ssr: false,
} as any;

const SANKEY_RENDERED_DATA = {
  renderedContent: "",
  appliedFilters: {},
  filterOptionGroups: [
    { name: "Continent1", enabled: true, options: [] },
    { name: "Component", enabled: true, options: [] },
  ],
  dataTypes: {
    Continent1: "string",
    Component: "string",
    AllocationAmountReferenceRate: "number",
  },
  dimensions: [
    {
      id: "steps",
      name: "Steps",
      validTypes: ["number", "date", "string"],
      required: true,
      multiple: true,
      minValues: 2,
      description: "Flow stages.",
    },
    {
      id: "size",
      name: "Size",
      validTypes: ["number"],
      required: true,
      aggregation: true,
      aggregationDefault: "sum",
      description: "Flow magnitude.",
    },
  ],
  // Real data: POST /report/render-chart-data, gf_allocations, sankey, steps=[Continent1,Component], size=AllocationAmountReferenceRate(sum)
  mappedData: [
    {
      source: "Continent1 - Africa",
      target: "Component - HIV/AIDS",
      value: 14574560973.43,
    },
    {
      source: "Continent1 - Africa",
      target: "Component - Malaria",
      value: 10204493193.26,
    },
    {
      source: "Continent1 - Africa",
      target: "Component - Tuberculosis",
      value: 2571826049.79,
    },
    {
      source: "Continent1 - Asia",
      target: "Component - HIV/AIDS",
      value: 2245160332,
    },
    {
      source: "Continent1 - Asia",
      target: "Component - Malaria",
      value: 983382088,
    },
    {
      source: "Continent1 - Asia",
      target: "Component - Tuberculosis",
      value: 3428052445,
    },
    {
      source: "Continent1 - Americas",
      target: "Component - HIV/AIDS",
      value: 730979623,
    },
    {
      source: "Continent1 - Americas",
      target: "Component - Malaria",
      value: 167795195,
    },
    {
      source: "Continent1 - Americas",
      target: "Component - Tuberculosis",
      value: 172780780,
    },
    {
      source: "Continent1 - Europe",
      target: "Component - HIV/AIDS",
      value: 341347227.21,
    },
    {
      source: "Continent1 - Europe",
      target: "Component - Tuberculosis",
      value: 213449632.99,
    },
    {
      source: "Continent1 - Oceania",
      target: "Component - HIV/AIDS",
      value: 49456741,
    },
    {
      source: "Continent1 - Oceania",
      target: "Component - Malaria",
      value: 118658560,
    },
    {
      source: "Continent1 - Oceania",
      target: "Component - Tuberculosis",
      value: 53469584,
    },
  ],
  ssr: false,
} as any;

const TREEMAP_RENDERED_DATA = {
  renderedContent: "",
  appliedFilters: {},
  filterOptionGroups: [
    { name: "Continent1", enabled: true, options: [] },
    { name: "Component", enabled: true, options: [] },
  ],
  dataTypes: {
    Continent1: "string",
    Component: "string",
    AllocationAmountReferenceRate: "number",
  },
  dimensions: [
    {
      id: "hierarchy",
      name: "Hierarchy",
      validTypes: ["number", "date", "string"],
      required: true,
      multiple: true,
      description: "Nesting levels.",
    },
    {
      id: "size",
      name: "Size",
      validTypes: ["number"],
      required: false,
      aggregation: true,
      aggregationDefault: "sum",
      description: "Box area.",
    },
  ],
  // Real data: POST /report/render-chart-data, gf_allocations, treemap, hierarchy=[Continent1,Component], size=AllocationAmountReferenceRate(sum)
  mappedData: [
    {
      name: "Africa",
      value: 27350880216.48,
      path: "Africa",
      children: [
        { name: "HIV/AIDS", value: 14574560973.43, path: "Africa/HIV/AIDS" },
        { name: "Malaria", value: 10204493193.26, path: "Africa/Malaria" },
        {
          name: "Tuberculosis",
          value: 2571826049.79,
          path: "Africa/Tuberculosis",
        },
      ],
    },
    {
      name: "Asia",
      value: 6656594865,
      path: "Asia",
      children: [
        { name: "HIV/AIDS", value: 2245160332, path: "Asia/HIV/AIDS" },
        { name: "Malaria", value: 983382088, path: "Asia/Malaria" },
        { name: "Tuberculosis", value: 3428052445, path: "Asia/Tuberculosis" },
      ],
    },
    {
      name: "Americas",
      value: 1071555598,
      path: "Americas",
      children: [
        { name: "HIV/AIDS", value: 730979623, path: "Americas/HIV/AIDS" },
        { name: "Malaria", value: 167795195, path: "Americas/Malaria" },
        {
          name: "Tuberculosis",
          value: 172780780,
          path: "Americas/Tuberculosis",
        },
      ],
    },
    {
      name: "Europe",
      value: 554796860.2,
      path: "Europe",
      children: [
        { name: "HIV/AIDS", value: 341347227.21, path: "Europe/HIV/AIDS" },
        {
          name: "Tuberculosis",
          value: 213449632.99,
          path: "Europe/Tuberculosis",
        },
      ],
    },
    {
      name: "Oceania",
      value: 221584885,
      path: "Oceania",
      children: [
        { name: "HIV/AIDS", value: 49456741, path: "Oceania/HIV/AIDS" },
        { name: "Malaria", value: 118658560, path: "Oceania/Malaria" },
        { name: "Tuberculosis", value: 53469584, path: "Oceania/Tuberculosis" },
      ],
    },
  ],
  ssr: false,
} as any;

const HEATMAP_RENDERED_DATA = {
  renderedContent: "",
  appliedFilters: {},
  filterOptionGroups: [
    { name: "Continent1", enabled: true, options: [] },
    { name: "Component", enabled: true, options: [] },
  ],
  dataTypes: {
    Continent1: "string",
    Component: "string",
    AllocationAmountReferenceRate: "number",
  },
  dimensions: [
    {
      id: "x",
      name: "X Axis",
      validTypes: ["number", "string", "date"],
      required: true,
      description: "Horizontal categories.",
    },
    {
      id: "y",
      name: "Y Axis",
      validTypes: ["number", "string", "date"],
      required: true,
      description: "Vertical categories.",
    },
    {
      id: "size",
      name: "Size",
      validTypes: ["number"],
      required: false,
      aggregation: true,
      aggregationDefault: "sum",
      description: "Cell colour intensity.",
    },
  ],
  // Derived from treemap API data: aggregated totals per continent × disease
  mappedData: [
    { x: "Africa", y: "HIV/AIDS", size: 14574560973 },
    { x: "Africa", y: "Malaria", size: 10204493193 },
    { x: "Africa", y: "Tuberculosis", size: 2571826050 },
    { x: "Asia", y: "HIV/AIDS", size: 2245160332 },
    { x: "Asia", y: "Malaria", size: 983382088 },
    { x: "Asia", y: "Tuberculosis", size: 3428052445 },
    { x: "Americas", y: "HIV/AIDS", size: 730979623 },
    { x: "Americas", y: "Malaria", size: 167795195 },
    { x: "Americas", y: "Tuberculosis", size: 172780780 },
    { x: "Europe", y: "HIV/AIDS", size: 341347227 },
    { x: "Europe", y: "Malaria", size: 0 },
    { x: "Europe", y: "Tuberculosis", size: 213449633 },
    { x: "Oceania", y: "HIV/AIDS", size: 49456741 },
    { x: "Oceania", y: "Malaria", size: 118658560 },
    { x: "Oceania", y: "Tuberculosis", size: 53469584 },
  ],
  ssr: false,
} as any;

const RADAR_RENDERED_DATA = {
  renderedContent: "",
  appliedFilters: {},
  filterOptionGroups: [{ name: "GrantComponent1", enabled: true, options: [] }],
  dataTypes: {
    TotalBoardApprovedAmountReferenceRate: "number",
    TotalCommitmentAmountReferenceRate: "number",
    TotalDisbursedAmountReferenceRate: "number",
    TotalSignedAmountReferenceRate: "number",
    GrantComponent1: "string",
  },
  dimensions: [
    {
      id: "dimensions",
      name: "Dimensions",
      validTypes: ["number"],
      required: true,
      multiple: true,
      minValues: 3,
      description: "Radar axes.",
    },
    {
      id: "category",
      name: "Category",
      validTypes: ["number", "string", "date"],
      required: false,
      description: "Series to compare.",
    },
  ],
  // Real data: POST /report/render-chart-data, gf_grant_implementation, radar,
  // dimensions=[TotalBoardApproved, TotalCommitment, TotalDisbursed, TotalSigned](sum), category=GrantComponent1
  // Manually aggregated per disease: sum across all implementation periods
  mappedData: {
    indicators: [
      { text: "Board Approved", max: 29745552815 },
      { text: "Commitment", max: 29745552815 },
      { text: "Disbursed", max: 29745552815 },
      { text: "Signed", max: 29745552815 },
    ],
    categories: ["HIV", "Malaria", "Tuberculosis"],
    data: [
      {
        name: "HIV",
        value: [29745552815, 28910705666, 28375933287, 29706028891],
      },
      {
        name: "Malaria",
        value: [22471823908, 21731360381, 21232705565, 22370584667],
      },
      {
        name: "Tuberculosis",
        value: [11443507136, 11064791140, 10832027351, 11407598429],
      },
    ],
  },
  ssr: false,
} as any;

/**
 * Helper functions to build a reusable chart item (without top-level IDs so the caller
 * can stamp a unique one). Used for both the standalone sections and the
 * nested grid / column cells.
 */

function barChartItem(id: string) {
  return {
    id,
    type: "chart" as const,
    open: false,
    focus: false,
    data: {
      dataset: "gf_allocations",
      chartType: "bar" as const,
      mapping: {
        bars: { value: ["Continent1"], mappedType: ["string"] },
        size: {
          value: ["AllocationAmountReferenceRate"],
          mappedType: ["number"],
          config: { aggregation: ["sum"] },
        },
      },
      appliedFilters: {},
      renderedChartData: BAR_CHART_RENDERED_DATA,
    },
  };
}

function lineChartItem(id: string) {
  return {
    id,
    type: "chart" as const,
    open: false,
    focus: false,
    data: {
      dataset: "gf_pledges_contributions",
      chartType: "line" as const,
      mapping: {
        x: { value: ["Year"], mappedType: ["number"] },
        y: {
          value: ["AmountReferenceRate"],
          mappedType: ["number"],
          config: { aggregation: ["sum"] },
        },
      },
      appliedFilters: {},
      renderedChartData: LINE_CHART_RENDERED_DATA,
    },
  };
}

function pieChartItem(id: string) {
  return {
    id,
    type: "chart" as const,
    open: false,
    focus: false,
    data: {
      dataset: "gf_allocations",
      chartType: "pie" as const,
      mapping: {
        category: { value: ["Component"], mappedType: ["string"] },
        value: {
          value: ["AllocationAmountReferenceRate"],
          mappedType: ["number"],
          config: { aggregation: ["sum"] },
        },
      },
      appliedFilters: {},
      renderedChartData: PIE_CHART_RENDERED_DATA,
    },
  };
}

function treemapChartItem(id: string) {
  return {
    id,
    type: "chart" as const,
    open: false,
    focus: false,
    data: {
      dataset: "gf_allocations",
      chartType: "treemap" as const,
      mapping: {
        hierarchy: {
          value: ["Continent1", "Component"],
          mappedType: ["string", "string"],
        },
        size: {
          value: ["AllocationAmountReferenceRate"],
          mappedType: ["number"],
          config: { aggregation: ["sum"] },
        },
      },
      appliedFilters: {},
      renderedChartData: TREEMAP_RENDERED_DATA,
    },
  };
}

function sankeyChartItem(id: string) {
  return {
    id,
    type: "chart" as const,
    open: false,
    focus: false,
    data: {
      dataset: "gf_allocations",
      chartType: "sankey" as const,
      mapping: {
        steps: {
          value: ["Continent1", "Component"],
          mappedType: ["string", "string"],
        },
        size: {
          value: ["AllocationAmountReferenceRate"],
          mappedType: ["number"],
          config: { aggregation: ["sum"] },
        },
      },
      appliedFilters: {},
      renderedChartData: SANKEY_RENDERED_DATA,
    },
  };
}

function heatmapChartItem(id: string) {
  return {
    id,
    type: "chart" as const,
    open: false,
    focus: false,
    data: {
      dataset: "gf_allocations",
      // heatmap is not in the sync.ts ChartType union but is supported by the chart library
      chartType: "heatmap" as any,
      mapping: {
        x: { value: ["Continent1"], mappedType: ["string"] },
        y: { value: ["Component"], mappedType: ["string"] },
        size: {
          value: ["AllocationAmountReferenceRate"],
          mappedType: ["number"],
          config: { aggregation: ["sum"] },
        },
      },
      appliedFilters: {},
      renderedChartData: HEATMAP_RENDERED_DATA,
    },
  };
}

function headingItem(id: string, title: string, subtitle: string) {
  return {
    id,
    type: "text" as const,
    open: false,
    focus: false,
    data: {
      rte: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: title }],
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: subtitle }],
          },
        ],
      },
    },
  };
}

function dividerItem(id: string) {
  return {
    id,
    type: "section_divider" as const,
    open: false,
    focus: false,
    data: null,
  };
}

function generatedComponentItem(
  id: string,
  suggestedName: string,
  componentCode: string,
  propsInterface: Record<string, string>,
  props: Record<string, unknown>,
) {
  return {
    id,
    type: "generated_component" as const,
    open: false,
    focus: false,
    data: {
      component_code: componentCode,
      suggested_name: suggestedName,
      props_interface: propsInterface,
      props,
    },
  };
}

const NOVELTY_REQUEST_CODE = `
function NoveltyRequest({ title, description, variant }) {
  var isExplorer = variant !== 'publisher';
  var primaryColor = isExplorer ? '#3B6CD3' : '#04857F';
  var backgroundColor = isExplorer ? '#ebf0fb' : '#E6F3F2';

  return React.createElement('div', {
    style: {
      backgroundColor: backgroundColor,
      borderRadius: '8px',
      padding: '24px',
      margin: '16px 0',
      border: '1px solid ' + primaryColor,
      boxShadow: '0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
      fontFamily: 'Inter, sans-serif',
    }
  },
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'flex-start', gap: '16px' }
    },
      React.createElement('div', {
        style: {
          flex: '0 0 auto',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: primaryColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: '18px',
        }
      }, 'N'),
      React.createElement('div', { style: { flex: '1' } },
        React.createElement('h3', {
          style: { margin: '0 0 8px 0', color: '#0C162A', fontSize: '20px', fontWeight: '600' }
        }, title),
        React.createElement('p', {
          style: { margin: '0', color: '#454545', fontSize: '14px', lineHeight: '1.5' }
        }, description)
      )
    )
  );
}

export default NoveltyRequest;
`.trim();

const TAG_CLOUD_CODE = `
function TagCloud({ tags, minFontSize, maxFontSize }) {
  var mn = minFontSize !== undefined ? minFontSize : 12;
  var mx = maxFontSize !== undefined ? maxFontSize : 32;

  if (!tags || tags.length === 0) {
    return React.createElement('div', {
      style: { fontStyle: 'italic', color: '#888888' }
    }, 'No tags available.');
  }

  var weights = tags.map(function(t) { return t.weight; });
  var minWeight = Math.min.apply(null, weights);
  var maxWeight = Math.max.apply(null, weights);
  var range = maxWeight - minWeight || 1;

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      padding: '16px',
      fontFamily: 'Inter, sans-serif',
    }
  },
    tags.map(function(tag, idx) {
      var size = Math.round(((tag.weight - minWeight) / range) * (mx - mn) + mn);
      var opacity = 0.5 + ((tag.weight - minWeight) / range) * 0.5;
      return React.createElement('span', {
        key: idx,
        style: {
          fontSize: size + 'px',
          color: '#002561',
          opacity: opacity,
          fontWeight: tag.weight > (minWeight + range * 0.6) ? '600' : '400',
          cursor: 'default',
          transition: 'opacity 0.2s',
        }
      }, tag.text);
    })
  );
}

export default TagCloud;
`.trim();

const CREATIVE_EXPLORATION_PANEL_CODE = `
function CreativeExplorationPanel({ title, description, prompt, ideas, loading, variant }) {
  var accentColor = variant === 'publisher' ? '#04857F' : '#3B6CD3';
  var trackColor  = variant === 'publisher' ? '#E6F3F2' : '#ebf0fb';
  var badgeText   = variant === 'publisher' ? 'Publisher mode' : 'Explorer mode';

  return React.createElement('section', {
    style: {
      border: '1px solid ' + accentColor,
      borderRadius: 8,
      padding: 24,
      background: '#FFFFFF',
      boxShadow: '0px 1px 14px 0px rgba(0,0,0,0.12)',
      fontFamily: 'Inter, sans-serif',
      color: '#454545',
    }
  },
    loading && React.createElement('div', {
      style: {
        width: '100%', height: 8, borderRadius: 4,
        backgroundColor: trackColor, overflow: 'hidden', marginBottom: 16,
      }
    },
      React.createElement('div', {
        style: {
          width: '65%', height: '100%', borderRadius: 4,
          backgroundColor: accentColor, transition: 'width 0.6s ease-in-out',
        }
      })
    ),
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }
    },
      React.createElement('h2', {
        style: { margin: 0, fontSize: 22, fontWeight: 700, color: '#0C162A' }
      }, title),
      React.createElement('span', {
        style: {
          fontSize: 12, fontWeight: 600, padding: '4px 8px',
          borderRadius: 999, backgroundColor: accentColor, color: '#FFFFFF',
        }
      }, badgeText)
    ),
    React.createElement('p', {
      style: { margin: '0 0 18px 0', fontSize: 14, lineHeight: 1.5 }
    }, description),
    React.createElement('div', {
      style: {
        backgroundColor: '#F7F7F7', borderRadius: 5, padding: 16,
        marginBottom: 18, border: '1px solid ' + trackColor,
      }
    },
      React.createElement('p', {
        style: { margin: '0 0 8px 0', fontSize: 14, fontWeight: 600, color: '#0C162A' }
      }, 'Prompt focus'),
      React.createElement('p', { style: { margin: 0, fontSize: 14, lineHeight: 1.4 } }, prompt)
    ),
    React.createElement('div', {
      style: { marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
    },
      React.createElement('p', {
        style: { margin: 0, fontSize: 14, fontWeight: 600, color: '#0C162A' }
      }, 'Suggested explorations'),
      React.createElement('span', {
        style: { fontSize: 12, color: '#888888' }
      }, ideas.length + ' idea' + (ideas.length === 1 ? '' : 's'))
    ),
    ideas.length === 0
      ? React.createElement('p', {
          style: { margin: 0, fontSize: 14, color: '#888888' }
        }, 'No ideas yet.')
      : React.createElement('ul', {
          style: { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }
        },
          ideas.map(function(idea, i) {
            return React.createElement('li', {
              key: i,
              style: { fontSize: 14, lineHeight: 1.4, color: '#454545' }
            }, idea);
          })
        )
  );
}

export default CreativeExplorationPanel;
`.trim();

// Report template
const SIMULATED_REPORT_TEMPLATE: RBReportModel = {
  name: "AI Explorer Comprehensive Demo Report",
  description:
    "Simulated report showcasing every available component type and chart type.",
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
    // Report header + KPI
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
              content: [
                {
                  type: "text",
                  text: "Global Fund Data Explorer Component Showcase",
                },
              ],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This simulated report demonstrates every component and chart type available in the Report Builder: text, KPI boxes, all nine chart types, an image, a 2×2 grid, and a two-column layout. Data is sourced from the Global Fund staging API.",
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
    dividerItem("sim_divider_1"),

    // Bar chart — allocations by continent
    headingItem(
      "sim_heading_bar",
      "Allocations by Geography (Bar Chart)",
      "Top recipient regions ranked by total committed amount across all allocation cycles.",
    ),
    barChartItem("sim_chart_bar"),
    dividerItem("sim_divider_bar"),

    // Line chart — pledges & contributions over time
    headingItem(
      "sim_heading_line",
      "Pledges & Contributions Over Time (Line Chart)",
      "Annual pledges and contributions to the Global Fund from 2002 to 2026 (USD reference rate).",
    ),
    lineChartItem("sim_chart_line"),
    dividerItem("sim_divider_line"),

    // Pie chart — allocations by disease
    headingItem(
      "sim_heading_pie",
      "Allocations by Disease Component (Pie Chart)",
      "Proportional split of total allocation amounts across HIV/AIDS, Malaria, and Tuberculosis.",
    ),
    pieChartItem("sim_chart_pie"),
    dividerItem("sim_divider_pie"),

    // Scatter chart — pledges year vs amount
    headingItem(
      "sim_heading_scatter",
      "Pledge Amount vs Year (Scatter Chart)",
      "Distribution of individual pledge amounts across years, showing variance in contribution sizes.",
    ),
    {
      id: "sim_chart_scatter",
      type: "chart",
      open: false,
      focus: false,
      data: {
        dataset: "gf_pledges_contributions",
        // scatter is not in the sync.ts ChartType union but is supported by the chart library
        chartType: "scatter" as any,
        mapping: {
          x: { value: ["Year"], mappedType: ["number"] },
          y: { value: ["AmountReferenceRate"], mappedType: ["number"] },
        },
        appliedFilters: {},
        renderedChartData: SCATTER_CHART_RENDERED_DATA,
      },
    },
    dividerItem("sim_divider_scatter"),

    // Geo map — allocations by country
    headingItem(
      "sim_heading_geomap",
      "Allocations by Country (Geo Map)",
      "Choropleth map showing total allocation amounts per recipient country. Requires the world GeoJSON to render the map fill; results data is present.",
    ),
    {
      id: "sim_chart_geomap",
      type: "chart",
      open: false,
      focus: false,
      data: {
        dataset: "gf_allocations",
        chartType: "geomap" as const,
        mapping: {
          country: { value: ["GeographyName1"], mappedType: ["string"] },
          size: {
            value: ["AllocationAmountReferenceRate"],
            mappedType: ["number"],
            config: { aggregation: ["sum"] },
          },
        },
        appliedFilters: {},
        renderedChartData: GEOMAP_RENDERED_DATA,
      },
    },
    dividerItem("sim_divider_geomap"),

    // Sankey diagram — continent → disease flow
    headingItem(
      "sim_heading_sankey",
      "Funding Flow: Continent → Disease (Sankey Diagram)",
      "Flow diagram showing how allocation amounts move from geographic regions into each disease component.",
    ),
    sankeyChartItem("sim_chart_sankey"),
    dividerItem("sim_divider_sankey"),

    // Treemap — allocation hierarchy
    headingItem(
      "sim_heading_treemap",
      "Allocation Hierarchy (Treemap)",
      "Nested rectangles showing allocation proportions by continent and disease, sized by total amount.",
    ),
    treemapChartItem("sim_chart_treemap"),
    dividerItem("sim_divider_treemap"),

    // Heatmap — continent × disease intensity
    headingItem(
      "sim_heading_heatmap",
      "Allocation Intensity: Continent × Disease (Heatmap)",
      "Colour-coded matrix of total allocation (USD) at the intersection of continent and disease component.",
    ),
    heatmapChartItem("sim_chart_heatmap"),
    dividerItem("sim_divider_heatmap"),

    // Radar chart — financial performance by disease
    headingItem(
      "sim_heading_radar",
      "Financial Performance by Disease (Radar Chart)",
      "Multi-axis comparison of Board-Approved, Commitment, Disbursed, and Signed amounts across HIV, Malaria, and Tuberculosis portfolios.",
    ),
    {
      id: "sim_chart_radar",
      type: "chart",
      open: false,
      focus: false,
      data: {
        dataset: "gf_grant_implementation",
        // radar is not in the sync.ts ChartType union but is supported by the chart library
        chartType: "radar" as any,
        mapping: {
          dimensions: {
            value: [
              "TotalBoardApprovedAmountReferenceRate",
              "TotalCommitmentAmountReferenceRate",
              "TotalDisbursedAmountReferenceRate",
              "TotalSignedAmountReferenceRate",
            ],
            mappedType: ["number", "number", "number", "number"],
            config: { aggregation: ["sum", "sum", "sum", "sum"] },
          },
          category: { value: ["GrantComponent1"], mappedType: ["string"] },
        },
        appliedFilters: {},
        renderedChartData: RADAR_RENDERED_DATA,
      },
    },
    dividerItem("sim_divider_radar"),

    // Image
    headingItem(
      "sim_heading_image",
      "Featured Image",
      "Images can be embedded directly in reports and cropped or repositioned in the builder.",
    ),
    {
      id: "sim_image",
      type: "image",
      open: false,
      focus: false,
      data: {
        src: "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759",
      },
    },
    dividerItem("sim_divider_image"),

    // 2×2 Grid — four charts side by side
    headingItem(
      "sim_heading_grid",
      "2×2 Chart Grid",
      "The Grid component arranges multiple charts in a fixed column layout. This example shows bar, pie, line, and treemap in a 2×2 arrangement.",
    ),
    {
      id: "sim_grid",
      type: "grid",
      open: false,
      focus: false,
      data: {
        rows: 2,
        columns: 2,
        items: [
          barChartItem("sim_grid_bar"),
          pieChartItem("sim_grid_pie"),
          lineChartItem("sim_grid_line"),
          treemapChartItem("sim_grid_treemap"),
        ],
      },
    },
    dividerItem("sim_divider_grid"),

    // Column — two charts side by side
    headingItem(
      "sim_heading_column",
      "Two-Column Chart Layout",
      "The Column component places charts side by side at equal width. Here a Sankey diagram and a Heatmap share the row.",
    ),
    {
      id: "sim_column",
      type: "column",
      open: false,
      focus: false,
      data: {
        columns: 2,
        items: [
          sankeyChartItem("sim_col_sankey"),
          heatmapChartItem("sim_col_heatmap"),
        ],
      },
    },

    // Generated components
    headingItem(
      "sim_heading_generated",
      "Generated Components",
      "Custom React components generated by the AI agent and rendered in sandboxed iframes. Use these for bespoke visualisations that no standard chart type covers.",
    ),
    generatedComponentItem(
      "sim_gen_novelty",
      "NoveltyRequest",
      NOVELTY_REQUEST_CODE,
      {
        title: "string",
        description: "string",
        variant: "'explorer' | 'publisher'",
      },
      {
        title: "AI-Powered Report Builder",
        description:
          "Generate data reports from natural language using the Global Fund Data Explorer's new AI capabilities. Ask questions about allocations, disbursements, and results across all active grants.",
        variant: "explorer",
      },
    ),
    dividerItem("sim_divider_gen_1"),
    headingItem(
      "sim_heading_gen_tagcloud",
      "Tag Cloud",
      "Weighted tag cloud where font size and opacity scale with the weight value.",
    ),
    generatedComponentItem(
      "sim_gen_tagcloud",
      "TagCloud",
      TAG_CLOUD_CODE,
      {
        tags: "Array<{ text: string; weight: number }>",
        minFontSize: "number | undefined",
        maxFontSize: "number | undefined",
      },
      {
        tags: [
          { text: "HIV/AIDS", weight: 10 },
          { text: "Malaria", weight: 8 },
          { text: "Tuberculosis", weight: 6 },
          { text: "Africa", weight: 9 },
          { text: "Disbursements", weight: 7 },
          { text: "Allocations", weight: 8 },
          { text: "Asia", weight: 5 },
          { text: "Pledges", weight: 6 },
          { text: "Grants", weight: 7 },
          { text: "Americas", weight: 3 },
          { text: "2023–2025 Cycle", weight: 9 },
          { text: "Results", weight: 5 },
          { text: "Europe", weight: 2 },
          { text: "Oceania", weight: 2 },
        ],
        minFontSize: 14,
        maxFontSize: 36,
      },
    ),
    dividerItem("sim_divider_gen_2"),
    headingItem(
      "sim_heading_gen_panel",
      "Creative Exploration Panel",
      "A richer widget combining variant theming, a loading bar, a prompt block, and a list of suggested explorations.",
    ),
    generatedComponentItem(
      "sim_gen_panel",
      "CreativeExplorationPanel",
      CREATIVE_EXPLORATION_PANEL_CODE,
      {
        title: "string",
        description: "string",
        prompt: "string",
        ideas: "string[]",
        loading: "boolean",
        variant: '"explorer" | "publisher"',
      },
      {
        title: "Disbursement Analysis",
        description:
          "Surface insights from Global Fund disbursement data using natural language queries and AI-assisted chart selection.",
        prompt:
          "Which regions received the largest disbursement increases in the 2023–2025 cycle?",
        ideas: [
          "Compare Africa vs Asia disbursement growth rates",
          "Show disbursement efficiency by disease component",
          "Map countries with highest TB funding per capita",
          "Overlay pledges vs actual disbursements by year",
        ],
        loading: false,
        variant: "explorer",
      },
    ),

    // Footer
    dividerItem("sim_divider_footer"),
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
                  text: "End of demo report. Use 'Open in Report Builder' to convert this into a fully editable report.",
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

  // Give each top-level item a fresh UUID so re-triggering the simulation
  // produces unique React keys without mutating nested grid/column children.
  report.items = report.items.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
  }));

  const content =
    placement === "main_view"
      ? "Here is a comprehensive demo report showcasing all component and chart types, rendered in the main view."
      : "Here is a comprehensive demo report showcasing all component and chart types.";

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
    createdAt: Date.now(),
    report,
    reportPlacement: placement,
  };
}
