import { Box, Button, Typography } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { ColorPicker } from "app/components/color-picker/example";
import { ColorService } from "app/components/color-picker/utils/color";
import {
  weightOptions,
  fontSizeOptions,
  fontFamilyOptions,
} from "app/components/rich-text-editor/data";
import StyledMenu from "../../common/menu-popup";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

export interface AdvancedOptionsProps {
  type: "topLabel" | "bigNumberText" | "bottomLabel" | "optionalText";
}
export default function AdvancedOptions(props: Readonly<AdvancedOptionsProps>) {
  const [isAdvancedOptionsExpanded, setIsAdvancedOptionsExpanded] =
    React.useState(false);
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find((i) => i.id === selectedItemController?.id);
  const [fontWeightAnchorEl, setFontWeightAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [isFontWeightMenuActive, setIsFontWeightMenuActive] =
    React.useState(false);
  const [fontFamilyAnchorEl, setFontFamilyAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [isFontFamilyMenuActive, setIsFontFamilyMenuActive] =
    React.useState(false);
  const [fontSizeAnchorEl, setFontSizeAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [isFontSizeMenuActive, setIsFontSizeMenuActive] = React.useState(false);
  const weightValue =
    selectedItem?.extra?.kpi_box?.field?.[props.type]?.fontWeightLabel || "400";
  const fontFamilyValue =
    selectedItem?.extra?.kpi_box?.field?.[props.type]?.fontFamily || "Arial";
  const fontSizeValue =
    selectedItem?.extra?.kpi_box?.field?.[props.type]?.fontSize || "14px";
  const textColorValue =
    selectedItem?.extra?.kpi_box?.field?.[props.type]?.color || "#000000";
  const bgColorValue =
    selectedItem?.extra?.kpi_box?.field?.[props.type]?.bgColor || "#FFFFFF";

  const weightLabel = weightOptions.find(
    (option) => option.value === weightValue,
  )?.label;

  const handleWeightChange = (value: string) => {
    let fontWeight = {};
    if (value.includes("italic")) {
      fontWeight = {
        fontStyle: "italic",
        fontWeight: value.split("+")[0],
        fontWeightLabel: value,
      };
    } else {
      fontWeight = {
        fontStyle: "normal",
        fontWeight: value,
        fontWeightLabel: value,
      };
    }
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "kpi_box",
      extra: {
        ...selectedItem?.extra,
        kpi_box: {
          ...selectedItem?.extra?.kpi_box,
          field: {
            ...selectedItem?.extra?.kpi_box?.field,
            [props.type]: {
              ...selectedItem?.extra?.kpi_box?.field?.[props.type],
              ...fontWeight,
            },
          },
        },
      },
    });
  };
  const handleSizeChange = (value: string) => {
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "kpi_box",
      extra: {
        ...selectedItem?.extra,
        kpi_box: {
          ...selectedItem?.extra?.kpi_box,
          field: {
            ...selectedItem?.extra?.kpi_box?.field,
            [props.type]: {
              ...selectedItem?.extra?.kpi_box?.field?.[props.type],
              fontSize: `${value}px`,
            },
          },
        },
      },
    });
  };
  const handleFontFamilyChange = (value: string) => {
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "kpi_box",
      extra: {
        ...selectedItem?.extra,
        kpi_box: {
          ...selectedItem?.extra?.kpi_box,
          field: {
            ...selectedItem?.extra?.kpi_box?.field,
            [props.type]: {
              ...selectedItem?.extra?.kpi_box?.field?.[props.type],
              fontFamily: value,
            },
          },
        },
      },
    });
  };
  const handleColorChange = (
    color: string,
    colorType: "text" | "background",
  ) => {
    let field = "";
    if (colorType === "background") {
      field = "bgColor";
    } else {
      field = "color";
    }

    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "kpi_box",
      extra: {
        ...selectedItem?.extra,
        kpi_box: {
          ...selectedItem?.extra?.kpi_box,
          field: {
            ...selectedItem?.extra?.kpi_box?.field,
            [props.type]: {
              ...selectedItem?.extra?.kpi_box?.field?.[props.type],
              [field]: color,
            },
          },
        },
      },
    });
  };
  const handleTriggerMenu = (
    event: React.MouseEvent<HTMLElement>,
    type: "fontWeight" | "fontSize" | "fontFamily",
  ) => {
    if (type === "fontWeight") {
      setFontWeightAnchorEl(event.currentTarget);
      setIsFontWeightMenuActive(true);
    } else if (type === "fontSize") {
      setFontSizeAnchorEl(event.currentTarget);
      setIsFontSizeMenuActive(true);
    } else if (type === "fontFamily") {
      setFontFamilyAnchorEl(event.currentTarget);
      setIsFontFamilyMenuActive(true);
    }
  };
  const handleClose = (type: "fontWeight" | "fontSize" | "fontFamily") => {
    if (type === "fontWeight") {
      setIsFontWeightMenuActive(false);
      setFontWeightAnchorEl(null);
    } else if (type === "fontSize") {
      setIsFontSizeMenuActive(false);
      setFontSizeAnchorEl(null);
    } else if (type === "fontFamily") {
      setIsFontFamilyMenuActive(false);
      setFontFamilyAnchorEl(null);
    }
  };

  return (
    <Box>
      {!isAdvancedOptionsExpanded && (
        <Button
          sx={{
            display: "flex",
            gap: "4px",
            color: "#3154F4",
            height: "17px",
            fontWeight: 400,
            fontSize: "14px",
            textTransform: "none",
            ":hover": { backgroundColor: "transparent" },
          }}
          onClick={() => setIsAdvancedOptionsExpanded(true)}
        >
          {" "}
          <AddIcon /> Expand advanced options
        </Button>
      )}
      {isAdvancedOptionsExpanded && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Box>
            {/* Font family */}
            <Typography
              sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
            >
              Font
            </Typography>
            <Button
              variant="text"
              onClick={(event) => handleTriggerMenu(event, "fontFamily")}
              endIcon={
                isFontWeightMenuActive ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowDown />
                )
              }
              sx={{
                fontWeight: "400",
                textTransform: "none",
                color: "#000",
                bgcolor: "#fff",
                width: "100%",
                justifyContent: "space-between",
                borderRadius: "4px",
                border: "0.5px solid #98A1AA",
              }}
            >
              {fontFamilyValue}
            </Button>

            <StyledMenu
              open={isFontFamilyMenuActive}
              anchorEl={fontFamilyAnchorEl}
              onClose={() => handleClose("fontFamily")}
              options={fontFamilyOptions}
              activeValue={fontFamilyValue}
              onSelect={handleFontFamilyChange}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {/* Paragraph / Headings */}
              <Typography
                sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
              >
                Weight
              </Typography>
              <Button
                variant="text"
                onClick={(event) => handleTriggerMenu(event, "fontWeight")}
                endIcon={
                  isFontWeightMenuActive ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )
                }
                sx={{
                  fontWeight: "400",
                  textTransform: "none",
                  color: "#000",
                  bgcolor: "#fff",
                  width: "134px",
                  justifyContent: "space-between",
                  borderRadius: "4px",
                  border: "0.5px solid #98A1AA",
                }}
              >
                <Typography
                  title={weightLabel}
                  fontSize={"14px"}
                  sx={{
                    maxWidth: "calc(100% - 24px)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {weightLabel}
                </Typography>
              </Button>

              <StyledMenu
                open={isFontWeightMenuActive}
                anchorEl={fontWeightAnchorEl}
                onClose={() => handleClose("fontWeight")}
                options={weightOptions}
                activeValue={weightValue}
                onSelect={handleWeightChange}
              />
            </Box>

            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
              >
                Size
              </Typography>
              <Button
                variant="text"
                onClick={(event) => handleTriggerMenu(event, "fontSize")}
                endIcon={
                  isFontSizeMenuActive ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )
                }
                sx={{
                  fontWeight: "400",
                  textTransform: "none",
                  color: "#000",
                  bgcolor: "#fff",
                  width: "134px",
                  justifyContent: "space-between",
                  borderRadius: "4px",
                  border: "0.5px solid #98A1AA",
                }}
              >
                {fontSizeValue}
              </Button>

              <StyledMenu
                open={isFontSizeMenuActive}
                anchorEl={fontSizeAnchorEl}
                onClose={() => handleClose("fontSize")}
                options={fontSizeOptions}
                activeValue={fontSizeValue}
                onSelect={handleSizeChange}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
              >
                Text Color
              </Typography>

              <ColorPicker
                color={ColorService.convert("hex", textColorValue)}
                onChange={(color) => {
                  handleColorChange(color.hex, "text");
                }}
                disabled={false}
                onResetColor={() => {
                  handleColorChange("#000000", "text");
                }}
                onChangeComplete={() => {}}
              />
            </Box>
            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
              >
                Highlight Color
              </Typography>

              <ColorPicker
                color={ColorService.convert("hex", bgColorValue)}
                onChange={(color) => {
                  handleColorChange(color.hex, "background");
                }}
                disabled={false}
                onResetColor={() => {
                  handleColorChange("#ffffff", "background");
                }}
                onChangeComplete={() => {}}
              />
            </Box>
          </Box>
        </Box>
      )}
      {isAdvancedOptionsExpanded && (
        <Button
          sx={{
            display: "flex",
            gap: "4px",
            color: "#3154F4",
            marginTop: "9.5px",
            height: "17px",
            fontWeight: 400,
            fontSize: "14px",
            textTransform: "none",
            ":hover": { backgroundColor: "transparent" },
          }}
          onClick={() => setIsAdvancedOptionsExpanded(false)}
        >
          {" "}
          <RemoveIcon /> Collapse options
        </Button>
      )}
    </Box>
  );
}
