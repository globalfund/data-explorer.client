import React from "react";
import { Box, Typography } from "@mui/material";
import { colorPaletteSequentialData } from "../../panel/elements-controller/common/data";
import { formatFinancialValue } from "app/utils/formatFinancialValue";

const GeomapLegend = ({
  data,
  visualOptions,
  mapping,
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

  const title = `${mapping?.country?.value?.[0] ?? ""} | ${
    mapping?.size?.value?.[0] ?? ""
  }`;

  const unit = mapping?.size?.value?.[0]?.slice(0, 3) ?? "";

  const minRaw = sizes.length ? Math.min(...sizes) : 0;
  const maxRaw = sizes.length ? Math.max(...sizes) : 0;

  const min = visualOptions.isMonetaryValue
    ? formatFinancialValue(minRaw, true)
    : minRaw;

  const max = visualOptions.isMonetaryValue
    ? formatFinancialValue(maxRaw, true)
    : maxRaw;

  return (
    <Box>
      <Typography
        sx={{
          m: 0,
          p: 0,
          fontFamily: 'Inter, "Helvetica Neue", sans-serif',
          fontSize: "10.047px",
          fontWeight: "bold",
          lineHeight: "12.558px",
          letterSpacing: "0.419px",
        }}
      >
        {title}
      </Typography>

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
              columnGap: "3.35px",
              alignItems: "center",
            }}
          >
            {colors?.map((color: string) => (
              <Box
                key={color}
                sx={{
                  height: "5.023px",
                  width: "37.674px",
                  bgcolor: color,
                  borderRadius: "16.744px",
                }}
              />
            ))}
          </Box>

          <Box
            sx={{
              mt: "5.86px",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: 'Inter, "Helvetica Neue", sans-serif',
              fontSize: "10.047px",
              fontStyle: "normal",
              fontWeight: 100,
              lineHeight: "12.558px",
              letterSpacing: "0.419px",
              textTransform: "uppercase",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: "inherit",
                fontSize: "inherit",
                fontStyle: "inherit",
                fontWeight: "inherit",
                lineHeight: "inherit",
                letterSpacing: "inherit",
                textTransform: "inherit",
              }}
            >
              {min} {unit}
            </Typography>

            <Typography
              component="span"
              sx={{
                fontFamily: "inherit",
                fontSize: "inherit",
                fontStyle: "inherit",
                fontWeight: "inherit",
                lineHeight: "inherit",
                letterSpacing: "inherit",
                textTransform: "inherit",
              }}
            >
              {max} {unit}
            </Typography>
          </Box>
        </Box>

        {/* N/A */}
        <Box>
          <Box
            sx={{
              height: "5.023px",
              width: "37.674px",
              bgcolor: "common.white",
              borderRadius: "16.744px",
              border: "0.419px solid",
              borderColor: "#CFD4DA",
            }}
          />

          <Box
            sx={{
              mt: "5.86px",
              display: "flex",
              justifyContent: "center",
              fontFamily: 'Inter, "Helvetica Neue", sans-serif',
              fontSize: "10.047px",
              fontStyle: "normal",
              fontWeight: 100,
              lineHeight: "12.558px",
              letterSpacing: "0.419px",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: "inherit",
                fontSize: "inherit",
                fontStyle: "inherit",
                fontWeight: "inherit",
                lineHeight: "inherit",
                letterSpacing: "inherit",
              }}
            >
              N/A
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GeomapLegend;
