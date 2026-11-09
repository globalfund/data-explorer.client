interface PendingEdits {
  flush: () => void;
}

// Chart edits that are debounced before they reach the report (zooming), one
// entry per mounted chart.
const pendingChartEdits = new Set<PendingEdits>();

/** Registers a chart's debounced edits; returns a function that unregisters them. */
export const trackPendingChartEdits = (edits: PendingEdits) => {
  pendingChartEdits.add(edits);
  return () => {
    pendingChartEdits.delete(edits);
  };
};

/**
 * Writes every chart's debounced edits to the report now, so a save made right
 * after a zoom includes it.
 */
export const flushPendingChartEdits = () => {
  pendingChartEdits.forEach((edits) => edits.flush());
};
