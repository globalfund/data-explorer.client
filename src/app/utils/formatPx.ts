export const removePx = (value: string): string => {
  return value.replace("px", "");
};

export const appendPx = (value: string): string => {
  return `${value}px`;
};
