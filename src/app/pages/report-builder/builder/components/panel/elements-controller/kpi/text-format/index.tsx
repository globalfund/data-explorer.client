import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { Box, Typography, Checkbox } from "@mui/material";
import TextField from "../../components/textfield";
import AdvancedOptions from "../../common/advanced-text-field/advancedOptions";
import SelectField from "../../components/selectfield";
import {
  fontFamilyOptions,
  fontSizeOptions,
  weightOptions,
} from "app/components/rich-text-editor/data";
import ColorPickerfield from "../../components/colorpickerfield";

export default function KPITextFormatting() {
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
    selectedItem.extra?.kpi_box?.field ?? {},
  );

  const handleCheck =
    (option: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      editItem({
        ...selectedItem,
        open: selectedItem?.open || false,
        id: selectedItemController?.id || "",
        type: "kpi_box",
        extra: {
          ...selectedItem.extra,
          kpi_box: {
            ...selectedItem.extra?.kpi_box,
            field: {
              ...selectedItem.extra?.kpi_box?.field,
              [option]: {
                ...selectedItem.extra?.kpi_box?.field?.[
                  option as keyof typeof selectedItem.extra.kpi_box.field
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
      type: "kpi_box",
      extra: {
        ...selectedItem?.extra,
        kpi_box: {
          ...selectedItem?.extra?.kpi_box,
          field: {
            ...selectedItem?.extra?.kpi_box?.field,
            [type]: {
              ...selectedItem?.extra?.kpi_box?.field?.[
                type as keyof typeof selectedItem.extra.kpi_box.field
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
      type: "kpi_box",
      extra: {
        ...selectedItem?.extra,
        kpi_box: {
          ...selectedItem?.extra?.kpi_box,
          field: {
            ...selectedItem?.extra?.kpi_box?.field,
            [type]: {
              ...selectedItem?.extra?.kpi_box?.field?.[
                type as keyof typeof selectedItem.extra.kpi_box.field
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
      type: "kpi_box",
      extra: {
        ...selectedItem?.extra,
        kpi_box: {
          ...selectedItem?.extra?.kpi_box,
          field: {
            ...selectedItem?.extra?.kpi_box?.field,
            [type]: {
              ...selectedItem?.extra?.kpi_box?.field?.[
                type as keyof typeof selectedItem.extra.kpi_box.field
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
      type: "kpi_box",
      extra: {
        ...selectedItem?.extra,
        kpi_box: {
          ...selectedItem?.extra?.kpi_box,
          field: {
            ...selectedItem?.extra?.kpi_box?.field,
            [type]: {
              ...selectedItem?.extra?.kpi_box?.field?.[
                type as keyof typeof selectedItem.extra.kpi_box.field
              ],
              [field]: color,
            },
          },
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
      {textFormattingOptions.map((option: string, index) => {
        const checked =
          selectedItem.extra?.kpi_box?.field?.[
            option as keyof typeof selectedItem.extra.kpi_box.field
          ]?.enabled ?? true;
        return (
          <Box
            key={option}
            sx={{
              borderBottom:
                index === textFormattingOptions.length - 1
                  ? "none"
                  : "1px solid #CFD4DA",
              display: "flex",
              flexDirection: "column",
              paddingBottom: "16px",
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
                value={
                  selectedItem.extra?.kpi_box?.field?.[
                    option as keyof typeof selectedItem.extra.kpi_box.field
                  ]?.value ?? ""
                }
                width="100%"
                onChange={(value) =>
                  editItem({
                    ...selectedItem,
                    open: selectedItem?.open || false,
                    id: selectedItem?.id || "",
                    type: "kpi_box",
                    extra: {
                      ...selectedItem?.extra,
                      kpi_box: {
                        ...selectedItem?.extra?.kpi_box,
                        field: {
                          ...selectedItem?.extra?.kpi_box?.field,
                          [option]: {
                            ...selectedItem?.extra?.kpi_box?.field?.[
                              option as keyof typeof selectedItem.extra.kpi_box.field
                            ],
                            value: value,
                          },
                        },
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
              >
                <Box
                  sx={{
                    gridColumn: "span 2",
                  }}
                >
                  <SelectField
                    label="Font Family"
                    value={
                      selectedItem.extra?.kpi_box?.field?.[
                        option as keyof typeof selectedItem.extra.kpi_box.field
                      ]?.fontFamily ?? ""
                    }
                    onChange={(value) => handleFontFamilyChange(value, option)}
                    options={fontFamilyOptions}
                  />
                </Box>

                <SelectField
                  label="Font Size"
                  value={
                    selectedItem.extra?.kpi_box?.field?.[
                      option as keyof typeof selectedItem.extra.kpi_box.field
                    ]?.fontSize.replace("px", "") ?? ""
                  }
                  onChange={(value) => handleSizeChange(value, option)}
                  options={fontSizeOptions}
                />
                <SelectField
                  label="Font Weight"
                  value={
                    selectedItem.extra?.kpi_box?.field?.[
                      option as keyof typeof selectedItem.extra.kpi_box.field
                    ]?.fontWeightLabel ?? ""
                  }
                  onChange={(value) => handleWeightChange(value, option)}
                  options={weightOptions}
                />
                <ColorPickerfield
                  label="Text Color"
                  color={
                    selectedItem.extra?.kpi_box?.field?.[
                      option as keyof typeof selectedItem.extra.kpi_box.field
                    ]?.color ?? ""
                  }
                  onChange={(color) => handleColorChange(color, "text", option)}
                />
                <ColorPickerfield
                  label="Background Color"
                  color={
                    selectedItem.extra?.kpi_box?.field?.[
                      option as keyof typeof selectedItem.extra.kpi_box.field
                    ]?.bgColor ?? ""
                  }
                  onChange={(color) =>
                    handleColorChange(color, "background", option)
                  }
                />
              </AdvancedOptions>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
