import React from "react";
import { Box, Typography, Checkbox, SxProps } from "@mui/material";

interface CheckfieldProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  sx?: SxProps<any>;
  customColor?: string;
}

export default function Checkfield(props: Readonly<CheckfieldProps>) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        svg: {
          fill: props.checked ? props.customColor : undefined,
        },
        ...props.sx,
      }}
    >
      <Checkbox
        checked={props.checked}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      <Typography
        sx={{
          color: props.disabled ? "#ADB5BD" : "#000",
          fontSize: "14px",
          opacity: props.disabled ? 0.5 : 1,
        }}
      >
        {props.label}
      </Typography>
    </Box>
  );
}
