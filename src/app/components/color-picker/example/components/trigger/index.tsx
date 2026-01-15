import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import React from "react";
import NullColor from "app/assets/vectors/RBNullColor.svg?react";
import HexIcon from "app/assets/vectors/RBHex.svg?react";

import { Button, IconButton } from "@mui/material";

interface ITrigger {
  color: string | null;
  onChange: (color: string) => void;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  triggerWidth?: string;
}
export default function Trigger(props: Readonly<ITrigger>) {
  return (
    <Box
      sx={{
        width: props.triggerWidth ?? "134px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        borderRadius: "4px",
        border: "0.5px solid #98A1AA",
        backgroundColor: "#FFF",
        padding: "5px",
      }}
    >
      {props.color ? (
        <Button
          onClick={props.onClick}
          sx={{
            height: "30px",
            width: "30px",
            minWidth: "30px",
            border: "0.75px solid #252C34",
            backgroundColor: props.color,
            borderRadius: "4px",
            padding: "0px",
          }}
        />
      ) : (
        <IconButton
          onClick={props.onClick}
          sx={{
            backgroundColor: "",
            border: "none",
            padding: "0",
            outline: "none",
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          <NullColor />
        </IconButton>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "16px",
          ".MuiInputBase-root": {
            height: "16px",
            "&:before": {
              borderBottom: props.color ? "none" : "1px solid #98A1AA",
            },
          },
        }}
      >
        <HexIcon />
        <TextField
          variant="standard"
          onChange={(e) => props.onChange(e.target.value)}
          value={props.color?.replace("#", "")}
          slotProps={{
            input: { disableUnderline: !!props.color },
          }}
          sx={{
            borderColor: " #98A1AA",
            width: props.color ? "70px" : "50px",
            color: "#70777E",
          }}
        />
      </Box>
    </Box>
  );
}
