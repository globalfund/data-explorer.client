import { Box, IconButton, Typography } from "@mui/material";
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
import { AssetSwitch } from "../grid/switchAsset";
import { GridLayoutTab } from "../grid/gridTab";
import { ColumnLayoutTab } from "../column/columnTab";
import { extraTabs } from "../common/tabOptions";
import ControllerTabs from "app/components/tabs";

type TextControllerTab = "font" | "style" | "layout" | "grid" | "column";
export default function TextController() {
  const [value, setValue] = React.useState<TextControllerTab>("font");
  const [isExpanded, setIsExpanded] = React.useState(true);
  const activeRTE = useStoreState((state) => state.RBReportRTEState.activeRTE);

  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

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
      case "grid":
        return <GridLayoutTab />;
      case "column":
        return <ColumnLayoutTab />;
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
      <Box sx={{ padding: "8px", borderBottom: "1px solid #CFD4DA" }}>
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
        {selectedController?.parent?.id ? <AssetSwitch /> : null}
      </Box>
      <Box sx={{ display: isExpanded ? "block" : "none" }}>
        <Box>
          <ControllerTabs
            tabs={[
              ...extraTabs(selectedController?.parent?.type),
              {
                value: "font",
                icon: <TypeIcon />,
                ariaLabel: "Text",
              },
              {
                value: "style",
                icon: <PaintBucketIcon />,
                ariaLabel: "Style",
              },
              {
                value: "layout",
                icon: <LayoutTemplateIcon />,
                ariaLabel: "Layout",
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
