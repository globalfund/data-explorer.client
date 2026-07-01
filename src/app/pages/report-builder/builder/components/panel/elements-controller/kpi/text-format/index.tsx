import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { Box, Typography, Checkbox, Button } from "@mui/material";
import TextField from "../../components/textfield";
import AdvancedOptions from "../../common/advanced-text-field/advancedOptions";
import SelectField from "../../components/selectfield";
import {
  fontFamilyOptions,
  fontSizeOptions,
  weightOptions,
} from "app/components/rich-text-editor/data";
import ColorPickerfield from "../../components/colorpickerfield";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import ControlAccordion from "../../components/accordion";
import { AssetSelect } from "../../common/asset-select";
import DatabaseIcon from "app/assets/vectors/RBDatabase.svg?react";
import { datasetItems } from "../../../../chart/data";
import { DatasetSelectModal } from "../../../../dataset-select-modal";
import FilterIcon from "app/assets/vectors/RBTableFilter.svg?react";
import { aggregationOptions } from "../../chart/mapping/data";
import {
  useGFSampleDataset,
  useRenderChartData,
} from "app/hooks/queries/report-builder";
import {
  DatasetColumn,
  getColumnType,
} from "../../../../dataset-select-modal/utils";
import React from "react";

interface KPITextFormattingProps {
  source: "manual" | "dataset";
}

