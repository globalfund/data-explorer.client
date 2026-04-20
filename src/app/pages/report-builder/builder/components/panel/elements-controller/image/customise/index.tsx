import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import { useStoreState } from "app/state/store/hooks";
import { Slider } from "../../components/slider";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import TextField from "../../components/textfield";
import { appendPx, removePx } from "app/utils/formatPx";
import ColorPickerfield from "../../components/colorpickerfield";

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

  const handleChange = (key: string, value: any) => {
    editItem({
      ...item,
      id: selectedItemController?.id || "",
      open: item?.open || false,
      type: "image",
      options: {
        ...item?.options,
        [key]: value,
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
      <Typography fontWeight={700}>Border & Fill</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          ".MuiInputBase-root": {
            "&:before": {
              borderBottom: "none",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Stroke"
            value={removePx(item?.options?.imgBorderWidth ?? "")}
            onChange={(value) =>
              handleChange("imgBorderWidth", appendPx(value))
            }
            type="number"
          />
          <Box>
            <Typography
              sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
            >
              Stroke Color
            </Typography>
            <ColorPickerfield
              color={item?.options?.imgBorderColor || "#000000"}
              onChange={(value) => handleChange("imgBorderColor", value)}
              disabled={false}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Corner Radius"
            value={removePx(item?.options?.imgBorderRadius ?? "")}
            onChange={(value) =>
              handleChange("imgBorderRadius", appendPx(value))
            }
            type="number"
          />
          <Box>
            <Typography
              sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
            >
              Background
            </Typography>
            <ColorPickerfield
              color={item?.options?.imgBackgroundColor || "#FFFFFF"}
              onChange={(value) => handleChange("imgBackgroundColor", value)}
              disabled={false}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
