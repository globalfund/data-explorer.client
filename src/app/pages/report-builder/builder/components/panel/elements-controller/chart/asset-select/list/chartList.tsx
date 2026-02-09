import React from "react";
import Box from "@mui/material/Box";
import { Typography, Button } from "@mui/material";
import { chartTypes } from "../../../../../chart/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ChartType } from "app/state/api/action-reducers/report-builder/sync";
import { getDefaultVisualOptions } from "../../utils";

export default function ChartList() {
  const [selectedChartType, setSelectedChartType] = React.useState<string>("");
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const item = items.find((i) => i.id === selectedController?.id);

  const handleApply = () => {
    if (!item || !selectedChartType) return;
    const chartTypeUnchanged =
      item?.extra?.chart?.chartType === selectedChartType;
    editItem({
      ...item,
      id: selectedController?.id || "",
      type: "chart",
      extra: {
        ...item?.extra,
        chart: {
          ...item?.extra?.chart,
          mapping: chartTypeUnchanged ? item?.extra?.chart?.mapping : {},
          chartType: selectedChartType as ChartType,
          visualOptions: chartTypeUnchanged
            ? item?.extra?.chart?.visualOptions
            : getDefaultVisualOptions(selectedChartType),
          appliedFilters: chartTypeUnchanged
            ? item?.extra?.chart?.appliedFilters
            : {},
        },
      },
    });

    handleBack();
  };

  const handleBack = () => {
    if (!selectedController) return;
    setSelectedController({
      ...selectedController,
      extra: {
        chart: {
          listToDisplay: null,
        },
      },
    });
  };

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
        Select Chart Type
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {chartTypes.map((item) => (
          <Box
            onClick={() => setSelectedChartType(item.id)}
            key={item.id}
            sx={{
              display: "flex",
              height: "61px",
              border: "0.5px solid #ADB5BD",
              borderColor:
                item.id === selectedChartType ? "#3154F4" : "#ADB5BD",
              borderRadius: "4px",
              background: "#FFFFFF",
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
              {item.icon}
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
                {item.chartType}
              </Typography>
              <Typography
                fontSize={"14px"}
                color={"#373D43"}
                lineHeight={"normal"}
              >
                {item.description}
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
          onClick={() => handleBack()}
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
          Back
        </Button>
        <Button
          disabled={!selectedChartType}
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
          Apply
        </Button>
      </Box>
    </Box>
  );
}
