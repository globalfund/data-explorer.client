import Box from "@mui/material/Box";
import React from "react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  ChartField,
  RBReportItem,
} from "app/state/api/action-reducers/report-builder/sync";
import AdvancedTextField from "app/pages/report-builder/builder/components/panel/elements-controller/common/advanced-text-field";
import { Divider, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import CustomTextField from "app/pages/report-builder/builder/components/panel/elements-controller/common/textField";
import AlignItems from "./alignItems";

export default function LayoutTab() {
  const label = { slotProps: { input: { "aria-label": "Checkbox demo" } } };

  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find(
    (i) => i.id === selectedItemController?.id,
  ) as RBReportItem;
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const textFormattingOptions = Object.keys(
    selectedItem.extra?.chart?.field ?? {},
  );

  const handleCheck =
    (option: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      editItem({
        ...selectedItem,
        open: selectedItem?.open || false,
        id: selectedItemController?.id || "",
        type: "chart",
        extra: {
          ...selectedItem.extra,
          chart: {
            ...selectedItem.extra?.chart,
            field: {
              ...selectedItem.extra?.chart?.field,
              [option]: {
                ...selectedItem.extra?.chart?.field?.[
                  option as keyof typeof selectedItem.extra.chart.field
                ],
                enabled: e.target.checked,
              },
            },
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
      type: "chart",
      extra: {
        ...selectedItem?.extra,
        chart: {
          ...selectedItem?.extra?.chart,
          field: {
            ...selectedItem?.extra?.chart?.field,
            [type]: {
              ...selectedItem?.extra?.chart?.field?.[
                type as keyof typeof selectedItem.extra.chart.field
              ],
              ...fontWeight,
            },
          },
        },
      },
    });
  };
  const handleSizeChange = (value: string, type: string) => {
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "chart",
      extra: {
        ...selectedItem?.extra,
        chart: {
          ...selectedItem?.extra?.chart,
          field: {
            ...selectedItem?.extra?.chart?.field,
            [type]: {
              ...selectedItem?.extra?.chart?.field?.[
                type as keyof typeof selectedItem.extra.chart.field
              ],
              fontSize: `${value}px`,
            },
          },
        },
      },
    });
  };
  const handleFontFamilyChange = (value: string, type: string) => {
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItem?.id || "",
      type: "chart",
      extra: {
        ...selectedItem?.extra,
        chart: {
          ...selectedItem?.extra?.chart,
          field: {
            ...selectedItem?.extra?.chart?.field,
            [type]: {
              ...selectedItem?.extra?.chart?.field?.[
                type as keyof typeof selectedItem.extra.chart.field
              ],
              fontFamily: value,
            },
          },
        },
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
      type: "chart",
      extra: {
        ...selectedItem?.extra,
        chart: {
          ...selectedItem?.extra?.chart,
          field: {
            ...selectedItem?.extra?.chart?.field,
            [type]: {
              ...selectedItem?.extra?.chart?.field?.[
                type as keyof typeof selectedItem.extra.chart.field
              ],
              [field]: color,
            },
          },
        },
      },
    });
  };
  const labelMap = {
    chartName: "Show Chart Name",
    showLegend: "Show Legend",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px 8px",
        height: "500px",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {textFormattingOptions.map((option: string, index) => {
          const checked =
            selectedItem.extra?.chart?.field?.[
              option as keyof typeof selectedItem.extra.chart.field
            ]?.enabled ?? true;
          return (
            <Box key={option}>
              <AdvancedTextField
                option={option}
                checked={checked}
                handleCheck={handleCheck}
                labelMap={labelMap}
                label={label}
                itemType="chart"
                componentType={index === 0 ? "TextField" : "Menu"}
                menuField={option as keyof ChartField}
                advancedOptions={{
                  fontFamilyValue:
                    selectedItem.extra?.chart?.field?.[
                      option as keyof typeof selectedItem.extra.chart.field
                    ]?.fontFamily ?? "",
                  weightValue:
                    selectedItem.extra?.chart?.field?.[
                      option as keyof typeof selectedItem.extra.chart.field
                    ]?.fontWeightLabel ?? "",
                  fontSizeValue:
                    selectedItem.extra?.chart?.field?.[
                      option as keyof typeof selectedItem.extra.chart.field
                    ]?.fontSize ?? "",
                  textColorValue:
                    selectedItem.extra?.chart?.field?.[
                      option as keyof typeof selectedItem.extra.chart.field
                    ]?.color ?? "",
                  bgColorValue:
                    selectedItem.extra?.chart?.field?.[
                      option as keyof typeof selectedItem.extra.chart.field
                    ]?.bgColor ?? "",
                  handleFontFamilyChange: (value: string) =>
                    handleFontFamilyChange(value, option),
                  handleWeightChange: (value: string) =>
                    handleWeightChange(value, option),
                  handleSizeChange: (value: string) =>
                    handleSizeChange(value, option),
                  handleColorChange: (
                    color: string,
                    target: "text" | "background",
                  ) => handleColorChange(color, target, option),
                }}
              />
            </Box>
          );
        })}
      </Box>
      <Divider sx={{ borderColor: "#CFD4DA)" }} />
      <Box>
        <Typography fontWeight={700} marginBottom={"16px"}>
          Padding
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "8px",
            ".MuiInputBase-root": {
              "&:before": {
                borderBottom: "none",
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "8px",
                  svg: {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <Direction />
                <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                  Left
                </Typography>
              </Box>
              <CustomTextField type="paddingLeft" item="chart" />
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "8px",
                  svg: {
                    transform: "rotate(180deg)",
                  },
                }}
              >
                <Direction />
                <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                  Top
                </Typography>
              </Box>
              <CustomTextField type="paddingTop" item="chart" />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "8px",
                  svg: {
                    transform: "rotate(270deg)",
                  },
                }}
              >
                <Direction />
                <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                  Right
                </Typography>
              </Box>
              <CustomTextField type="paddingRight" item="chart" />
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "8px",
                }}
              >
                <Direction />
                <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                  Bottom
                </Typography>
              </Box>
              <CustomTextField type="paddingBottom" item="chart" />
            </Box>
          </Box>
          <AlignItems />
          <Box>
            <Typography fontWeight={700} marginBottom={"8px"}>
              Size
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{ color: "#373D43", fontSize: "14px" }}
                  marginBottom={"8px"}
                >
                  Width
                </Typography>
                <CustomTextField type="width" item="chart" />
              </Box>

              <Box>
                <Typography
                  sx={{ color: "#373D43", fontSize: "14px" }}
                  marginBottom={"8px"}
                >
                  Height
                </Typography>
                <CustomTextField type="height" item="chart" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
