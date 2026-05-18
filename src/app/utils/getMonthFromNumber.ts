const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getMonthFromNumber(value: number, fullName?: boolean): string {
  if (value < 0 || value > 12) return "";
  if (fullName) return months[value - 1];
  return months[value - 1].slice(0, 3);
}
