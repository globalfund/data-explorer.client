import React from "react";
import { isAxiosError } from "axios";
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

const ChartLoadError: React.FC<{ error: unknown; height?: string }> = ({
  error,
  height,
}) => (
  <Box
    role="alert"
    data-cy="rb-chart-error"
    sx={{
      height,
      width: "100%",
      display: "flex",
      minHeight: "120px",
      padding: "16px",
      borderRadius: "4px",
      alignItems: "center",
      bgcolor: "#f8f9fa",
      textAlign: "center",
      justifyContent: "center",
      border: "1px dashed #cfd4da",
    }}
  >
    <Typography fontSize="14px" color="#59616a">
      {isAxiosError(error) && error.response?.status === 404
        ? "The data for this chart is no longer available."
        : "Couldn't load this chart's data. Check its data settings or try again later."}
    </Typography>
  </Box>
);

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

  const setFilterOptionGroups = useStoreActions(
    (actions) => actions.FilterOptionGroupsState.setValue,
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

  // Re-render when this chart's data inputs change, or when it gets selected
  // (so the panel gets its filter options). Visual options are left out on
  // purpose: the server's mapped data doesn't depend on them, and echarts
  // applies them client side.
  const selectedControllerChange = selectedController?.id === id;

  // The response can arrive after further edits to this item; write the
  // rendered data onto the latest version rather than the one that sent it.
  const latestItem = React.useRef(selectedItem);
  latestItem.current = selectedItem;

  React.useEffect(() => {
    // A chart without a type has no required dimensions, so the mapping check
    // alone would let it through and the server would reject the request.
    if (
      chartExtra?.dataset &&
      chartExtra.chartType &&
      checkValidDimensionMapping(chartExtra.chartType, chartExtra.mapping)
    ) {
      renderChartData.mutate(
        {
          chartType: chartExtra.chartType,
          mapping: chartExtra.mapping,
          vizOptions: latestItem.current?.options,
          appliedFilters: chartExtra.appliedFilters,
          datasetId: chartExtra.dataset,
        },
        {
          onSuccess: (data) => {
            const {
              mappedData: newMappedData,
              filterOptionGroups,
              ...rendered
            } = data.data;
            // We store mappedData and filterOptionGroups in local state and global state because we don't want to write to them to the report as they're too large,
            // but we need to persist them when the user switches between different controllers or tabs in the chart controller
            setMappedData(newMappedData);
            if (selectedControllerChange) {
              setFilterOptionGroups(filterOptionGroups);
            }

            const item = latestItem.current;
            if (!item) return;
            editItem({
              ...item,
              id,
              type: "chart",
              initialized: true,
              data: {
                ...item.data,
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
    // Until the chart can be rendered again, show its placeholder rather than
    // the error of an earlier request.
    renderChartData.reset();
  }, [
    chartExtra?.mapping,
    chartExtra?.chartType,
    chartExtra?.dataset,
    chartExtra?.appliedFilters,
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
      chartExtra?.chartType || "",
      chartExtra?.mapping,
    ) && renderedChartData;

  return (
    <Box
      id="chart-render"
      data-cy="rb-chart"
      data-id={id}
      onClick={() => {
        if (!viewMode) {
          editItem({
            ...selectedItem,
            id,
            type: "chart",
            initialized: true,
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
      {selectedItem?.initialized && chartExtra?.chartType ? (
        renderChartData.isError ? (
          <ChartLoadError
            error={renderChartData.error}
            height={hasParent ? "100%" : selectedItem?.options?.height}
          />
        ) : canRender ? (
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
