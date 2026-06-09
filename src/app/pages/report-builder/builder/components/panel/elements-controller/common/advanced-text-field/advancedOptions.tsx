import { Box, Button, SxProps, Theme } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export interface AdvancedOptionsProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  label?: string;
}
export default function AdvancedOptions(props: Readonly<AdvancedOptionsProps>) {
  const [isAdvancedOptionsExpanded, setIsAdvancedOptionsExpanded] =
    React.useState(false);
  const isOpen = isAdvancedOptionsExpanded && !props.disabled;
  return (
    <>
      {!isOpen && (
        <Button
          sx={{
            display: "flex",
            gap: "4px",
            color: "#3154F4",
            height: "17px",
            fontWeight: 400,
            fontSize: "14px",
            textTransform: "none",
            ":hover": { backgroundColor: "transparent" },
            ...(props.disabled && {
              pointerEvents: "none",
              opacity: 0.5,
            }),
          }}
          onClick={() => setIsAdvancedOptionsExpanded(true)}
        >
          {" "}
          <AddIcon /> {props.label ?? "Expand advanced options"}
        </Button>
      )}
      {isOpen && <Box sx={props.sx}> {props.children ?? null} </Box>}
      {isOpen && (
        <Button
          sx={{
            display: "flex",
            gap: "4px",
            color: "#3154F4",
            marginTop: "9.5px",
            height: "17px",
            fontWeight: 400,
            fontSize: "14px",
            textTransform: "none",
            ":hover": { backgroundColor: "transparent" },
          }}
          onClick={() => setIsAdvancedOptionsExpanded(false)}
        >
          {" "}
          <RemoveIcon /> Collapse options
        </Button>
      )}
    </>
  );
}
