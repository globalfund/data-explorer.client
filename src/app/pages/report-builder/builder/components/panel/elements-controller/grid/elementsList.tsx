import React from "react";
import Box from "@mui/material/Box";
import { Typography, Button } from "@mui/material";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  RBReportItem,
  ReportItemOf,
} from "app/state/api/action-reducers/report-builder/sync";
import TextIcon from "./assets/TextIcon.svg?react";
import ChartIcon from "./assets/ChartIcon.svg?react";
import TableIcon from "./assets/TableIcon.svg?react";
import ImageIcon from "./assets/ImageIcon.svg?react";
import KPIIcon from "./assets/KPIIcon.svg?react";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { DEFAULT_TABLE_OPTIONS } from "app/pages/report-builder/builder/components/table/options";

export default function GridElementsList(props: { type: "grid" | "column" }) {
  const cmsData = useCMSData({ returnData: true });
  const [selectedElementType, setSelectedElementType] =
    React.useState<string>("");
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const editGridItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editGridItem,
  );

  const elements = [
    {
      type: "text",
      icon: TextIcon,
      name: "Text",
      description: "Add formatted text, titles, or paragraphs",
      nameKey: "componentTextOption",
      descriptionKey: "componentTextDescription",
    },
    {
      type: "chart",
      name: "Chart",
      description: "Visualize your data with bar, line, or pie charts",
      icon: ChartIcon,
      nameKey: "componentChartOption",
      descriptionKey: "componentChartDescription",
    },
    {
      type: "table",
      name: "Table",
      description: "Organize data in a grid with rows and columns.",
      icon: TableIcon,
      nameKey: "componentTableOption",
      descriptionKey: "componentTableDescription",
    },
    {
      type: "image",
      name: "Image",
      description: "Upload a logo, photo, or other graphic",
      icon: ImageIcon,
      nameKey: "componentImageOption",
      descriptionKey: "componentImageDescription",
    },
    {
      type: "kpi_box",
      name: "Key Metrics Box",
      description: "Highlight a single, important number, like a KPI or total",
      icon: KPIIcon,
      nameKey: "componentKeyMetricsBoxOption",
      descriptionKey: "componentKeyMetricsBoxDescription",
    },
  ];

  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find(
    (i) => i.id === selectedController?.parent?.id,
  ) as ReportItemOf<typeof props.type>;

  const selectedGridItem = selectedItem?.data?.items?.find(
    (i) => i?.id === selectedController?.id,
  );

  const handleApply = () => {
    if (!selectedItem || !selectedElementType) {
      if (selectedController?.type !== "unknown") {
        setSelectedController({
          open: true,
          type: selectedController?.type || "unknown",
          id: selectedController?.id || "",
          parent: {
            id: selectedController?.parent?.id || "",
            type: props.type,
            open: false,
          },
        });
      }
      return;
    }
    let newItem: Omit<RBReportItem, "id"> | null = null;
    switch (selectedElementType) {
      case "text":
        newItem = {
          type: "text",
          open: false,
          data: { rte: null },
          options: {
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            borderWidth: "0px",
            borderColor: "#98A1AA",
            borderRadius: "4px",
            borderStyle: "solid",
            backgroundColor: "#ffffff",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          },
        };
        break;
      case "chart":
        newItem = {
          type: "chart",
          open: false,
          options: {
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            borderWidth: "0px",
            borderColor: "#98A1AA",
            borderRadius: "4px",
            backgroundColor: "#ffffff",
            borderStyle: "solid",
            width: "100%",
            height: "100%",
            justifyContent: "start",
            orderList: ["title", "chart", "legend"],
          },
          data: {
            dataset: null,
            chartType: undefined,
            mapping: {},
          },
        };
        break;
      case "table":
        newItem = {
          type: "table",
          open: false,
          options: DEFAULT_TABLE_OPTIONS,
          data: {
            dataset: null,
            columns: [],
          },
        };
        break;
      case "image":
        newItem = {
          type: "image",
          open: false,
          options: {
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            borderStyle: "solid",
            width: "100%",
            height: "100%",
            imgOpacity: 1,
            imgBorderWidth: "0px",
            imgBorderColor: "#98A1AA",
            imgBorderRadius: "0px",
            imgBackgroundColor: "#ffffff",
            sizingMode: "fit-proportional",
            enableCrop: true,
          },
          data: {
            src: "",
            cropCoordinates: {
              left: 0,
              top: 0,
              width: 1000,
              height: 1000,
            },
            transformCoordinates: {
              scale: 1,
              positionX: 0,
              positionY: 0,
            },
          },
        };
        break;
      case "section_divider":
        newItem = {
          type: "section_divider",
          open: false,
          data: null,
          options: {
            paddingLeft: "10px",
            paddingTop: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            width: "100%",
            borderWidth: "1px",
            borderRadius: "1px",
            borderColor: "#373D43",
            borderStyle: "solid",
            strokeLinecap: "round",
          },
        };
        break;
      case "kpi_box":
        newItem = {
          type: "kpi_box",
          open: false,
          data: {
            topLabel: {
              value: "Top Label",
              fontFamily: "Arial",
              fontWeightLabel: "400",
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "14px",
              color: "#70777E",
              bgColor: "#ffffff00",
              enabled: true,
            },
            bigNumberText: {
              value: "BN",
              fontFamily: "Arial",
              fontWeight: "700",
              fontWeightLabel: "400",
              fontStyle: "normal",
              fontSize: "44px",
              color: "#000000",
              bgColor: "#ffffff",
              enabled: true,
            },
            bottomLabel: {
              value: "Bottom Label",
              fontFamily: "Arial",
              fontWeightLabel: "400",
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "16px",
              color: "#70777E",
              bgColor: "#ffffff",
              enabled: true,
            },
            optionalText: {
              value: "Optional Text",
              fontFamily: "Arial",
              fontWeightLabel: "400",
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "14px",
              color: "#70777E",
              bgColor: "#ffffff",
              enabled: true,
            },
            dataset: null,
            datasetColumn: null,
            source: "manual",
            aggregation: "sum",
          },
          options: {
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "10px",
            borderWidth: "0.5px",
            borderColor: "#98A1AA",
            borderRadius: "4px",
            backgroundColor: "#ffffff",
            borderStyle: "solid",
            width: "100%",
            height: "100%",
            justifyContent: "start",
            alignVertical: "middle",
            alignHorizontal: "left",
            innerLine: {
              type: "line",
              borderWidth: "0.5px",
              borderColor: "#98A1AA",
            },
          },
        };
        break;
      default:
        break;
    }
    if (!newItem) return;

    editGridItem({
      gridId: selectedItem.id,
      item: {
        ...newItem,
        id: selectedController?.id || "",
        options: {
          ...newItem.options,
          ...selectedGridItem?.options,
        },
      } as RBReportItem,
    });
    setSelectedController({
      open: true,
      type: newItem.type,
      id: selectedController?.id || "",
      parent: {
        id: selectedController?.parent?.id || "",
        type: props.type,
        open: false,
      },
    });
  };

  const handleBack = () => {
    setSelectedController({
      open: true,
      type: selectedController?.type || "unknown",
      id: selectedController?.id || "",
      parent: {
        id: selectedController?.parent?.id || "",
        type: props.type,
        open: false,
      },
    });
  };

  const selectedType = selectedElementType || selectedController?.type;

  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        flexDirection: "column",
        padding: "8px",
        paddingBottom: "0px",
        maxHeight: "600px",
        overflowY: "auto",
        paddingRight: "4px",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#000",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#D9D9D9",
        },
      }}
    >
      <Typography color="#000" fontSize="14px">
        {getCMSDataField(
          cmsData,
          "componentsRBGridElementsList.selectComponentForBox",
          "Select Component for Box",
        )}{" "}
        {(selectedItem?.data?.items?.findIndex(
          (i) => i?.id === selectedController?.id,
        ) || 0) + 1}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {elements.map((item) => (
          <Box
            onClick={() => setSelectedElementType(item.type)}
            key={item.type}
            sx={{
              display: "flex",
              height: "61px",
              border: "0.5px solid #ADB5BD",
              bgcolor: item.type === selectedType ? "#EFF1FE" : "#fff",
              borderColor: item.type === selectedType ? "#3154F4" : "#ADB5BD",
              borderRadius: "4px",
              cursor: "pointer",
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
                width: "40px",
                borderTopLeftRadius: "4px",
                borderBottomLeftRadius: "4px",
              }}
            >
              <item.icon />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                gap: "2px",
                paddingTop: "4px",
                paddingLeft: "8px",
              }}
            >
              <Typography
                fontSize={"14px"}
                color={"#000"}
                fontWeight={700}
                lineHeight={"normal"}
              >
                {getCMSDataField(
                  cmsData,
                  `componentsRBComponentOptions.${item.nameKey}`,
                  item.name,
                )}
              </Typography>
              <Typography
                fontSize={"14px"}
                color={"#373D43"}
                lineHeight={"normal"}
              >
                {getCMSDataField(
                  cmsData,
                  `componentsRBGridElementsList.${item.descriptionKey}`,
                  item.description,
                )}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "0.5px solid #98A1AA",
          padding: "8px 0",
          position: "sticky",
          bottom: 0,
          background: "#F8F9FA",
        }}
      >
        <Button
          onClick={() => {
            handleBack();
          }}
          sx={{
            width: "71px",
            height: "35px",
            borderRadius: "4px",
            border: "1px solid #CFD4DA",
            bgcolor: "#fff",
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            textTransform: "none",
          }}
        >
          {getCMSDataField(
            cmsData,
            "componentsRBGridElementsList.backButton",
            "Back",
          )}
        </Button>
        <Button
          disabled={!selectedType}
          onClick={handleApply}
          sx={{
            width: "71px",
            height: "35px",
            borderRadius: "4px",
            bgcolor: "#3154F4",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            textTransform: "none",
            //disabled styles
            "&.Mui-disabled": {
              color: "#FFFFFF",
              cursor: "not-allowed",
            },
          }}
        >
          {getCMSDataField(
            cmsData,
            "componentsRBGridElementsList.applyButton",
            "Apply",
          )}
        </Button>
      </Box>
    </Box>
  );
}
