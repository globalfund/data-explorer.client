import { Box, Typography } from "@mui/material";
import { ColorPicker } from "app/components/color-picker/example";
import { ColorService } from "app/components/color-picker/utils/color";
import React from "react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { IColor } from "app/components/color-picker/types";
import { set } from "lodash";
import TextField from "../components/textfield";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";

export default function StyleTab() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const item = items.find(
    (i) => i.id === selectedController?.id,
  ) as ReportItemOf<"text">;

  const handleChange = (key: string, value: any) => {
    if (!item) return;
    const currentItem = structuredClone(item);
    set(currentItem, key, value);
    editItem({
      ...currentItem,
      id: selectedController?.id || "",
      open: currentItem?.open || false,
      type: "text",
    });
  };
  const handleBackgroundColorChange = (color: IColor) => {
    editItem({
      ...item,
      open: selectedController?.open || false,
      id: selectedController?.id || "",
      type: "text",
      options: {
        ...item?.options,
        backgroundColor: ColorService.convert("hex", color.hex).hex,
      },
    });
  };
  const handleBorderColorChange = (color: IColor) => {
    editItem({
      ...item,
      open: selectedController?.open || false,
      id: selectedController?.id || "",
      type: "text",
      options: {
        ...item?.options,
        borderColor: ColorService.convert("hex", color.hex).hex,
        borderStyle: "solid",
      },
    });
  };

  return (
    <Box sx={{ padding: "8px" }}>
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
          <TextField
            label="Stroke"
            value={item?.options?.borderWidth ?? ""}
            onChange={(value) => handleChange("options.borderWidth", value)}
          />
          <Box>
            <Typography
              sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
            >
              Stroke Color
            </Typography>
            <ColorPicker
              color={ColorService.convert(
                "hex",
                item?.options?.borderColor || "#000000",
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
          <TextField
            label="Corner Radius"
            value={item?.options?.borderRadius ?? ""}
            onChange={(value) => handleChange("options.borderRadius", value)}
          />
          <Box>
            <Typography
              sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
            >
              Background Color
            </Typography>
            <ColorPicker
              color={ColorService.convert(
                "hex",
                item?.options?.backgroundColor ?? "#FFFFFF",
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
  );
}
