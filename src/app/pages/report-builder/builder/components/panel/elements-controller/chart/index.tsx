import { Box } from "@mui/material";
import React, { useEffect } from "react";
import ChartIcon from "app/assets/vectors/RBChart.svg?react";
import { chartInfo, tabList } from "./data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import LayoutTab from "./layout";
import Customise from "./customise";
import Advanced from "./advanced";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import { AssetSwitch } from "../grid/switchAsset";
import { GridLayoutTab } from "../grid/gridTab";
import { ColumnLayoutTab } from "../column/columnTab";
import ChartSelectModal from "app/pages/report-builder/builder/components/chart-select-modal";
import { DatasetSelectModal } from "../../../dataset-select-modal";
import { AssetSelect } from "../common/asset-select";
import { chartTypes, datasetItems } from "../../../chart/data";
import { ChartProperty } from "app/state/api/action-reducers/report-builder/sync";
import ControllerTabs from "app/components/tabs";
import { extraTabs } from "../common/tabOptions";
import DataSettings from "./data-settings";
import PanelHeader from "../../panel-header";

type ChartControllerTab =
  "data-settings" | "layout" | "style" | "advanced" | "grid" | "column";

export default function ChartController() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [value, setValue] = React.useState<ChartControllerTab>("data-settings");

  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const { selectedItem: item, editItem } = useGetReportItemState<"chart">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const chartExtra = selectedController?.extra?.chart || {};

  const chartData = item?.data || {};

  const chartConfigured = item?.data?.dataset && item?.data?.chartType;

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: ChartControllerTab,
  ) => {
    setValue(newValue);
  };

  const renderTabPanel = () => {
    switch (value) {
      case "data-settings":
        return <DataSettings />;
      case "layout":
        return <LayoutTab />;
      case "style":
        return <Customise />;
      case "advanced":
        return <Advanced />;
      case "grid":
        return <GridLayoutTab />;
      case "column":
        return <ColumnLayoutTab />;
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (!selectedController) return;
    setSelectedController({
      ...selectedController,
      extra: {
        ...selectedController?.extra,
        chart: {
          listToDisplay: null,
        },
      },
    });
  };

  const handleApply = (
    selectedDataset: string,
    filters: Record<string, any[]>,
  ) => {
    if (!item || !selectedDataset) return;
    const datasetUnchanged = item?.data?.dataset === selectedDataset;
    editItem({
      ...item,
      id: selectedController?.id || "",
      type: "chart",
      data: {
        ...item?.data,
        dataset: selectedDataset,
        mapping: datasetUnchanged ? item?.data?.mapping : {},
        appliedFilters:
          filters || (datasetUnchanged ? item?.data?.appliedFilters : {}),
      },
    });
    handleBack();
  };

  const getSelectedItem = (type: "chartType" | "dataset") => {
    if (type === "chartType") {
      const chartTypeId = chartData[type];
      const chartType = chartTypes.find((chart) => chart.id === chartTypeId);
      return chartType ? chartType.chartType : "";
    } else if (type === "dataset") {
      return (
        datasetItems.find((dataset) => dataset.id === chartData.dataset)
          ?.name || ""
      );
    }
    return chartExtra?.[type] || "";
  };

  useEffect(() => {
    if (chartConfigured) {
      setValue("data-settings");
    }
  }, [chartConfigured, item?.data?.dataset, item?.data?.chartType]);

  React.useEffect(() => {
    if (selectedController?.parent?.type === "grid") {
      setValue("grid");
    } else if (selectedController?.parent?.type === "column") {
      setValue("column");
    } else {
      setValue("data-settings");
    }
  }, [selectedController?.id]);

  return (
    <Box
      id="chart-controller"
      key={selectedController?.id}
      sx={{
        minWidth: "300px",
        maxWidth: "max-content",
      }}
    >
      <Box
        sx={{
          border: "1px solid #98A1AA",
          borderRadius: "4px",
          boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60);",
          bgcolor: "#F8F9FA",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "304px",
        }}
      >
        <Box
          sx={{
            padding: "8px",
            borderBottom: "1px solid #CFD4DA",
          }}
        >
          <PanelHeader
            isExpanded={isExpanded}
            handleExpandToggle={handleExpandToggle}
            name="Chart"
            icon={<ChartIcon />}
          />
          {selectedController?.parent?.id ? <AssetSwitch /> : null}
        </Box>
        <Box sx={{ display: isExpanded ? "block" : "none" }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "0 8px",
              }}
            >
              {chartInfo.map((data) => (
                <AssetSelect
                  key={data.buttonLabel}
                  buttonLabel={data.buttonLabel}
                  helperText={data.helperText}
                  icon={data.icon}
                  selectedItem={getSelectedItem(data.type)}
                  type={data.type as ChartProperty}
                />
              ))}
            </Box>
            <Box sx={{ borderTop: "1px solid #CFD4DA", marginTop: "8px" }}>
              <ControllerTabs
                tabs={[
                  ...extraTabs(selectedController?.parent?.type),
                  ...tabList,
                ]}
                value={chartConfigured ? value : null}
                handleChange={chartConfigured ? handleChange : undefined}
              />
            </Box>

            {chartConfigured ? (
              renderTabPanel()
            ) : (
              <Box
                sx={{
                  padding: "38.5px 8px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                *Configure chart first to start editing.
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <ChartSelectModal
        open={selectedController?.extra?.chart?.listToDisplay == "chartType"}
        onClose={handleBack}
      />
      <DatasetSelectModal
        open={selectedController?.extra?.chart?.listToDisplay == "dataset"}
        onClose={handleBack}
        skipColumnSelection
        handleSelectDataset={({ selectedDataset, filters }) =>
          handleApply(selectedDataset, filters)
        }
      />
    </Box>
  );
}
