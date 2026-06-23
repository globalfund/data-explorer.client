import uniqBy from "lodash/uniqBy";
import sortBy from "lodash/sortBy";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

import {
  MapChart,
  BarChart,
  LineChart,
  PieChart,
  SankeyChart,
  TreemapChart,
  SunburstChart,
  CustomChart,
  GraphChart,
  ScatterChart,
  RadarChart,
  HeatmapChart,
} from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  DataZoomComponent,
  RadarComponent,
} from "echarts/components";

//@ts-expect-error module without types
import { transform } from "echarts-stat";
import { debounce, get } from "lodash";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { ChartType } from "../data";
import {
  colorPaletteCategoricalData,
  colorPaletteSequentialData,
} from "../../panel/elements-controller/common/data";
import {
  parseBarWidth,
  parseCssPx,
  parseFontSize,
  valueFormatter3,
} from "../utils/chart-utils";

echarts.use([
  BarChart,
  MapChart,
  PieChart,
  LineChart,
  GraphChart,
  CustomChart,
  SankeyChart,
  HeatmapChart,
  RadarChart,
  TreemapChart,
  GridComponent,
  SunburstChart,
  ScatterChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent,
  RadarComponent,
]);

interface UseDataThemesEchartProps {
  readOnly?: boolean;
  setVisualOptions?: (value: any) => void;
  visualOptions?: any;
  setStateChart?: (chart: echarts.EChartsType | null) => void;
}

