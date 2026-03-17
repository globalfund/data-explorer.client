import { Box, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import UploadIcon from "app/assets/vectors/RBUpload.svg?react";
import ImageIcon from "app/assets/vectors/RBImage.svg?react";
import PaintBucketIcon from "app/assets/vectors/Paint_Bucket.svg?react";
import LayoutTemplateIcon from "app/assets/vectors/Layout_Template.svg?react";
import { ImageSource } from "./image-source";
import { PaddingSize } from "./padding-size";
import { Customise } from "./customise";
import { Options } from "../common/elementOptions";
import { useStoreState } from "app/state/store/hooks";
import { AssetSwitch } from "../grid/switchAsset";
import { GridLayoutTab } from "../grid/gridTab";
import { ColumnLayoutTab } from "../column/columnTab";
import { ColumnOptionIcon, GridOptionIcon } from "../../../toolbar/data";

type ImageControllerTab = "source" | "style" | "layout" | "grid" | "column";
export default function ImageController() {
  const [value, setValue] = React.useState<ImageControllerTab>("source");
  const [isExpanded, setIsExpanded] = React.useState(true);
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };
  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: ImageControllerTab,
  ) => {
    setValue(newValue);
  };

  const renderTabPanel = () => {
    switch (value) {
      case "source":
        return <ImageSource />;
      case "style":
        return <Customise />;
      case "layout":
        return <PaddingSize />;
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
      id="image-controller"
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
          padding: "8px",
          borderBottom: "1px solid #CFD4DA",
        }}
      >
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
            <ImageIcon />
            <Typography fontSize="16px" color="#000000" fontWeight={700}>
              Image
            </Typography>
          </Box>
          <Options />
        </Box>
        {selectedItemController?.parent?.id ? <AssetSwitch /> : null}
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
              width: "100%",
              "& .MuiTabs-flexContainer": { width: "100%", gap: "8px" },
              "& .MuiTab-root": { flex: 1, maxWidth: "none" },
              "& .MuiTabs-indicator": {
                backgroundColor: "#0F62FE",
                height: "2px",
              },
            }}
          >
            {selectedItemController?.parent?.type === "grid" ? (
              <Tab
                value="grid"
                aria-label="Grid"
                sx={{ borderBottom: "2px solid #98A1AA" }}
                icon={<GridOptionIcon />}
              />
            ) : selectedItemController?.parent?.type === "column" ? (
              <Tab
                value="column"
                aria-label="Column"
                sx={{ borderBottom: "2px solid #98A1AA" }}
                icon={<ColumnOptionIcon />}
              />
            ) : null}
            <Tab
              value="source"
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
