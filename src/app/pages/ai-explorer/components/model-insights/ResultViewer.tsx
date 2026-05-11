import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import {
  BarChart as EBarChart,
  GraphChart,
  TreemapChart as ETreemapChart,
} from "echarts/charts";
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { UseCaseTaskType, UseCaseResult } from "app/pages/ai-explorer/types";
import { formatFinancialValue } from "app/utils/formatFinancialValue";

echarts.use([
  EBarChart,
  GraphChart,
  ETreemapChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  SVGRenderer,
]);

interface ResultViewerProps {
  taskType: UseCaseTaskType;
  result: UseCaseResult;
}

function useEChart(
  option: echarts.EChartsCoreOption | null,
  height: number = 300,
) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    if (!ref.current || !option) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current, undefined, {
        renderer: "svg",
      });
    }
    chartRef.current.setOption(option, true);
  }, [option]);

  useEffect(() => {
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return { ref, height };
}

// Clustering result
const ClusteringResult: React.FC<{ result: UseCaseResult }> = ({ result }) => {
  const assignments =
    (result.assignments as Array<Record<string, unknown>>) ?? [];
  const nClusters = (result.n_clusters as number) ?? 0;

  const counts = Array.from(
    { length: nClusters },
    (_, i) => assignments.filter((a) => a.cluster === i).length,
  );

  const option: echarts.EChartsCoreOption = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: counts.map((_, i) => `Cluster ${i}`),
    },
    yAxis: { type: "value", name: "Assignments" },
    series: [
      {
        type: "bar",
        data: counts,
        itemStyle: { color: "#002561" },
      },
    ],
    grid: { left: 40, right: 16, top: 20, bottom: 40 },
  };

  const { ref } = useEChart(option);

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {nClusters} clusters · {assignments.length} assignments
      </Typography>
      <Box ref={ref} sx={{ width: "100%", height: 240 }} />
      {assignments.slice(0, 8).map((a, i) => (
        <Chip
          key={i}
          label={`${a.GeographyName1 ?? a.Grant1 ?? `Item ${i}`}: C${a.cluster}`}
          size="small"
          sx={{ m: 0.25 }}
        />
      ))}
      {assignments.length > 8 && (
        <Typography variant="caption" color="text.secondary">
          {" "}
          +{assignments.length - 8} more
        </Typography>
      )}
    </Box>
  );
};

