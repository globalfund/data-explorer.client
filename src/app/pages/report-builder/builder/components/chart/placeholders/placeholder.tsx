import React from "react";
import Box from "@mui/material/Box";
import BarChartPlaceholderImage from "app/pages/report-builder/builder/components/chart/placeholders/bar.svg?react";
import PieChartPlaceholderImage from "app/pages/report-builder/builder/components/chart/placeholders/pie.svg?react";
import GeoMapPlaceholderImage from "app/pages/report-builder/builder/components/chart/placeholders/geomap.svg?react";
import LineChartPlaceholderImage from "app/pages/report-builder/builder/components/chart/placeholders/line.svg?react";
import HeatmapPlaceholderImage from "app/pages/report-builder/builder/components/chart/placeholders/heatmap.svg?react";
import TreemapPlaceholderImage from "app/pages/report-builder/builder/components/chart/placeholders/treemap.svg?react";
import RadarChartPlaceholderImage from "app/pages/report-builder/builder/components/chart/placeholders/radar.svg?react";
import SankeyChartPlaceholderImage from "app/pages/report-builder/builder/components/chart/placeholders/sankey.svg?react";
import ScatterChartPlaceholderImage from "app/pages/report-builder/builder/components/chart/placeholders/scatter.svg?react";

const ChartPlaceholder = ({ chartType }: { chartType: string }) => {
  const chartPlaceholders: { [key: string]: React.ReactNode } = {
    bar: <BarChartPlaceholderImage height={"100%"} />,
    line: <LineChartPlaceholderImage height={"100%"} />,
    pie: <PieChartPlaceholderImage height={"100%"} />,
    geomap: <GeoMapPlaceholderImage height={"100%"} />,
    sankey: <SankeyChartPlaceholderImage height={"100%"} />,
    scatter: <ScatterChartPlaceholderImage height={"100%"} />,
    treemap: <TreemapPlaceholderImage height={"100%"} />,
    radar: <RadarChartPlaceholderImage height={"100%"} />,
    heatmap: <HeatmapPlaceholderImage height={"100%"} />,
  };

  const getPlaceholder = (chartType: string) => {
    return chartPlaceholders[chartType] || <>No Placeholder Available</>;
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "> svg": { width: "100%" },
      }}
    >
      {getPlaceholder(chartType)}
    </Box>
  );
};

export default ChartPlaceholder;
