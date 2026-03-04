import React from "react";
import find from "lodash/find";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import Button from "@mui/material/Button";
import CheckboxIcon from "app/assets/vectors/Checkbox_notchecked.svg?react";
import CheckboxCheckedIcon from "app/assets/vectors/Checkbox_checked_2.svg?react";
import { ChartBlockCyclesProps } from "app/components/chart-block/components/cycles/data";

export const ChartBlockCycles: React.FC<ChartBlockCyclesProps> = (
  props: ChartBlockCyclesProps,
) => {
  const handleCycleClick = (cycle: { name: string; value: string }) => () => {
    props.handleCycleChange(cycle);
  };

  return (
    <Box
      zIndex="1"
      gap="10px"
      display="flex"
      flexWrap="wrap"
      flexDirection="row"
      position="relative"
      sx={{
        "& > button": {
          height: "35px",
          fontSize: "14px",
          fontWeight: "400",
          padding: "9px 12px",
          borderRadius: "4px",
          textTransform: "none",
          border: `1px solid ${appColors.CHART_BLOCK_CYCLES.BUTTON_BORDER_COLOR}`,
          color: appColors.CHART_BLOCK_CYCLES.BUTTON_TEXT_COLOR,
          "&:hover": {
            color: appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_TEXT_COLOR,
            background:
              appColors.CHART_BLOCK_CYCLES.BUTTON_HOVER_BACKGROUND_COLOR,
            path: {
              fill: "#3154F4",
            },
          },
        },
      }}
    >
      {props.cycles.length > 0 && props.showCycleAll && (
        <Button
          onClick={handleCycleClick({ name: "All", value: "All" })}
          style={
            props.selectedCycles.length === 0
              ? {
                  color: appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_TEXT_COLOR,
                  background:
                    appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR,
                }
              : {}
          }
        >
          All
        </Button>
      )}
      {props.cycles.map((cycle) => {
        const selected = find(props.selectedCycles, { value: cycle.value });
        let startIcon = undefined;
        if (props.showCycleAll) {
          startIcon = selected ? <CheckboxCheckedIcon /> : <CheckboxIcon />;
        }
        return (
          <Button
            key={cycle.name}
            startIcon={startIcon}
            disabled={cycle.disabled}
            onClick={handleCycleClick(cycle)}
            data-cy={`chart-cycle-button`}
            style={
              selected
                ? {
                    color:
                      appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_TEXT_COLOR,
                    background:
                      appColors.CHART_BLOCK_CYCLES
                        .BUTTON_ACTIVE_BACKGROUND_COLOR,
                  }
                : {}
            }
            sx={
              selected
                ? {
                    path: {
                      fill: "#3154F4",
                    },
                  }
                : {}
            }
          >
            {cycle.name.replace(" - ", "-")}
          </Button>
        );
      })}
    </Box>
  );
};
