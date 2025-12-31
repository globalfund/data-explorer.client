export const sizingModes = [
  { label: "Fit Proportional (Contain)", value: "fit-proportional" },
  { label: "Fill", value: "fill" },
  { label: "Crop", value: "crop" },
  { label: "Auto-Size (Grow)", value: "auto" },
];

export const objectFitMap: Record<string, string> = {
  "fit-proportional": "contain",
  fill: "cover",
  crop: "none",
  auto: "none",
};
