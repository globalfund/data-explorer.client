import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ITEM_LABELS: Record<string, string> = {
  text: "text box",
  chart: "chart",
  table: "table",
  image: "image",
  kpi_box: "KPI",
  section_divider: "divider",
  grid: "grid",
  column: "column layout",
};

interface ReportItemErrorBoundaryProps {
  itemId: string;
  itemType: string;
  // The boundary tries again whenever this changes, e.g. after an edit.
  resetKey: unknown;
  viewMode?: boolean;
  children: React.ReactNode;
}

interface ReportItemErrorBoundaryState {
  error: Error | null;
  resetKey: unknown;
}

/**
 * Keeps one broken item from taking the whole report (and the editor, with
 * its unsaved changes) down to the route-level error page.
 */
export class ReportItemErrorBoundary extends React.Component<
  ReportItemErrorBoundaryProps,
  ReportItemErrorBoundaryState
> {
  state: ReportItemErrorBoundaryState = {
    error: null,
    resetKey: this.props.resetKey,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  static getDerivedStateFromProps(
    props: ReportItemErrorBoundaryProps,
    state: ReportItemErrorBoundaryState,
  ) {
    if (props.resetKey !== state.resetKey) {
      return { error: null, resetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `Report item ${this.props.itemId} (${this.props.itemType}) failed to render`,
      error,
      info.componentStack,
    );
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }
    const label = ITEM_LABELS[this.props.itemType] ?? "element";
    return (
      <Box
        role="alert"
        data-testid="report-item-error"
        sx={{
          width: "100%",
          padding: "16px",
          minHeight: "80px",
          display: "flex",
          borderRadius: "4px",
          textAlign: "center",
          alignItems: "center",
          bgcolor: "#f8f9fa",
          justifyContent: "center",
          border: "1px dashed #cfd4da",
        }}
      >
        <Typography fontSize="14px" color="#59616a">
          {this.props.viewMode
            ? `This ${label} couldn't be displayed.`
            : `This ${label} couldn't be displayed. Try changing its settings, or delete it.`}
        </Typography>
      </Box>
    );
  }
}
