import { Box, Typography } from "@mui/material";
import { ColorPicker } from "app/components/color-picker/example";
import { ColorService } from "app/components/color-picker/utils/color";
import React from "react";
import { useStoreState } from "app/state/store/hooks";
import { IColor } from "app/components/color-picker/types";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import Button from "@mui/material/Button";
import StyledMenu from "../../common/menu-popup";
import { lineOptions } from "../data";
import TextField from "../../components/textfield";
import { set } from "lodash";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import { appendPx, removePx } from "app/utils/formatPx";
import ColorPickerfield from "../../components/colorpickerfield";

export function Customise() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem, editItem } = useGetReportItemState<"kpi_box">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });
  // const handleBackgroundColorChange = (color: IColor) => {
  //   editItem({
  //     ...selectedItem,
  //     initialized: selectedItem?.initialized || false,
  //     id: selectedController?.id || "",
  //     type: "kpi_box",
  //     settings: {
  //       ...selectedItem?.settings,
  //       backgroundColor: ColorService.convert("hex", color.hex).hex,
  //     },
  //   });
  // };
  // const handleBorderColorChange = (color: IColor) => {
  //   editItem({
  //     ...selectedItem,
  //     initialized: selectedItem?.initialized || false,
  //     id: selectedController?.id || "",
  //     type: "kpi_box",
  //     settings: {
  //       ...selectedItem?.settings,
  //       borderColor: ColorService.convert("hex", color.hex).hex,
  //       borderStyle: "solid",
  //     },
  //   });
  // };

  const handleChange = (key: string, value: any) => {
    const currentItem = structuredClone(selectedItem);
    if (!currentItem) return;
    set(currentItem, key, value);
    editItem({
      ...currentItem,
      initialized: selectedItem?.initialized || false,
      id: selectedController?.id || "",
      type: "kpi_box",
    });
  };
  const handleInnerBorderColorChange = (color: IColor) => {
    handleChange("options.innerLine.borderColor", color.hex);
  };

  const [lineMenuOption, setLineMenuOption] = React.useState(
    selectedItem?.options?.innerLine?.type || "line",
  );

  const [lineMenuAnchorEl, setLineMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isLineOptionMenuActive = Boolean(lineMenuAnchorEl);

  React.useEffect(() => {
    setLineMenuOption(selectedItem?.options?.innerLine?.type || "line");
  }, [selectedItem]);

  const handleSelectLineOption = (value: "line" | "box" | "simple") => {
    editItem({
      ...selectedItem,
      initialized: selectedItem?.initialized || false,
      id: selectedController?.id || "",
      type: "kpi_box",
      options: {
        ...selectedItem?.options,
        innerLine: {
          ...selectedItem?.options?.innerLine,
          type: value,
        },
      },
    });
    setLineMenuOption(value);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLineMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setLineMenuAnchorEl(null);
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
      <Box>
        <Typography
          sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
        >
          Type
        </Typography>
        <Button
          variant="text"
          onClick={(event) => handleOpenMenu(event)}
          endIcon={
            isLineOptionMenuActive ? <KeyboardArrowUp /> : <KeyboardArrowDown />
          }
          sx={{
            fontWeight: "400",
            textTransform: "none",
            color: "#000",
            bgcolor: "#fff",
            width: "100%",
            height: "40px",
            justifyContent: "space-between",
            borderRadius: "4px",
            border: "0.5px solid #98A1AA",
          }}
        >
          {lineOptions.find((option) => option.value === lineMenuOption)?.label}
        </Button>

        <StyledMenu
          open={isLineOptionMenuActive}
          anchorEl={lineMenuAnchorEl}
          onClose={() => handleCloseMenu()}
          options={lineOptions}
          activeValue={lineMenuOption}
          onSelect={handleSelectLineOption}
        />
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
            label="Line Stroke"
            value={removePx(
              selectedItem?.options?.innerLine?.borderWidth || "",
            )}
            onChange={(value) => {
              handleChange("options.innerLine.borderWidth", appendPx(value));
            }}
            type="number"
            disabled={lineMenuOption === "simple"}
          />
        </Box>
        <Box>
          <Typography
            sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
          >
            Line Stroke Color
          </Typography>
          <ColorPicker
            color={ColorService.convert(
              "hex",
              selectedItem?.options?.innerLine?.borderColor || "#000000",
            )}
            onChange={handleInnerBorderColorChange}
            disabled={lineMenuOption === "simple"}
            onResetColor={() => {}}
            onChangeComplete={() => {}}
            triggerWidth="138px"
          />
        </Box>
      </Box>
      <Box>
        <Typography fontWeight={700} marginBottom={"8px"}>
          Border & Fill
        </Typography>
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
              gap: "16px",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="Stroke"
              value={removePx(selectedItem?.options?.borderWidth ?? "")}
              onChange={(value) =>
                handleChange("options.borderWidth", appendPx(value))
              }
              type="number"
              width="100%"
            />

            <ColorPickerfield
              label="Stroke Color"
              color={selectedItem?.options?.borderColor || "#000000"}
              onChange={(color) => handleChange("options.borderColor", color)}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "16px",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="Corner Radius"
              value={removePx(selectedItem?.options?.borderRadius ?? "")}
              onChange={(value) =>
                handleChange("options.borderRadius", appendPx(value))
              }
              type="number"
              width="100%"
            />

            <ColorPickerfield
              label="Background Color"
              color={selectedItem?.options?.backgroundColor ?? "#FFFFFF"}
              onChange={(color) =>
                handleChange("options.backgroundColor", color)
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
