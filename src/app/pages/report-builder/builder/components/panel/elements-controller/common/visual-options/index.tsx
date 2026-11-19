import React from "react";
import { capitalize, cloneDeep, get, groupBy, set } from "lodash";
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
import { useStoreState } from "app/state/store/hooks";
import { Slider } from "../../components/slider";
import { ColorPalette } from "../../components/colorpalette";
import { useDebounce } from "react-use";
import { IDefaultChartVisualOptions } from "../../chart/utils";
import { appendPx, removePx } from "app/utils/formatPx";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

/** The options with the edits, each a value by its path, applied. */
const applyEdits = (
  options: Record<string, any>,
  edits: Record<string, any> | null,
): Record<string, any> => {
  if (!edits) return options;
  const edited = cloneDeep(options);
  Object.entries(edits).forEach(([path, value]) => set(edited, path, value));
  return edited;
};

const VisualOptions = ({
  defaultOptionsToDisplay,
  tab,
  disableSizeFields = false,
}: {
  defaultOptionsToDisplay: IDefaultChartVisualOptions;
  tab?: string;
  disableSizeFields?: boolean;
}) => {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem, editItem } = useGetReportItemState<"chart">({
    id: selectedItemController?.id || "",
    parent: selectedItemController?.parent ?? undefined,
  });

  // Edits here are saved half a second after the last one. Until then they're
  // kept as the options they change, by path, rather than as a copy of all the
  // options: saving a copy would undo whatever changed meanwhile elsewhere,
  // such as the title, which is also edited on the chart.
  const [pendingEdits, setPendingEdits] = React.useState<Record<
    string,
    any
  > | null>(null);

  const visualOptionsState = selectedItem?.options ?? {};

  const visualOptions = React.useMemo(
    () => applyEdits(visualOptionsState, pendingEdits),
    [visualOptionsState, pendingEdits],
  );

  const savePendingEdits = () => {
    if (!pendingEdits || !selectedItem) return;
    editItem({
      ...selectedItem,
      id: selectedItemController?.id || "",
      type: "chart",
      options: applyEdits(visualOptionsState, pendingEdits),
    });
    setPendingEdits(null);
  };

  useDebounce(savePendingEdits, 500, [pendingEdits]);

  // Switching tabs, or to another item, unmounts this before the delay is up.
  const savePendingEditsRef = React.useRef(savePendingEdits);
  savePendingEditsRef.current = savePendingEdits;
  React.useEffect(() => () => savePendingEditsRef.current(), []);

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
      const key = parent ? `${parent}.${option.key}` : option.key;
      setPendingEdits((edits) => ({ ...edits, [key]: value }));
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
            disabled={
              optionDisabled ||
              (disableSizeFields &&
                (option.key === "width" || option.key === "height"))
            }
            value={optionValue}
            placeholder={option.placeholder}
          />
        );
      case "number":
        return (
          <TextField
            label={optionLabel}
            width={"100%"}
            onChange={(value) => onChange(appendPx(value))}
            disabled={optionDisabled}
            value={removePx(optionValue)}
            placeholder={option.placeholder}
            type="number"
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
