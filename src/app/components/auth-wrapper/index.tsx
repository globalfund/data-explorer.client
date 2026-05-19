import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { appColors } from "app/theme";
import womanImage from "app/assets/images/woman.png";

interface AuthWrapperProps {
  title: string;
  description: string;
  descriptionWidth?: string;
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = (props) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        gap: "64px",
        alignItems: "stretch",
        justifyContent: "space-between",
        padding: "50px 0",
        "@media (max-width: 920px)": {
          gap: "40px",
          padding: "40px 0",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          flex: "1 1 50%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px",
          "@media (max-width: 920px)": {
            padding: 0,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "550px",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          <Typography
            component="h1"
            sx={{
              color: appColors.COMMON.BLACK,
              fontSize: "64px",
              fontWeight: 700,
              lineHeight: "normal",
              marginBottom: "16px",
              "@media (max-width: 767px)": {
                fontSize: "44px",
              },
            }}
          >
            {props.title}
          </Typography>
          <Typography
            sx={{
              width: "100%",
              maxWidth: props.descriptionWidth || "541px",
              margin: "0 auto",
              color: appColors.COMMON.BLACK,
              fontSize: "20px",
              lineHeight: "normal",
              "@media (max-width: 767px)": {
                fontSize: "16px",
              },
            }}
          >
            {props.description}
          </Typography>
        </Box>
        {props.children}
      </Box>

      <Box
        sx={{
          flex: "0 1 621px",
          minWidth: "420px",
          display: "flex",
          alignItems: "stretch",
          "@media (max-width: 920px)": {
            minWidth: 0,
            flexBasis: "auto",
          },
          "@media (max-width: 767px)": {
            display: "none",
          },
        }}
      >
        <Box
          component="img"
          src={womanImage}
          alt=""
          sx={{
            width: "100%",
            minHeight: "620px",
            maxHeight: "775px",
            objectFit: "cover",
            borderRadius: "18px",
            "@media (max-width: 920px)": {
              minHeight: "360px",
              maxHeight: "420px",
            },
          }}
        />
      </Box>
    </Box>
  );
};
