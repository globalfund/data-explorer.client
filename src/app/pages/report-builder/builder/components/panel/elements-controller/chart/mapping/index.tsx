import React from "react";
import { Box } from "@mui/material";
import { dimensions } from "./data";
import { Dimension } from "./dimension";
import Aggregation from "./aggregation";

export default function Mapping() {
  const [dimensionsState, setDimensionsState] = React.useState(dimensions);
  const handleMappingSelect = (value: string, dimensionLabel: string) => {
    console.log(value, "valie");
    setDimensionsState((prevState) => {
      const dimToUpdate = prevState.find((dim) => dim.label === dimensionLabel);
      if (!dimToUpdate) return prevState;
      const updatedDimension = {
        ...dimToUpdate,
        selectedValue: value,
        menuProps: { ...dimToUpdate.menuProps, activeValue: value },
      };
      return prevState.map((dim) =>
        dim.label === dimensionLabel ? updatedDimension : dim,
      );
    });
  };

  return (
    <Box
      sx={{
        padding: "16px 8px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {dimensionsState.map((dimension) => (
        <Dimension
          key={dimension.label}
          label={dimension.label}
          helperText={dimension.helperText}
          placeholder={dimension.placeholder}
          selectedValue={dimension.selectedValue}
          menuProps={{
            ...dimension.menuProps,
            onSelect: (value: string) =>
              handleMappingSelect(value, dimension.label),
          }}
        />
      ))}
      <Aggregation />
    </Box>
  );
}
