import TableIcon from "app/assets/vectors/Select_Table.svg?react";
import TreemapIcon from "app/assets/vectors/Select_Treemap.svg?react";
import HeatmapIcon from "app/assets/vectors/Select_Heatmap.svg?react";
import BarChartIcon from "app/assets/vectors/Select_BarChart.svg?react";
import LineChartIcon from "app/assets/vectors/Select_LineChart.svg?react";
import SankeyChartIcon from "app/assets/vectors/Select_SankeyChart.svg?react";
import SunburstChartIcon from "app/assets/vectors/Select_SunburstChart.svg?react";

export const getChartTypeIcon = (chartType: string): React.ReactNode => {
  switch (chartType) {
    case "Sankey Chart":
      return <SankeyChartIcon />;
    case "Bar Chart":
      return <BarChartIcon />;
    case "Treemap":
      return <TreemapIcon />;
    case "Line Chart":
      return <LineChartIcon />;
    case "Heatmap":
      return <HeatmapIcon />;
    case "Sunburst Chart":
      return <SunburstChartIcon />;
    case "Polyline Tree":
      return <BarChartIcon />;
    case "Table View":
      return <TableIcon />;
    default:
      return null;
  }
};
