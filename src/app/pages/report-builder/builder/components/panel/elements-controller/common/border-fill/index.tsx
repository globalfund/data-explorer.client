import { Box, Typography } from "@mui/material";
import { ColorPicker } from "app/components/color-picker/example";
import { ColorService } from "app/components/color-picker/utils/color";
import React from "react";
import CustomTextField from "app/pages/report-builder/builder/components/panel/elements-controller/common/textField";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { IColor } from "app/components/color-picker/types";
import { CustomiseComponentProps } from "../../chart/customise/component";

export default function BorderFill(props: Readonly<CustomiseComponentProps>) {
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
      type: props.borderFill?.itemType ?? null,
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
      type: props.borderFill?.itemType ?? null,
      settings: {
        ...item?.settings,
        borderColor: ColorService.convert("hex", color.hex).hex,
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
          <Box>
            <Typography
              sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
            >
              Stroke
            </Typography>
            <CustomTextField
              type="borderWidth"
              item={props.borderFill?.itemType ?? null}
            />
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
            <CustomTextField
              type="borderRadius"
              item={props.borderFill?.itemType ?? null}
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
