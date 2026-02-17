import { Box, Typography } from "@mui/material";
import { ColorPicker } from "app/components/color-picker/example";
import { ColorService } from "app/components/color-picker/utils/color";
import React from "react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { IColor } from "app/components/color-picker/types";

import { set } from "lodash";
import TextField from "../../components/textfield";
import { RBReportItemTypes } from "app/state/api/action-reducers/report-builder/sync";

interface BorderFillProps {
  itemType: RBReportItemTypes;
}

export default function BorderFill(props: Readonly<BorderFillProps>) {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const item = items.find((i) => i.id === selectedController?.id);

  const handleChange = (key: string, value: any) => {
    if (!item) return;
    const currentItem = structuredClone(item);
    set(currentItem, key, value);
    editItem({
      ...currentItem,
      id: selectedController?.id || "",
      open: currentItem?.open || false,
      type: props.itemType ?? null,
    });
  };

  const handleBackgroundColorChange = (color: IColor) => {
    handleChange("settings.backgroundColor", color.hex);
  };
  const handleBorderColorChange = (color: IColor) => {
    editItem({
      ...item,
      id: selectedController?.id || "",
      open: item?.open || false,
      type: props.itemType ?? null,
      settings: {
        ...item?.settings,
        borderColor: color.hex,
        borderStyle: "solid",
      },
    });
  };
  return (
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
          <TextField
            label="Stroke"
            value={item?.settings?.borderWidth ?? ""}
            onChange={(value) => handleChange("settings.borderWidth", value)}
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
            <TextField
              label="Corner Radius"
              value={item?.settings?.borderRadius ?? ""}
              onChange={(value) => handleChange("settings.borderRadius", value)}
            />
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
  );
}
