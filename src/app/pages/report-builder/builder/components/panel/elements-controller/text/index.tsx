import { Box, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import LetterTextIcon from "app/assets/vectors/Letter_Text.svg?react";
import TypeIcon from "app/assets/vectors/Type.svg?react";
import PaintBucketIcon from "app/assets/vectors/Paint_Bucket.svg?react";
import LayoutTemplateIcon from "app/assets/vectors/Layout_Template.svg?react";
import { useStoreState } from "app/state/store/hooks";
import StyleTab from "./border-fill-tab";
import LayoutTab from "./padding-size-tab";
import { Options } from "../common/elementOptions";
import { RTEToolbar } from "./font-style-tab";

type TextControllerTab = "font" | "style" | "layout";
export default function TextController() {
  const [value, setValue] = React.useState<TextControllerTab>("font");
  const [isExpanded, setIsExpanded] = React.useState(true);
  const activeRTE = useStoreState((state) => state.RBReportRTEState.activeRTE);

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: TextControllerTab,
  ) => {
    setValue(newValue);
  };

  const renderTabPanel = () => {
    switch (value) {
      case "font":
        return <Box>{<RTEToolbar editor={activeRTE!} />}</Box>;
      case "style":
        return <StyleTab />;
      case "layout":
        return <LayoutTab />;
      default:
        return null;
    }
  };

  return (
    <Box
      id="rte-toolbar"
      sx={{
        minWidth: "300px",
        maxWidth: "304px",
        border: "1px solid #98A1AA",
        borderRadius: "4px",
        boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60);",
        bgcolor: "#F8F9FA",
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
          <LetterTextIcon />
          <Typography fontSize="16px" color="#000000" fontWeight={700}>
            Text
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
              value="font"
              aria-label="Text"
              sx={{ borderBottom: "2px solid #98A1AA" }}
              icon={<TypeIcon />}
            />
            <Tab
              value="style"
              aria-label="Style"
              icon={<PaintBucketIcon />}
              sx={{ borderBottom: "2px solid #98A1AA", marginLeft: "8px" }}
            />
            <Tab
              value="layout"
              aria-label="Layout"
              icon={<LayoutTemplateIcon />}
              sx={{ borderBottom: "2px solid #98A1AA", marginLeft: "8px" }}
            />
          </Tabs>
        </Box>
        {renderTabPanel()}
      </Box>
    </Box>
  );
}
