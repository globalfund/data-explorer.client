import React from "react";
import { Box, Typography } from "@mui/material";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  ChartType,
  RBReportItem,
} from "app/state/api/action-reducers/report-builder/sync";
import { chartTypeCustomiseComponents } from "./component";

type CTCustomiseComponentsKey = keyof typeof chartTypeCustomiseComponents;
type CTCustomiseOptions<T extends CTCustomiseComponentsKey> =
  keyof (typeof chartTypeCustomiseComponents)[T];

export default function Customise() {
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
  const chartType = selectedItem?.extra?.chart?.chartType as ChartType;
  const categories = Object.keys(
    chartTypeCustomiseComponents[chartType as CTCustomiseComponentsKey],
  ) as CTCustomiseOptions<typeof chartType>[];
  console.log("selectedItem", selectedItem);
  const handleCheck =
    (option: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("chartType", chartType, e.target.checked);
      if (!chartType) return;
      editItem({
        ...selectedItem,
        open: selectedItem?.open || false,
        id: selectedItemController?.id || "",
        type: "chart",
        extra: {
          ...selectedItem.extra,
          chart: {
            ...selectedItem.extra?.chart,
            type: {
              ...selectedItem.extra?.chart?.type,

              [chartType]: {
                ...selectedItem.extra?.chart?.type?.[
                  option as keyof typeof selectedItem.extra.chart.type
                ],
                [option]: e.target.checked,
              },
            },
          },
        },
      });
    };
  console.log("checked, ", selectedItem?.extra?.chart?.type?.bar?.donutChecked);
  return (
    <Box
      sx={{
        padding: "16px 8px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {categories.map((option) => {
        const category =
          chartTypeCustomiseComponents[chartType as CTCustomiseComponentsKey][
            option
          ];

        return (
          <Box key={option}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {category.showLabel && (
                <Typography fontWeight={700} color="#000">
                  {category.label}
                </Typography>
              )}
              {category.components.map((Component) => (
                <Component
                  key={option}
                  borderFill={{
                    itemType: selectedItem.type,
                  }}
                  checkfield={{
                    checked: false,
                    onChange: handleCheck(option),
                    label: option,
                  }}
                  slider={{
                    label: "",
                    checkField: true,
                    checkFieldLabel: "Custom bar width",
                  }}
                />
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
