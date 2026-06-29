import { Box } from "@mui/material";
import React, { useCallback } from "react";
import { EChartsType } from "echarts/core";
import { DragIndicator } from "@mui/icons-material";
import GeomapLegend from "../geomap-legend";
import { colorPaletteSequentialData } from "../../panel/elements-controller/common/data";
import { generateHeatmapLegends } from "../utils/chart-utils";
import { useSortable } from "@dnd-kit/react/sortable";

interface LegendContentProps {
  items: Array<{
    name: string;
    color: string;
  }>;
  onItemClick?: (name: string) => void;
  legendTextOptions?: any;
  chartType?: string;
  mappedData?: any;
  mapping?: any;
  visualOptions?: any;
}

const LegendContent: React.FC<LegendContentProps> = ({
  items,
  onItemClick,
  legendTextOptions,
  chartType,
  mappedData,
  mapping,
  visualOptions,
}) => {
  if (chartType === "geomap") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <GeomapLegend
          data={mappedData}
          visualOptions={visualOptions}
          mapping={mapping}
        />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {items.map((item, index) => (
        <Box
          component={"button"}
          type="button"
          key={index}
          sx={{
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            span: {
              ...legendTextOptions,
              fontSize: legendTextOptions?.fontSize + "px" || "12px",
              color: legendTextOptions?.textColor || "#000000",
              fontWeight: legendTextOptions.fontWeight.split("+")?.[0] || "400",
              fontStyle:
                legendTextOptions.fontWeight.split("+")?.[1] || "normal",
            },
          }}
          onClick={() => onItemClick?.(item.name)}
        >
          <Box
            sx={{
              width: "12px",
              height: "12px",
              backgroundColor: item.color,
              marginRight: "8px",
              borderRadius: "1px",
            }}
          />
          <span>{item.name}</span>
        </Box>
      ))}
    </Box>
  );
};

const DraggableLegendContent: React.FC<
  LegendContentProps & {
    setIsDragging?: (isDragging: boolean) => void;
    visualOptions?: any;
    chartType?: string;
    mappedData?: any;
    mapping?: any;
    index: number;
  }
> = ({
  items,
  legendTextOptions,
  setIsDragging,
  visualOptions,
  chartType,
  mappedData,
  mapping,
  index,
}) => {
  const dragRef = React.useRef<HTMLDivElement>(null);

  const [isOver, setIsOver] = React.useState(false);

  const [element, setElement] = React.useState<Element | null>(null);

  const { isDragging } = useSortable({
    id: "legend",
    element,
    handle: dragRef,
    accept: ["title", "chart", "legend"],
    index,
    type: "legend",
  });

  React.useEffect(() => {
    setIsDragging?.(isDragging);
  }, [isDragging]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
      ref={setElement}
      onMouseOver={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) {
          return;
        }
        setIsOver(true);
      }}
      onMouseLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) {
          return;
        }
        setIsOver(false);
      }}
    >
      <Box
        sx={{
          cursor: "grab",
          visibility: isOver ? "visible" : "hidden",
          display: "flex",
          alignItems: "center",
          marginRight: "8px",
        }}
        ref={dragRef}
      >
        <DragIndicator />
      </Box>
      <LegendContent
        items={items}
        legendTextOptions={legendTextOptions}
        chartType={chartType}
        mappedData={mappedData}
        mapping={mapping}
        visualOptions={visualOptions}
      />
    </Box>
  );
};

interface LegendProps {
  index: number;
  chart: EChartsType | null;
  chartType?: string;
  visualOptions?: any;
  viewMode?: boolean;
  setIsDragging?: (isDragging: boolean) => void;
  mappedData?: any;
  mapping?: any;
}

