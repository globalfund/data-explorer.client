import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { CustomUseCaseSummary } from "app/pages/ai-explorer/types";

interface ByocUseCaseCardProps {
  useCase: CustomUseCaseSummary;
  onSelect: (uc: CustomUseCaseSummary) => void;
}

export const ByocUseCaseCard: React.FC<ByocUseCaseCardProps> = ({
  useCase,
  onSelect,
}) => (
  <Card
    variant="outlined"
    sx={{ "&:hover": { boxShadow: 2 }, transition: "box-shadow 0.2s", height: "100%" }}
  >
    <CardActionArea
      onClick={() => onSelect(useCase)}
      sx={{
        height: "100%",
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flex: 1, width: "100%" }}>
        <Box sx={{ display: "flex", gap: 0.5, mb: 1, flexWrap: "wrap" }}>
          {useCase.has_metrics && (
            <Chip
              icon={<PsychologyIcon sx={{ fontSize: 12 }} />}
              label="Trained"
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontSize: 10, height: 20 }}
            />
          )}
          {!useCase.has_metrics && (
            <Chip
              label="Pending"
              size="small"
              variant="outlined"
              sx={{ fontSize: 10, height: 20 }}
            />
          )}
        </Box>
        <Typography variant="body2" fontWeight={700} gutterBottom>
          {useCase.name}
        </Typography>
        {useCase.description && (
          <Typography variant="caption" color="text.secondary">
            {useCase.description}
          </Typography>
        )}
      </CardContent>
    </CardActionArea>
  </Card>
);
