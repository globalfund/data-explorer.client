/** The title's text style, from the chart's title text options. */
export const getTitleTextSx = (chartTitleOptions: Record<string, any> = {}) => {
  const [fontWeight, fontStyle] = String(
    chartTitleOptions.fontWeight ?? "600",
  ).split("+");
  return {
    fontFamily: chartTitleOptions.fontFamily,
    fontWeight: fontWeight || "400",
    fontStyle: fontStyle || "normal",
    fontSize: `${chartTitleOptions.fontSize ?? 16}px`,
    color: chartTitleOptions.textColor,
    backgroundColor: chartTitleOptions.backgroundColor,
  };
};

export const getTitleJustifyContent = (align?: string) =>
  align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start";
