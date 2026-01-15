import React from "react";
import Box from "@mui/material/Box";
import { useSaturation } from "../hooks/useSaturation";
import { ISaturationProps } from "../types";

export default function Saturation({
  height,
  color,
  disabled,
  onChange,
  onChangeComplete,
}: Readonly<ISaturationProps>) {
  const {
    getInteractiveProps,
    height: saturationHeight,
    hsl,
    position,
    ref: saturationRef,
    interactiveRef,
    rgb,
  } = useSaturation({
    color,
    height,
    onChange,
    disabled,
    onChangeComplete,
  });

  return (
    <Box
      ref={interactiveRef}
      className="rcp-interactive"
      {...getInteractiveProps()}
    >
      <Box
        ref={saturationRef}
        className="rcp-saturation"
        sx={{
          height: saturationHeight,
          backgroundColor: `hsl(${hsl})`,
          backgroundImage:
            "linear-gradient(to right, #fff, rgba(255,255,255,0)), linear-gradient(to top, #000, rgba(0,0,0,0))",
          position: "relative",
        }}
      >
        <Box
          className="rcp-saturation-cursor"
          sx={{
            left: position.x,
            top: position.y,
            position: "absolute",
            backgroundColor: `rgb(${rgb})`,
            width: 8,
            height: 8,
            borderRadius: "50%",
            border: "2px solid #fff",
            pointerEvents: "none",
          }}
        />
      </Box>
    </Box>
  );
}
