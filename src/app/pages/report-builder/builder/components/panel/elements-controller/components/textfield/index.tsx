import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Input from "@mui/material/TextField";
import React from "react";

type InputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export interface TextFieldProps {
  onChange?: (value: string) => void;
  value?: string;
  width?: string;
  sx?: Record<string, any>;
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
}
export default function TextField(props: Readonly<TextFieldProps>) {
  return (
    <Box
      sx={{
        width: props.width ?? "138px",
        height: "max-content",
      }}
    >
      {props.label ? (
        <Typography
          sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
          component={"div"}
        >
          {props.label}
        </Typography>
      ) : null}
      <Box
        sx={{
          width: "100%",
          height: "40px",
          display: "flex",
          alignItems: "center",
          border: "0.5px solid #98A1AA",
          backgroundColor: "#FFF",
          borderRadius: "4px",
          padding: "0 16px",
          ...props.sx,
        }}
      >
        <Input
          variant="standard"
          value={props.value}
          slotProps={{
            input: { disableUnderline: true },
          }}
          onChange={(e: InputEvent) => {
            props.onChange?.(e.target.value);
          }}
          disabled={props.disabled}
          placeholder={props.placeholder}
        />
      </Box>
    </Box>
  );
}
