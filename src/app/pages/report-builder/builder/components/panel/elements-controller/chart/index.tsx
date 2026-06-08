import { Box, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import ChartIcon from "app/assets/vectors/RBChart.svg?react";
import { Options } from "../common/elementOptions";
import { SelectChartAssetList } from "./asset-select";
import DatasetList from "./asset-select/list/datasetList";
import { tabList } from "./data";
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
import ChartSelectModal from "app/pages/report-builder/main/components/chart-select-modal";
import ControllerTabs from "app/components/tabs";
import { extraTabs } from "../common/tabOptions";

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

  const { selectedItem: item } = useGetReportItemState<"chart">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const chartExtra = selectedController?.extra?.chart || {};

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

  const renderList = () => {
    switch (selectedController?.extra?.chart?.listToDisplay) {
      case "dataset":
        return <DatasetList />;
      default:
        return <></>;
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
            {selectedController?.extra?.chart?.listToDisplay === "dataset" ? (
              renderList()
            ) : (
              <Box>
                <SelectChartAssetList />

                <Box sx={{ borderTop: "1px solid #CFD4DA", marginTop: "8px" }}>
                  <ControllerTabs
                    tabs={[
                      ...extraTabs(selectedController?.parent?.type),
                      ...tabList,
                    ]}
                    value={chartConfigured ? value : null}
                    handleChange={chartConfigured ? handleChange : undefined}
                  />
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
            )}
          </Box>
        </Box>
      )}
      <ChartSelectModal
        open={selectedController?.extra?.chart?.listToDisplay == "chartType"}
        onClose={handleBack}
      />
    </Box>
  );
}
