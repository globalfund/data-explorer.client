import { Box } from "@mui/material";
import { ChartProperty } from "app/state/api/action-reducers/report-builder/sync";
import React from "react";
import { chartInfo } from "../data";
import { ChartAssetSelect } from "./chartAssetSelect";
import { useStoreState } from "app/state/store/hooks";

export function SelectChartAssetList() {
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const item = items.find((i) => i.id === selectedController?.id);
  const chartExtra = item?.extra?.chart || {};
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
        <ChartAssetSelect
          key={data.buttonLabel}
          buttonLabel={data.buttonLabel}
          helperText={data.helperText}
          icon={data.icon}
          selectedItem={chartExtra?.[data.type] || ""}
          type={data.type as ChartProperty}
        />
      ))}
    </Box>
  );
}
