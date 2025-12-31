import { Box, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import ChartIcon from "app/assets/vectors/RBChart.svg?react";
import { Options } from "../common/elementOptions";
import { SelectChartAssetList } from "./asset-select";
import DatasetList from "./asset-select/list/datasetList";
import ChartList from "./asset-select/list/chartList";
import { tabList } from "./data";
import { useStoreState } from "app/state/store/hooks";
import DataDetail from "./dataDetail";
import Mapping from "./mapping";
import Filtering from "./filtering";
import LayoutTab from "./layout";
import Customise from "./customise";

type ChartControllerTab = "mapping" | "filter" | "layout" | "style" | "more";
export default function ChartController() {
  const [value, setValue] = React.useState<ChartControllerTab>("mapping");
  const [isExpanded, setIsExpanded] = React.useState(true);

  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const chartExtra = selectedController?.extra?.chart || {};
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
      default:
        return null;
    }
  };

  const renderList = () => {
    switch (selectedController?.extra?.chart?.listToDisplay) {
      case "dataset":
        return <DatasetList />;
      case "chartType":
        return <ChartList />;
      default:
        return <></>;
    }
  };

  return (
    <Box
      id="chart-controller"
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
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "50px",
              padding: "8px",
              borderBottom: "1px solid #CFD4DA",
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

          <Box sx={{ display: isExpanded ? "block" : "none" }}>
            {selectedController?.extra?.chart?.listToDisplay ? (
              renderList()
            ) : (
              <Box>
                <SelectChartAssetList />

                <Box sx={{ borderTop: "1px solid #CFD4DA", marginTop: "8px" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="primary"
                    aria-label="secondary tabs example"
                    sx={{
                      gap: "4px",
                      display: "flex",
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#0F62FE",
                        height: "2px",
                      },
                      "& .MuiTab-root": {
                        minWidth: "52px",
                      },
                    }}
                  >
                    {tabList.map((tab) => (
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
                {renderTabPanel()}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
