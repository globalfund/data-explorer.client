import React from "react";
import { capitalize, get, groupBy, set } from "lodash";
import {
  fontFamilyOptions,
  fontSizeOptions,
  weightOptions,
} from "app/components/rich-text-editor/data";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import Checkfield from "../../components/checkfield";
import SelectField from "../../components/selectfield";
import TextField from "../../components/textfield";
import ColorPickerfield from "../../components/colorpickerfield";
import AdvancedOptions from "../../common/advanced-text-field/advancedOptions";
import { Box, Divider, Typography } from "@mui/material";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";
import { Slider } from "../../components/slider";
import { ColorPalette } from "../../components/colorpalette";
import { useDebounce } from "react-use";
import { IDefaultChartVisualOptions } from "../../chart/utils";

const VisualOptions = ({
  defaultOptionsToDisplay,
  tab,
}: {
  defaultOptionsToDisplay: IDefaultChartVisualOptions;
  tab?: string;
}) => {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find(
    (i) => i.id === selectedItemController?.id,
  ) as ReportItemOf<"chart">;
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );

  const [visualOptionsTemp, setVisualOptionsTemp] = React.useState<Record<
    string,
    any
  > | null>(null);

  const visualOptionsState = selectedItem?.options ?? {};

  const visualOptions = visualOptionsTemp ?? visualOptionsState;

  const setVisualOptionsState = (newVisualOptions: Record<string, any>) => {
    if (!selectedItem) return;
    editItem({
      ...selectedItem,
      id: selectedItemController?.id || "",
      type: "chart",
      options: newVisualOptions,
    });
  };

  useDebounce(
    () => {
      if (visualOptionsTemp) {
        setVisualOptionsState(visualOptionsTemp);
      }
    },
    500,
    [visualOptionsTemp],
  );

  const optionsToDisplay = React.useMemo(() => {
    return Object.entries(defaultOptionsToDisplay)
      .map(([key, value]) => ({
        key,
        ...value,
        advancedOptions: value.advancedOptions
          ? Object.entries(value.advancedOptions).map(([key2, value2]) => ({
              key: key2,
              ...value2,
            }))
          : null,
      }))
      .filter((option) => {
        if (tab) {
          return option.tab === tab;
        }
        return true;
      });
  }, [defaultOptionsToDisplay, tab]);

  type ComponentMap = Record<string, React.ReactNode>;

  function renderLabelWithComponents(
    text: string,
    components: ComponentMap,
  ): string | React.ReactNode {
    if (!text) return "";
    const regex = /{(.*?)}/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const [full, key] = match;
      const start = match.index;

      // Push plain text before the placeholder
      if (start > lastIndex) {
        parts.push(text.slice(lastIndex, start));
      }

      // Push replacement (string or ReactNode)
      parts.push(components[key] ?? "");
      lastIndex = start + full.length;
    }

    // Push any remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        component={"span"}
      >
        {parts}
      </Box>
    );
  }

  const componentMap: ComponentMap = {
    arrowUp: <Direction />,
    arrowRight: <Direction style={{ transform: "rotate(90deg)" }} />,
    arrowDown: <Direction style={{ transform: "rotate(180deg)" }} />,
    arrowLeft: <Direction style={{ transform: "rotate(270deg)" }} />,
  };

  const checkOptionDisabled = (option: any, parent?: string) => {
    const optionDisabled = option.disabled
      ? Object.entries(option.disabled).some(
          ([depKey, depValue]: [string, any]) => {
            const currentValue = get(
              visualOptions,
              parent ? `${parent}.${depKey}` : depKey,
            );
            return currentValue === depValue;
          },
        )
      : false;

    return optionDisabled;
  };

  const renderOption = (option: any, parent?: string) => {
    const optionLabel = renderLabelWithComponents(option.label, componentMap);

    const optionValue = get(
      visualOptions,
      parent ? `${parent}.${option.key}` : option.key,
      option.default,
    );
    const optionDisabled = checkOptionDisabled(option, parent);

    const onChange = (value: any) => {
      const newVisualOptions = { ...visualOptions };
      let key = option.key;
      if (parent) {
        key = `${parent}.${option.key}`;
      }
      set(newVisualOptions, key, value);
      setVisualOptionsTemp(newVisualOptions);
    };
    switch (option.type) {
      case "boolean":
        return (
          <Checkfield
            label={optionLabel}
            onChange={(e) => onChange(e.target.checked)}
            disabled={optionDisabled}
            checked={optionValue}
          />
        );
      case "text":
        if (option.options) {
          return (
            <SelectField
              value={optionValue}
              onChange={onChange}
              options={option.options.map((opt: string) => ({
                label: capitalize(opt),
                value: opt,
              }))}
              label={optionLabel}
              disabled={optionDisabled}
            />
          );
        }
        return (
          <TextField
            label={optionLabel}
            width={"100%"}
            onChange={onChange}
            disabled={optionDisabled}
            value={optionValue}
            placeholder={option.placeholder}
          />
        );
      case "color":
        return (
          <ColorPickerfield
            color={optionValue}
            onChange={onChange}
            label={optionLabel}
            disabled={optionDisabled}
          />
        );
      case "fontFamily":
        return (
          <SelectField
            label={optionLabel}
            value={optionValue}
            onChange={onChange}
            options={fontFamilyOptions}
            disabled={optionDisabled}
          />
        );
      case "fontWeight":
        return (
          <SelectField
            label={optionLabel}
            value={optionValue}
            onChange={onChange}
            options={weightOptions}
            disabled={optionDisabled}
          />
        );
      case "fontSize":
        return (
          <SelectField
            label={optionLabel}
            value={optionValue}
            onChange={onChange}
            options={fontSizeOptions}
            disabled={optionDisabled}
          />
        );
      case "slider":
        return (
          <Slider
            label={optionLabel}
            value={optionValue}
            onChange={onChange}
            disabled={optionDisabled}
          />
        );
      case "colorPaletteCategorical":
        return (
          <ColorPalette
            label={optionLabel}
            type="categorical"
            value={optionValue}
            onChange={onChange}
          />
        );
      case "colorPaletteSequential":
        return (
          <ColorPalette
            label={optionLabel}
            type="sequential"
            value={optionValue}
            onChange={onChange}
          />
        );
      default:
        return "unknown option type";
    }
  };

  console.log("visualOptions", visualOptions);

  const groupsToDisplay = groupBy(
    optionsToDisplay,
    (option) => option.group || "",
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: "16px",
        padding: "16px 8px",
        maxHeight: "500px",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {Object.entries(groupsToDisplay).map(
        ([groupName, groupOptions], groupIndex) => (
          <React.Fragment key={groupName + groupIndex}>
            {groupName ? (
              <Typography
                sx={{
                  gridColumn: "span 2",
                  fontWeight: 700,
                  color: "#000",
                  padding: 0,
                  margin: 0,
                  lineHeight: "normal",
                  marginTop: groupIndex === 0 ? 0 : "16px",
                }}
              >
                {capitalize(groupName)}
              </Typography>
            ) : null}

            {groupOptions.map((option, index) => {
              return (
                <Box
                  key={option.key}
                  sx={{
                    gridColumn: option.column ?? "span 2",
                    marginTop: !option.label
                      ? "4px"
                      : index === 0 && !groupName
                        ? "0px"
                        : option.advancedOptions
                          ? "8px"
                          : "16px",
                  }}
                >
                  {option.advancedOptions ? (
                    <AdvancedOptions
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        columnGap: "16px",
                        width: "100%",
                      }}
                      disabled={checkOptionDisabled(option)}
                    >
                      {option.advancedOptions.map(
                        (advOption: any, advIndex: number) => (
                          <Box
                            key={`${option.key}.${advOption.key}`}
                            sx={{
                              gridColumn: advOption.column ?? "span 2",
                              marginTop: !option.label
                                ? "4px"
                                : advIndex === 0
                                  ? "8px"
                                  : "16px",
                            }}
                          >
                            {renderOption(advOption, option.key)}
                          </Box>
                        ),
                      )}
                    </AdvancedOptions>
                  ) : (
                    renderOption(option)
                  )}
                </Box>
              );
            })}
            {groupIndex !== Object.keys(groupsToDisplay).length - 1 ? (
              <Divider
                sx={{
                  borderColor: "#CFD4DA",
                  gridColumn: "span 2",
                  marginTop: "16px",
                }}
              />
            ) : null}
          </React.Fragment>
        ),
      )}
    </Box>
  );
};

export default VisualOptions;
