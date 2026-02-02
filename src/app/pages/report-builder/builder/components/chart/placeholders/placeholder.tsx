import React from "react";
import BarChartPlaceholderImage from "./bar.svg?react";
import LineChartPlaceholderImage from "./line.svg?react";
import PieChartPlaceholderImage from "./pie.svg?react";
import GeoMapPlaceholderImage from "./geomap.svg?react";
import { Box } from "@mui/material";

const ChartPlaceholder = ({ chartType }: { chartType: string }) => {
  const chartPlaceholders: { [key: string]: React.ReactNode } = {
    bar: <BarChartPlaceholderImage height={"100%"} />,
    line: <LineChartPlaceholderImage height={"100%"} />,
    pie: <PieChartPlaceholderImage height={"100%"} />,
    geomap: <GeoMapPlaceholderImage height={"100%"} />,
  };

  const getPlaceholder = (chartType: string) => {
    return chartPlaceholders[chartType] || <>No Placeholder Available</>;
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        alignItems: "center",
        height: "100%",
      }}
    >
      {getPlaceholder(chartType)}
    </Box>
  );
};

export default ChartPlaceholder;
