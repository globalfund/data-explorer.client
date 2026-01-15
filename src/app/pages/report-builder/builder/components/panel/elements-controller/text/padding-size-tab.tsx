import { Box, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import CustomTextField from "../common/textField";
import React from "react";

export default function LayoutTab() {
  return (
    <Box sx={{ padding: "8px" }}>
      <Typography fontWeight={700} marginBottom={"16px"}>
        Padding
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "8px",
          ".MuiInputBase-root": {
            "&:before": {
              borderBottom: "none",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "8px",
                svg: {
                  transform: "rotate(90deg)",
                },
              }}
            >
              <Direction />
              <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                Left
              </Typography>
            </Box>
            <CustomTextField type="paddingLeft" item="text" />
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "8px",
                svg: {
                  transform: "rotate(180deg)",
                },
              }}
            >
              <Direction />
              <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                Top
              </Typography>
            </Box>
            <CustomTextField type="paddingTop" item="text" />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "8px",
                svg: {
                  transform: "rotate(270deg)",
                },
              }}
            >
              <Direction />
              <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                Right
              </Typography>
            </Box>
            <CustomTextField type="paddingRight" item="text" />
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "8px",
              }}
            >
              <Direction />
              <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                Bottom
              </Typography>
            </Box>
            <CustomTextField type="paddingBottom" item="text" />
          </Box>
        </Box>

        <Box>
          <Typography fontWeight={700} marginBottom={"8px"}>
            Size
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px" }}
                marginBottom={"8px"}
              >
                Width
              </Typography>
              <CustomTextField type="width" item="text" />
            </Box>

            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px" }}
                marginBottom={"8px"}
              >
                Height
              </Typography>
              <CustomTextField type="height" item="text" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
