import React from "react";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";

interface DemoToggleProps {
  demoMode: boolean;
  setDemoMode: (value: boolean) => void;
}

export const DemoToggle: React.FC<DemoToggleProps> = ({
  demoMode,
  setDemoMode,
}) => {
  return (
    <Tooltip
      title={
        demoMode
          ? "Demo mode on, provides dummy responses and contains `/demo`. Click to use live API!"
          : "Talking to the live API — click to switch to demo mode"
      }
      placement="left"
    >
      <Chip
        label={`${demoMode ? "Demo" : "Live"} (click to toggle)`}
        size="small"
        onClick={() => setDemoMode(!demoMode)}
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 2,
          fontSize: 11,
          height: 22,
          cursor: "pointer",
          fontWeight: 600,
          letterSpacing: 0.3,
          bgcolor: demoMode ? "#fff8e1" : "#e8f5e9",
          color: demoMode ? "#8a6200" : "#265c38",
          border: `1px solid ${demoMode ? "#e8d08a" : "#90c9a0"}`,
          "& .MuiChip-label": { px: 1 },
          "&:hover": {
            bgcolor: demoMode ? "#fff3cd" : "#d4edda",
          },
        }}
      />
    </Tooltip>
  );
};
