import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import KPIIcon from "app/assets/vectors/RB_KPI.svg?react";
import InfoIcon from "@mui/icons-material/Info";
import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import TextIcon from "app/assets/vectors/RBText.svg?react";
import PaintBucketIcon from "app/assets/vectors/Paint_Bucket.svg?react";
import LayoutTemplateIcon from "app/assets/vectors/Layout_Template.svg?react";
import { PaddingSize } from "./layout";
import { Customise } from "./customise";
import { Options } from "../common/elementOptions";
import KPITextFormatting from "./text-format";
import { AssetSwitch } from "../grid/switchAsset";
import { useStoreState } from "app/state/store/hooks";
import { GridLayoutTab } from "../grid/gridTab";
import { ColumnLayoutTab } from "../column/columnTab";
import RadioCheck from "app/components/radio-check";
import ControllerTabs from "app/components/tabs";
import { extraTabs } from "../common/tabOptions";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

type KPIControllerTab = "text" | "style" | "layout" | "grid" | "column";
export default function KPIController() {
  const [value, setValue] = React.useState<KPIControllerTab>("text");
  const [isExpanded, setIsExpanded] = React.useState(true);
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const { selectedItem, editItem } = useGetReportItemState<"kpi_box">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

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
        return <KPITextFormatting source={selectedItem?.data?.source} />;
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

  const setSource = (source: "manual" | "dataset") => {
    if (!selectedItem) return;
    editItem({
      ...selectedItem,
      id: selectedController?.id || "",
      type: "kpi_box",
      open: selectedItem.open || false,
      data: {
        ...selectedItem.data,
        source,
      },
    });
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
            <KPIIcon />
            <Typography fontSize="16px" color="#000000" fontWeight={700}>
              Key Metrics Box
            </Typography>
          </Box>
          <Options />
        </Box>
        {selectedController?.parent?.id ? <AssetSwitch /> : null}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: "4px",
            border: "0.5px solid #98A1AA",
            overflow: "hidden",
            gap: "8px",
          }}
        >
          <Typography
            fontSize="14px"
            color="#000000"
            lineHeight="normal"
            fontWeight={700}
            sx={{
              backgroundColor: "#E9ECEF",
              padding: "10px 5px",
              borderRight: "0.5px solid #98A1AA",
              borderRadius: "4px 0 0 4px",
            }}
          >
            Source
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <RadioCheck
              checked={selectedItem?.data?.source === "manual"}
              onChange={() => setSource("manual")}
              label="Manual"
            />
            <RadioCheck
              checked={selectedItem?.data?.source === "dataset"}
              onChange={() => setSource("dataset")}
              label="Dataset"
            />
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: "8px",
            display: "flex",
            border: "0.5px dashed #0E8410",
            padding: "8px",
            gap: "6px",
            backgroundColor: "#E5F2E5",
            borderRadius: "4px",
            alignItems: "center",
          }}
        >
          <InfoIcon
            sx={{
              flexShrink: 0,
              fill: "#0E8410",
            }}
          />
          <Typography fontSize="14px" color="#000000" lineHeight="normal">
            {selectedItem?.data?.source === "dataset"
              ? "Pulls a number from a connected dataset. Updates automatically."
              : "Manual entry is a fixed value. Good for static reports."}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: isExpanded ? "block" : "none" }}>
        <Box>
          <ControllerTabs
            tabs={[
              ...extraTabs(selectedController?.parent?.type),
              {
                value: "text",
                icon: <TextIcon />,
                ariaLabel: "Text",
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
