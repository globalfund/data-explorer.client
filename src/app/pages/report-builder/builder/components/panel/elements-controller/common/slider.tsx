import { Box, Typography, Slider as MuiSlider } from "@mui/material";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import React from "react";
import { Checkfield } from "./checkfield";
import { CustomiseComponentProps } from "../chart/customise/component";

export function Slider(props: Readonly<CustomiseComponentProps>) {
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
      type: "chart",
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
    <Box sx={{ color: "#000" }}>
      {props.slider?.checkField && (
        <Checkfield
          checkfield={{
            checked: props.slider.checked!,
            onChange: props.slider?.onChange || (() => {}),
            label: props.slider?.checkFieldLabel || "",
          }}
        />
      )}
      <Typography marginBottom={"12px"} fontSize={"14px"} color="#70777E">
        {props.slider?.label}
      </Typography>
      <Box
        sx={{
          height: "17px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          // bgcolor: "pink",
        }}
      >
        <Typography>0</Typography>
        <MuiSlider
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
  );
}
