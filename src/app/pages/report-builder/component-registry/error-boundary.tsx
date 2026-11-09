import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStoreActions } from "app/state/store/hooks";
import { RBReportItemTypes } from "app/state/api/action-reducers/report-builder/sync";

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
  // The item's own click handler and menus fail with it, so the message
  // offers these instead (edit mode only).
  onSelect?: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

// Item types whose settings panel opens on selection. Text needs its editor
// running, and grids and columns have no panel of their own.
const SELECTABLE_TYPES = [
  "chart",
  "table",
  "kpi_box",
  "image",
  "section_divider",
];

/** What the error message of a failed item can do in the editor. */
export const useReportItemErrorActions = ({
  itemId,
  itemType,
  viewMode,
  parent,
}: {
  itemId: string;
  itemType: RBReportItemTypes;
  viewMode?: boolean;
  parent?: { id: string; type: "grid" | "column" };
}): Pick<ReportItemErrorBoundaryProps, "onSelect" | "onDelete"> => {
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const removeItem = useStoreActions(
    (actions) => actions.RBReportItemsState.removeItem,
  );
  const deleteGridItem = useStoreActions(
    (actions) => actions.RBReportItemsState.deleteGridItem,
  );

  if (viewMode) return {};

  return {
    onSelect: SELECTABLE_TYPES.includes(itemType)
      ? () =>
          setSelectedController({
            id: itemId,
            type: itemType,
            open: true,
            ...(parent && { parent: { ...parent, open: false } }),
          })
      : undefined,
    onDelete: () => {
      if (parent) {
        deleteGridItem({ gridId: parent.id, itemId });
      } else {
        removeItem(itemId);
      }
      setSelectedController({ id: "", type: null, open: false });
    },
  };
};

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
    const { viewMode, onSelect, onDelete } = this.props;
    const label = ITEM_LABELS[this.props.itemType] ?? "element";
    let message = `This ${label} couldn't be displayed.`;
    if (!viewMode) {
      message += onSelect
        ? " Click it to change its settings, or delete it."
        : " Delete it, then add it again.";
    }
    return (
      <Box
        role="alert"
        data-testid="report-item-error"
        onClick={viewMode ? undefined : onSelect}
        sx={{
          gap: "8px",
          width: "100%",
          padding: "16px",
          minHeight: "80px",
          display: "flex",
          borderRadius: "4px",
          textAlign: "center",
          alignItems: "center",
          bgcolor: "#f8f9fa",
          flexDirection: "column",
          justifyContent: "center",
          border: "1px dashed #cfd4da",
          cursor: !viewMode && onSelect ? "pointer" : undefined,
        }}
      >
        <Typography fontSize="14px" color="#59616a">
          {message}
        </Typography>
        {!viewMode && onDelete && (
          <Button
            size="small"
            onClick={(event) => {
              // A grid cell selects its item on click; this one is going away.
              event.stopPropagation();
              onDelete();
            }}
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
            Delete
          </Button>
        )}
      </Box>
    );
  }
}
