import { Box, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect } from "react";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import ChartIcon from "app/assets/vectors/RBChart.svg?react";
import { Options } from "../common/elementOptions";
import { chartInfo, tabList } from "./data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import DataDetail from "./dataDetail";
import Mapping from "./mapping";
import Filtering from "./filtering";
import LayoutTab from "./layout";
import Customise from "./customise";
import Advanced from "./advanced";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import { AssetSwitch } from "../grid/switchAsset";
import { GridLayoutTab } from "../grid/gridTab";
import { ColumnLayoutTab } from "../column/columnTab";
import { ColumnOptionIcon, GridOptionIcon } from "../../../header/data";
import ChartSelectModal from "app/pages/report-builder/builder/components/chart-select-modal";
import { DatasetSelectModal } from "../../../dataset-select-modal";
import { AssetSelect } from "../common/asset-select";
import { chartTypes, datasetItems } from "../../../chart/data";
import { ChartProperty } from "app/state/api/action-reducers/report-builder/sync";

type ChartControllerTab =
  | "mapping"
  | "filter"
  | "layout"
  | "style"
  | "advanced"
  | "grid"
  | "column";

export default function ChartController() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [value, setValue] = React.useState<ChartControllerTab>("mapping");

  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const { selectedItem: item, editItem } = useGetReportItemState<"chart">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const chartExtra = selectedController?.extra?.chart || {};

  const chartData = item?.data || {};

  const chartConfigured = item?.data?.dataset && item?.data?.chartType;

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: ChartControllerTab,
  ) => {
    setValue(newValue);
  };

  const renderTabPanel = () => {
    switch (value) {
      case "mapping":
        return <Mapping />;
      case "filter":
        return <Filtering />;
      case "layout":
        return <LayoutTab />;
      case "style":
        return <Customise />;
      case "advanced":
        return <Advanced />;
      case "grid":
        return <GridLayoutTab />;
      case "column":
        return <ColumnLayoutTab />;
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (!selectedController) return;
    setSelectedController({
      ...selectedController,
      extra: {
        ...selectedController?.extra,
        chart: {
          listToDisplay: null,
        },
      },
    });
  };

  const handleApply = (selectedDataset: string) => {
    if (!item || !selectedDataset) return;
    const datasetUnchanged = item?.data?.dataset === selectedDataset;
    editItem({
      ...item,
      id: selectedController?.id || "",
      type: "chart",
      data: {
        ...item?.data,
        dataset: selectedDataset,
        mapping: datasetUnchanged ? item?.data?.mapping : {},
        appliedFilters: datasetUnchanged ? item?.data?.appliedFilters : {},
      },
    });
    handleBack();
  };

  const getSelectedItem = (type: "chartType" | "dataset") => {
    if (type === "chartType") {
      const chartTypeId = chartData[type];
      const chartType = chartTypes.find((chart) => chart.id === chartTypeId);
      return chartType ? chartType.chartType : "";
    } else if (type === "dataset") {
      return (
        datasetItems.find((dataset) => dataset.id === chartData.dataset)
          ?.name || ""
      );
    }
    return chartExtra?.[type] || "";
  };

  const extraTabs = [
    ...(selectedController?.parent?.type === "grid"
      ? [
          {
            value: "grid" as ChartControllerTab,
            ariaLabel: "Grid",
            icon: <GridOptionIcon />,
            sx: {
              borderBottom: "2px solid #98A1AA",
              svg: {
                path: {
                  stroke: "#70777E",
                },
              },
            },
          },
        ]
      : []),
    ...(selectedController?.parent?.type === "column"
      ? [
          {
            value: "column" as ChartControllerTab,
            ariaLabel: "Column",
            icon: <ColumnOptionIcon />,
            sx: {
              borderBottom: "2px solid #98A1AA",
              svg: {
                path: {
                  stroke: "#70777E",
                },
              },
            },
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (chartConfigured) {
      setValue("mapping");
    }
  }, [chartConfigured, item?.data?.dataset, item?.data?.chartType]);

  return (
    <Box
      id="chart-controller"
      key={selectedController?.id}
      sx={{
        minWidth: "300px",
        maxWidth: "max-content",
      }}
    >
      {chartExtra.showDatasetTable?.open && (
        <DataDetail datasetId={chartExtra.showDatasetTable?.datasetId ?? ""} />
      )}
      {!chartExtra.showDatasetTable?.open && (
        <Box
          sx={{
            border: "1px solid #98A1AA",
            borderRadius: "4px",
            boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60);",
            bgcolor: "#F8F9FA",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "304px",
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
                <ChartIcon />
                <Typography fontSize="16px" color="#000000" fontWeight={700}>
                  Chart
                </Typography>
              </Box>

              <Options />
            </Box>
            {selectedController?.parent?.id ? <AssetSwitch /> : null}
          </Box>
          <Box sx={{ display: isExpanded ? "block" : "none" }}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "0 8px",
                }}
              >
                {chartInfo.map((data) => (
                  <AssetSelect
                    key={data.buttonLabel}
                    buttonLabel={data.buttonLabel}
                    helperText={data.helperText}
                    icon={data.icon}
                    selectedItem={getSelectedItem(data.type)}
                    type={data.type as ChartProperty}
                  />
                ))}
              </Box>
              <Box sx={{ borderTop: "1px solid #CFD4DA", marginTop: "8px" }}>
                <Tabs
                  value={chartConfigured ? value : null}
                  onChange={chartConfigured ? handleChange : undefined}
                  textColor="secondary"
                  indicatorColor="primary"
                  aria-label="secondary tabs example"
                  sx={{
                    gap: "8px",
                    display: "flex",
                    width: "100%",
                    "& .MuiTabs-flexContainer": { width: "100%", gap: "8px" },
                    "& .MuiTab-root": {
                      flex: 1,
                      maxWidth: "none",
                      minWidth: "30px",
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
                  {[...extraTabs, ...tabList].map((tab) => (
                    <Tab
                      key={tab.value}
                      value={tab.value}
                      aria-label={tab.value}
                      sx={tab.sx}
                      icon={tab.icon}
                    />
                  ))}
                </Tabs>
              </Box>

              {chartConfigured ? (
                renderTabPanel()
              ) : (
                <Box
                  sx={{
                    padding: "38.5px 8px",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  *Configure chart first to start editing.
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
      <ChartSelectModal
        open={selectedController?.extra?.chart?.listToDisplay == "chartType"}
        onClose={handleBack}
      />
      <DatasetSelectModal
        open={selectedController?.extra?.chart?.listToDisplay == "dataset"}
        onClose={handleBack}
        skipColumnSelection
        handleSelectDataset={handleApply}
      />
    </Box>
  );
}