// Anomaly detection result
const AnomalyResult: React.FC<{ result: UseCaseResult }> = ({ result }) => {
  const topAnomalies =
    (result.top_anomalies as Array<Record<string, unknown>>) ?? [];
  const nAnomalies = (result.n_anomalies as number) ?? topAnomalies.length;
  const rate = (result.anomaly_rate as number) ?? null;

  if (topAnomalies.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No anomaly data returned.
      </Typography>
    );
  }

  const cols = Object.keys(topAnomalies[0]).slice(0, 5);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
        <Box>
          <Typography variant="h6" fontWeight={700} color="error.main">
            {nAnomalies.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Flagged items
          </Typography>
        </Box>
        {rate != null && (
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {(rate * 100).toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Anomaly rate
            </Typography>
          </Box>
        )}
      </Box>
      <Typography variant="caption" fontWeight={700} color="text.secondary">
        TOP ANOMALIES
      </Typography>
      <Table size="small" sx={{ mt: 0.5 }}>
        <TableHead>
          <TableRow>
            {cols.map((c) => (
              <TableCell key={c} sx={{ fontWeight: 700, fontSize: 11 }}>
                {c}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {topAnomalies.slice(0, 10).map((row, i) => (
            <TableRow
              key={i}
              sx={{
                bgcolor: i < 3 ? "rgba(211,47,47,0.06)" : "transparent",
              }}
            >
              {cols.map((c) => (
                <TableCell key={c} sx={{ fontSize: 11 }}>
                  {typeof row[c] === "number"
                    ? (row[c] as number).toFixed(3)
                    : String(row[c] ?? "—")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

// Optimization result
const OptimizationResult: React.FC<{ result: UseCaseResult }> = ({
  result,
}) => {
  const allocations =
    (result.optimal_allocations as Record<string, number>) ?? {};
  const entries = Object.entries(allocations)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15);

  const option: echarts.EChartsCoreOption = {
    tooltip: {
      trigger: "axis",
      formatter: (params: unknown) => {
        const p = (params as Array<{ name: string; value: number }>)[0];
        return `${p.name}<br/>${formatFinancialValue(p.value)}`;
      },
    },
    xAxis: {
      type: "value",
      axisLabel: { formatter: (v: number) => formatFinancialValue(v) },
    },
    yAxis: {
      type: "category",
      data: entries.map(([k]) => k),
      axisLabel: { fontSize: 10 },
    },
    series: [
      {
        type: "bar",
        data: entries.map(([, v]) => v),
        itemStyle: { color: "#002561" },
        label: {
          show: true,
          position: "right",
          formatter: (p: { value: number }) => formatFinancialValue(p.value),
          fontSize: 10,
        },
      },
    ],
    grid: { left: 140, right: 80, top: 10, bottom: 20 },
  };

  const { ref } = useEChart(option, entries.length * 24 + 40);

  return (
    <Box>
      {result.predicted_impact != null && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Predicted impact:{" "}
          <strong>
            {formatFinancialValue(result.predicted_impact as number)}
          </strong>
        </Typography>
      )}
      <Box ref={ref} sx={{ width: "100%", height: entries.length * 24 + 40 }} />
    </Box>
  );
};

// Network analysis result
const NetworkResult: React.FC<{ result: UseCaseResult }> = ({ result }) => {
  const graph = result.graph as
    | {
        nodes: Array<{ id?: string; name?: string }>;
        links: Array<{ source: string; target: string; weight?: number }>;
      }
    | undefined;
  const metrics = result.metrics as Record<string, unknown> | undefined;

  const nodes = (graph?.nodes ?? []).slice(0, 80).map((n) => ({
    id: String(n.id ?? n.name ?? ""),
    name: String(n.name ?? n.id ?? ""),
    symbolSize: 10,
    label: { show: false },
  }));

  const links = (graph?.links ?? []).slice(0, 200).map((l) => ({
    source: String(l.source),
    target: String(l.target),
    lineStyle: {
      width: l.weight ? Math.max(1, Math.log10(l.weight + 1) / 2) : 1,
    },
  }));

  const option: echarts.EChartsCoreOption = {
    tooltip: { show: false },
    series: [
      {
        type: "graph",
        layout: "force",
        data: nodes,
        links,
        roam: true,
        force: { repulsion: 60, edgeLength: 40 },
        lineStyle: { color: "#ccc", curveness: 0.1 },
        itemStyle: { color: "#002561" },
        label: { show: false },
      },
    ],
  };

  const { ref } = useEChart(option, 300);

  return (
    <Box>
      {metrics && (
        <Box sx={{ display: "flex", gap: 2, mb: 1.5, flexWrap: "wrap" }}>
          {Object.entries(metrics)
            .filter(([, v]) => typeof v === "number" || typeof v === "string")
            .slice(0, 4)
            .map(([k, v]) => (
              <Box key={k}>
                <Typography variant="h6" fontWeight={700}>
                  {typeof v === "number" ? v.toLocaleString() : String(v)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {k.replace(/_/g, " ")}
                </Typography>
              </Box>
            ))}
        </Box>
      )}
      <Box
        ref={ref}
        sx={{
          width: "100%",
          height: 300,
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: 1,
        }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 0.5, display: "block" }}
      >
        {nodes.length} nodes · {links.length} links shown (drag to explore)
      </Typography>
    </Box>
  );
};

// Causal inference result
const CausalResult: React.FC<{ result: UseCaseResult }> = ({ result }) => {
  const coef = result.did_coefficient as number | undefined;
  const ci = result.confidence_interval_95 as [number, number] | undefined;
  const pValue = result.p_value as number | undefined;
  const r2 = result.r_squared as number | undefined;
  const treatment = result.treatment_module as string | undefined;

  const isSignificant = pValue != null && pValue < 0.05;

  return (
    <Box>
      {treatment && (
        <Typography variant="body2" gutterBottom>
          Treatment: <strong>{treatment}</strong>
        </Typography>
      )}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        {coef != null && (
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              color={coef < 0 ? "success.main" : "error.main"}
            >
              {coef.toFixed(3)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              DiD Coefficient
            </Typography>
          </Box>
        )}
        {pValue != null && (
          <Box>
            <Chip
              label={`p = ${pValue.toExponential(2)}`}
              size="small"
              color={isSignificant ? "success" : "default"}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              {isSignificant ? "Statistically significant" : "Not significant"}
            </Typography>
          </Box>
        )}
        {r2 != null && (
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {r2.toFixed(3)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              R²
            </Typography>
          </Box>
        )}
      </Box>
      {ci && (
        <Box>
          <Typography variant="caption" color="text.secondary">
            95% Confidence Interval
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, gap: 1 }}>
            <Typography variant="body2" fontFamily="monospace">
              [{ci[0].toFixed(3)},
            </Typography>
            <Box
              sx={{
                flex: 1,
                height: 6,
                bgcolor: isSignificant ? "success.light" : "grey.300",
                borderRadius: 3,
                position: "relative",
              }}
            >
              {coef != null && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -4,
                    left: `${((coef - ci[0]) / (ci[1] - ci[0])) * 100}%`,
                    width: 14,
                    height: 14,
                    bgcolor: isSignificant ? "success.main" : "grey.500",
                    borderRadius: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              )}
            </Box>
            <Typography variant="body2" fontFamily="monospace">
              {ci[1].toFixed(3)}]
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

// ShapResult
export const ShapChart: React.FC<{ shapSummary: Record<string, number> }> = ({
  shapSummary,
}) => {
  const entries = Object.entries(shapSummary)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12);

  const option: echarts.EChartsCoreOption = {
    tooltip: { trigger: "axis" },
    xAxis: { type: "value", name: "Mean |SHAP|" },
    yAxis: {
      type: "category",
      data: entries.map(([k]) => k.replace(/^cat__|^num__/, "").slice(0, 30)),
      axisLabel: { fontSize: 10 },
    },
    series: [
      {
        type: "bar",
        data: entries.map(([, v]) => Number(v.toFixed(4))),
        itemStyle: { color: "#002561" },
      },
    ],
    grid: { left: 160, right: 40, top: 10, bottom: 30 },
  };

  const { ref } = useEChart(option, entries.length * 22 + 50);

  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        Feature Importances (SHAP)
      </Typography>
      <Box ref={ref} sx={{ width: "100%", height: entries.length * 22 + 50 }} />
    </Box>
  );
};

// Main ResultViewer routing to the correct visualization based on task type
export const ResultViewer: React.FC<ResultViewerProps> = ({
  taskType,
  result,
}) => {
  switch (taskType) {
    case "clustering":
      return <ClusteringResult result={result} />;
    case "anomaly_detection":
      return <AnomalyResult result={result} />;
    case "optimization":
      return <OptimizationResult result={result} />;
    case "network_analysis":
      return <NetworkResult result={result} />;
    case "causal_inference":
      return <CausalResult result={result} />;
    default:
      return (
        <Box
          component="pre"
          sx={{
            fontSize: 11,
            overflowX: "auto",
            bgcolor: "grey.100",
            p: 1,
            borderRadius: 1,
          }}
        >
          {JSON.stringify(result, null, 2)}
        </Box>
      );
  }
};
