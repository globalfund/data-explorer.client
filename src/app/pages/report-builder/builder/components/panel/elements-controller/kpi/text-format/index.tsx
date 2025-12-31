import { Box } from "@mui/material";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import AdvancedTextField from "../../common/advanced-text-field";

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
            <AdvancedTextField
              option={option}
              itemType="kpi_box"
              checked={checked}
              handleCheck={handleCheck}
              labelMap={labelMap}
              label={label}
              componentType="TextField"
              advancedOptions={{
                fontFamilyValue:
                  selectedItem.extra?.kpi_box?.field?.[
                    option as keyof typeof selectedItem.extra.kpi_box.field
                  ]?.fontFamily ?? "",
                weightValue:
                  selectedItem.extra?.kpi_box?.field?.[
                    option as keyof typeof selectedItem.extra.kpi_box.field
                  ]?.fontWeightLabel ?? "",
                fontSizeValue:
                  selectedItem.extra?.kpi_box?.field?.[
                    option as keyof typeof selectedItem.extra.kpi_box.field
                  ]?.fontSize ?? "",
                textColorValue:
                  selectedItem.extra?.kpi_box?.field?.[
                    option as keyof typeof selectedItem.extra.kpi_box.field
                  ]?.color ?? "",
                bgColorValue:
                  selectedItem.extra?.kpi_box?.field?.[
                    option as keyof typeof selectedItem.extra.kpi_box.field
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
  );
}
