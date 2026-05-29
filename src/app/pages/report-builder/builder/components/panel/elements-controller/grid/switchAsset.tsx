import Box from "@mui/material/Box";
import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowUpDown from "app/assets/vectors/ArrowUpDown.svg?react";

import { useStoreActions, useStoreState } from "app/state/store/hooks";
import TextIcon from "./assets/TextIcon.svg?react";
import ChartIcon from "./assets/ChartIcon.svg?react";
import TableIcon from "./assets/TableIcon.svg?react";
import ImageIcon from "./assets/ImageIcon.svg?react";
import KPIIcon from "./assets/KPIIcon.svg?react";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export function AssetSwitch() {
  const cmsData = useCMSData({ returnData: true });
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const elements = [
    {
      type: "text",
      icon: <TextIcon />,
      name: "Text",
      nameKey: "componentTextOption",
    },
    {
      type: "chart",
      name: "Chart",
      icon: <ChartIcon />,
      nameKey: "componentChartOption",
    },
    {
      type: "table",
      name: "Table",
      icon: <TableIcon />,
      nameKey: "componentTableOption",
    },
    {
      type: "image",
      name: "Image",
      icon: <ImageIcon />,
      nameKey: "componentImageOption",
    },
    {
      type: "kpi_box",
      name: "Key Metrics Box",
      icon: <KPIIcon />,
      nameKey: "componentKeyMetricsBoxOption",
    },
  ];
  const selectedItem = elements.find(
    (element) => element.type === selectedController?.type,
  );

  return (
    <Box
      sx={{
        display: "flex",
        maxHeight: "65px",
        minHeight: "40px",
        border: "0.5px solid #ADB5BD",
        borderRadius: "4px",
        background: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          background: "#F1F3F5",
          borderRight: "0.5px solid #ADB5BD",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 8px",
          borderTopLeftRadius: "4px",
          borderBottomLeftRadius: "4px",
        }}
      >
        {selectedItem?.icon}
      </Box>

      <Button
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 8px",
          svg: {
            flexShrink: 0,
          },
          textTransform: "none",
          fontSize: "14px",
        }}
        onClick={() => {
          if (selectedController) {
            setSelectedController({
              ...selectedController,
              parent: {
                ...selectedController.parent,
                open: true,
                id: selectedController?.parent?.id || "",
                type: selectedController?.parent?.type || "grid",
              },
            });
          }
        }}
      >
        <Typography>
          {getCMSDataField(
            cmsData,
            `componentsRBComponentOptions.${selectedItem?.nameKey}`,
            selectedItem?.name || "",
          )}
        </Typography>
        <ArrowUpDown />
      </Button>
    </Box>
  );
}
