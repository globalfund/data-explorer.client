import React from "react";
import { Box, Typography, Checkbox } from "@mui/material";

interface CheckfieldProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}

export default function Checkfield(props: Readonly<CheckfieldProps>) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <Checkbox
        checked={props.checked}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      <Typography
        sx={{
          color: props.checked ? "#000" : "#ADB5BD",
          fontSize: "14px",
          opacity: props.disabled ? 0.5 : 1,
        }}
      >
        {props.label}
      </Typography>
    </Box>
  );
}
