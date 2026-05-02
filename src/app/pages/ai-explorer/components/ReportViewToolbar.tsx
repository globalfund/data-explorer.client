import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useStoreActions } from "app/state/store/hooks";
import { useCreateReport } from "app/hooks/queries/report-builder";
import { RBReportModel } from "app/state/api/action-reducers/report-builder/sync";

interface ReportViewToolbarProps {
  report: RBReportModel;
}

export const ReportViewToolbar: React.FC<ReportViewToolbarProps> = ({
  report,
}) => {
  const navigate = useNavigate();
  const clearGeneratedReport = useStoreActions(
    (a) => a.AiExplorerChats.clearGeneratedReport,
  );
  const createReport = useCreateReport();

  const handleOpenInBuilder = async () => {
    try {
      const result = await createReport.mutateAsync({
        name: report.name,
        description: report.description,
        items: report.items,
        settings: report.settings,
      });
      navigate(`/report-builder/reports/${result.data.id}/edit`);
    } catch {
      // navigation blocked, user can retry
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 3,
        pb: 2,
        borderBottom: "1px solid #e3e3e3",
      }}
    >
      <Button
        size="small"
        startIcon={<ArrowBackIcon />}
        onClick={() => clearGeneratedReport()}
        sx={{ color: "#002561", textTransform: "none" }}
      >
        Back to AI Explorer
      </Button>

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} color="#002561">
          {report.name}
        </Typography>
        {report.description && (
          <Typography variant="caption" color="text.secondary">
            {report.description}
          </Typography>
        )}
      </Box>

      <Button
        size="small"
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={handleOpenInBuilder}
        disabled={createReport.isPending}
        sx={{ textTransform: "none", borderColor: "#002561", color: "#002561" }}
      >
        Open in Report Builder
      </Button>
    </Box>
  );
};
