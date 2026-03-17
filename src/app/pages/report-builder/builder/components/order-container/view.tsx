import { Box } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const ViewModeContainer: React.FC<Props> = ({ children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        border: "0.5px solid transparent",
      }}
    >
      {children}
    </Box>
  );
};

export default ViewModeContainer;
