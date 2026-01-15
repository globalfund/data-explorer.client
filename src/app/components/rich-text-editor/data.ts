export const weightOptions = [
  {
    label: "Light",
    value: "400",
  },
  {
    label: "Medium",
    value: "500",
  },
  {
    label: "Bold",
    value: "600",
  },
  {
    label: "Extra Bold",
    value: "700",
  },
  {
    label: "Thin Italic",
    value: "400+italic",
  },
  {
    label: "Medium Italic",
    value: "500+italic",
  },
  {
    label: "Bold Italic",
    value: "600+italic",
  },
  {
    label: "Extra Bold Italic",
    value: "700+italic",
  },
];

export const fontFamilyOptions = [
  {
    label: "Amatic SC",
    value: "Amatic SC",
    stateVar: "isFontFamilyAmaticSC",
    fontWeight: "400",
  },
  {
    label: "Arial",
    value: "Arial",
    stateVar: "isFontFamilyArial",
    fontWeight: "400",
  },
  {
    label: "Caveat",
    value: "Caveat",
    stateVar: "isFontFamilyCaveat",
    fontWeight: "700",
  },
  {
    label: "Comfortaa",
    value: "Comfortaa",
    stateVar: "isFontFamilyComfortaa",
    fontWeight: "400",
  },
  {
    label: "Comic Sans MS",
    value: "Comic Sans MS",
    stateVar: "isFontFamilyComicSansMS",
    fontWeight: "700",
  },
  {
    label: "Courier New",
    value: "Courier New",
    stateVar: "isFontFamilyCourierNew",
    fontWeight: "400",
  },
  {
    label: "EB Garamond",
    value: "EB Garamond",
    stateVar: "isFontFamilyEBGaramond",
    fontWeight: "400",
  },
  {
    label: "Finlandica",
    value: "Finlandica",
    stateVar: "isFontFamilyFinlandica",
    fontWeight: "400",
  },
  {
    label: "Impact",
    value: "Impact",
    stateVar: "isFontFamilyImpact",
    fontWeight: "400",
  },
  {
    label: "Inter",
    value: "Inter",
    stateVar: "isFontFamilyInter",
    fontWeight: "400",
  },
];

export const fontSizeOptions = Array.from({ length: 72 }, (_, i) => i + 8).map(
  (size) => ({
    label: `${size}px`,
    value: size.toString(),
  }),
);

export const lineHeightOptions = [
  {
    label: "auto",
    value: "auto",
  },
];
