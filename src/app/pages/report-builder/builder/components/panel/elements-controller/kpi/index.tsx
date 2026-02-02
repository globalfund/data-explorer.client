import { Box, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import KPIIcon from "app/assets/vectors/RB_KPI.svg?react";

import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import UploadIcon from "app/assets/vectors/RBUpload.svg?react";
import PaintBucketIcon from "app/assets/vectors/Paint_Bucket.svg?react";
import LayoutTemplateIcon from "app/assets/vectors/Layout_Template.svg?react";
import { PaddingSize } from "./layout";
import { Customise } from "./customise";
import { Options } from "../common/elementOptions";
import KPITextFormatting from "./text-format";

type KPIControllerTab = "text" | "style" | "layout";
export default function KPIController() {
  const [value, setValue] = React.useState<KPIControllerTab>("text");
  const [isExpanded, setIsExpanded] = React.useState(true);

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: KPIControllerTab,
  ) => {
    setValue(newValue);
  };

  const renderTabPanel = () => {
    switch (value) {
      case "text":
        return <KPITextFormatting />;
      case "style":
        return <Customise />;
      case "layout":
        return <PaddingSize />;
      default:
        return null;
    }
  };

  return (
    <Box
      id="kpi-controller"
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
            Big Number Chart
          </Typography>
        </Box>
        <Options />
      </Box>

      <Box sx={{ display: isExpanded ? "block" : "none" }}>
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="primary"
            aria-label="secondary tabs example"
            sx={{
              gap: "8px",
              display: "flex",
              "& .MuiTabs-indicator": {
                backgroundColor: "#0F62FE",
                height: "2px",
              },
            }}
          >
            <Tab
              value="text"
              aria-label="Text"
              sx={{ borderBottom: "2px solid #98A1AA" }}
              icon={<UploadIcon />}
            />
            <Tab
              value="layout"
              aria-label="Layout"
              icon={<LayoutTemplateIcon />}
              sx={{ borderBottom: "2px solid #98A1AA", marginLeft: "8px" }}
            />
            <Tab
              value="style"
              aria-label="Style"
              icon={<PaintBucketIcon />}
              sx={{ borderBottom: "2px solid #98A1AA", marginLeft: "8px" }}
            />
          </Tabs>
        </Box>
        {renderTabPanel()}
      </Box>
    </Box>
  );
}
