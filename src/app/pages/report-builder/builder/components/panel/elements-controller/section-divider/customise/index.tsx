import { Box, Typography } from "@mui/material";
import { ColorPicker } from "app/components/color-picker/example";
import { ColorService } from "app/components/color-picker/utils/color";
import React from "react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { IColor } from "app/components/color-picker/types";
import { set } from "lodash";
import TextField from "../../components/textfield";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";
import SelectField from "../../components/selectfield";
import { appendPx, removePx } from "app/utils/formatPx";

export default function Customise() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const item = items.find(
    (i) => i.id === selectedController?.id,
  ) as ReportItemOf<"section_divider">;

  const handleChange = (key: string, value: any) => {
    if (!item) return;
    const currentItem = structuredClone(item);
    set(currentItem, key, value);
    editItem({
      ...currentItem,
      id: selectedController?.id || "",
      open: currentItem?.open || false,
      type: "section_divider",
    });
  };

  const handleBorderColorChange = (color: IColor) => {
    editItem({
      ...item,
      open: selectedController?.open || false,
      id: selectedController?.id || "",
      type: "section_divider",
      options: {
        ...item?.options,
        borderColor: color.hex,
      },
    });
  };

  return (
    <Box sx={{ padding: "8px" }}>
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
          <SelectField
            label="Line Type"
            value={item?.options?.borderStyle ?? ""}
            onChange={(value) => handleChange("options.borderStyle", value)}
            options={[
              { label: "Solid", value: "solid" },
              { label: "Dashed", value: "dashed" },
              { label: "Dotted", value: "dotted" },
            ]}
            width={"100%"}
          />

          <SelectField
            label="Line Cap"
            value={item?.options?.strokeLinecap ?? ""}
            onChange={(value) => handleChange("options.strokeLinecap", value)}
            options={[
              { label: "Round", value: "round" },
              { label: "Square", value: "square" },
            ]}
            width={"100%"}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Line Stroke"
            value={removePx(item?.options?.borderWidth ?? "")}
            onChange={(value) =>
              handleChange("options.borderWidth", appendPx(value))
            }
          />
          <Box>
            <Typography
              sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
            >
              Line Stroke Color
            </Typography>
            <ColorPicker
              color={ColorService.convert(
                "hex",
                item?.options?.borderColor ?? "#FFFFFF",
              )}
              onChange={handleBorderColorChange}
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
