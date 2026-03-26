import React from "react";
import Box from "@mui/material/Box";

import Button from "@mui/material/Button";
import ChartIcon from "app/assets/vectors/RBChart.svg?react";
import ColumnIcon from "app/assets/vectors/RBColumn.svg?react";
import LetterTextIcon from "app/assets/vectors/Letter_Text.svg?react";
import GridIcon from "app/assets/vectors/RBGrid.svg?react";
import ImageIcon from "app/assets/vectors/RBImage.svg?react";

export type AssetViewType =
  | "all"
  | "chart"
  | "column"
  | "text"
  | "grid"
  | "image";

export const ReportBuilderAssetsToolbar: React.FC<{
  selectedView: AssetViewType;
  setSelectedView: (view: AssetViewType) => void;
}> = ({ selectedView, setSelectedView }) => {
  const items = [
    {
      name: "All",
      icon: null,
      value: "all",
    },
    {
      name: "Text",
      icon: <LetterTextIcon />,
      value: "text",
    },
    {
      name: "Chart",
      icon: <ChartIcon />,
      value: "chart",
    },
    {
      name: "Image",
      icon: <ImageIcon />,
      value: "image",
    },
    {
      name: "Column",
      icon: <ColumnIcon />,
      value: "column",
    },

    {
      name: "Grid",
      icon: <GridIcon />,
      value: "grid",
    },
  ];
  return (
    <Box
      sx={{
        gap: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        button: {
          fontSize: "16px",
          textTransform: "none",
        },
      }}
    >
      <Box
        sx={{
          gap: "1px",
          display: "flex",
          button: {
            borderRadius: 0,
            fontWeight: "400",
            padding: "8px 12px",
          },
        }}
      >
        {items.map((item) => (
          <Button
            key={item.value}
            endIcon={item.icon}
            onClick={() => setSelectedView(item.value as AssetViewType)}
            sx={{
              borderBottom: `2px solid ${selectedView === item.value ? "#0f62fe" : "#cfd4da"}`,
            }}
          >
            {item.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
