import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import { FileTabView } from "app/pages/report-builder/builder/components/report-settings/file-tab";
import { SettingsTabView } from "app/pages/report-builder/builder/components/report-settings/settings-tab";

export const ReportBuilderPageReportSettings: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [value, setValue] = React.useState<"file" | "settings">("file");

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: "file" | "settings",
  ) => {
    setValue(newValue);
  };

  const renderTabPanel = () => {
    switch (value) {
      case "file":
        return <FileTabView />;
      case "settings":
        return <SettingsTabView />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        "& .MuiMenuItem-root": {
          gap: "10px",
          padding: "6px",
        },
      }}
    >
      <Box
        sx={{
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px ${isExpanded ? "solid" : "none"} #CFD4DA`,
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
            gap: "10px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontSize="16px" color="#000000" fontWeight={700}>
            Report Title
          </Typography>
          <IconButton onClick={handleExpandToggle}>
            {isExpanded ? <MinimizeIcon /> : <MaximizeIcon />}
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ display: isExpanded ? "block" : "none" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          sx={{
            "& .MuiTabs-indicator": {
              height: "2px",
              backgroundColor: "#0F62FE",
            },
            "& .MuiTab-root": {
              width: "50%",
              fontSize: "14px",
              padding: "11px 0",
              fontWeight: "normal",
              textTransform: "none",
              borderBottom: "2px solid #98A1AA",
              svg: {
                path: {
                  stroke: "#70777E",
                },
              },
            },
          }}
        >
          <Tab value="file" aria-label="file" label="File" />
          <Tab value="settings" aria-label="settings" label="Settings" />
        </Tabs>
        {renderTabPanel()}
      </Box>
    </Box>
  );
};
