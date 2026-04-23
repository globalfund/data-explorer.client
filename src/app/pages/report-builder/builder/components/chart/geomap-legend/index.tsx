import React from "react";
import { Box, Typography } from "@mui/material";
import { colorPaletteSequentialData } from "../../panel/elements-controller/common/data";
import { formatCompactNumber } from "app/utils/formatFinancialValue";

const GeomapLegend = ({
  data,
  visualOptions,
}: {
  data: any;
  visualOptions: any;
  mapping: any;
}) => {
  const colors =
    colorPaletteSequentialData.find(
      (item) => item.name === visualOptions.colorPalette,
    )?.colors ?? colorPaletteSequentialData[0].colors;

  const sizes = data?.results?.map((d: any) => d.value) ?? [];

  const minRaw = sizes.length ? Math.min(...sizes) : 0;
  const maxRaw = sizes.length ? Math.max(...sizes) : 0;

  const interval = (maxRaw - minRaw) / 5;

  return (
    <Box>
      <Box
        sx={{
          mt: "6.2px",
          display: "flex",
          columnGap: "16.74px",
          alignItems: "center",
        }}
      >
        {/* Gradient + min/max */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      height: "14px",
                      width: "75px",
                      background: `linear-gradient(90deg, ${colors[index]} 0%, ${colors[index + 1]} 50%, ${colors[index + 2]} 100%)`,
                      borderTopLeftRadius: index === 0 ? "7px" : 0,
                      borderBottomLeftRadius: index === 0 ? "7px" : 0,
                      borderTopRightRadius: index === 4 ? "7px" : 0,
                      borderBottomRightRadius: index === 4 ? "7px" : 0,
                    }}
                  />
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: 'Inter, "Helvetica Neue", sans-serif',
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                      textTransform: "uppercase",
                    }}
                  >
                    {formatCompactNumber(minRaw + interval * index)}-
                    {formatCompactNumber(minRaw + interval * (index + 1))}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GeomapLegend;
