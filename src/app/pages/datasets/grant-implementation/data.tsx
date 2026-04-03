import Divider from "@mui/material/Divider";

export const defaultGeographyGroupingOptions = [
  { value: "Standard View", label: "Standard View" },
  { value: "Portfolio View", label: "Portfolio View" },
  { value: "Board Constituency View", label: "Board Constituency View" },
];

export const defaultComponentsGroupingOptions = [
  { value: "Grouped", label: "Grouped" },
  { value: "Un-Grouped", label: "Un-Grouped" },
];

export const stats: {
  label: string;
  value: number | string;
}[] = [
  {
    value: "24.5 Million",
    label: "People on antiretroviral therapy for HIV in 2022.",
  },
  {
    value: "6.7 Million",
    label: "People with TB treated in 2022.",
  },
  {
    value: "220 Million",
    label: "Insecticide-treated mosquito nets distributed in 2022.",
  },
];

export const FullWidthDivider = () => (
  <Divider
    sx={{
      left: 0,
      width: "100vw",
      position: "absolute",
      borderColor: "#CFD4DA",
      "@media (max-width: 767px)": {
        display: "none",
      },
    }}
  />
);

export const BUDGET_BREAKDOWN_DATA = [
  {
    name: "Multicomponent",
    value: 37.41334776474775,
    color: "#0A2840",
  },
  {
    name: "HIV",
    value: 26.03209507797034,
    color: "#013E77",
  },
  {
    name: "Malaria",
    value: 17.556574762349314,
    color: "#00B5AE",
  },
  {
    name: "Tuberculosis",
    value: 10.822421383684201,
    color: "#C3EDFD",
  },
  {
    name: "RSSH",
    value: 8.175561011248398,
    color: "#F3F5F4",
  },
];
