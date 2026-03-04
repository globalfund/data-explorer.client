import { Box, Divider } from "@mui/material";
import React from "react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { Slider } from "../../components/slider";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";

export function Customise() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const item = items.find(
    (i) => i.id === selectedController?.id,
  ) as ReportItemOf<"image">;

  const handleOpacityChange = (value: number | number[]) => {
    editItem({
      ...item,
      id: selectedController?.id || "",
      open: item?.open || false,
      type: "image",
      options: {
        ...item?.options,
        imgOpacity: (value as number) / 100,
      },
    });
  };

  return (
    <Box
      sx={{
        padding: "16px 8px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Slider
        label={"Image Opacity"}
        onChange={handleOpacityChange}
        value={(item?.options?.imgOpacity ?? 0) * 100}
      />
      <Divider sx={{ color: "#CFD4DA" }} />
      {/* <BorderFill itemType="image" /> */}
    </Box>
  );
}
