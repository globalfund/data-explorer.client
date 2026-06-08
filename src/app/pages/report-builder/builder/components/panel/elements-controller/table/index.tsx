import { Box, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect } from "react";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import TableIcon from "app/assets/vectors/RBTable.svg?react";
import { Options } from "../common/elementOptions";
import DatabaseIcon from "app/assets/vectors/RBDatabase.svg?react";
import { tabList } from "./data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import Mapping from "./mapping";
import LayoutTab from "./layout";
import Customise from "./customise";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import { AssetSwitch } from "../grid/switchAsset";
import { GridLayoutTab } from "../grid/gridTab";
import { ColumnLayoutTab } from "../column/columnTab";
import { ColumnOptionIcon, GridOptionIcon } from "../../../header/data";
import { datasetItems } from "../../../chart/data";
import { DatasetSelectModal } from "../../../dataset-select-modal";
import { AssetSelect } from "../common/asset-select";

type TableControllerTab = "mapping" | "layout" | "style" | "grid" | "column";

export default function TableController() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [value, setValue] = React.useState<TableControllerTab>("mapping");

  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const { selectedItem: item, editItem } = useGetReportItemState<"table">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const tableExtra = selectedController?.extra?.table || {};

  const tableConfigured = !!item?.data?.dataset;

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: TableControllerTab,
  ) => {
    setValue(newValue);
  };

  const renderTabPanel = () => {
    switch (value) {
      case "mapping":
        return <Mapping />;
      case "layout":
        return <LayoutTab />;
      case "style":
        return <Customise />;
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
        table: {
          ...selectedController?.extra?.table,
          showDatasetModal: false,
          datasetModalStep: null,
        },
      },
    });
  };

  const extraTabs = [
    ...(selectedController?.parent?.type === "grid"
      ? [
          {
            value: "grid" as TableControllerTab,
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
            value: "column" as TableControllerTab,
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
    if (tableConfigured) {
      setValue("mapping");
    }
  }, [tableConfigured, item?.data?.dataset]);

  return (
    <Box
      id="table-controller"
      key={selectedController?.id}
      sx={{
        minWidth: "300px",
        maxWidth: "max-content",
      }}
    >
      {!tableExtra.showDatasetModal && (
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
                <TableIcon />
                <Typography fontSize="16px" color="#000000" fontWeight={700}>
                  Table
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
                <AssetSelect
                  key={"Select Dataset"}
                  buttonLabel={"Select Dataset"}
                  helperText={"Select a dataset to get started"}
                  icon={<DatabaseIcon />}
                  selectedItem={
                    datasetItems.find(
                      (dataset) => dataset.id === item?.data?.dataset,
                    )?.name || ""
                  }
                  type={"dataset"}
                  componentType="table"
                />
              </Box>
              <Box sx={{ borderTop: "1px solid #CFD4DA", marginTop: "8px" }}>
                <Tabs
                  value={tableConfigured ? value : null}
                  onChange={tableConfigured ? handleChange : undefined}
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

              {tableConfigured ? (
                renderTabPanel()
              ) : (
                <Box
                  sx={{
                    padding: "38.5px 8px",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  *Configure table first to start editing.
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
      <DatasetSelectModal
        open={!!selectedController?.extra?.table?.showDatasetModal}
        onClose={handleBack}
        handleSelectDataset={(selectedDataset, previewColumns) => {
          editItem({
            ...item,
            id: selectedController?.id || "",
            type: "table",
            data: {
              ...item.data,
              dataset: selectedDataset,
              columns: previewColumns.map((col) => ({
                name: col.name,
                id: col.name,
                type: col.type,
              })),
            },
          });
        }}
      />
    </Box>
  );
}
