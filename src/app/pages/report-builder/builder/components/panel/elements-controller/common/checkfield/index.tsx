import React from "react";
import { Box, Typography, Checkbox } from "@mui/material";
import { CustomiseComponentProps } from "../../chart/customise/component";

export function Checkfield(props: Readonly<CustomiseComponentProps>) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "4px", mb: "9px" }}>
      <Checkbox
        checked={props.checkfield?.checked}
        onChange={props.checkfield?.onChange}
      />
      <Typography
        sx={{
          color: props.checkfield?.checked ? "#000" : "#ADB5BD",
          fontSize: "14px",
        }}
      >
        {props.checkfield?.label}
      </Typography>
    </Box>
  );
}
