import React, { memo } from "react";
import { useAlpha } from "../hooks/useAlpha";
import { IAlphaProps } from "../types";
import Box from "@mui/material/Box";

const Alpha = ({
  color,
  disabled,
  onChange,
  onChangeComplete,
}: IAlphaProps) => {
  const { ref, position, rgb, rgba, getInteractiveProps, interactiveRef } =
    useAlpha({
      color,
      disabled,
      onChange,
      onChangeComplete,
    });

  return (
    <Box
      {...getInteractiveProps()}
      ref={interactiveRef}
      className="rcp-interactive"
    >
      <Box
        ref={ref}
        className="rcp-alpha"
        sx={{
          position: "relative",
          background: `linear-gradient(to right, rgb(${rgb} / 0), rgb(${rgb} / 1)) top left / auto auto,
                     conic-gradient(#666 0.25turn, #999 0.25turn 0.5turn, #666 0.5turn 0.75turn, #999 0.75turn) top left / 12px 12px repeat`,
        }}
      >
        <Box
          className="rcp-alpha-cursor"
          sx={{
            position: "absolute",
            left: position.x - 5,
            top: 4,
            width: 10,
            height: "100%",
            background: `linear-gradient(to right, rgb(${rgba}), rgb(${rgba})) top left / auto auto,
                         conic-gradient(#666 0.25turn, #999 0.25turn 0.5turn, #666 0.5turn 0.75turn, #999 0.75turn) ${
                           -position.x - 4
                         }px 2px / 12px 12px repeat`,
            pointerEvents: "none",
          }}
        />
      </Box>{" "}
    </Box>
  );
};
export default memo(Alpha);
