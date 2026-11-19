import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { RaceBarChartProps } from "app/components/charts/race-bar/data";
import { useAnimateInView } from "app/components/animate-in-view";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";

export const RaceBarChart: React.FC<RaceBarChartProps> = (
  props: RaceBarChartProps,
) => {
  const { inView } = useAnimateInView();
  return (
    <Box
      gap="12px"
      width="100%"
      display="flex"
      padding="32px 0"
      flexDirection="column"
    >
      {props.data.map((item, index) => {
        const range = getRange([item], ["value"]);
        return (
          <Box
            gap="16px"
            width="100%"
            display="flex"
            key={item.name}
            alignItems="center"
            flexDirection="row"
            data-cy="race-bar-chart"
          >
            <Typography
              fontSize="16px"
              color="#333"
              minWidth="90px"
              textAlign="right"
            >
              {item.name}
            </Typography>
            <Box
              height="9px"
              borderRadius="16px"
              bgcolor={item.color}
              sx={{
                width: inView
                  ? `calc(${item.sizePercentage ?? item.percentage}% - 120px)`
                  : 0,
                transition: `width 1.2s cubic-bezier(0.33, 1, 0.68, 1) ${0.2 + index * 0.08}s`,
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
              }}
            />
            <Typography fontSize="16px" color="#333" whiteSpace="nowrap">
              {!props.noValuesFormat
                ? `US$${getFinancialValueWithMetricPrefix(
                    item.value,
                    range.index,
                    2,
                  )} ${range.abbr}`
                : item.value}{" "}
              - {item.percentage.toFixed(0)}%
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
