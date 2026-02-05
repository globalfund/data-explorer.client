import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import ChartIcon from "app/assets/vectors/RBChart.svg?react";
import { useClickOutsideEditor } from "app/hooks/useClickOutsideEditorComponent";
import ChartPlaceholder from "./placeholders/placeholder";
import { checkValidDimensionMapping } from "../panel/elements-controller/chart/utils";
import ChartComponent from "./chart-component";
import { useRenderChartData } from "app/hooks/queries/report-builder";

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

  const renderChartData = useRenderChartData();

  const chartExtra = selectedItem?.extra?.chart;
  const renderedChartData = chartExtra?.renderedChartData;

  React.useEffect(() => {
    if (
      chartExtra?.dataset &&
      checkValidDimensionMapping(chartExtra.chartType || "", chartExtra.mapping)
    ) {
      renderChartData.mutate(
        {
          chartType: chartExtra.chartType,
          mapping: chartExtra.mapping,
          vizOptions: chartExtra.visualOptions,
          appliedFilters: chartExtra.appliedFilters,
          datasetId: chartExtra.dataset,
        },
        {
          onSuccess: (data) => {
            editItem({
              ...selectedItem,
              id,
              type: "chart",
              open: selectedItem?.open || true,
              extra: {
                ...selectedItem?.extra,
                chart: {
                  ...selectedItem?.extra?.chart,
                  renderedChartData: data.data,
                },
              },
            });
          },
        },
      );
    }
  }, [
    chartExtra?.mapping,
    chartExtra?.chartType,
    chartExtra?.dataset,
    chartExtra?.appliedFilters,
    chartExtra?.visualOptions,
  ]);

  useClickOutsideEditor({
    editorId: "chart-render",
    toolbarId: "chart-controller",
    onOutsideClick: () => {
      clearSelectedItem();
    },
  });

  return (
    <Box
      id="chart-render"
      onClick={() => {
        editItem({
          ...selectedItem,
          id,
          type: "chart",
          open: true,
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
      {selectedItem?.open && chartExtra?.chartType ? (
        <Box
          sx={{
            width: chartExtra?.visualOptions?.width,
            height: chartExtra?.visualOptions?.height,
          }}
        >
          {checkValidDimensionMapping(
            chartExtra.chartType || "",
            chartExtra.mapping,
          ) && renderedChartData ? (
            <ChartComponent
              data={renderedChartData?.mappedData}
              mapping={chartExtra?.mapping}
              chartType={chartExtra.chartType}
              visualOptions={chartExtra.visualOptions || {}}
              id={id}
            />
          ) : (
            <ChartPlaceholder chartType={chartExtra.chartType} />
          )}
        </Box>
      ) : (
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
    </Box>
  );
};
