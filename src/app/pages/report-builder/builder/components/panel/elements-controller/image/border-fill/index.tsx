import { Box, Divider, Slider, Typography } from "@mui/material";
import { ColorPicker } from "app/components/color-picker/example";
import { ColorService } from "app/components/color-picker/utils/color";
import React from "react";
import CustomTextField from "app/pages/report-builder/builder/components/panel/elements-controller/common/textField";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { IColor } from "app/components/color-picker/types";

export function BorderFill() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const item = items.find((i) => i.id === selectedController?.id);
  const handleBackgroundColorChange = (color: IColor) => {
    editItem({
      ...item,
      id: selectedController?.id || "",
      open: item?.open || false,
      type: "image",
      settings: {
        ...item?.settings,
        backgroundColor: ColorService.convert("hex", color.hex).hex,
      },
    });
  };
  const handleBorderColorChange = (color: IColor) => {
    editItem({
      ...item,
      id: selectedController?.id || "",
      open: item?.open || false,
      type: "image",
      settings: {
        ...item?.settings,
        borderColor: ColorService.convert("hex", color.hex).hex,
        borderStyle: "solid",
      },
    });
  };
  const handleOpacityChange = (_event: Event, value: number | number[]) => {
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
      <Box>
        <Typography fontWeight={700}>Border & Fill</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "8px",
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
            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
              >
                Stroke
              </Typography>
              <CustomTextField type="borderWidth" item="image" />
            </Box>
            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
              >
                Stroke Color
              </Typography>
              <ColorPicker
                color={ColorService.convert(
                  "hex",
                  item?.settings?.borderColor || "#000000",
                )}
                onChange={handleBorderColorChange}
                disabled={false}
                onResetColor={() => {}}
                onChangeComplete={() => {}}
                triggerWidth="138px"
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
            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
              >
                Corner Radius
              </Typography>
              <CustomTextField type="borderRadius" item="image" />
            </Box>
            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
              >
                Background Color
              </Typography>
              <ColorPicker
                color={ColorService.convert(
                  "hex",
                  item?.settings?.backgroundColor ?? "#FFFFFF",
                )}
                onChange={handleBackgroundColorChange}
                disabled={false}
                onResetColor={() => {}}
                onChangeComplete={() => {}}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
