import React from "react";
import { Box, Typography } from "@mui/material";
import { ColorPicker } from "app/components/color-picker/example";
import { ColorService } from "app/components/color-picker/utils/color";

interface ColorPickerfieldProps {
  color: string;
  onChange: (color: string) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}

export default function ColorPickerfield(
  props: Readonly<ColorPickerfieldProps>,
) {
  return (
    <Box
      sx={{
        width: "100%",
        opacity: props.disabled ? 0.5 : 1,
        pointerEvents: props.disabled ? "none" : "auto",
      }}
    >
      {props.label ? (
        <Typography
          sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
        >
          {props.label}
        </Typography>
      ) : null}
      <ColorPicker
        color={ColorService.convert("hex", props.color)}
        onChange={(color) => {
          props.onChange(color.hex);
        }}
        disabled={props.disabled}
        onResetColor={() => {
          props.onChange("#000000");
        }}
        onChangeComplete={() => {}}
        triggerWidth="100%"
      />
    </Box>
  );
}
