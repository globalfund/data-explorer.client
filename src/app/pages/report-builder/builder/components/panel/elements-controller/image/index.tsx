import { Box } from "@mui/material";
import React from "react";
import UploadIcon from "app/assets/vectors/RBUpload.svg?react";
import ImageIcon from "app/assets/vectors/RBImage.svg?react";
import PaintBucketIcon from "app/assets/vectors/Paint_Bucket.svg?react";
import LayoutTemplateIcon from "app/assets/vectors/Layout_Template.svg?react";
import { ImageSource } from "./image-source";
import { PaddingSize } from "./padding-size";
import { Customise } from "./customise";
import { useStoreState } from "app/state/store/hooks";
import { AssetSwitch } from "../grid/switchAsset";
import { GridLayoutTab } from "../grid/gridTab";
import { ColumnLayoutTab } from "../column/columnTab";
import { extraTabs } from "../common/tabOptions";
import ControllerTabs from "app/components/tabs";
import PanelHeader from "../../panel-header";

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

  React.useEffect(() => {
    if (selectedItemController?.parent?.type === "grid") {
      setValue("grid");
    } else if (selectedItemController?.parent?.type === "column") {
      setValue("column");
    } else {
      setValue("source");
    }
  }, [selectedItemController?.id]);

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
        <PanelHeader
          isExpanded={isExpanded}
          handleExpandToggle={handleExpandToggle}
          name="Image"
          icon={<ImageIcon />}
        />
        {selectedItemController?.parent?.id ? <AssetSwitch /> : null}
      </Box>
      <Box sx={{ display: isExpanded ? "block" : "none" }}>
        <Box>
          <ControllerTabs
            tabs={[
              ...extraTabs(selectedItemController?.parent?.type),
              {
                value: "source",
                icon: <UploadIcon />,
                ariaLabel: "Source",
              },
              {
                value: "layout",
                icon: <LayoutTemplateIcon />,
                ariaLabel: "Layout",
              },
              {
                value: "style",
                icon: <PaintBucketIcon />,
                ariaLabel: "Style",
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
