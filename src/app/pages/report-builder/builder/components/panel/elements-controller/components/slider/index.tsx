import { Box, Typography, Slider as MuiSlider } from "@mui/material";
import React from "react";

interface SliderProps {
  label?: React.ReactNode;
  value?: number;
  onChange: (value: number | number[]) => void;
  disabled?: boolean;
}

export function Slider(props: Readonly<SliderProps>) {
  return (
    <Box
      sx={{
        color: "#000",
        opacity: props.disabled ? 0.5 : 1,
        pointerEvents: props.disabled ? "none" : "auto",
      }}
    >
      {props.label ? (
        <Typography marginBottom={"8px"} fontSize={"14px"} color="#70777E">
          {props.label}
        </Typography>
      ) : null}
      <Box
        sx={{
          height: "17px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          // bgcolor: "pink",
        }}
      >
        <Typography>0</Typography>
        <MuiSlider
          size="small"
          sx={{ width: "230px" }}
          value={props.value}
          aria-label="Small"
          valueLabelDisplay="auto"
          onChange={(event, value) => {
            if (props.onChange) {
              props.onChange(value);
            }
          }}
          slotProps={{
            track: {
              style: { color: "#373D43" },
            },
          }}
        />

        <Typography>100</Typography>
      </Box>
    </Box>
  );
}
