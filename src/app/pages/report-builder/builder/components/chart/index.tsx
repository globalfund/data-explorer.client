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
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

export const ReportBuilderPageChart: React.FC<{
  id: string;
  viewMode?: boolean;
  parent?: {
    id: string;
    type: "grid" | "column";
  };
}> = ({ id, viewMode, parent }) => {
  const { selectedItem, editItem } = useGetReportItemState<"chart">({
    id,
    parent,
  });

  const hasParent = !!parent?.id;

  const clearSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );

  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const setFilterOptionGroups = useStoreActions(
    (actions) => actions.FilterOptionGroupsState.setValue,
  );

  const renderChartData = useRenderChartData();

  const chartExtra = selectedItem?.data;
  const renderedChartData = chartExtra?.renderedChartData;
  const [mappedData, setMappedData] = React.useState<any>(null);

  const setVisualOptions = (newVisualOptions: Record<string, any>) => {
    if (!selectedItem) return;
    editItem({
      ...selectedItem,
      id: id || "",
      type: "chart",
      options: newVisualOptions,
    });
  };

  // We want to re-render the chart when the selected controller changes to this chart, or when the chart's own properties change. But we don't want to re-render when other controllers are selected,
  // so we check if the selected controller's id matches this chart's id and include that in the dependency array
  const selectedControllerChange = selectedController?.id === id;

  React.useEffect(() => {
    if (
      chartExtra?.dataset &&
      checkValidDimensionMapping(chartExtra.chartType || "", chartExtra.mapping)
    ) {
      renderChartData.mutate(
        {
          chartType: chartExtra.chartType,
          mapping: chartExtra.mapping,
          vizOptions: selectedItem.options,
          appliedFilters: chartExtra.appliedFilters,
          datasetId: chartExtra.dataset,
        },
        {
          onSuccess: (data) => {
            const { mappedData, filterOptionGroups, ...rendered } = data.data;
            // We store mappedData and filterOptionGroups in local state and global state because we don't want to write to them to the report as they're too large,
            // but we need to persist them when the user switches between different controllers or tabs in the chart controller
            setMappedData(mappedData);
            if (selectedControllerChange) {
              setFilterOptionGroups(filterOptionGroups);
            }

            editItem({
              ...selectedItem,
              id,
              type: "chart",
              open: selectedItem?.open || true,
              data: {
                ...selectedItem?.data,
                renderedChartData: rendered,
              },
            });
          },
        },
      );

      return () => {
        setMappedData(null);
        setFilterOptionGroups([]);
      };
    }
  }, [
    chartExtra?.mapping,
    chartExtra?.chartType,
    chartExtra?.dataset,
    chartExtra?.appliedFilters,
    selectedItem?.options,
    selectedControllerChange,
  ]);

  useClickOutsideEditor({
    editorId: "chart-render",
    toolbarId: "chart-controller",
    modalId: "save-as-asset-modal",
    onOutsideClick: () => {
      clearSelectedItem();
    },
  });

  const canRender =
    checkValidDimensionMapping(
      chartExtra.chartType || "",
      chartExtra.mapping,
    ) && renderedChartData;

  return (
    <Box
      id="chart-render"
      onClick={() => {
        if (!viewMode) {
          editItem({
            ...selectedItem,
            id,
            type: "chart",
            open: true,
          });
          if (parent?.id) {
            setSelectedController({
              type: "chart",
              open: true,
              id,
              parent: {
                id: parent.id,
                type: parent.type,
                open: false,
              },
            });
          } else {
            setSelectedController({
              type: "chart",
              open: true,
              id,
            });
          }
        }
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
        canRender ? (
          <Box
            sx={{
              width: hasParent ? "100%" : selectedItem?.options?.width,
              height: hasParent ? "100%" : selectedItem?.options?.height,
              position: "relative",
            }}
          >
            <ChartComponent
              data={mappedData}
              mapping={chartExtra?.mapping}
              chartType={chartExtra.chartType}
              visualOptions={selectedItem.options || {}}
              setVisualOptions={setVisualOptions}
              id={id}
              readOnly={viewMode}
            />
          </Box>
        ) : viewMode ? null : (
          <Box
            sx={{
              width: hasParent ? "100%" : selectedItem?.options?.width,
              height: hasParent ? "100%" : selectedItem?.options?.height,
              position: "relative",
            }}
          >
            <ChartPlaceholder chartType={chartExtra.chartType} />
          </Box>
        )
      ) : viewMode ? null : (
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
            height: selectedItem?.options?.height,
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
