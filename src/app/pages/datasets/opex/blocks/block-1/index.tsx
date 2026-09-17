import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {
  GridItem,
  gridItems,
} from "app/pages/datasets/opex/blocks/block-1/data";

const ItemBox = ({ item }: { item: GridItem }) => (
  <Box key={item.title}>
    <Typography fontWeight="700" fontSize={item.titleFontSize}>
      {item.title}
    </Typography>
    <Typography fontSize={16}>{item.subtitle}</Typography>
    <Typography fontSize={14} color="#373D43">
      {item.text}
    </Typography>
    {item.percentageValue && (
      <Box
        sx={{
          gap: "16px",
          width: "100%",
          display: "flex",
          marginTop: "8px",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            flex: 1,
            height: "8px",
            borderRadius: "4px",
            bgcolor: "#DFE3E5",
          }}
        >
          <Box
            sx={{
              height: "8px",
              borderRadius: "4px",
              bgcolor: "#0A2840",
              width: `${item.percentageValue}%`,
            }}
          />
        </Box>
        <Typography fontSize={12} color="#70777E">
          {item.percentageValue}% used
        </Typography>
      </Box>
    )}
  </Box>
);

const ContainerBox = ({ children }: { children: React.ReactNode[] }) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      "> div": {
        flex: "1 1 25%",
        minWidth: "200px",
        padding: "0 10px",
        borderRight: "1px solid #CFD4DA",
      },
      "> div:nth-of-type(4n)": {
        borderRight: "none",
      },
    }}
  >
    {children}
  </Box>
);

export const OpexPageBlock1: React.FC = () => {
  return (
    <React.Fragment>
      <ContainerBox>
        {gridItems.slice(0, 4).map((item) => (
          <ItemBox key={item.title} item={item} />
        ))}
      </ContainerBox>
      <Divider sx={{ margin: "24px 0" }} />
      <ContainerBox>
        {gridItems.slice(4).map((item) => (
          <ItemBox key={item.title} item={item} />
        ))}
      </ContainerBox>
    </React.Fragment>
  );
};
