import React from "react";

import { ColorInput, ColorPreview, OpacityInput } from "./components/fields";
import { useLocalStorage } from "react-use";
import Tabs from "./components/tabs";
import { IColor } from "../types";
import { ColorPickerWrapper } from "app/components/color-picker/example/styles";
import Box from "@mui/material/Box";
import { ClickAwayListener, Popper, Typography } from "@mui/material";
import { ColorService } from "../utils/color";
import Saturation from "./saturation";
import Alpha from "./alpha";
import Hue from "./hue";
import ResetIcon from "./assets/reset-icon";
import Trigger from "./components/trigger";

const swatches = [
  {
    label: "Dataxplorer",
    value: ["#6061E5", "#73D3CD", "#F6C445", "#E492BD", "#E75656"],
  },
  {
    label: "Sunset coast",
    value: ["#05405B", "#58528C", "#BB5390", "#FD6565", "#FDA529"],
  },
  {
    label: "Nordic Aurora",
    value: ["#175A5C", "#23768C", "#5291BC", "#94A8E4", "#E0BAFD"],
  },
  {
    label: "Warm tone",
    value: ["#5B0C0E", "#8A3C49", "#B26E87", "#D3A4C5", "#F5DCFE"],
  },
  {
    label: "Sprint forest",
    value: ["#2B5B16", "#538137", "#7BA95A", "#A4D37E", "#D0FEA3"],
  },
  {
    label: "Purple Gradient",
    value: ["#231D2C", "#655579", "#B194D1", "#DAB5FF", "#DADAF8"],
  },
  {
    label: "Grey Gradient",
    value: ["#373D43", "#70777E", "#98A1AA", "#CFD4DA", "#F1F3F5"],
  },
];

interface IColorPickerProps {
  height?: number;
  triggerWidth?: string;
  color: IColor;
  disabled?: boolean;
  onChange: (color: IColor) => void;
  onChangeComplete?: (color: IColor) => void;
  onResetColor: () => void; // Added onreset prop for reset functionality
}

export const ColorPicker = ({
  height = 105,
  color: inputColor,
  disabled,
  onChange: onChangeColor,
  onChangeComplete,
  triggerWidth,
  onResetColor = () => {}, // Added onreset prop for reset functionality
}: IColorPickerProps) => {
  const [recentlyUsedColors, setRecentlyUsedColors] = useLocalStorage(
    "recentlyUsedColors",
    [] as string[],
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  // Handle hue for grayscale colors
  // hue is lost when converting to hex and back, so we store a fallback hue
  // this only happens with grayscale colors (saturation = 0)
  const [fallbackHue, setFallbackHue] = React.useState(inputColor.hsv.h);
  const safeHue = inputColor.hsv.s === 0 ? fallbackHue : inputColor.hsv.h;

  const color = {
    ...inputColor,
    hsv: {
      ...inputColor.hsv,
      h: safeHue,
    },
  };

  const onChange = React.useCallback(
    (c: IColor) => {
      if (!c) return;
      onChangeColor(c);
      setFallbackHue(c.hsv.h); // Update fallback hue on color change
      const newColors = [c.hex, ...(recentlyUsedColors ?? [])];
      setRecentlyUsedColors(Array.from(new Set(newColors)).slice(0, 5));
    },
    [onChangeColor, color],
  );
  const [activeTab, setActiveTab] = React.useState("color");
  const handleTriggerColorPicker = (e: any) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };
  const handleTriggerInputChange = (c: string) => {
    onChangeColor(ColorService.convert("hex", c));
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={{ position: "relative" }}>
        <Trigger
          color={color?.hex ?? null}
          onChange={handleTriggerInputChange}
          onClick={handleTriggerColorPicker}
          triggerWidth={triggerWidth}
        />

        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="bottom-end"
          sx={{ zIndex: 101 }}
          disablePortal
        >
          <ColorPickerWrapper>
            <Box className="rcp">
              <Tabs
                activeTab={activeTab}
                tabs={[
                  {
                    value: "color",
                    label: "Color Picker",
                  },
                  {
                    value: "swatches",
                    label: "Swatches",
                  },
                ]}
                handleSwitch={setActiveTab}
              />
              {activeTab === "swatches" ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  {swatches.map((swatch) => (
                    <Box
                      key={swatch.label}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontFamily: "'GothamNarrow-Book', sans-serif",
                          fontWeight: 325,
                          color: "#231D2C",
                          lineHeight: "normal",
                          margin: 0,
                        }}
                      >
                        {swatch.label}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "5px",
                        }}
                      >
                        {swatch.value.map((c) => (
                          <Box
                            key={c}
                            className="rcp-recently-used-color"
                            sx={{
                              backgroundColor: c,
                              border:
                                c === color?.hex ? "2px solid #0026FF" : "none",
                              cursor: disabled ? "auto" : "pointer",
                            }}
                            onClick={() => {
                              if (disabled) return;
                              onChange(ColorService.convert("hex", c));
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box className="rcp-section">
                  <Saturation
                    height={height}
                    color={color}
                    disabled={disabled}
                    onChange={onChange}
                    onChangeComplete={onChangeComplete}
                  />
                  <Box className="rcp-body">
                    <Box className="rcp-section">
                      <Hue
                        color={color}
                        disabled={disabled}
                        onChange={onChange}
                        onChangeComplete={onChangeComplete}
                      />

                      <Alpha
                        color={color}
                        disabled={disabled}
                        onChange={onChange}
                        onChangeComplete={onChangeComplete}
                      />

                      <Box className="rcp-input-section">
                        <ColorPreview color={color} />

                        <ColorInput
                          onChange={onChange}
                          color={color}
                          disabled={disabled}
                        />
                        <OpacityInput
                          onChange={onChange}
                          color={color}
                          disabled={disabled}
                        />
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            margin: 0,
                            fontSize: "12px",
                            fontFamily: "GothamNarrow-Bold, sans-serif",
                            fontWeight: 400,
                            color: "#373D43",
                            lineHeight: "normal",
                          }}
                        >
                          Recently Used
                        </Typography>
                        <Box
                          sx={{
                            marginTop: "8px",
                            display: "flex",
                            gap: "4px",
                          }}
                        >
                          {recentlyUsedColors?.map((c) => (
                            <Box
                              key={c}
                              className="rcp-recently-used-color"
                              sx={{
                                backgroundColor: c,
                                cursor: disabled ? "auto" : "pointer",
                              }}
                              onClick={() => {
                                if (disabled) return;
                                onChange(ColorService.convert("hex", c));
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              <Box sx={{ paddding: "0 16px" }}>
                <Box
                  sx={{
                    padding: "7px 0",
                    borderTop: "1px solid #cfd4da",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    svg: {
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box
                    component={"span"}
                    sx={{
                      margin: 0,
                      fontSize: "12px",
                      fontFamily: "GothamNarrow-Book, sans-serif",
                      fontWeight: 325,
                      lineHeight: "normal",
                      cursor: disabled ? "auto" : "pointer",
                    }}
                  >
                    Reset
                  </Box>
                  <ResetIcon onClick={onResetColor} />
                </Box>
              </Box>
            </Box>
          </ColorPickerWrapper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};
