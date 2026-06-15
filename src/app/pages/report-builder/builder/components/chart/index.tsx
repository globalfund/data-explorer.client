import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import ChartIcon from "app/assets/vectors/RBChartLarge.svg?react";
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

  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const renderChartData = useRenderChartData();

  const chartExtra = selectedItem?.data;
  const renderedChartData = chartExtra?.renderedChartData;
  const [mappedData, setMappedData] = React.useState<any>(null);

  const active =
    selectedController?.id === id && selectedController?.type === "chart";

  const setVisualOptions = (newVisualOptions: Record<string, any>) => {
    if (!selectedItem) return;
    editItem({
      ...selectedItem,
      id: id || "",
      type: "chart",
      options: newVisualOptions,
    });
  };

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
            const { mappedData, ...rendered } = data.data;
            setMappedData(mappedData);
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
    }
  }, [
    chartExtra?.mapping,
    chartExtra?.chartType,
    chartExtra?.dataset,
    chartExtra?.appliedFilters,
    selectedItem?.options,
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
            bgcolor: active ? "#F8F9FA" : "#EFF1FE",
            flexDirection: "column",
            justifyContent: "center",
            border: active ? "0px solid #3154f4" : "0.5px dashed #3154f4",
            transition: "all 0.3s ease-in-out",
            height: selectedItem?.options?.height,
            path: {
              stroke: "#3154f4",
            },
          }}
        >
          <ChartIcon />
          <Typography fontSize="16px" color="#3154f4">
            {active ? "Configure Chart" : "Click to edit chart"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
