import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import { Box, IconButton, Typography, SxProps, Theme } from "@mui/material";
import { Options } from "../elements-controller/common/elementOptions";

interface PanelHeaderProps {
  isExpanded: boolean;
  handleExpandToggle: () => void;
  name: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const PanelHeader = ({
  isExpanded,
  handleExpandToggle,
  name,
  icon,
  sx,
}: PanelHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "50px",
        ".MuiIconButton-root": {
          backgroundColor: "#FFFFFF",
          borderRadius: "4px",
          border: "1px solid #CFD4DA",
          width: "34px",
          height: "34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ...sx,
      }}
      className="panel-drag-handle"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <IconButton onClick={handleExpandToggle}>
          {isExpanded ? <MinimizeIcon /> : <MaximizeIcon />}
        </IconButton>
        {icon}
        <Typography fontSize="16px" color="#000000" fontWeight={700}>
          {name}
        </Typography>
      </Box>
      <Options />
    </Box>
  );
};

export default PanelHeader;
