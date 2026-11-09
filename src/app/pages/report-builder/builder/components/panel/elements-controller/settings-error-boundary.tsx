import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface SettingsErrorBoundaryProps {
  // Tries again whenever this changes, i.e. another element is selected.
  resetKey: unknown;
  onClose: () => void;
  children: React.ReactNode;
}

interface SettingsErrorBoundaryState {
  error: Error | null;
  resetKey: unknown;
}

/**
 * Keeps a settings panel that fails, often on the same data that broke its
 * element, from taking the editor down to the route-level error page.
 */
export class SettingsErrorBoundary extends React.Component<
  SettingsErrorBoundaryProps,
  SettingsErrorBoundaryState
> {
  state: SettingsErrorBoundaryState = {
    error: null,
    resetKey: this.props.resetKey,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  static getDerivedStateFromProps(
    props: SettingsErrorBoundaryProps,
    state: SettingsErrorBoundaryState,
  ) {
    if (props.resetKey !== state.resetKey) {
      return { error: null, resetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      "Settings panel failed to render",
      error,
      info.componentStack,
    );
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }
    return (
      <Box
        role="alert"
        sx={{
          gap: "12px",
          display: "flex",
          padding: "16px",
          minWidth: "300px",
          maxWidth: "304px",
          bgcolor: "#F8F9FA",
          borderRadius: "4px",
          flexDirection: "column",
          alignItems: "flex-start",
          border: "1px solid #98A1AA",
          boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60)",
        }}
      >
        <Typography fontSize="14px" color="#252c34">
          The settings for this element couldn&apos;t be displayed.
        </Typography>
        <Button
          size="small"
          onClick={this.props.onClose}
          sx={{
            fontSize: "14px",
            bgcolor: "#fff",
            color: "#252c34",
            padding: "4px 12px",
            borderRadius: "4px",
            textTransform: "none",
            border: "1px solid #cfd4da",
            "&:hover": { bgcolor: "#f8f8f8", borderColor: "#000000" },
          }}
        >
          Close
        </Button>
      </Box>
    );
  }
}
