import React from "react";
import { colors } from "app/theme";
import Link from "@mui/material/Link";

export const SkipToMainButton: React.FC = () => {
  return (
    <Link
      href="#main"
      tabIndex={0}
      aria-label="Skip to main content"
      sx={{
        left: 0,
        zIndex: 100,
        top: "-5000px",
        padding: "8px",
        background: "#000",
        position: "absolute",
        color: colors.primary.white + " !important",
        "&:focus": {
          top: 0,
        },
      }}
    >
      Skip to main
    </Link>
  );
};
