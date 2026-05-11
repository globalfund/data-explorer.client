import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import {
  UseCaseDetail,
  PredictResponse,
  UseCaseTaskType,
} from "app/pages/ai-explorer/types";
import { formatFinancialValue } from "app/utils/formatFinancialValue";

interface PredictFormProps {
  detail: UseCaseDetail;
  onPredict: (body: Record<string, unknown>) => void;
  loading: boolean;
  error: string | null;
  result: PredictResponse | null;
}

function inferType(value: unknown): "number" | "string" {
  return typeof value === "number" ? "number" : "string";
}

function formatPrediction(
  result: PredictResponse,
  taskType: UseCaseTaskType,
): string {
  if (taskType === "regression") {
    const val = result.prediction;
    if (result.unit === "USD") return formatFinancialValue(val);
    if (result.unit === "%" || (val > 0 && val < 2))
      return `${(val * 100).toFixed(1)}%`;
    return val.toLocaleString();
  }
  if (taskType === "classification") {
    const label = result.label ?? String(result.prediction);
    const prob =
      result.probability != null
        ? ` (${(result.probability * 100).toFixed(0)}% confidence)`
        : "";
    return `${label}${prob}`;
  }
  return String(result.prediction);
}

function classificationColor(result: PredictResponse): string {
  const label = (result.label ?? "").toLowerCase();
  if (
    label.includes("eligible") ||
    label.includes("performing") ||
    label.includes("high")
  )
    return "success";
  if (label.includes("risk") || label.includes("low") || label.includes("not"))
    return "error";
  return "default";
}

export const PredictForm: React.FC<PredictFormProps> = ({
  detail,
  onPredict,
  loading,
  error,
  result,
}) => {
  const exampleInputs = detail.example_inputs ?? {};
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      Object.entries(exampleInputs).map(([k, v]) => [k, String(v)]),
    ),
  );

  const isOptimization = detail.task_type === "optimization";

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = () => {
    if (isOptimization) {
      const envelope = parseFloat(values["allocation_envelope"] ?? "500000000");
      onPredict({ params: { allocation_envelope: envelope } });
      return;
    }
    const features: Record<string, unknown> = {};
    for (const [key, rawVal] of Object.entries(values)) {
      const exampleVal = exampleInputs[key];
      features[key] =
        inferType(exampleVal) === "number" ? parseFloat(rawVal) : rawVal;
    }
    onPredict({ features });
  };

  const fields = isOptimization
    ? [["allocation_envelope", 500000000] as [string, unknown]]
    : Object.entries(exampleInputs);

  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        Interactive Prediction
      </Typography>
      <Box
        sx={{
          mt: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 1.5,
        }}
      >
        {fields.map(([key]) => (
          <TextField
            key={key}
            label={key}
            size="small"
            value={values[key] ?? ""}
            onChange={(e) => handleChange(key, e.target.value)}
            type={
              inferType(exampleInputs[key]) === "number" ? "number" : "text"
            }
          />
        ))}
      </Box>
      <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ bgcolor: "#002561", "&:hover": { bgcolor: "#013B82" } }}
        >
          {loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            "Run Prediction"
          )}
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 1.5 }}>
          {error}
        </Alert>
      )}
      {result && !error && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: "grey.50",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Typography variant="caption" fontWeight={700} color="text.secondary">
            PREDICTION RESULT
          </Typography>
          {detail.task_type === "classification" ? (
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={formatPrediction(result, detail.task_type)}
                color={
                  classificationColor(result) as "success" | "error" | "default"
                }
                size="small"
              />
            </Box>
          ) : (
            <Typography
              variant="h6"
              fontWeight={700}
              color="#002561"
              sx={{ mt: 0.5 }}
            >
              {formatPrediction(result, detail.task_type)}
              {result.unit && result.unit !== "USD" && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  {result.unit}
                </Typography>
              )}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
