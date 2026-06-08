import React from "react";
import { Tab, Tabs } from "@mui/material";

interface ControllerTab {
  value: string;
  icon: JSX.Element;
  sx?: object;
  ariaLabel: string;
}

interface ControllerTabsProps {
  tabs?: ControllerTab[];
  value?: any;
  handleChange?: (event: React.SyntheticEvent, newValue: any) => void;
}

const ControllerTabs: React.FC<ControllerTabsProps> = ({
  tabs = [],
  value,
  handleChange,
}) => {
  return (
    <Tabs
      value={value}
      onChange={handleChange}
      textColor="secondary"
      indicatorColor="primary"
      aria-label="secondary tabs example"
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "40px",
        "& .MuiTabs-flexContainer": { width: "100%", gap: "1px" },
        "& .MuiTab-root": {
          flex: 1,
          maxWidth: "none",
          minWidth: "30px",
          padding: "8px 12px",
          minHeight: "40px",
        },
        "& .MuiTabs-indicator": {
          backgroundColor: "#0F62FE",
          height: "2px",
        },
        svg: {
          flexShrink: 0,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          aria-label={tab.ariaLabel}
          sx={{
            borderBottom: "2px solid #98A1AA",
            svg: {
              path: {
                stroke: "#373D43",
              },
            },
            ...tab.sx,
          }}
          icon={tab.icon}
        />
      ))}
    </Tabs>
  );
};

export default ControllerTabs;
