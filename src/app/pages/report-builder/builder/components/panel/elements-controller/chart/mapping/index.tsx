import React from "react";
import { Box } from "@mui/material";
import { Dimension } from "./dimension";
import Aggregation from "./aggregation";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { getDimensions } from "../utils";
import { useGFSampleDataset } from "app/hooks/queries/report-builder";
import { MappedDimension } from "app/state/api/action-reducers/report-builder/sync";
import { isEmpty } from "lodash";

export default function Mapping() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );

  const [selectedAggregation, setSelectedAggregation] =
    React.useState<string>("sum");

  const items = useStoreState((state) => state.RBReportItemsState.items);
  const item = items.find((i) => i.id === selectedController?.id);
  const chartExtra = item?.extra?.chart;
  const dimensions = getDimensions(chartExtra?.chartType || "");

  const sampledDatasetQuery = useGFSampleDataset(chartExtra?.dataset || "");
  const sampledDataset = sampledDatasetQuery?.data?.data?.data?.result;

  const filteredMapping = Object.fromEntries(
    Object.entries(chartExtra?.mapping ?? {}).filter((mappingEntry) => {
      return dimensions.map((dim) => dim.id).includes(mappingEntry[0]);
    }),
  );

  const showAggregation = dimensions.some((dim) => dim.aggregation);

  const currentAggregation = React.useMemo(() => {
    if (!showAggregation) return null;
    const firstDimensionWithAggregation = dimensions.find(
      (dim) => dim.aggregation,
    );
    if (!firstDimensionWithAggregation) return null;

    const mappedDimension =
      chartExtra?.mapping?.[firstDimensionWithAggregation.id];
    if (!mappedDimension) return null;

    return mappedDimension?.config?.aggregation?.[0] as string;
  }, [chartExtra?.mapping, dimensions, showAggregation]);

  const handleMappingSelect = (
    value: string[],
    types: string[],
    dimensionId: string,
  ) => {
    const dimension = dimensions.find((dim) => dim.id === dimensionId);
    if (!dimension) return;
    const newItem = {
      ...item,
      id: selectedController?.id || "",
      type: "chart" as const,
      open: true,
      extra: {
        ...item?.extra,
        chart: {
          ...item?.extra?.chart,
          mapping: {
            ...filteredMapping,
            [dimensionId]: {
              value,
              mappedType: types,
              ...(dimension.aggregation
                ? {
                    config: {
                      aggregation: (value as string[])?.map(
                        () => currentAggregation || selectedAggregation,
                      ),
                    },
                  }
                : {}),
            },
          },
          //dataset: fetched datasetId
          //chartType: fetched chart type
        },
      },
    };
    if (isEmpty(value) || !value) {
      delete newItem.extra?.chart?.mapping?.[dimensionId];
    }

    editItem(newItem);
  };

  const handleAggregationSelect = (aggregation: string) => {
    if (!showAggregation) return;

    const firstDimensionWithAggregation = dimensions.find(
      (dim) => dim.aggregation,
    );
    if (!firstDimensionWithAggregation) return;

    const newMapping = Object.keys(filteredMapping).reduce(
      (acc, dimensionId) => {
        const dimension = dimensions.find((dim) => dim.id === dimensionId);
        if (!dimension) return acc;
        if (!dimension.aggregation) {
          acc[dimensionId] = filteredMapping[dimensionId];
          return acc;
        }
        acc[dimensionId] = {
          ...filteredMapping[dimensionId],
          config: {
            aggregation: filteredMapping[dimensionId].value?.map(
              () => aggregation,
            ),
          },
        };
        return acc;
      },
      {} as MappedDimension,
    );

    editItem({
      ...item,
      id: selectedController?.id || "",
      type: "chart",
      open: true,
      extra: {
        ...item?.extra,
        chart: {
          ...item?.extra?.chart,
          mapping: newMapping,
        },
      },
    });
  };

  return (
    <Box
      sx={{
        padding: "16px 8px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {dimensions.map((dimension) => {
        const selectedValue = chartExtra?.mapping?.[dimension.id]?.value?.length
          ? chartExtra?.mapping?.[dimension.id]?.value
          : [];

        return (
          <Dimension
            key={dimension.id}
            label={dimension.name}
            helperText={dimension.description}
            placeholder={"Select " + dimension.name}
            selectedValue={selectedValue}
            required={dimension.required}
            options={
              sampledDataset?.filterOptionGroups?.map((optionGroup: any) => ({
                value: optionGroup,
                id: optionGroup,
                type:
                  typeof sampledDataset.dataTypes?.[optionGroup] === "object"
                    ? sampledDataset.dataTypes?.[optionGroup]?.type
                    : sampledDataset.dataTypes?.[optionGroup],
                disabled: !dimension.validTypes.includes(
                  typeof sampledDataset.dataTypes?.[optionGroup] === "object"
                    ? sampledDataset.dataTypes?.[optionGroup]?.type
                    : sampledDataset.dataTypes?.[optionGroup],
                ),
              })) || []
            }
            onSelect={(value, types) =>
              handleMappingSelect(
                dimension.multiple ? value : value.slice(-1),
                dimension.multiple ? types : types.slice(-1),
                dimension.id,
              )
            }
          />
        );
      })}

      {showAggregation && (
        <Aggregation
          selectedValue={currentAggregation || selectedAggregation}
          setSelectedValue={
            currentAggregation
              ? handleAggregationSelect
              : setSelectedAggregation
          }
        />
      )}
    </Box>
  );
}
