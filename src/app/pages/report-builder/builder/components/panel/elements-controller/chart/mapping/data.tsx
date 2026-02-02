import CaseSensitiveIcon from "app/assets/vectors/RBCaseSensitive.svg?react";
import DateIcon from "app/assets/vectors/Date.svg?react";
import PoundIcon from "app/assets/vectors/PoundIcon.svg?react";
import WorldIcon from "app/assets/vectors/World.svg?react";
import DateTimeIcon from "app/assets/vectors/DateTime.svg?react";
import BooleanMappingIcon from "app/assets/vectors/Toggle.svg?react";
import { DataType } from "app/state/api/action-reducers/report-builder/sync";

export interface MappingData {
  value: string;
  id: string;
  label?: string;
  disabled?: boolean;
  type: DataType;
}

export const MappingTypeIcons = {
  string: <CaseSensitiveIcon />,
  date: <DateIcon />,
  number: <PoundIcon />,
  geographical: <WorldIcon />,
  "date-time": <DateTimeIcon />,
  boolean: <BooleanMappingIcon />,
};
export const mappingData: MappingData[] = [
  {
    value: "Text or String",
    id: "1",
    type: "string",
  },
  {
    value: "Date",
    id: "2",
    type: "date",
  },
  {
    value: "Numeric value",
    id: "3",
    type: "number",
  },
  {
    value: "Numeric value",
    id: "4",
    type: "number",
  },
  {
    value: "Geographical data",
    id: "5",
    type: "geographical",
  },
  {
    value: "Date and Time",
    id: "6",
    type: "date-time",
  },
  {
    value: "Boolean (true/false)",
    id: "7",
    type: "boolean",
  },

  {
    value: "Boolean (true/false)",
    id: "8",
    type: "boolean",
  },

  {
    value: "Text or String",
    id: "9",
    type: "string",
  },
  {
    value: "Text or String",
    id: "10",
    type: "string",
  },
];

export const dimensions = [
  {
    label: "Category",
    helperText: "The items you want to compare.",
    placeholder: "Choose a category field...",
    selectedValue: "",
    required: true,
    menuProps: {
      options: mappingData,
      activeValue: "",
    },
  },
  {
    label: "Value",
    helperText: "The items you want to compare.",
    placeholder: "Choose a value field...",
    selectedValue: "",
    menuProps: {
      options: mappingData,
      activeValue: "",
    },
  },
  {
    label: "Breakdown",
    helperText: "Split or stack bars by another category.",
    placeholder: "Add a breakdown...",
    selectedValue: "",
    menuProps: {
      options: mappingData,
      activeValue: "",
    },
  },
];

export const aggregationOptions = [
  { value: "sum", id: "agg-1", label: "Sum" },
  { value: "mean", id: "agg-2", label: "Average" },
  { value: "count", id: "agg-3", label: "Count" },
  { value: "median", id: "agg-4", label: "Median" },
];
