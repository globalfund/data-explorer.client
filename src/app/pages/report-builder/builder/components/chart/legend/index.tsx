import { Box } from "@mui/material";
import React, { useCallback } from "react";
import { EChartsType } from "echarts/core";
import { DragIndicator } from "@mui/icons-material";
import { useDrag } from "react-dnd";
import GeomapLegend from "../geomap-legend";

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
    position?: string;
    setIsDragging?: (isDragging: boolean) => void;
    visualOptions?: any;
    chartType?: string;
    mappedData?: any;
    mapping?: any;
  }
> = ({
  items,
  legendTextOptions,
  position,
  setIsDragging,
  visualOptions,
  chartType,
  mappedData,
  mapping,
}) => {
  const dragRef = React.useRef<HTMLDivElement>(null);

  const [isOver, setIsOver] = React.useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "legend",
    item: () => {
      return { position };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(dragRef);

  React.useEffect(() => {
    setIsDragging?.(isDragging);
  }, [isDragging]);

  if (visualOptions?.legendPosition !== position) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
      ref={dragRef}
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
  chart: EChartsType | null;
  chartType?: string;
  visualOptions?: any;
  viewMode?: boolean;
  position?: string;
  setIsDragging?: (isDragging: boolean) => void;
  mappedData?: any;
  mapping?: any;
}

const Legend: React.FC<LegendProps> = ({
  chart,
  chartType,
  visualOptions,
  viewMode,
  position,
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
    (chart: EChartsType | null) => {
      if (!chart) return [];
      const option: any = chart.getOption();

      switch (chartType) {
        case "bar":
          if (option.series?.[0]?.type === "bar") {
            return (option.xAxis?.[0]?.data || []).map(
              (s: any, index: number) => ({
                name: s,
                color:
                  option.color?.[index % option.color?.length] || "#000000",
                type: option.series?.[0]?.type,
              }),
            );
          }
          return [];
        case "radar":
        case "pie":
          return (option.series?.[0]?.data || []).map(
            (s: any, index: number) => ({
              name: s.name,
              color: option.color?.[index % option.color?.length] || "#000000",
              type: option.series?.[0]?.type,
            }),
          );

        case "line":
        case "scatter":
          return (option.series || [])
            ?.filter((s: any) => s.name)
            .map((s: any, index: number) => ({
              name: s.name,
              color:
                s.lineStyle?.color ||
                s.itemStyle?.color?.substring(0, 7) ||
                option.color?.[index % option.color?.length],
              type: s.type,
            }));
        case "treemap": {
          const data = option.series?.[0]?.data || [];

          const getItems = (nodes: any[]) =>
            nodes
              .sort((a: any, b: any) => b.value - a.value)
              .map((n: any, index: number) => ({
                name: n.name,
                color:
                  n.itemStyle?.color ||
                  option.color?.[index % option.color?.length] ||
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
            .map((s: any, index: number) => ({
              name: s.name,
              color:
                s.lineStyle?.color ||
                s.itemStyle?.color ||
                option.color?.[index % option.color?.length],
              type: s.type,
            }));
      }
    },
    [chartType, treemapPath],
  );

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

  if (visualOptions?.legendPosition !== position && viewMode) {
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
      items={legendItems}
      legendTextOptions={visualOptions?.legendTextOptions}
      position={position}
      setIsDragging={setIsDragging}
      visualOptions={visualOptions}
      chartType={chartType}
      mappedData={mappedData}
      mapping={mapping}
    />
  );
};

export default Legend;