export default function KPITextFormatting({ source }: KPITextFormattingProps) {
  const label = { slotProps: { input: { "aria-label": "Checkbox demo" } } };
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem, editItem } = useGetReportItemState<"kpi_box">({
    id: selectedItemController?.id || "",
    parent: selectedItemController?.parent ?? undefined,
  });

  const renderChartData = useRenderChartData();

  const setSelectedItemController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const sampledDatasetQuery = useGFSampleDataset(
    selectedItem?.data?.dataset || "",
  );
  const sampledDataset = sampledDatasetQuery?.data?.data?.data?.result;

  const columns = React.useMemo<DatasetColumn[]>(() => {
    const dataTypes = sampledDataset?.dataTypes ?? {};
    return (
      sampledDataset?.stats?.map((stat) => ({
        name: stat.name,
        id: stat.name,
        type: getColumnType(dataTypes[stat.name]),
      })) ?? []
    );
  }, [sampledDataset?.dataTypes, sampledDataset?.stats]);

  React.useEffect(() => {
    if (
      selectedItem?.data?.dataset &&
      selectedItem?.data?.datasetColumn &&
      selectedItem?.data?.aggregation
    ) {
      renderChartData.mutate(
        {
          chartType: "bigNumber",
          mapping: {
            metric: {
              value: [selectedItem.data.datasetColumn],
              mappedType: ["number"],
              config: {
                aggregation: [selectedItem.data.aggregation],
              },
            },
          },
          vizOptions: {},
          appliedFilters: selectedItem.data?.appliedFilters ?? {},
          datasetId: selectedItem.data?.dataset,
        },
        {
          onSuccess: (data) => {
            const { mappedData, ...rendered } = data.data;
            console.log("rendered", rendered, mappedData);
            editItem({
              ...selectedItem,
              id: selectedItemController?.id || "",
              type: "kpi_box",
              open: selectedItem?.open || true,
              data: {
                ...selectedItem?.data,
                // @ts-expect-error - need to update types
                bigNumberText: {
                  ...selectedItem?.data?.bigNumberText,
                  value: mappedData?.metric ?? "",
                },
              },
            });
          },
        },
      );
    }
  }, [
    selectedItem?.data?.datasetColumn,
    selectedItem?.data?.dataset,
    selectedItem?.data?.aggregation,
  ]);

  type TextOption =
    | "bigNumberText"
    | "topLabel"
    | "bottomLabel"
    | "optionalText";
  const handleCheck =
    (option: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      editItem({
        ...selectedItem,
        open: selectedItem?.open || false,
        id: selectedItemController?.id || "",
        type: "kpi_box",
        data: {
          ...selectedItem.data,
          [option]: {
            ...selectedItem.data[option as TextOption],
            enabled: e.target.checked,
          },
        },
      });
    };

  const handleWeightChange = (value: string, type: string) => {
    let fontWeight = {};
    if (value.includes("italic")) {
      fontWeight = {
        fontStyle: "italic",
        fontWeight: value.split("+")[0],
        fontWeightLabel: value,
      };
    } else {
      fontWeight = {
        fontStyle: "normal",
        fontWeight: value,
        fontWeightLabel: value,
      };
    }
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "kpi_box",
      data: {
        ...selectedItem?.data,
        [type]: {
          ...selectedItem?.data?.[type as TextOption],
          ...fontWeight,
        },
      },
    });
  };

  const handleSizeChange = (value: string, type: string) => {
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "kpi_box",
      data: {
        ...selectedItem?.data,
        [type]: {
          ...selectedItem?.data?.[type as TextOption],
          fontSize: `${value}px`,
        },
      },
    });
  };
  const handleFontFamilyChange = (value: string, type: string) => {
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "kpi_box",
      data: {
        ...selectedItem?.data,
        [type]: {
          ...selectedItem?.data?.[type as TextOption],
          fontFamily: value,
        },
      },
    });
  };

  const handleDatasetColumnChange = (value: string) => {
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "kpi_box",
      data: {
        ...selectedItem?.data,
        datasetColumn: value,
      },
    });
  };
  const handleColorChange = (
    color: string,
    colorType: "text" | "background",
    type: string,
  ) => {
    let field = "";
    if (colorType === "background") {
      field = "bgColor";
    } else {
      field = "color";
    }

    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "kpi_box",
      data: {
        ...selectedItem?.data,
        [type]: {
          ...selectedItem?.data?.[type as TextOption],
          [field]: color,
        },
      },
    });
  };

  const handleAggregationChange = (value: string) => {
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "kpi_box",
      data: {
        ...selectedItem?.data,
        aggregation: value,
      },
    });
  };

  const handleBack = () => {
    if (!selectedItemController) return;
    setSelectedItemController({
      ...selectedItemController,
      extra: {
        ...selectedItemController?.extra,
        kpi_box: {
          ...selectedItemController?.extra?.kpi_box,
          showDatasetModal: false,
        },
      },
    });
  };

  const labelMap = {
    bigNumberText: "Big Number Text",
    topLabel: "Top Label Text",
    bottomLabel: "Bottom Label Text",
    optionalText: "Optional Text",
  };

  const textFormattingOptions = Object.keys(labelMap);

  const renderLabels = () => {
    return textFormattingOptions
      .filter((d) => source === "manual" || d !== "bigNumberText")
      .map((option: string) => {
        const checked =
          selectedItem?.data?.[option as TextOption]?.enabled ?? true;
        return (
          <Box
            key={option}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              key={option}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Checkbox
                  {...label}
                  checked={checked}
                  onChange={handleCheck(option)}
                  defaultChecked
                />
                <Typography
                  sx={{
                    color: checked ? "#373D43" : "#ADB5BD",
                    fontSize: "14px",
                  }}
                >
                  {labelMap[option as keyof typeof labelMap]}
                </Typography>
              </Box>{" "}
              <TextField
                value={selectedItem.data?.[option as TextOption]?.value ?? ""}
                width="100%"
                onChange={(value) =>
                  editItem({
                    ...selectedItem,
                    open: selectedItem?.open || false,
                    id: selectedItem?.id || "",
                    type: "kpi_box",
                    data: {
                      ...selectedItem?.data,
                      [option]: {
                        ...selectedItem?.data?.[option as TextOption],
                        value: value,
                      },
                    },
                  })
                }
              />
              <AdvancedOptions
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  width: "100%",
                }}
                disabled={!checked}
                label="More text options"
              >
                <Box
                  sx={{
                    gridColumn: "span 2",
                  }}
                >
                  <SelectField
                    label="Font Family"
                    value={
                      selectedItem.data?.[option as TextOption]?.fontFamily ??
                      ""
                    }
                    onChange={(value) => handleFontFamilyChange(value, option)}
                    options={fontFamilyOptions}
                  />
                </Box>

                <SelectField
                  label="Font Size"
                  value={
                    selectedItem.data?.[option as TextOption]?.fontSize.replace(
                      "px",
                      "",
                    ) ?? ""
                  }
                  onChange={(value) => handleSizeChange(value, option)}
                  options={fontSizeOptions}
                />
                <SelectField
                  label="Font Weight"
                  value={
                    selectedItem.data?.[option as TextOption]
                      ?.fontWeightLabel ?? ""
                  }
                  onChange={(value) => handleWeightChange(value, option)}
                  options={weightOptions}
                />
                <ColorPickerfield
                  label="Text Color"
                  color={selectedItem.data?.[option as TextOption]?.color ?? ""}
                  onChange={(color) => handleColorChange(color, "text", option)}
                />
                <ColorPickerfield
                  label="Background Color"
                  color={
                    selectedItem.data?.[option as TextOption]?.bgColor ?? ""
                  }
                  onChange={(color) =>
                    handleColorChange(color, "background", option)
                  }
                />
              </AdvancedOptions>
            </Box>
          </Box>
        );
      });
  };

  return (
    <Box
      sx={{
        maxHeight: "450px",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {source === "dataset" ? (
        <>
          <ControlAccordion title="Mapping">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "8px 8px",
                width: "100%",
              }}
            >
              <AssetSelect
                key={"Select Dataset"}
                buttonLabel={"Select Dataset"}
                helperText={"Select a dataset to get started"}
                icon={<DatabaseIcon />}
                selectedItem={
                  datasetItems.find(
                    (dataset) => dataset.id === selectedItem?.data?.dataset,
                  )?.name || ""
                }
                type={"dataset"}
                componentType="kpi_box"
              />
              <SelectField
                label="Field"
                value={selectedItem.data?.datasetColumn ?? ""}
                onChange={(value) => handleDatasetColumnChange(value)}
                options={columns
                  .filter((col) => col.type === "number")
                  .map((col) => ({
                    value: col.name,
                    label: col.name,
                  }))}
                placeholder="Select a Field"
              />

              <SelectField
                label="Aggregation"
                value={selectedItem.data?.aggregation ?? "sum"}
                onChange={(value) => handleAggregationChange(value)}
                options={aggregationOptions}
                placeholder="Select an Aggregation"
              />
            </Box>
          </ControlAccordion>
          <ControlAccordion title="Filter">
            <Box
              sx={{
                gap: "10px",
                p: "8px",
                pt: "2px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Typography fontSize="14px" color="#373D43">
                No filters are active.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                sx={{
                  px: "12px",
                  py: "9px",
                  height: "35px",
                  color: "#000",
                  fontSize: "14px",
                  fontWeight: 400,
                  borderRadius: "4px",
                  textTransform: "none",
                  borderColor: "#98A1AA",
                  width: "100%",
                  display: "flex",
                  bgcolor: "#fff",
                  ".MuiButton-startIcon": {
                    mr: "5px",
                  },
                  "&:hover": {
                    borderColor: "#3154F4",
                    bgcolor: "#fff",
                  },
                  justifyContent: "flex-start",
                }}
              >
                Edit Filters
              </Button>
            </Box>
          </ControlAccordion>
          <ControlAccordion title="Labels">
            {
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  padding: "8px 8px",
                  width: "100%",
                }}
              >
                {renderLabels()}
              </Box>
            }
          </ControlAccordion>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "8px 8px",
          }}
        >
          <Typography fontSize="14px" fontWeight="700">
            Labels
          </Typography>
          {renderLabels()}
        </Box>
      )}
      <DatasetSelectModal
        open={!!selectedItemController?.extra?.kpi_box?.showDatasetModal}
        onClose={handleBack}
        handleSelectDataset={({ selectedDataset }) => {
          editItem({
            ...selectedItem,
            id: selectedItemController?.id || "",
            type: "kpi_box",
            data: {
              ...selectedItem.data,
              dataset: selectedDataset,
            },
          });
        }}
        skipColumnSelection
      />
    </Box>
  );
}