export function useEcharts({
  visualOptions: mainVisualOptions,
  setVisualOptions,
  readOnly,
  setStateChart,
}: UseDataThemesEchartProps) {
  const debouncedSetVisualOptions = debounce((value: any) => {
    if (setVisualOptions) {
      setVisualOptions(value);
    }
  }, 500);

  function onResize(chart: echarts.EChartsType, id: string, height?: number) {
    const container = document.getElementById(id);
    chart.resize({
      width: container?.clientWidth,
      height: height ?? "auto",
    });
  }
  echarts.registerTransform(transform.regression);

  function echartsBarchart(data: any, visualOptions: any, mapping: any) {
    const vo = visualOptions ?? {};

    const {
      // colors / bars
      colorPalette,
      customBarWidth,
      barWidth,

      // axes / behavior
      logarithmicYAxis,
      realTimeSort,

      // tooltip
      showTooltip,
      monetaryValueTooltip,

      chartOrientation,
    } = vo;

    const paletteColors: string[] =
      colorPaletteCategoricalData.find((item) => item.name === colorPalette)
        ?.colors ?? [];

    const totalData: number[] = [];

    for (let i = 0; i < data.series[0].values.length; ++i) {
      let sum = 0;
      for (let j = 0; j < data.series.length; ++j) {
        sum += data.series[j].values[i];
      }
      totalData.push(sum);
    }

    const isMonetaryValue = !!monetaryValueTooltip;

    const option: any = {
      backgroundColor: "transparent",
      ...(paletteColors?.length ? { color: paletteColors } : {}),
      legend: { show: false },
      grid: {
        top: 30,
        left: 10,
        right: 30,
        bottom: 10,
        containLabel: true,
      },
      xAxis: {
        ...(chartOrientation === "horizontal"
          ? { type: logarithmicYAxis ? "log" : "value" }
          : { type: "category", data: data.xAxisValues }),
        splitLine: { show: true },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
      },

      yAxis: {
        ...(chartOrientation === "horizontal"
          ? { type: "category", data: data.yAxisValues }
          : { type: logarithmicYAxis ? "log" : "value" }),
        splitLine: { show: true },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
      },

      tooltip: {
        show: !!showTooltip,
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => valueFormatter3(params, isMonetaryValue),
      },
      colorBy: mapping?.breakdown?.value ? "series" : "data",
      series: data.series?.map((d: any) => {
        return {
          type: "bar",
          name: d?.name,
          data:
            visualOptions?.groupStyle === "percent"
              ? d?.values.map((val: number, dataIndex: number) =>
                  totalData[dataIndex] <= 0 ? 0 : val / totalData[dataIndex],
                )
              : d?.values,
          stack: visualOptions?.groupStyle === "grouped" ? false : "total",
          realtimeSort: realTimeSort ?? true,
          barWidth: customBarWidth ? parseBarWidth(barWidth) : undefined,
          emphasis: {
            focus: "series",
          },
        };
      }),
    };

    return option;
  }

  function echartsPiechart(data: any[], visualOptions: any) {
    const vo = visualOptions ?? {};

    const {
      // label
      showLabel,
      labelPosition,

      // donut
      drawAsDonuts,
      donutThickness,

      // palette
      colorPalette,

      // tooltip
      showTooltip,
      monetaryValueTooltip,
    } = vo;

    const paletteColors: string[] =
      colorPaletteCategoricalData.find((item) => item.name === colorPalette)
        ?.colors ??
      colorPaletteCategoricalData[0]?.colors ??
      [];

    const isMonetaryValue = !!monetaryValueTooltip;

    // ECharts pie radius is usually percent strings; donut thickness becomes inner radius.
    // Clamp to keep it sane.
    const outer = 80; // percent
    const inner = Math.max(
      0,
      Math.min(outer, outer - Number(donutThickness ?? 50)),
    );

    const radius = drawAsDonuts
      ? [`${inner}%`, `${outer}%`]
      : ["0%", `${outer}%`];

    return {
      backgroundColor: "transparent",
      ...(paletteColors?.length ? { color: paletteColors } : {}),
      legend: { show: false },

      tooltip: {
        show: !!showTooltip,
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => valueFormatter3(params, isMonetaryValue),
      },

      series: [
        {
          type: "pie",
          radius,
          center: ["50%", "50%"],
          avoidLabelOverlap: false,

          label: {
            show: showLabel ?? true,
            position: labelPosition ?? "outside",
            rotate: (labelPosition ?? "outside") === "inside",
            fontFamily: get(
              visualOptions,
              "labelTextOptions.fontFamily",
              "Arial",
            ),
            fontWeight: get(
              visualOptions,
              "labelTextOptions.fontWeight",
              "400",
            ),
            fontSize: parseFontSize(
              get(visualOptions, "labelTextOptions.fontSize", "12"),
              12,
            ),
            color: get(visualOptions, "labelTextOptions.textColor", "#000000"),
            backgroundColor: get(
              visualOptions,
              "labelTextOptions.backgroundColor",
              "transparent",
            ),
          },

          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },

          data: data ?? [],
        },
      ],
    };
  }

  function echartsGeomap(data: any, visualOptions: any) {
    const vo = visualOptions ?? {};

    const {
      // map behavior
      mapRoaming,
      roamOption,
      showAntarctica,
      scaleLimitMin,
      scaleLimitMax,

      // tooltip
      showTooltip,
      monetaryValueTooltip,

      // colors
      colorPalette,
    } = vo;

    if (!data?.geoJSON) return {};

    // remove Antarctica if requested
    const geoJSON = !showAntarctica
      ? {
          ...data.geoJSON,
          features: data.geoJSON.features.filter((f: any) => f.id !== "ATA"),
        }
      : data.geoJSON;

    echarts.registerMap("World", geoJSON);

    const sizes = (data?.results ?? []).map((d: any) => d.value);

    // palette lookup (sequential for choropleth)
    const paletteColors =
      colorPaletteSequentialData.find((item) => item.name === colorPalette)
        ?.colors ?? colorPaletteSequentialData[0]?.colors;

    return {
      backgroundColor: "transparent",

      tooltip: {
        trigger: showTooltip ? "item" : "none",
        showDelay: 0,
        transitionDuration: 0.2,
        confine: true,
        formatter: (params: any) => {
          if (params?.value == null) return "";
          return `${params.name}: ${
            monetaryValueTooltip
              ? formatFinancialValue(params.value, true)
              : params.value
          }`;
        },
      },

      visualMap: {
        left: "right",
        min: Math.min(...sizes),
        max: Math.max(...sizes),
        inRange: {
          color: paletteColors,
        },
        text: ["High", "Low"],
        calculable: true,
        show: false,
      },
      series: [
        {
          type: "map",
          map: "World",
          data: data?.results ?? [],
          roam: mapRoaming ? (roamOption ?? true) : false,
          layoutCenter: ["50%", "50%"],
          layoutSize: "150%",
          scaleLimit: {
            min: parseFloat(scaleLimitMin ?? "0.5"),
            max: parseFloat(scaleLimitMax ?? "2"),
          },

          itemStyle: {
            borderWidth: 0,
          },

          emphasis: {
            label: { show: false },
            itemStyle: { areaColor: "#cdd4df" },
          },

          select: { disabled: true },
        },
      ],
    };
  }

  const valueFormatter2 = (value: number | string, isMonetaryValue: boolean) =>
    isMonetaryValue
      ? formatFinancialValue(parseInt(value.toString(), 10), true)
      : value;

  function echartsLinechart(data: any, visualOptions: any) {
    const vo = visualOptions ?? {};

    const {
      // line styling
      lineType,
      lineWidth,
      smoothLine,

      // tooltip
      showTooltip,
      monetaryValueTooltip,

      // colors
      colorPalette,
    } = vo;

    const paletteColors: string[] =
      colorPaletteCategoricalData.find((item) => item.name === colorPalette)
        ?.colors ??
      colorPaletteCategoricalData[0]?.colors ??
      [];

    const isMonetaryValue = !!monetaryValueTooltip;

    return {
      backgroundColor: "transparent",
      ...(paletteColors?.length ? { color: paletteColors } : {}),
      legend: { show: false },

      grid: {
        top: 30,
        left: 10,
        right: 30,
        bottom: 10,
        containLabel: true,
      },

      xAxis: {
        type: "category",
        data: data?.xAxisValues || [],
        boundaryGap: false,
        splitLine: { show: true },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
      },

      yAxis: {
        type: "value",
        splitLine: { show: true },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
      },
      series: (data?.series ?? []).map((s: any) => ({
        type: "line",
        name: s.name,
        smooth: smoothLine ?? false,
        data: (data?.xAxisValues ?? []).map((x: any) => s.values?.[x] ?? 0),
        lineStyle: {
          type: lineType ?? "solid",
          width: parseCssPx(lineWidth, 2),
        },
      })),

      tooltip: {
        show: !!showTooltip,
        trigger: showTooltip ? "axis" : "none",
        confine: true,
        valueFormatter: (value: number | string) =>
          valueFormatter2(value, isMonetaryValue),
      },
    };
  }

  function echartsBubblechart(data: any, visualOptions: any, mapping: any) {
    const vo = visualOptions ?? {};

    const {
      // colors / styling
      colorPalette,
      symbolSize, // max bubble size
      symbolColor, // default point color if item.color missing

      // behavior
      showDataZoom,

      // tooltip
      showTooltip,
      monetaryValueTooltip,
    } = vo;

    const paletteColors: string[] =
      colorPaletteCategoricalData.find((item) => item.name === colorPalette)
        ?.colors ??
      colorPaletteCategoricalData[0]?.colors ??
      [];

    const isMonetaryValue = !!monetaryValueTooltip;

    const groups = Object.keys(data ?? {});

    // ---- bubble size normalization (same as your original)
    const maxSize = Math.max(
      0,
      ...groups.map((group) =>
        (data?.[group] ?? []).reduce((prev: number, curr: any) => {
          return Math.max(prev, Number(curr?.size ?? 0));
        }, 0),
      ),
    );

    const maxSymbol = Number(symbolSize ?? 50);

    // ---- Trendline: flatten ALL points into [[x,y], ...]
    const trendlineSource: any[] = [];
    groups.forEach((group) => {
      (data?.[group] ?? []).forEach((item: any) => {
        trendlineSource.push([item?.x, item?.y]);
      });
    });

    return {
      backgroundColor: "transparent",
      ...(paletteColors?.length ? { color: paletteColors } : {}),
      grid: {
        top: 30,
        left: 10,
        right: 30,
        bottom: 10,
        containLabel: true,
      },

      xAxis: {
        type: mapping?.x?.mappedType?.[0] === "date" ? "category" : "value",
        splitLine: { lineStyle: { type: "dashed" } },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
      },

      yAxis: {
        type: mapping?.y?.mappedType?.[0] === "date" ? "category" : "value",
        scale: true,
        splitLine: { lineStyle: { type: "dashed" } },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
      },

      dataZoom: showDataZoom
        ? [{ type: "inside", start: 0, end: 100 }, { show: true }]
        : null,

      tooltip: {
        show: !!showTooltip,
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => {
          // bubble series points: [x, y, normalizedSize, label, color, rawSize]
          if (params?.seriesType === "line") {
            // trendline tooltip
            const x = params?.data?.[0];
            const y = params?.data?.[1];
            return `Trend: ${x}, ${valueFormatter2(y, isMonetaryValue)}`;
          }

          const rawSize = params?.data?.[5] ?? 0;
          const label = params?.data?.[3] ?? params?.seriesName ?? "";

          const displayValue = isMonetaryValue
            ? formatFinancialValue(rawSize, true)
            : rawSize;

          return `${label}: ${displayValue}`;
        },
      },

      series: groups.map((group, idx) => {
        const itemColor = mapping?.label
          ? paletteColors?.[idx % paletteColors.length]
          : symbolColor;
        return {
          name: group,
          type: "scatter",

          data: (data?.[group] ?? []).map((item: any) => {
            const raw = Number(item?.size ?? 0);
            const normalized = mapping?.size
              ? maxSize > 0
                ? (raw / maxSize) * maxSymbol
                : 0
              : maxSymbol / 2; // if size not mapped, use default mid-size for all points

            return [item?.x, item?.y, normalized, item?.label ?? ""];
          }),

          symbolSize: (singleData: any) => singleData?.[2] ?? 0,

          itemStyle: {
            color: itemColor + "80",
            borderWidth: 2,
            borderColor: itemColor, // add transparency to border
            opacity: 0.7,
          },

          emphasis: {
            focus: "series",
            label: {
              show: true,
              formatter: (param: any) => param?.data?.[3] ?? "",
              position: "top",
            },
          },
        };
      }),
    };
  }

  function echartsHeatmap(data: any, visualOptions: any, mapping: any) {
    const {
      //artboard
      width,
      height,
      // margin
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // Label
      showLabels,
      labelFontSize,
      // Palette
      palette,
      customYAxisName,
      yAxisName,
    } = visualOptions;

    const xAxisData = sortBy(data.filter((d: any) => d.x).map((d: any) => d.x));

    const yAxisData = sortBy(data.filter((d: any) => d.y).map((d: any) => d.y));

    const seriesData = data.map((item: any) => [item.x, item.y, item.size]);

    return {
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: uniqBy(xAxisData, (d: any) => d),
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        data: uniqBy(yAxisData, (d: any) => d),
        splitArea: {
          show: true,
        },
        name: customYAxisName ? yAxisName : (mapping?.y?.value?.[0] ?? ""),
        nameTextStyle: {
          align: "left",
        },
      },
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        valueFormatter: (value: number | string) =>
          valueFormatter2(value, isMonetaryValue),
      },
      visualMap: {
        min: Math.min(...data.map((item: any) => item.size)),
        max: Math.max(...data.map((item: any) => item.size)),
        calculable: true,
        realtime: false,
        inRange: {
          color: colorPaletteSequentialData.find(
            (item) => item.label === palette,
          )?.colors,
        },
        show: false,
      },
      series: [
        {
          type: "heatmap",
          data: seriesData,
          label: {
            show: showLabels,
            fontSize: labelFontSize,
          },
          emphasis: {
            itemStyle: {
              borderColor: "#333",
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          progressive: 1000,
          animation: false,
          width,
          height,
        },
      ],
    };
  }

  function echartsRadarchart(data: any, visualOptions: any) {
    const {
      showTooltip,
      monetaryValueTooltip: isMonetaryValue,
      colorPalette: palette,
      startAngle,
      gridCircles,
      showPointMarkers,
    } = visualOptions;

    const paletteColors =
      colorPaletteCategoricalData.find((item: any) => item.name === palette)
        ?.colors ?? undefined;

    const minAxisRange =
      visualOptions.minAxisRange === "auto"
        ? undefined
        : Number(visualOptions.minAxisRange);

    const maxAxisRange =
      visualOptions.maxAxisRange === "auto"
        ? undefined
        : Number(visualOptions.maxAxisRange);

    const indicators = data.indicators.map((ind: any) => {
      const next = { ...ind };
      if (minAxisRange !== undefined) next.min = minAxisRange;
      if (maxAxisRange !== undefined) next.max = maxAxisRange;
      return next;
    });

    const radarCenter: any = ["50%", "50%"];
    const radarRadius: any = "70%";

    return {
      color: paletteColors,
      backgroundColor: "transparent",

      tooltip: {
        trigger: showTooltip ? "item" : "none",
        valueFormatter: (value: number | string) =>
          valueFormatter2(value, isMonetaryValue),
      },

      legend: {
        show: false,
      },
      radar: {
        startAngle,
        splitNumber: gridCircles,
        indicator: indicators,
        center: radarCenter,
        radius: radarRadius,
        axisName: {
          show: showPointMarkers,
        },
      },
      colorBy: "data",
      series: [
        {
          type: "radar",
          symbol: "none",
          lineStyle: {
            width: 2,
          },
          // areaStyle: {
          //   opacity: 0.2,
          //   zIndex: -1,
          // },
          emphasis: {
            lineStyle: {
              width: 4,
            },
          },

          data: data.data.map((d: any) => ({
            value: d.value,
            name: String(d.name),
          })),
        },
      ],
    };
  }

  const formatSankeyTooltip = (params: any, isMonetaryValue: boolean) => {
    let result = "";
    if (params.data.source && params.data.target && params.data.value) {
      let source = "";
      let target = "";
      let splits = params.data.source.split("-");
      if (splits.length === 1) {
        source = params.data.source;
      } else {
        source = splits.slice(1).join("-");
      }
      splits = params.data.target.split("-");
      if (splits.length === 1) {
        target = params.data.target;
      } else {
        target = splits.slice(1).join("-");
      }
      result = `${source} - ${target}: ${
        isMonetaryValue
          ? formatFinancialValue(params.data.value, true)
          : params.data.value
      }`;
    } else {
      let name = "";
      const splits = params.name.split("-");
      if (splits.length === 1) {
        name = params.name;
      } else {
        name = splits.slice(1).join("-");
      }
      result = name;
    }
    return result;
  };

  function echartsSankey(data: any, visualOptions: any) {
    const vo = visualOptions ?? {};

    const {
      // sankey layout
      nodeWidth,
      nodePadding,
      linkOpacity,
      chartOrientation,
      flowAlignment,
      draggableNodes,

      // labels
      showEdgeLabels,
      showNodeLabels,
      labelPosition,
      labelRotation,
      labelTextOptions,

      // palette
      colorPalette,

      // tooltip
      showTooltip,
      monetaryValueTooltip,
    } = vo;

    const paletteColors: string[] =
      colorPaletteCategoricalData.find((item) => item.name === colorPalette)
        ?.colors ??
      colorPaletteCategoricalData[0]?.colors ??
      [];

    const isMonetaryValue = !!monetaryValueTooltip;

    // --- normalize input shape
    const links = Array.isArray(data) ? data : (data?.links ?? []);
    let nodes =
      Array.isArray(data?.nodes) && data.nodes.length ? data.nodes : [];

    if (!nodes.length) {
      // build nodes from links if not provided
      const built: { name: string }[] = [];
      links.forEach((d: any) => {
        if (d?.source != null) built.push({ name: String(d.source) });
        if (d?.target != null) built.push({ name: String(d.target) });
      });
      nodes = uniqBy(built, "name");
    }

    // ECharts sankey uses `orient: 'horizontal' | 'vertical'`
    const orient = chartOrientation === "vertical" ? "vertical" : "horizontal";

    // ECharts sankey uses nodeAlign: 'left' | 'right' | 'justify'
    // Your VO provides flowAlignment: "justify" etc.
    const nodeAlign =
      flowAlignment === "left" ||
      flowAlignment === "right" ||
      flowAlignment === "justify"
        ? flowAlignment
        : "justify";

    return {
      backgroundColor: "transparent",
      ...(paletteColors?.length ? { color: paletteColors } : {}),

      series: [
        {
          type: "sankey",
          data: nodes,
          links,

          orient,
          nodeAlign,

          nodeWidth: Number(nodeWidth ?? 15),
          nodeGap: Number(nodePadding ?? 10),

          // allow drag or lock nodes
          draggable: !!draggableNodes,

          emphasis: { focus: "adjacency" },

          // link styling
          lineStyle: {
            curveness: 0.5,
            color: "source",
            opacity: Math.max(0, Math.min(1, Number(linkOpacity ?? 50) / 100)),
          },
          // node labels
          label: {
            show: showNodeLabels ?? true,
            position: labelPosition ?? "right",
            rotate: Number(labelRotation ?? 0),
            fontFamily: labelTextOptions?.fontFamily ?? "Arial",
            fontWeight: labelTextOptions?.fontWeight ?? "400",
            fontSize: parseFontSize(labelTextOptions?.fontSize, 12),
            color: labelTextOptions?.textColor ?? "#000000",
            backgroundColor: labelTextOptions?.backgroundColor,
          },

          // edge labels (optional)
          edgeLabel: {
            show: !!showEdgeLabels,
            // If you later add edge label styling options, wire them here.
          },
        },
      ],

      tooltip: {
        show: !!showTooltip,
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) =>
          formatSankeyTooltip(params, isMonetaryValue),
      },
    };
  }

  const valueFormatter1 = (params: any, isMonetaryValue: boolean) => {
    if (params.dataType === "node") {
      const value = isMonetaryValue
        ? formatFinancialValue(params.data.value, true)
        : params.data.value;
      return `${params.name}: ${value ?? "unspecified"}`;
    }
    return params.name;
  };

  function echartsTreemap(data: any, visualOptions: any, mapping: any) {
    const vo = visualOptions ?? {};

    const {
      // labels / breadcrumbs
      showLabels,
      showBreadcrumbs,

      // tooltip
      showTooltip,
      monetaryValueTooltip,

      // colors
      colorPalette,
    } = vo;

    const paletteColors: string[] =
      colorPaletteCategoricalData.find((item) => item.name === colorPalette)
        ?.colors ??
      colorPaletteCategoricalData[0]?.colors ??
      [];

    return {
      backgroundColor: "transparent",
      ...(paletteColors?.length ? { color: paletteColors } : {}),
      legend: { show: false },

      series: [
        {
          name: "All",
          type: "treemap",
          data,
          roam: false,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          leafDepth: 1,
          nodeClick: "zoomToNode",
          drillDownIcon: "",
          label: {
            show: !!showLabels,
          },

          breadcrumb: {
            show: !!showBreadcrumbs,
            top: 0,
            bottom: "auto",
          },
          levels: mapping?.hierarchy?.value?.map(() => ({
            color: paletteColors,
            label: {
              offset: [8, 8],
              position: "insideTopLeft",
              fontFamily: "Inter, sans-serif",
              formatter: (params: any) => {
                return [
                  `{name|${params.data.name}}`,
                  `{value|${params.value}}`,
                ].join("\n");
              },
              rich: {
                name: {
                  fontSize: "14px",
                  fontWeight: "bold",
                },
                value: {
                  fontSize: "14px",
                },
              },
            },
          })),
        },
      ],

      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) =>
          valueFormatter1(params, !!monetaryValueTooltip),
      },
    };
  }

  const handleDataZoom = (event: any) => {
    if (!readOnly) {
      if (event.batch) {
        debouncedSetVisualOptions({
          ...mainVisualOptions,
          dataZoomStart: event.batch[0].start,
          dataZoomEnd: event.batch[0].end,
        });
      } else {
        debouncedSetVisualOptions({
          ...mainVisualOptions,
          dataZoomStart: event.start,
          dataZoomEnd: event.end,
        });
      }
    }
  };

  function render(
    data: any,
    node: HTMLElement,
    chartType: ChartType,
    visualOptions: any,
    mapping: any,
    id: string,
  ) {
    new ResizeObserver(() => onResize(chart, id, node.clientHeight)).observe(
      node,
    );

    const chart = echarts.init(node, undefined, {
      renderer: "svg",
      height: visualOptions.height,
    });

    window.removeEventListener("resize", () => onResize(chart, id));

    const CHART_TYPE_TO_COMPONENT = {
      bar: () => echartsBarchart(data, visualOptions, mapping),
      geomap: () => echartsGeomap(data, visualOptions),
      line: () => echartsLinechart(data, visualOptions),
      sankey: () => echartsSankey(data, visualOptions),
      treemap: () => echartsTreemap(data, visualOptions, mapping),
      pie: () => echartsPiechart(data, visualOptions),
      scatter: () => echartsBubblechart(data, visualOptions, mapping),
      heatmap: () => echartsHeatmap(data, visualOptions, mapping),
      radar: () => echartsRadarchart(data, visualOptions),
      bigNumber: () => {},
    };

    chart.setOption(CHART_TYPE_TO_COMPONENT[chartType](), true);

    window.addEventListener("resize", () => onResize(chart, id));
    chart.on("datazoom", handleDataZoom);
    setStateChart?.(chart);
  }

  return { render };
}
