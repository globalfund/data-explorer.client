import {
  echartsBarchart,
  echartsGeomap,
  echartsHeatmap,
  echartsLinechart,
  echartsPiechart,
  echartsRadarchart,
  echartsSankey,
  echartsBubblechart,
  echartsTreemap,
} from "rb-core.charts";

export const charts: { [key: string]: any } = {
  bar: echartsBarchart,
  geomap: echartsGeomap,
  heatmap: echartsHeatmap,
  line: echartsLinechart,
  pie: echartsPiechart,
  radar: echartsRadarchart,
  scatter: echartsBubblechart,
  sankey: echartsSankey,
  treemap: echartsTreemap,
};
