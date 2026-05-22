import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  CustomUseCaseCreateResponse,
  CustomUseCaseRunResult,
} from "app/pages/ai-explorer/types";

function qualityLabel(
  taskType: string,
  result: CustomUseCaseRunResult,
): { label: string; color: "success" | "warning" | "error" } {
  if (taskType === "regression" && result.test_r2 !== undefined) {
    if (result.test_r2 >= 0.9)
      return { label: "Excellent fit", color: "success" };
    if (result.test_r2 >= 0.7) return { label: "Good fit", color: "success" };
    if (result.test_r2 >= 0.5)
      return { label: "Moderate fit", color: "warning" };
    return { label: "Weak fit", color: "error" };
  }
  if (taskType === "classification" && result.test_f1 !== undefined) {
    if (result.test_f1 >= 0.9) return { label: "Excellent", color: "success" };
    if (result.test_f1 >= 0.75) return { label: "Good", color: "success" };
    if (result.test_f1 >= 0.6) return { label: "Moderate", color: "warning" };
    return { label: "Weak", color: "error" };
  }
  if (taskType === "clustering" && result.silhouette !== undefined) {
    if (result.silhouette >= 0.6)
      return { label: "Well-separated clusters", color: "success" };
    if (result.silhouette >= 0.3)
      return { label: "Moderate separation", color: "warning" };
    return { label: "Weak separation", color: "error" };
  }
  return { label: "Trained", color: "success" };
}

function primaryMetricLabel(taskType: string): string {
  if (taskType === "regression") return "R² (test)";
  if (taskType === "classification") return "F1 (test)";
  if (taskType === "clustering") return "Silhouette";
  return "Score";
}

function primaryMetricValue(
  taskType: string,
  result: CustomUseCaseRunResult,
): string {
  if (taskType === "regression" && result.test_r2 !== undefined)
    return result.test_r2.toFixed(3);
  if (taskType === "classification" && result.test_f1 !== undefined)
    return result.test_f1.toFixed(3);
  if (taskType === "clustering" && result.silhouette !== undefined)
    return result.silhouette.toFixed(3);
  return "—";
}

interface ByocResultsCardProps {
  result: CustomUseCaseCreateResponse;
}

export const ByocResultsCard: React.FC<ByocResultsCardProps> = ({ result }) => {
  const run = result.run_result;
  // const quality = qualityLabel(result.task_type, run);

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "success.light",
        borderRadius: 1,
        bgcolor: "success.50",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CheckCircleOutlineIcon color="success" fontSize="small" />
        <Typography variant="body2" fontWeight={700} color="success.dark">
          Model trained successfully
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            USE CASE
          </Typography>
          <Typography variant="body2">{result.name}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            TASK
          </Typography>
          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
            {result.task_type}
          </Typography>
        </Box>
        {result.target_column && (
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              TARGET
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              {result.target_column}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {primaryMetricLabel(result.task_type)}
          </Typography>
          <Typography variant="h6" fontWeight={700} color="#002561">
            {primaryMetricValue(result.task_type, run)}
          </Typography>
        </Box>
        {/* <Chip label={quality.label} color={quality.color} size="small" /> */}
      </Box>

      {result.task_type === "regression" && (
        <Box sx={{ display: "flex", gap: 3 }}>
          {run.test_mae !== undefined && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                MAE
              </Typography>
              <Typography variant="body2">
                {run.test_mae.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          )}
          {run.test_rmse !== undefined && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                RMSE
              </Typography>
              <Typography variant="body2">
                {run.test_rmse.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          )}
          {run.mean_cv_score !== undefined && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                CV SCORE
              </Typography>
              <Typography variant="body2">
                {run.mean_cv_score.toFixed(3)}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {result.task_type === "clustering" && run.n_clusters !== undefined && (
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            CLUSTERS FOUND
          </Typography>
          <Typography variant="body2">{run.n_clusters}</Typography>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary">
        Slug: <code>{result.slug}</code> — use this to call the predict
        endpoint.
      </Typography>
    </Box>
  );
};
