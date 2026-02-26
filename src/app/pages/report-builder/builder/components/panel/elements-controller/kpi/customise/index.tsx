import { Box, Typography } from "@mui/material";
import { ColorPicker } from "app/components/color-picker/example";
import { ColorService } from "app/components/color-picker/utils/color";
import React from "react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { IColor } from "app/components/color-picker/types";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import Button from "@mui/material/Button";
import StyledMenu from "../../common/menu-popup";
import { lineOptions } from "../data";
import TextField from "../../components/textfield";
import { set } from "lodash";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";

export function Customise() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find(
    (i) => i.id === selectedController?.id,
  ) as ReportItemOf<"kpi_box">;
  // const handleBackgroundColorChange = (color: IColor) => {
  //   editItem({
  //     ...selectedItem,
  //     open: selectedItem?.open || false,
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
  //     open: selectedItem?.open || false,
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
      open: selectedItem?.open || false,
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
    let alignItems = "";
    switch (value) {
      case "line":
        alignItems = "start";
        break;
      case "box":
        alignItems = "center";
        break;
      case "simple":
        alignItems = "end";
        break;
    }
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedController?.id || "",
      type: "kpi_box",
      options: {
        ...selectedItem?.options,
        display: "flex",
        alignItems,
        innerLine: {
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
            value={selectedItem?.options?.innerLine?.borderWidth || ""}
            onChange={(value) => {
              handleChange("options.innerLine.borderWidth", value);
            }}
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
            disabled={false}
            onResetColor={() => {}}
            onChangeComplete={() => {}}
            triggerWidth="138px"
          />
        </Box>
      </Box>
      {/* <BorderFill itemType="kpi_box" /> */}
      {/* <Box>
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
              <CustomTextField type="borderWidth" item="kpi_box" />
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
                  selectedItem?.settings?.borderColor || "#000000",
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
              <CustomTextField type="borderRadius" item="kpi_box" />
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
                  selectedItem?.settings?.backgroundColor ?? "#FFFFFF",
                )}
                onChange={handleBackgroundColorChange}
                disabled={false}
                onResetColor={() => {}}
                onChangeComplete={() => {}}
              />
            </Box>
          </Box>
        </Box>
      </Box> */}
    </Box>
  );
}
