import React from "react";
import { Box, Typography, Checkbox } from "@mui/material";
import TextField, { TextFieldProps } from "../textField";
import AdvancedOptions, { AdvancedOptionsProps } from "./advancedOptions";
import {
  ChartField,
  RBReportItemTypes,
} from "app/state/api/action-reducers/report-builder/sync";
import Menu from "./menu";

interface AdvancedTextfieldProps {
  option: string;
  itemType: RBReportItemTypes;
  checked: boolean;
  handleCheck: (
    option: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelMap: Partial<Record<TextFieldProps["type"], string>>;
  label: { slotProps: { input: { "aria-label": string } } };
  advancedOptions: AdvancedOptionsProps;
  componentType: "TextField" | "Menu";
  menuField?: keyof ChartField;
}
export default function AdvancedTextField(
  props: Readonly<AdvancedTextfieldProps>,
) {
  const {
    option,
    checked,
    handleCheck,
    labelMap,
    itemType,
    label,
    advancedOptions,
  } = props;
  return (
    <Box
      key={option}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Checkbox
          {...label}
          checked={checked}
          onChange={handleCheck(option)}
          defaultChecked
        />
        <Typography
          sx={{
            color: checked ? "#373D43" : "#ADB5BD",
            fontSize: "14px",
          }}
        >
          {labelMap[option as keyof typeof labelMap]}
        </Typography>
      </Box>{" "}
      {props.componentType === "TextField" ? (
        <TextField
          item={itemType}
          type={option as keyof typeof labelMap}
          sx={{
            width: "100%",
            padding: "16px 11px",
            borderColor: checked ? "#98A1AA" : "transparent",
          }}
          disabled={checked !== true}
        />
      ) : (
        <Menu
          fieldLabel={props.menuField as keyof ChartField}
          disabled={checked !== true}
        />
      )}
      {checked === true && <AdvancedOptions {...advancedOptions} />}
    </Box>
  );
}
