import BarChartIcon from "./icons/bar";
import LineChartIcon from "./icons/line";
import PieChartIcon from "./icons/pie";
import ScatterChartIcon from "./icons/scatter";
import GeoMapIcon from "./icons/geomap";
import SankeyDiagramIcon from "./icons/sankey";
import TreeMapIcon from "./icons/treemap";
import HeatmapChartIcon from "./icons/heatmap";
import RadarChartIcon from "./icons/radar";

export const datasetItems = [
  {
    id: "gf_results",
    name: "Reported Results",
    description: "Global Fund results reported on an annual basis.",
    date: "2023-01-01",
  },
  {
    id: "gf_pledges_contributions",
    name: "Pledges and Contributions - Reference Rate",
    description:
      "Government, private sector, nongovernment and other donor pledges and contributions. These amounts are in US$ equivalents based on the Reference Rate used.",
    date: "2023-01-02",
  },
  {
    id: "gf_eligibility",
    name: "Country Eligibility",
    description: "Country eligibility for funding over time.",
    date: "2023-01-04",
  },
  {
    id: "gf_allocations",
    name: "Allocations",
    description: "Allocations amounts for countries by disease.",
    date: "2023-01-04",
  },
  {
    id: "gf_grant_implementation",
    name: "Grant Implementation Periods",
    description: "All grants and implementation periods across the portfolio",
    date: "2023-01-05",
  },
];

export const chartTypes = [
  {
    id: "bar",
    chartType: "Bar Chart",
    description: "Compare values across categories.",
    icon: <BarChartIcon />,
  },

  {
    id: "line",
    chartType: "Line Chart",
    description: "Show trends or changes over time.",
    icon: <LineChartIcon />,
  },
  {
    id: "pie",
    chartType: "Pie Chart",
    description: "Show proportions of a whole.",
    icon: <PieChartIcon />,
  },
  {
    id: "scatter",
    chartType: "Scatter Chart",
    description: "Reveal relationships or distributions.",
    icon: <ScatterChartIcon />,
  },
  {
    id: "geomap",
    chartType: "Geo Map",
    description: "Visualize data by location.",
    icon: <GeoMapIcon />,
  },
  {
    id: "sankey",
    chartType: "Sankey Diagram",
    description: "Show flows between sources and targets.",
    icon: <SankeyDiagramIcon />,
  },
  {
    id: "treemap",
    chartType: "Tree Map",
    description: "Show proportions within hierarchies.",
    icon: <TreeMapIcon />,
  },
  {
    id: "heatmap",
    chartType: "Heatmap Chart",
    description: "Show intensity or distribution across two dimensions.",
    icon: <HeatmapChartIcon />,
  },
  {
    id: "radar",
    chartType: "Radar Chart",
    description: "Compare multivariate data across categories.",
    icon: <RadarChartIcon />,
  },
];

export type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "scatter"
  | "geomap"
  | "sankey"
  | "treemap"
  | "heatmap"
  | "radar";
