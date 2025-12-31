import { Box, Divider, Slider, Typography } from "@mui/material";
import React from "react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import BorderFill from "../../common/border-fill";

export function Customise() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const item = items.find((i) => i.id === selectedController?.id);

  const handleOpacityChange = (event: Event, value: number | number[]) => {
    editItem({
      ...item,
      id: selectedController?.id || "",
      open: item?.open || false,
      type: "image",
      settings: {
        ...item?.settings,
        img: {
          ...item?.settings?.img,
          opacity: (value as number) / 100,
        },
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
      <Box sx={{ color: "#000" }}>
        <Typography marginBottom={"12px"}>Image Opacity</Typography>
        <Box
          sx={{
            // height: "17px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            // bgcolor: "pink",
          }}
        >
          <Typography>0</Typography>
          <Slider
            size="small"
            sx={{ width: "230px" }}
            defaultValue={70}
            aria-label="Small"
            valueLabelDisplay="auto"
            onChange={handleOpacityChange}
            slotProps={{
              track: {
                style: { color: "#373D43" },
              },
            }}
          />

          <Typography>100</Typography>
        </Box>
      </Box>
      <Divider sx={{ color: "#CFD4DA" }} />
      <BorderFill itemType="image" />
    </Box>
  );
}
