import Divider from "@mui/material/Divider";

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

export const BOXES = [
  {
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
    image: "/static/images/ImagePlaceholder.png",
  },
  {
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
    image: "/static/images/ImagePlaceholder.png",
  },
  {
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
    image: "/static/images/ImagePlaceholder.png",
  },
  {
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
    image: "/static/images/ImagePlaceholder.png",
  },
];

export const ACCESS_TO_FUNDING_DEFAULT_YEAR = "2026";
export const ACCESS_TO_FUNDING_DEFAULT_CYCLE = "2026-2028";
export const ACCESS_TO_FUNDING_DEFAULT_CYCLES = [
  "2017-2019",
  "2020-2022",
  "2023-2025",
  "2026-2028",
];