const Legend: React.FC<LegendProps> = ({
  index,
  chart,
  chartType,
  visualOptions,
  viewMode,
  setIsDragging,
  mappedData,
  mapping,
}) => {
  const [legendItems, setLegendItems] = React.useState<
    Array<{
      name: string;
      color: string;
      type?: string;
    }>
  >([]);

  const [treemapPath, setTreemapPath] = React.useState<string[]>([]);

  const getLegendItems = useCallback(
    (chartProp: EChartsType | null) => {
      if (!chartProp) return [];
      const option: any = chartProp.getOption();

      switch (chartType) {
        case "bar":
          if (option.series?.[0]?.type === "bar") {
            return (option.xAxis?.[0]?.data || []).map((s: any, i: number) => ({
              name: s,
              color: option.color?.[i % option.color?.length] || "#000000",
              type: option.series?.[0]?.type,
            }));
          }
          return [];
        case "radar":
        case "pie":
          return (option.series?.[0]?.data || []).map((s: any, i: number) => ({
            name: s.name,
            color: option.color?.[i % option.color?.length] || "#000000",
            type: option.series?.[0]?.type,
          }));
        case "line":
        case "scatter":
          return (option.series || [])
            ?.filter((s: any) => s.name)
            .map((s: any, i: number) => ({
              name: s.name,
              color:
                s.lineStyle?.color ||
                s.itemStyle?.color?.substring(0, 7) ||
                option.color?.[i % option.color?.length],
              type: s.type,
            }));
        case "treemap": {
          const data = option.series?.[0]?.data || [];

          const getItems = (nodes: any[]) =>
            nodes
              .sort((a: any, b: any) => b.value - a.value)
              .map((n: any, i: number) => ({
                name: n.name,
                color:
                  n.itemStyle?.color ||
                  option.color?.[i % option.color?.length] ||
                  "#000000",
                type: "treemap",
              }));

          // no path -> show top-level nodes
          if (!treemapPath?.length || treemapPath.length === 1) {
            return getItems(data);
          }
          const normalizedPath =
            treemapPath?.[0] === "All" ? treemapPath.slice(1) : treemapPath;
          let currentNode: any = null;
          let currentLevel = data;

          for (const segment of normalizedPath) {
            currentNode = currentLevel.find((n: any) => n.name === segment);
            if (!currentNode) {
              return [];
            }

            currentLevel = currentNode.children || [];
          }

          return getItems(currentLevel);
        }
        default:
          return (option.series || [])
            ?.filter((s: any) => s.name)
            .map((s: any, i: number) => ({
              name: s.name,
              color:
                s.lineStyle?.color ||
                s.itemStyle?.color ||
                option.color?.[i % option.color?.length],
              type: s.type,
            }));
      }
    },
    [chartType, treemapPath, mappedData, visualOptions],
  );

  React.useEffect(() => {
    if (chartType === "heatmap" && mappedData) {
      setLegendItems(
        generateHeatmapLegends(
          mappedData || [],
          colorPaletteSequentialData.find(
            (item) => item.name === visualOptions?.colorPalette,
          )?.colors ||
            colorPaletteSequentialData[0]?.colors ||
            [],
        ),
      );
    }
  }, [mappedData, visualOptions]);

  React.useEffect(() => {
    if (!chart) return;

    const update = () => {
      const items = getLegendItems(chart);
      setLegendItems(items);
    };

    update(); // initial

    chart.on("finished", update);

    chart.on("click", (params: any) => {
      if (params.seriesType !== "treemap") return;
      if (params.treePathInfo) {
        const path = params.treePathInfo.map((p: any) => p.name);
        setTreemapPath(path);
      }
    });

    return () => {
      chart.off("finished", update);
    };
  }, [chart, chartType, treemapPath]);

  if (!visualOptions?.showLegend) {
    return null;
  }

  return viewMode ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          cursor: "grab",
          visibility: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <DragIndicator />
      </Box>
      <LegendContent
        items={legendItems}
        legendTextOptions={visualOptions?.legendTextOptions}
        chartType={chartType}
        mappedData={mappedData}
        mapping={mapping}
        visualOptions={visualOptions}
      />
    </Box>
  ) : (
    <DraggableLegendContent
      index={index}
      items={legendItems}
      legendTextOptions={visualOptions?.legendTextOptions}
      setIsDragging={setIsDragging}
      visualOptions={visualOptions}
      chartType={chartType}
      mappedData={mappedData}
      mapping={mapping}
    />
  );
};

export default Legend;
