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
  TitleComponent,
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
  parseEchartsLayout,
  parseFontSize,
  resolveLegendPosition,
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
  TitleComponent,
]);

interface UseDataThemesEchartProps {
  readOnly?: boolean;
  setVisualOptions?: (value: any) => void;
  visualOptions?: any;
}

export function useEcharts({
  visualOptions: mainVisualOptions,
  setVisualOptions,
  readOnly,
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

  function echartsBarchart(data: any[], visualOptions: any, mapping: any) {
    const vo = visualOptions ?? {};

    const {
      // title
      showChartName,
      chartTitle,
      chartTitleOptions,

      // legend
      showLegend,
      legendPosition,
      legendTextOptions,

      // layout
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      background,

      // colors / bars
      colorPalette,
      customBarWidth,
      barWidth,
      strokeWidth,
      strokeColor,
      cornerRadius,

      // axes / behavior
      logarithmicYAxis,
      realTimeSort,

      // tooltip
      showTooltip,
      monetaryValueTooltip,

      // axis names
      customYAxisName,
      yAxisName,
      customXAxisName,
      xAxisName,
    } = vo;

    const sortedData = sortBy(data ?? [], (d) => d?.bars);
    const bars = sortedData.map((d: any) => d?.bars);
    const sizes = sortedData.map((d: any) => d?.size);

    const paletteColors: string[] =
      colorPaletteCategoricalData.find((item) => item.name === colorPalette)
        ?.colors ?? [];

    console.log(paletteColors, "paletteColors", colorPalette);

    const resolvedXAxisName = customXAxisName
      ? (xAxisName ?? mapping?.bars?.value?.[0] ?? "")
      : "";

    const resolvedYAxisName = customYAxisName
      ? (yAxisName ?? mapping?.size?.value?.[0] ?? "")
      : "";

    const isMonetaryValue = !!monetaryValueTooltip;

    const title = showChartName
      ? (() => {
          const t: any = {
            show: true,
            text: chartTitle ?? "",
            left: 0,
            top: 0,
            padding: 6,
            backgroundColor: chartTitleOptions?.backgroundColor,
            textStyle: {
              fontFamily: get(
                visualOptions,
                "chartTitleOptions.fontFamily",
                "Arial",
              ),
              fontWeight: get(
                visualOptions,
                "chartTitleOptions.fontWeight",
                "400",
              ),
              fontSize: parseFontSize(
                get(visualOptions, "chartTitleOptions.fontSize", "14"),
                14,
              ),
              color: get(
                visualOptions,
                "chartTitleOptions.textColor",
                "#000000",
              ),
            },
          };

          return t;
        })()
      : undefined;

    const legend = showLegend
      ? {
          show: true,
          ...resolveLegendPosition(legendPosition),
          textStyle: {
            fontFamily: legendTextOptions?.fontFamily ?? "Arial",
            fontWeight: legendTextOptions?.fontWeight ?? "400",
            fontSize: parseFontSize(legendTextOptions?.fontSize, 14),
            color: legendTextOptions?.textColor ?? "#000000",
            backgroundColor: legendTextOptions?.backgroundColor,
          },
        }
      : { show: false };

    const option: any = {
      backgroundColor: background ?? "transparent",
      ...(paletteColors?.length ? { color: paletteColors } : {}),
      ...(title ? { title } : {}),
      legend,
      grid: {
        top: parseEchartsLayout(paddingTop, 20),
        left: parseEchartsLayout(paddingLeft, 20),
        right: parseEchartsLayout(paddingRight, 20),
        bottom: parseEchartsLayout(paddingBottom, 20),
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: bars,
        name: resolvedXAxisName,
        nameLocation: "middle",
        nameGap: 32,
        splitLine: { show: true },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
        nameTextStyle: {
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          color: "#161616",
          fontWeight: "600",
        },
      },

      yAxis: {
        type: logarithmicYAxis ? "log" : "value",
        name: resolvedYAxisName,
        nameLocation: "middle",
        nameGap: 47,
        splitLine: { show: true },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
        nameTextStyle: {
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          color: "#161616",
          fontWeight: "600",
        },
      },

      tooltip: {
        show: !!showTooltip,
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => valueFormatter3(params, isMonetaryValue),
      },
      series: [
        {
          name: resolvedYAxisName || "",
          type: "bar",
          data: sizes,
          realtimeSort: realTimeSort ?? true,
          barWidth: customBarWidth
            ? parseBarWidth(barWidth, undefined)
            : undefined,
          colorBy: "data",
          itemStyle: {
            borderRadius: parseCssPx(cornerRadius, 0),
            borderWidth: parseCssPx(strokeWidth, 0),
            borderColor: strokeColor ?? "#000000",
          },
        },
      ],
    };

    return option;
  }

  function echartsPiechart(data: any[], visualOptions: any) {
    const vo = visualOptions ?? {};

    const {
      // title
      showChartName,
      chartTitle,
      chartTitleOptions,

      // label
      showLabel,
      labelPosition,
      labelTextOptions,

      // legend
      showLegend,
      legendPosition,
      legendTextOptions,

      // layout
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      background,

      // donut
      drawAsDonuts,
      donutThickness,

      // palette
      colorPalette,

      // stroke / rounding
      strokeWidth,
      strokeColor,
      cornerRadius,

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

    const title = showChartName
      ? {
          show: true,
          text: chartTitle ?? "",
          left: 0,
          top: 0,
          padding: 6,
          backgroundColor: chartTitleOptions?.backgroundColor,
          textStyle: {
            fontFamily: get(vo, "chartTitleOptions.fontFamily", "Arial"),
            fontWeight: get(vo, "chartTitleOptions.fontWeight", "400"),
            fontSize: parseFontSize(
              get(vo, "chartTitleOptions.fontSize", "14"),
              14,
            ),
            color: get(vo, "chartTitleOptions.textColor", "#000000"),
          },
        }
      : undefined;

    const legend = showLegend
      ? {
          show: true,
          ...resolveLegendPosition(legendPosition),
          type: "scroll",
          width: "90%",
          textStyle: {
            fontFamily: legendTextOptions?.fontFamily ?? "Arial",
            fontWeight: legendTextOptions?.fontWeight ?? "400",
            fontSize: parseFontSize(legendTextOptions?.fontSize, 14),
            color: legendTextOptions?.textColor ?? "#000000",
            backgroundColor: legendTextOptions?.backgroundColor,
          },
        }
      : { show: false };

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
      backgroundColor: background ?? "transparent",
      ...(paletteColors?.length ? { color: paletteColors } : {}),
      ...(title ? { title } : {}),
      legend,

      grid: {
        top: parseEchartsLayout(paddingTop, 20),
        left: parseEchartsLayout(paddingLeft, 20),
        right: parseEchartsLayout(paddingRight, 20),
        bottom: parseEchartsLayout(paddingBottom, 20),
        containLabel: true,
      },

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
          // Centering in pie is done with `center` not alignHorizontal/Vertical in most cases
          center: ["50%", "50%"],
          avoidLabelOverlap: false,

          label: {
            show: showLabel ?? true,
            position: labelPosition ?? "outside",
            rotate: (labelPosition ?? "outside") === "inside",
            fontFamily: labelTextOptions?.fontFamily ?? "Arial",
            fontWeight: labelTextOptions?.fontWeight ?? "400",
            fontSize: parseFontSize(labelTextOptions?.fontSize, 12),
            color: labelTextOptions?.textColor ?? "#000000",
            backgroundColor: labelTextOptions?.backgroundColor,
          },

          itemStyle: {
            borderWidth: parseCssPx(strokeWidth, 0),
            borderColor: strokeColor ?? "#000000",
            borderRadius: parseCssPx(cornerRadius, 0),
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
    const {
      // artboard
      height,
      width,
      // chart
      showAntarctica,
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // Tooltip
      palette,
      roam,
      showTooltip,
      isMonetaryValue,
      scaleLimitMin,
      scaleLimitMax,
    } = visualOptions;

    if (!data.geoJSON) return {};
    let geoJSON = null;
    if (!showAntarctica) {
      geoJSON = {
        ...data.geoJSON,
        features: data.geoJSON.features.filter(
          (feature: any) => feature.id !== "ATA",
        ),
      };
    } else {
      geoJSON = data.geoJSON;
    }

    echarts.registerMap("World", geoJSON);

    const sizes = data.results.map((d: any) => d.value);

    // height to width ratio
    const sizeRatio = showAntarctica ? 0.55 : 0.45;

    const responsiveHeight = sizeRatio * width;
    const responsiveWidth = height * (1 / sizeRatio);

    const newHeight = responsiveHeight > height ? height : responsiveHeight;
    const newWidth = responsiveHeight > height ? responsiveWidth : width;

    const top = height - newHeight > 0 ? (height - newHeight) / 2 : 0;
    const left = width - newWidth > 0 ? (width - newWidth) / 2 : 0;
    return {
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        showDelay: 0,
        transitionDuration: 0.2,
        confine: true,
        formatter: (params: any) => {
          if (params.value) {
            return `${params.name}: ${
              isMonetaryValue
                ? formatFinancialValue(params.value, true)
                : params.value
            }`;
          }
        },
      },
      visualMap: {
        left: "right",
        min: Math.min(...sizes),
        max: Math.max(...sizes),
        inRange: {
          color: colorPaletteSequentialData.find(
            (item) => item.label === palette,
          )?.colors,
        },
        text: ["High", "Low"],
        calculable: true,
        show: false,
      },
      series: [
        {
          type: "map",
          height: newHeight,
          width: newWidth,
          roam: roam,
          map: "World",
          data: data.results,
          top: marginTop + top,
          left: marginLeft + left,
          right: marginRight,
          bottom: marginBottom,
          scaleLimit: {
            min: scaleLimitMin,
            max: scaleLimitMax,
          },

          emphasis: {
            label: {
              show: false,
            },
            itemStyle: {
              areaColor: "#cdd4df",
            },
          },
          select: {
            disabled: true,
          },
        },
      ],
    };
  }

  const valueFormatter2 = (value: number | string, isMonetaryValue: boolean) =>
    isMonetaryValue
      ? formatFinancialValue(parseInt(value.toString(), 10), true)
      : value;

  function echartsLinechart(data: any, visualOptions: any, mapping: any) {
    const vo = visualOptions ?? {};

    const {
      // title
      showChartName,
      chartTitle,
      chartTitleOptions,

      // legend
      showLegend,
      legendPosition,
      legendTextOptions,

      // layout
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      background,

      // line styling
      lineType,
      lineWidth,
      smoothLine,

      // tooltip
      showTooltip,
      monetaryValueTooltip,

      // colors
      colorPalette,

      // axis names
      customYAxisName,
      yAxisName,
      customXAxisName,
      xAxisName,
    } = vo;

    const paletteColors: string[] =
      colorPaletteCategoricalData.find((item) => item.name === colorPalette)
        ?.colors ??
      colorPaletteCategoricalData[0]?.colors ??
      [];

    const resolvedXAxisName = customXAxisName
      ? (xAxisName ?? "")
      : (mapping?.x?.value?.[0] ?? "");

    const resolvedYAxisName = customYAxisName
      ? (yAxisName ?? "")
      : (mapping?.y?.value?.[0] ?? "");
    const isMonetaryValue = !!monetaryValueTooltip;

    const title = showChartName
      ? {
          show: true,
          text: chartTitle ?? "",
          left: 0,
          top: 0,
          padding: 6,
          backgroundColor: chartTitleOptions?.backgroundColor,
          textStyle: {
            fontFamily: get(vo, "chartTitleOptions.fontFamily", "Arial"),
            fontWeight: get(vo, "chartTitleOptions.fontWeight", "400"),
            fontSize: parseFontSize(
              get(vo, "chartTitleOptions.fontSize", "14"),
              14,
            ),
            color: get(vo, "chartTitleOptions.textColor", "#000000"),
          },
        }
      : undefined;

    const legend = showLegend
      ? {
          show: true,
          ...resolveLegendPosition(legendPosition),
          textStyle: {
            fontFamily: legendTextOptions?.fontFamily ?? "Arial",
            fontWeight: legendTextOptions?.fontWeight ?? "400",
            fontSize: parseFontSize(legendTextOptions?.fontSize, 14),
            color: legendTextOptions?.textColor ?? "#000000",
            backgroundColor: legendTextOptions?.backgroundColor,
          },
          icon: "roundRect",
          type: "scroll",
          width: "90%",
        }
      : { show: false };

    return {
      backgroundColor: background ?? "transparent",
      ...(paletteColors?.length ? { color: paletteColors } : {}),
      ...(title ? { title } : {}),
      legend,

      grid: {
        top: parseEchartsLayout(paddingTop, 20),
        left: parseEchartsLayout(paddingLeft, 20),
        right: parseEchartsLayout(paddingRight, 20),
        bottom: parseEchartsLayout(paddingBottom, 20),
        containLabel: true,
      },

      xAxis: {
        type: "category",
        data: data?.xAxisValues || [],
        name: resolvedXAxisName,
        nameLocation: "middle",
        nameGap: 32,
        boundaryGap: false,

        splitLine: { show: true },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
        nameTextStyle: {
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          color: "#161616",
          fontWeight: "600",
        },
      },

      yAxis: {
        type: "value",
        name: resolvedYAxisName,
        nameLocation: "middle",
        nameGap: 47,

        splitLine: { show: true },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
        nameTextStyle: {
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          color: "#161616",
          fontWeight: "600",
        },
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
      // title
      showChartName,
      chartTitle,
      chartTitleOptions,

      // layout
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      background,

      // colors / styling
      colorPalette,
      symbolSize, // max bubble size
      symbolColor, // default point color if item.color missing

      // behavior
      showDataZoom,

      // tooltip
      showTooltip,
      monetaryValueTooltip,

      // axis names (optional)
      customYAxisName,
      yAxisName,
      customXAxisName,
      xAxisName,
    } = vo;

    const paletteColors: string[] =
      colorPaletteCategoricalData.find((item) => item.name === colorPalette)
        ?.colors ??
      colorPaletteCategoricalData[0]?.colors ??
      [];

    const isMonetaryValue = !!monetaryValueTooltip;

    const groups = Object.keys(data ?? {});

    const resolvedXAxisName = customXAxisName
      ? (xAxisName ?? "")
      : (mapping?.x?.value?.[0] ?? mapping?.x?.value ?? "");

    const resolvedYAxisName = customYAxisName
      ? (yAxisName ?? "")
      : (mapping?.y?.value?.[0] ?? mapping?.y?.value ?? "");

    const title = showChartName
      ? {
          show: true,
          text: chartTitle ?? "",
          left: 0,
          top: 0,
          padding: 6,
          backgroundColor: chartTitleOptions?.backgroundColor,
          textStyle: {
            fontFamily: get(vo, "chartTitleOptions.fontFamily", "Arial"),
            fontWeight: get(vo, "chartTitleOptions.fontWeight", "400"),
            fontSize: parseFontSize(
              get(vo, "chartTitleOptions.fontSize", "14"),
              14,
            ),
            color: get(vo, "chartTitleOptions.textColor", "#000000"),
          },
        }
      : undefined;

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
    console.log(mapping?.x?.mappedType, "mapping?.x?.mappedType");

    return {
      backgroundColor: background ?? "transparent",
      ...(paletteColors?.length ? { color: paletteColors } : {}),
      ...(title ? { title } : {}),

      grid: {
        top: parseEchartsLayout(paddingTop, 20),
        left: parseEchartsLayout(paddingLeft, 20),
        right: parseEchartsLayout(paddingRight, 20),
        bottom: parseEchartsLayout(paddingBottom, 20),
        containLabel: true,
      },

      xAxis: {
        type: mapping?.x?.mappedType?.[0] === "date" ? "category" : "value",
        name: resolvedXAxisName,
        nameLocation: "middle",
        nameGap: 32,
        splitLine: { lineStyle: { type: "dashed" } },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
        nameTextStyle: {
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          color: "#161616",
          fontWeight: "600",
        },
      },

      yAxis: {
        type: mapping?.y?.mappedType?.[0] === "date" ? "category" : "value",
        scale: true,
        name: resolvedYAxisName,
        nameLocation: "middle",
        nameGap: 47,
        splitLine: { lineStyle: { type: "dashed" } },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: "#8D8D8D", width: 1 } },
        axisLabel: { show: true, color: "#6F6F6F", fontSize: 12 },
        nameTextStyle: {
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          color: "#161616",
          fontWeight: "600",
        },
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

      series: [
        // bubble series per group (your original structure)
        ...groups.map((group, idx) => ({
          name: group,
          type: "scatter",

          data: (data?.[group] ?? []).map((item: any) => {
            const raw = Number(item?.size ?? 0);
            const normalized = maxSize > 0 ? (raw / maxSize) * maxSymbol : 0;

            return [item?.x, item?.y, normalized, item?.label ?? ""];
          }),

          symbolSize: (singleData: any) => singleData?.[2] ?? 0,

          itemStyle: {
            color: (params: any) =>
              params?.data?.[3]
                ? params.color
                : (symbolColor ?? paletteColors?.[idx] ?? undefined),
          },

          emphasis: {
            focus: "series",
            label: {
              show: true,
              formatter: (param: any) => param?.data?.[3] ?? "",
              position: "top",
            },
          },
        })),
      ],
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
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // Palette
      palette,
      showLegend,
    } = visualOptions;

    return {
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        valueFormatter: (value: number | string) =>
          valueFormatter2(value, isMonetaryValue),
      },
      legend: {
        type: "scroll",
        top: 10,
        data: data.categories.map((color: any) => String(color)),
        show: showLegend,
      },
      visualMap: {
        top: "middle",
        right: 10,
        color: colorPaletteCategoricalData.find(
          (item) => item.label === palette,
        )?.colors,
        show: false,
        calculable: true,
      },

      radar: {
        indicator: data.indicators,
      },
      series: data.data.map((item: any) => ({
        type: "radar",
        symbol: "none",
        lineStyle: {
          width: 1,
        },
        emphasis: {
          areaStyle: {
            color: "rgba(0,250,0,0.3)",
          },
        },
        data: [
          {
            value: item.value,
            name: String(item.name),
          },
        ],
      })),
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
      // title
      showChartName,
      chartTitle,
      chartTitleOptions,

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

      // layout
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      background,

      // palette
      colorPalette,

      // stroke / rounding
      strokeWidth,
      strokeColor,
      cornerRadius,

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

    const title = showChartName
      ? {
          show: true,
          text: chartTitle ?? "",
          left: 0,
          top: 0,
          padding: 6,
          backgroundColor: chartTitleOptions?.backgroundColor,
          textStyle: {
            fontFamily: get(vo, "chartTitleOptions.fontFamily", "Arial"),
            fontWeight: get(vo, "chartTitleOptions.fontWeight", "400"),
            fontSize: parseFontSize(
              get(vo, "chartTitleOptions.fontSize", "14"),
              14,
            ),
            color: get(vo, "chartTitleOptions.textColor", "#000000"),
          },
        }
      : undefined;

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
      backgroundColor: background ?? "transparent",
      ...(paletteColors?.length ? { color: paletteColors } : {}),
      ...(title ? { title } : {}),

      grid: {
        top: parseEchartsLayout(paddingTop, 20),
        left: parseEchartsLayout(paddingLeft, 20),
        right: parseEchartsLayout(paddingRight, 20),
        bottom: parseEchartsLayout(paddingBottom, 20),
        containLabel: true,
      },

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
            width: parseCssPx(strokeWidth, 0),
          },

          // node styling
          itemStyle: {
            borderWidth: parseCssPx(strokeWidth, 0),
            borderColor: strokeColor ?? "#000000",
            borderRadius: parseCssPx(cornerRadius, 0),
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

  function echartsTreemap(data: any, visualOptions: any) {
    const {
      // artboard
      width,
      height,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // labels
      showLabels,
      upperLabel,
      labelFontSize,
      nodeClick,
      showBreadcrumbs,
      // tooltip
      showTooltip,
      isMonetaryValue,
    } = visualOptions;
    return {
      // backgroundColor: background,
      backgroundColor: "transparent",
      series: [
        {
          nodeClick: nodeClick === "false" ? false : nodeClick,
          name: "All",
          type: "treemap",
          data,
          width,
          height,
          roam: false,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          leafDepth: 1,
          label: {
            show: showLabels,
            fontSize: labelFontSize,
          },
          upperLabel: {
            show: upperLabel,
            fontSize: labelFontSize,
          },
          breadcrumb: {
            show: showBreadcrumbs,
            top: 0,
            bottom: "auto",
          },
        },
      ],
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => valueFormatter1(params, isMonetaryValue),
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
      renderer: "canvas",
      height: visualOptions.height,
    });

    window.removeEventListener("resize", () => onResize(chart, id));

    const CHART_TYPE_TO_COMPONENT = {
      bar: () => echartsBarchart(data, visualOptions, mapping),
      geomap: () => echartsGeomap(data, visualOptions),
      line: () => echartsLinechart(data, visualOptions, mapping),
      sankey: () => echartsSankey(data, visualOptions),
      treemap: () => echartsTreemap(data, visualOptions),
      pie: () => echartsPiechart(data, visualOptions),
      scatter: () => echartsBubblechart(data, visualOptions, mapping),
      heatmap: () => echartsHeatmap(data, visualOptions, mapping),
      radar: () => echartsRadarchart(data, visualOptions),
    };

    chart.setOption(CHART_TYPE_TO_COMPONENT[chartType](), true);

    window.addEventListener("resize", () => onResize(chart, id));
    chart.on("datazoom", handleDataZoom);
  }

  return { render };
}
