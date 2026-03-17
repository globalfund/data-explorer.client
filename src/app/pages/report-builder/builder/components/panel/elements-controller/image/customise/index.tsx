import { Box, Divider } from "@mui/material";
import React from "react";
import { useStoreState } from "app/state/store/hooks";
import { Slider } from "../../components/slider";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

export function Customise() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem: item, editItem } = useGetReportItemState<"image">({
    id: selectedItemController?.id || "",
    parent: selectedItemController?.parent ?? undefined,
  });

  const handleOpacityChange = (value: number | number[]) => {
    editItem({
      ...item,
      id: selectedItemController?.id || "",
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
