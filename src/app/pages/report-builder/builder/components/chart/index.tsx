import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BarChart } from "app/components/charts/bar";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import ChartIcon from "app/assets/vectors/RBChart.svg?react";
import { STORY_DATA_VARIANT_1 } from "app/components/charts/bar/data";
import { useClickOutsideEditor } from "app/hooks/useClickOutsideEditorComponent";

export const ReportBuilderPageChart: React.FC<{
  id: string;
}> = ({ id }) => {
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const clearSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );
  const selectedItem = items.find((i) => i.id === id);
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  useClickOutsideEditor({
    editorId: "chart-render",
    toolbarId: "chart-controller",
    onOutsideClick: () => {
      clearSelectedItem();
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchChartData = () => {
    // Fetch or compute chart data here
  };

  return (
    <Box
      id="chart-render"
      onClick={() => {
        editItem({
          ...selectedItem,
          id,
          type: "chart",
          open: false,
          extra: {
            ...selectedItem?.extra,
            chart: {
              ...selectedItem?.extra?.chart,
              //dataset: fetched datasetId
              //chartType: fetched chart type
            },
          },
        });
        setSelectedController({
          id,
          type: "chart",
          open: true,
        });
      }}
      sx={{
        width: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        "&:hover": {
          ".top-right-actions": {
            display: "flex",
          },
        },
      }}
    >
      {!selectedItem?.open && (
        <Box
          sx={{
            gap: "10px",
            width: "100%",
            display: "flex",
            padding: "10px",
            cursor: "pointer",
            borderRadius: "4px",
            alignItems: "center",
            bgcolor: "#d6ddfd",
            flexDirection: "column",
            justifyContent: "center",
            border: "1px dashed #3154f4",
            transition: "all 0.3s ease-in-out",
            height: "220px",
          }}
        >
          <ChartIcon />
          <Typography fontSize="16px" color="#3154f4">
            Configure Chart
          </Typography>
        </Box>
      )}
      {selectedItem?.open && (
        <BarChart data={STORY_DATA_VARIANT_1} valueLabels={{ value: "" }} />
      )}
    </Box>
  );
};
