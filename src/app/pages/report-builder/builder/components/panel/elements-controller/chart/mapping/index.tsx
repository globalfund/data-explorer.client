import React from "react";
import { Box } from "@mui/material";
import { Dimension } from "./dimension";
import Aggregation from "./aggregation";
import { useStoreState } from "app/state/store/hooks";
import { getDimensions } from "../utils";
import { useGFSampleDataset } from "app/hooks/queries/report-builder";
import { MappedDimension } from "app/state/api/action-reducers/report-builder/sync";
import { isEmpty } from "lodash";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import RBBarGroupedIcon from "app/assets/vectors/RBBarGrouped.svg?react";
import RBBarStackedIcon from "app/assets/vectors/RBBarStacked.svg?react";
import RBBarPercentIcon from "app/assets/vectors/RBBarPercent.svg?react";

export default function Mapping() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const [selectedAggregation, setSelectedAggregation] =
    React.useState<string>("sum");

  const { selectedItem: item, editItem } = useGetReportItemState<"chart">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const chartExtra = item?.data;
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
      data: {
        ...item?.data,
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
      },
    };
    if (isEmpty(value) || !value) {
      delete newItem.data?.mapping?.[dimensionId];
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
      data: {
        ...item?.data,
        mapping: newMapping,
      },
    });
  };

  const barGroupOptions = [
    {
      name: "Grouped",
      value: "grouped",
      icon: <RBBarGroupedIcon />,
    },
    {
      name: "Stacked",
      value: "stacked",
      icon: <RBBarStackedIcon />,
    },
    {
      name: "100% Stack",
      value: "percent",
      icon: <RBBarPercentIcon />,
    },
  ];

  return (
    <Box
      sx={{
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
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

      {item?.data?.chartType === "bar" && (
        <Box
          sx={{
            display: "grid",
            gap: "8px",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {barGroupOptions.map((option) => (
            <Box
              key={option.value}
              component="button"
              sx={{
                padding: "5px",
                border: `0.5px solid ${option.value === item?.options?.groupStyle ? "#3154f4" : "#98A1AA"}`,
                backgroundColor: "#ffffff",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "column",
                gap: "10px",
                "&:hover": {
                  border: "0.5px solid #3154f4",
                },
              }}
              onClick={() => {
                if (!item) return;
                editItem({
                  ...item,
                  id: selectedController?.id || "",
                  type: "chart",
                  open: true,
                  options: {
                    ...item.options,
                    groupStyle: option.value,
                  },
                });
              }}
            >
              {option.icon}
              {option.name}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
