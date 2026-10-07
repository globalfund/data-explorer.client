import { Box } from "@mui/material";
import React from "react";
import ColumnIcon from "app/assets/vectors/RBColumn.svg?react";
import { useStoreState } from "app/state/store/hooks";
import GridElementsList from "../grid/elementsList";
import PanelHeader from "../../panel-header";

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
        <PanelHeader
          isExpanded={isExpanded}
          handleExpandToggle={handleExpandToggle}
          name="Column"
          icon={<ColumnIcon />}
          sx={{
            padding: "8px",
            borderBottom: "1px solid #CFD4DA",
          }}
        />
        <Box sx={{ display: isExpanded ? "block" : "none" }}>
          <GridElementsList type="column" />
        </Box>
      </Box>
    </Box>
  );
}
