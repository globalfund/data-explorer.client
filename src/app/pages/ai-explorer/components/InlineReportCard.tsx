import React, { useLayoutEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useNavigate } from "react-router-dom";
import { RBReportModel } from "app/state/api/action-reducers/report-builder/sync";
import { useStoreActions } from "app/state/store/hooks";
import { useCreateReport } from "app/hooks/queries/report-builder";
import { StatelessReportCanvas } from "app/pages/report-builder/preview/StatelessReportCanvas";
import {
  InlineReportCardRoot,
  InlineReportCardHeader,
  InlineReportCanvasContainer,
  InlineReportCardActions,
} from "app/pages/ai-explorer/styles";

interface InlineReportCardProps {
  report: RBReportModel;
  chatId: string;
}

export const InlineReportCard: React.FC<InlineReportCardProps> = ({
  report,
  chatId,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const setGeneratedReport = useStoreActions(
    (a) => a.AiExplorerChats.setGeneratedReport,
  );
  const createReport = useCreateReport();

  useLayoutEffect(() => {
    if (!expanded || !containerRef.current) return;
    const reportWidth =
      Number.parseInt(report.settings.width ?? "1200", 10) || 1200;
    const containerWidth = containerRef.current.offsetWidth;
    setScale(Math.min(1, containerWidth / reportWidth));
  }, [expanded, report.settings.width]);

  const handlePromoteToMain = () => {
    setGeneratedReport({ chatId, report });
  };

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
      // user can retry
    }
  };

  const handleExportPdf = async () => {
    console.log("EXPORT TO PDF - TO BE IMPLEMENTED");
  };

  return (
    <InlineReportCardRoot>
      <InlineReportCardHeader onClick={() => setExpanded((v) => !v)}>
        <BarChartIcon
          fontSize="small"
          sx={{ color: "#002561", flexShrink: 0 }}
        />
        <Typography
          variant="subtitle2"
          sx={{ flex: 1, color: "#002561", fontWeight: 600 }}
          noWrap
        >
          {report.name}
        </Typography>
        {expanded ? (
          <ExpandLessIcon fontSize="small" sx={{ color: "#667085" }} />
        ) : (
          <ExpandMoreIcon fontSize="small" sx={{ color: "#667085" }} />
        )}
      </InlineReportCardHeader>

      {expanded && (
        <>
          {report.description && (
            <Typography
              variant="caption"
              sx={{ display: "block", px: 2, pb: 1, color: "text.secondary" }}
            >
              {report.description}
            </Typography>
          )}

          <InlineReportCanvasContainer ref={containerRef}>
            <Box
              sx={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: scale < 1 ? `${100 / scale}%` : "100%",
              }}
            >
              <StatelessReportCanvas
                report={report}
                compact
                id={`inline-report-canvas-${report.id || report.name.replace(/\s+/g, "-").toLowerCase()}`}
              />
            </Box>
          </InlineReportCanvasContainer>

          <InlineReportCardActions>
            <Button
              size="small"
              startIcon={<OpenInFullIcon fontSize="small" />}
              onClick={handlePromoteToMain}
              sx={{ textTransform: "none", color: "#002561", fontSize: 12 }}
            >
              Open in main view
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon fontSize="small" />}
              onClick={handleOpenInBuilder}
              disabled={createReport.isPending}
              sx={{ textTransform: "none", color: "#667085", fontSize: 12 }}
            >
              Open in Report Builder
            </Button>
            <Button
              size="small"
              startIcon={<PictureAsPdfIcon fontSize="small" />}
              onClick={handleExportPdf}
              sx={{ textTransform: "none", color: "#667085", fontSize: 12 }}
            >
              Export to PDF
            </Button>
          </InlineReportCardActions>
        </>
      )}
    </InlineReportCardRoot>
  );
};
