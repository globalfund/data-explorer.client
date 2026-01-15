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

export const alignHOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];
export const alignVOptions = [
  { label: "Top", value: "top" },
  { label: "Middle", value: "middle" },
  { label: "Bottom", value: "bottom" },
];
