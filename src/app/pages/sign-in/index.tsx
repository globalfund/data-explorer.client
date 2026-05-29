import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { useTitle } from "react-use";
import Typography from "@mui/material/Typography";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { appColors } from "app/theme";
import { AuthInput, AuthPasswordInput } from "app/components/auth-input";
import { AuthWrapper } from "app/components/auth-wrapper";
import AppleLogo from "app/assets/vectors/AppleLogo.svg?react";
import GoogleLogo from "app/assets/vectors/GoogleLogo.svg?react";

const primaryButtonSx = {
  height: "48px",
  marginTop: "24px",
  borderRadius: "4px",
  background: "#3154F4",
  color: appColors.COMMON.WHITE,
  fontSize: "16px",
  fontWeight: 400,
  textTransform: "none",
  "&:hover": {
    background: "#2446DC",
  },
};

const socialButtonSx = {
  height: "48px",
  borderRadius: "4px",
  color: appColors.COMMON.BLACK,
  fontSize: "16px",
  fontWeight: 400,
  textTransform: "none",
  borderColor: "#98A1AA",
};

const dividerSx = {
  flex: 1,
  height: "1px",
  background: "#DFE3E6",
};

export const SignIn: React.FC = () => {
  useTitle("The Data Explorer - Sign In");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <Helmet>
        <link rel="canonical" href={`${window.location.origin}/sign-in`} />
      </Helmet>
      <AuthWrapper
        title="Welcome Back!"
        description="Log in to access the Data Explorer reporting tool and help tell the story of global health impact."
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: "401px",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <AuthInput
              id="email"
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              placeholder="janedoe@gmail.com"
            />
            <AuthPasswordInput
              id="password"
              name="password"
              label="Password"
              autoComplete="current-password"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <Box
              component="label"
              sx={{
                gap: "8px",
                display: "flex",
                cursor: "pointer",
                alignItems: "center",
                color: "#373D43",
                fontSize: "16px",
              }}
            >
              <Box
                component="input"
                type="checkbox"
                sx={{
                  appearance: "none",
                  width: "14px",
                  height: "14px",
                  margin: "0 3px",
                  border: "1.5px solid #373D43",
                  borderRadius: "1px",
                  background: appColors.COMMON.WHITE,
                  cursor: "pointer",
                  "&:checked": {
                    background: "#3154F4",
                    borderColor: "#3154F4",
                  },
                }}
              />
              Remember me
            </Box>
            <Link
              href="#"
              underline="always"
              sx={{
                color: "#373D43",
                fontSize: "16px",
                whiteSpace: "nowrap",
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            disableElevation
            sx={primaryButtonSx}
          >
            Sign In
          </Button>

          <Box
            sx={{
              gap: "16px",
              display: "flex",
              alignItems: "center",
              marginTop: "24px",
            }}
          >
            <Box sx={dividerSx} />
            <Typography
              sx={{ color: "#373D43", fontSize: "16px", whiteSpace: "nowrap" }}
            >
              Or login with
            </Typography>
            <Box sx={dividerSx} />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            <Button
              variant="outlined"
              sx={socialButtonSx}
              startIcon={<GoogleLogo width={18} height={18} />}
            >
              Google
            </Button>
            <Button
              variant="outlined"
              sx={socialButtonSx}
              startIcon={<AppleLogo width={14} height={17} />}
            >
              Apple
            </Button>
          </Box>

          <Typography
            sx={{
              color: "#373D43",
              fontSize: "16px",
              marginTop: "24px",
              textAlign: "center",
            }}
          >
            New to the Data Explorer?{" "}
            <Link
              component={RouterLink}
              to="/sign-up"
              underline="none"
              sx={{ color: "#3154F4", fontWeight: 700 }}
            >
              Create an account
            </Link>
          </Typography>
        </Box>
      </AuthWrapper>
    </React.Fragment>
  );
};
