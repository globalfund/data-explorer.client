import { Box } from "@mui/material";
import { ChartProperty } from "app/state/api/action-reducers/report-builder/sync";
import React from "react";
import { chartInfo } from "../data";
import { AssetSelect } from "./asset-select";
import { useStoreState } from "app/state/store/hooks";
import { chartTypes, datasetItems } from "../../../../chart/data";

export function SelectChartAssetList() {
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const item = items.find((i) => i.id === selectedController?.id);
  const chartExtra = item?.extra?.chart || {};

  console.log(chartExtra, "chart extra in asset select");
  const getSelectedItem = (type: "chartType" | "dataset") => {
    if (type === "chartType") {
      const chartTypeId = chartExtra[type];
      const chartType = chartTypes.find((chart) => chart.id === chartTypeId);
      return chartType ? chartType.chartType : "";
    } else if (type === "dataset") {
      return (
        datasetItems.find((dataset) => dataset.id === chartExtra.dataset)
          ?.name || ""
      );
    }
    return chartExtra?.[type] || "";
  };
  return (
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
  );
}
