import Box from "@mui/material/Box";
import Input from "@mui/material/TextField";
import {
  RBReportItem,
  RBRKPIBoxField,
  AdvancedTextFormatting,
  RBReportItemTypes,
} from "app/state/api/action-reducers/report-builder/sync";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import React from "react";

type InputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export interface TextFieldProps {
  item: RBReportItemTypes;
  type:
    | "letterSpacing"
    | "lineHeight"
    | "borderWidth"
    | "borderRadius"
    | "paddingLeft"
    | "paddingRight"
    | "paddingTop"
    | "paddingBottom"
    | "width"
    | "height"
    | "bigNumberText"
    | "topLabel"
    | "bottomLabel"
    | "optionalText"
    | "innerBorderWidth"
    | "chartName"
    | "showLegend";

  onChange?: (value: string) => void;
  value?: string;
  width?: string;
  sx?: Record<string, any>;
  disabled?: boolean;
}
export default function TextField(props: Readonly<TextFieldProps>) {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const item = items.find((i) => i.id === selectedController?.id);

  const inputFunction = React.useMemo(() => {
    const updateSetting = (newSetting: Record<any, string>) => {
      editItem({
        ...item,
        open: item?.open || false,
        id: selectedController?.id || "",
        type: props.item,
        settings: {
          ...item?.settings,
          ...newSetting,
        },
      });
    };

    const getKPIBoxFields = () => {
      const fieldTypes = [
        "bigNumberText",
        "topLabel",
        "bottomLabel",
        "optionalText",
      ];
      const kpiBox = item?.extra?.kpi_box?.field || {};

      const getKPIBoxValue = (kb: RBRKPIBoxField, field: string) => {
        const fieldObj = kb[
          field as keyof RBRKPIBoxField
        ] as AdvancedTextFormatting;
        return fieldObj?.value || "";
      };
      const createKPIBoxUpdater = (fieldType: string, e: InputEvent) => {
        const value = e.target.value;
        const updatedItem = buildUpdatedItem(fieldType, value);
        editItem(updatedItem);
      };

      const buildUpdatedItem = (
        fieldType: string,
        value: string,
      ): RBReportItem => {
        const currentField = item?.extra?.kpi_box?.field?.[
          fieldType as keyof RBRKPIBoxField
        ] as AdvancedTextFormatting;

        const updatedField = { ...currentField, value };

        return {
          ...item,
          id: selectedController?.id || "",
          type: props.item,
          open: item?.open || false,
          extra: {
            ...item?.extra,
            kpi_box: {
              ...item?.extra?.kpi_box,
              field: {
                ...item?.extra?.kpi_box?.field,
                [fieldType]: updatedField,
              },
            },
          },
        };
      };

      return fieldTypes.map((fieldType) => ({
        [fieldType]: {
          value: getKPIBoxValue(kpiBox, fieldType),
          action: (e: InputEvent) => createKPIBoxUpdater(fieldType, e),
        },
      }));
    };

    const innerBorderLineStyle = (borderStyle: Record<any, string>) => {
      editItem({
        ...item,
        open: item?.open || false,
        id: selectedController?.id || "",
        type: "kpi_box",
        extra: {
          ...item?.extra,
          kpi_box: {
            ...item?.extra?.kpi_box,
            options: {
              ...item?.extra?.kpi_box?.options,
              innerLine: {
                ...item?.extra?.kpi_box?.options?.innerLine,
                ...borderStyle,
              },
            },
          },
        },
      });
    };
    return {
      letterSpacing: {
        value: props.value || "0px",
        action: (e: InputEvent) => {
          props.onChange?.(e.target.value);
        },
      },
      lineHeight: {
        value: props.value || "0px",
        action: (e: InputEvent) => {
          props.onChange?.(e.target.value);
        },
      },

      borderWidth: {
        value: item?.settings?.borderWidth || "0px",
        action: (e: InputEvent) => {
          updateSetting({ borderWidth: e.target.value, borderStyle: "solid" });
        },
      },
      innerBorderWidth: {
        value: item?.extra?.kpi_box?.options?.innerLine?.borderWidth || "0px",
        action: (e: InputEvent) => {
          innerBorderLineStyle({ borderWidth: e.target.value });
        },
      },

      borderRadius: {
        value: item?.settings?.borderRadius || "0px",
        action: (e: InputEvent) => {
          updateSetting({ borderRadius: e.target.value });
        },
      },
      paddingLeft: {
        value: item?.settings?.paddingLeft || "0px",
        action: (e: InputEvent) => {
          updateSetting({ paddingLeft: e.target.value });
        },
      },
      paddingRight: {
        value: item?.settings?.paddingRight || "0px",
        action: (e: InputEvent) => {
          updateSetting({ paddingRight: e.target.value });
        },
      },
      paddingTop: {
        value: item?.settings?.paddingTop || "0px",
        action: (e: InputEvent) => {
          updateSetting({ paddingTop: e.target.value });
        },
      },
      paddingBottom: {
        value: item?.settings?.paddingBottom || "0px",
        action: (e: InputEvent) => {
          updateSetting({ paddingBottom: e.target.value });
        },
      },

      width: {
        value: item?.settings?.width || "0px",
        action: (e: InputEvent) => {
          updateSetting({ width: e.target.value });
        },
      },
      height: {
        value: item?.settings?.height || "0px",
        action: (e: InputEvent) => {
          updateSetting({ height: e.target.value });
        },
      },
      chartName: {
        value: item?.extra?.chart?.field?.chartName?.value,
        action: (e: InputEvent) => {
          const value = e.target.value;
          const currentField = item?.extra?.chart?.field
            ?.chartName as AdvancedTextFormatting;
          editItem({
            ...item,
            open: item?.open || false,
            id: selectedController?.id || "",
            type: props.item,
            extra: {
              ...item?.extra,
              chart: {
                ...item?.extra?.chart,
                field: {
                  ...item?.extra?.chart?.field,
                  chartName: {
                    ...currentField,
                    value,
                  },
                },
              },
            },
          });
        },
      },

      ...Object.assign({}, ...getKPIBoxFields()),
    };
  }, [
    editItem,
    item?.settings,
    item?.extra,
    item?.extra?.kpi_box?.field?.topLabel?.value,
    selectedController?.id,
    props.value,
    props.onChange,
    props.item,
    props.type,
  ]);
  const handleChange = (type: keyof typeof inputFunction, e: InputEvent) => {
    inputFunction[type].action(e);
  };

  return (
    <Box
      sx={{
        width: props.width ?? "138px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        border: "0.5px solid #98A1AA",
        backgroundColor: "#FFF",
        borderRadius: "4px",
        padding: "0 16px",
        ...props.sx,
      }}
    >
      <Input
        variant="standard"
        value={inputFunction[props.type]?.value}
        slotProps={{
          input: { disableUnderline: true },
        }}
        onChange={(e) => handleChange(props.type, e)}
        disabled={props.disabled}
      />
    </Box>
  );
}
