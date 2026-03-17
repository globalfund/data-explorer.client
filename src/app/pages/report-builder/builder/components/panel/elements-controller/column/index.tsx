import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import ColumnIcon from "app/assets/vectors/RBColumn.svg?react";
import { Options } from "../common/elementOptions";

import { useStoreState } from "app/state/store/hooks";
import GridElementsList from "../grid/elementsList";

export default function ColumnController() {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      id="grid-controller"
      key={selectedController?.id}
      sx={{
        minWidth: "300px",
        maxWidth: "max-content",
      }}
    >
      <Box
        sx={{
          border: "1px solid #98A1AA",
          borderRadius: "4px",
          boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60);",
          bgcolor: "#F8F9FA",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "304px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "50px",
            padding: "8px",
            borderBottom: "1px solid #CFD4DA",
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
          }}
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
            <ColumnIcon />
            <Typography fontSize="16px" color="#000000" fontWeight={700}>
              Column
            </Typography>
          </Box>
          <Options />
        </Box>
        <Box sx={{ display: isExpanded ? "block" : "none" }}>
          <GridElementsList type="column" />
        </Box>
      </Box>
    </Box>
  );
}
