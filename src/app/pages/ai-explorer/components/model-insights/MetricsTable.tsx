import React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

interface MetricsTableProps {
  metrics: Record<string, unknown>;
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") return v.toFixed(4).replace(/\.?0+$/, "");
  if (typeof v === "string") return v;
  return JSON.stringify(v);
}

function flattenMetrics(
  obj: Record<string, unknown>,
  prefix = "",
): [string, string][] {
  const rows: [string, string][] = [];
  for (const [key, value] of Object.entries(obj)) {
    const label = prefix ? `${prefix} / ${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      rows.push(...flattenMetrics(value as Record<string, unknown>, label));
    } else {
      rows.push([label, formatValue(value)]);
    }
  }
  return rows;
}

export const MetricsTable: React.FC<MetricsTableProps> = ({ metrics }) => {
  const rows = flattenMetrics(metrics);
  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        Model Metrics
      </Typography>
      <Table size="small" sx={{ mt: 1 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Metric</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(([label, val]) => (
            <TableRow key={label}>
              <TableCell sx={{ color: "text.secondary", fontSize: 12 }}>
                {label}
              </TableCell>
              <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                {val}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
