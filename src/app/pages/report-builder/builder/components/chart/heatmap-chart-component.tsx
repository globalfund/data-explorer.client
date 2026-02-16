import React from "react";
import { ChartType } from "./data";
import { Heatmap } from "app/components/charts/heatmap";
import { HeatmapDataItem } from "app/components/charts/heatmap/data";
import { MappedDimension } from "app/state/api/action-reducers/report-builder/sync";
import { colorPaletteSequentialData } from "../panel/elements-controller/common/data";
import { generateHeatmapLegends } from "./utils/chart-utils";

interface HeatmapChartComponentProps {
  data: any;
  chartType: ChartType;
  visualOptions: any;
  mapping: MappedDimension | undefined;
  id: string;
}

const HeatmapChartComponent = (props: HeatmapChartComponentProps) => {
  const { colorPalette } = props.visualOptions;
  const resolvedXAxisName = props.mapping?.x?.value?.[0] ?? "";

  const resolvedYAxisName = props.mapping?.y?.value?.[0] ?? "";

  const data = props.data.map((item: any) => ({
    column: item.x,
    row: item.y,
    value: item.size,
  }));

  const paletteColors: string[] =
    colorPaletteSequentialData.find((item) => item.name === colorPalette)
      ?.colors ??
    colorPaletteSequentialData[0]?.colors ??
    [];

  const values = data.map((d: any) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  function getColor(item?: HeatmapDataItem) {
    if (!item) return "#FFFFFF";

    const value = item.value as number;

    if (maxValue === minValue) {
      return paletteColors[Math.floor(paletteColors.length / 2)] || "#FFFFFF";
    }

    const normalized = (value - minValue) / (maxValue - minValue);

    const index = Math.round(normalized * (paletteColors.length - 1));

    return paletteColors[index] || "#FFFFFF";
  }

  return (
    <Heatmap
      valueType="other"
      contentProp="value"
      hoveredLegend={null}
      columnCategory={props.mapping?.x?.value?.[0] ?? ""}
      rowCategory={props.mapping?.y?.value?.[0] ?? ""}
      getItemColor={getColor}
      columnHeader={resolvedXAxisName}
      rowHeader={resolvedYAxisName}
      data={data}
      customLegends={generateHeatmapLegends(data, paletteColors, {
        suffix: "",
        decimals: 0,
        includeOutlier: true,
      })}
    />
  );
};

export default HeatmapChartComponent;
