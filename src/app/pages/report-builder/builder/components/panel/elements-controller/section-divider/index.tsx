import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import KPIIcon from "app/assets/vectors/RB_KPI.svg?react";

import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import PaintBucketIcon from "app/assets/vectors/Paint_Bucket.svg?react";
import LayoutTemplateIcon from "app/assets/vectors/Layout_Template.svg?react";
import { Options } from "../common/elementOptions";
import Layout from "./layout";
import Customise from "./customise";
import { useStoreState } from "app/state/store/hooks";
import ControllerTabs from "app/components/tabs";

type SectionDividerControllerTab = "customise" | "layout";
export default function SectionDividerController() {
  const [value, setValue] =
    React.useState<SectionDividerControllerTab>("layout");
  const [isExpanded, setIsExpanded] = React.useState(true);
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: SectionDividerControllerTab,
  ) => {
    setValue(newValue);
  };

  const renderTabPanel = () => {
    switch (value) {
      case "customise":
        return <Customise />;
      case "layout":
        return <Layout />;
      default:
        return null;
    }
  };

  return (
    <Box
      id="section-divider-controller"
      key={selectedItemController?.id}
      sx={{
        border: "1px solid #98A1AA",
        borderRadius: "4px",
        boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60);",
        bgcolor: "#F8F9FA",
        minWidth: "300px",
        maxWidth: "304px",
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
          <KPIIcon />
          <Typography fontSize="16px" color="#000000" fontWeight={700}>
            Section Divider
          </Typography>
        </Box>
        <Options />
      </Box>

      <Box sx={{ display: isExpanded ? "block" : "none" }}>
        <Box>
          <ControllerTabs
            tabs={[
              {
                value: "layout",
                icon: <LayoutTemplateIcon />,
                ariaLabel: "Layout",
              },
              {
                value: "customise",
                icon: <PaintBucketIcon />,
                ariaLabel: "Customise",
              },
            ]}
            value={value}
            handleChange={handleChange}
          />
        </Box>
        {renderTabPanel()}
      </Box>
    </Box>
  );
}
