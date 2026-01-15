import { Box, Button } from "@mui/material";
import React from "react";

interface Props {
  tabs: {
    value: string;
    label: string;
    icon?: React.ReactNode;
    testId?: string;
  }[];
  handleSwitch: (key: any) => void;
  activeTab: string;
}
export default function Tabs(props: Readonly<Props>) {
  const currentIndex = props.tabs.findIndex(
    (tab) => tab.value === props.activeTab,
  );
  const [activeIndex, setActiveIndex] = React.useState(currentIndex);
  const handleTabSwitch = (key: string, index: number) => {
    setActiveIndex(index);
    props.handleSwitch(key);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 2px",
        gap: "8px",
        position: "relative",
        width: "100%",
        height: "28px",
        borderRadius: "5px",
        background: "rgba(255, 255, 255, 0.00)",
        backgroundBlendMode: "multiply",
        boxShadow: "1px 1px 4px 0 rgba(0, 0, 0, 0.25) inset",
      }}
    >
      {props.tabs.map((tab, index) => (
        <Button
          key={tab.value}
          onClick={() => handleTabSwitch(tab.value, index)}
          data-cy={tab.testId}
          sx={{
            background: "transparent",
            textTransform: "none",
            fontWeight: props.activeTab === tab.value ? "bold" : "medium",
            color: props.activeTab === tab.value ? "white" : "#231D2C",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {tab.icon ? tab.icon : null} {tab.label}
        </Button>
      ))}

      <Box
        sx={{
          position: "absolute",
          background: "#231d2c",
          borderRadius: "5px",
          height: "calc(100% - 4px)",
          transformBox: "fill-box",
          width: `calc(100% / ${props.tabs.length} - 2px)`,
          left: "2px",
          top: "2px",
          transform:
            activeIndex === 0
              ? "translateX(0%)"
              : `translateX(${activeIndex * 100}%)`,
          transition: "transform 0.3s, width 0.3s",
        }}
      />
    </Box>
  );
}
