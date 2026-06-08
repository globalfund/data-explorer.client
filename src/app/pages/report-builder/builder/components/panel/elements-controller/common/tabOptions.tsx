import { ColumnOptionIcon, GridOptionIcon } from "../../../header/data";

export const extraTabs = (parentType: "grid" | "column" | undefined) => [
  ...(parentType === "grid"
    ? [
        {
          value: "grid",
          ariaLabel: "Grid",
          icon: <GridOptionIcon />,
        },
      ]
    : []),
  ...(parentType === "column"
    ? [
        {
          value: "column",
          ariaLabel: "Column",
          icon: <ColumnOptionIcon />,
        },
      ]
    : []),
];
