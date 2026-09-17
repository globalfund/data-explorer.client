import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  simpleFormatter,
  BulletBudgetChartProps,
} from "app/pages/datasets/opex/charts/bullet/data";

export const BulletBudgetChart: React.FC<BulletBudgetChartProps> = (props) => {
  const axisStep = props.axisStep || 50e6;
  const total = props.actual + props.forecast;
  const gap = props.budget - total;
  const axisMax = React.useMemo(() => {
    const steps = Math.ceil(props.budget / axisStep);
    return steps * axisStep;
  }, [props.budget, axisStep]);

  const ticks = React.useMemo(() => {
    const result: number[] = [];
    for (let value = 0; value <= axisMax; value += axisStep) {
      result.push(value);
    }
    return result;
  }, [axisMax, axisStep]);

  const toPct = (value: number) => (value / axisMax) * 100;

  const actualPct = toPct(props.actual);
  const totalPct = toPct(total);
  const budgetPct = toPct(props.budget);

  return (
    <Box width="100%" data-cy="bullet-budget-chart">
      <Box display="flex" width="100%" alignItems="center">
        <Box flex="1" position="relative">
          <Box
            position="relative"
            height="52px"
            sx={{
              "@media (max-width: 767px)": {
                height: "72px",
              },
            }}
          >
            <Box position="absolute" left="0%" top={0}>
              <Typography
                fontSize="14px"
                fontWeight="700"
                letterSpacing="0.5px"
                color="#8A93A0"
                sx={{ textTransform: "uppercase" }}
              >
                Actuals to 30 Jun
              </Typography>
              <Typography fontSize="20px" fontWeight="700" color="#1C2B4A">
                {simpleFormatter(props.actual)}
              </Typography>
            </Box>
            <Box
              position="absolute"
              left={`${actualPct}%`}
              top={0}
              sx={{
                "@media (max-width: 767px)": {
                  top: "36px",
                },
              }}
            >
              <Typography
                fontSize="14px"
                fontWeight="700"
                letterSpacing="0.5px"
                color="#8A93A0"
                sx={{ textTransform: "uppercase" }}
              >
                H2 Forecast (Jul-Dec)
              </Typography>
              <Typography fontSize="20px" fontWeight="700" color="#5B6470">
                {simpleFormatter(props.forecast)}
              </Typography>
            </Box>
            <Box
              position="absolute"
              left={`${budgetPct}%`}
              top={0}
              sx={{ transform: "translateX(-100%)", textWrap: "nowrap" }}
            >
              <Typography fontSize="20px" fontWeight="700" color="#1A9E8F">
                Budget {simpleFormatter(props.budget)}
              </Typography>
            </Box>
          </Box>
          <Box position="relative" height="48px">
            <Box
              position="absolute"
              left="0%"
              width={`${actualPct}%`}
              height="48px"
              display="flex"
              alignItems="center"
              paddingLeft="12px"
              sx={{ bgcolor: "#0A2840", borderRadius: "4px 0 0 4px" }}
            >
              <Typography fontSize="14px" fontWeight="700" color="#fff">
                Actual
              </Typography>
            </Box>
            <Box
              position="absolute"
              left={`${actualPct}%`}
              width={`${totalPct - actualPct}%`}
              height="48px"
              display="flex"
              alignItems="center"
              paddingLeft="12px"
              sx={{
                bgcolor: "#E9ECEE",
                border: "1px dashed #B4BBC2",
                borderLeft: "none",
                borderRadius: "0 4px 4px 0",
                boxSizing: "border-box",
              }}
            >
              <Typography fontSize="14px" fontWeight="700" color="#5B6470">
                Forecast
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              position="absolute"
              left={`${totalPct}%`}
              width={`calc(${budgetPct - totalPct}% + 1px)`}
              top="calc(50% - 6px)"
              height="12px"
              sx={{
                borderLeft: "1px solid #1A9E8F",
                borderRight: "1px solid #1A9E8F",
              }}
            >
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #1A9E8F",
                  width: "100%",
                }}
              />
            </Box>
            <Box
              position="absolute"
              left={`${budgetPct}%`}
              top="-12px"
              height="60px"
              width="0"
              sx={{ borderLeft: "2px dashed #1A9E8F" }}
            />
          </Box>
          <Box position="relative" height="34px" marginTop="6px">
            <Box
              position="absolute"
              left="0%"
              width={`calc(${budgetPct}% + 2px)`}
              top={0}
              height="10px"
              sx={{
                borderLeft: "1px solid #9AA1A9",
                borderBottom: "1px solid #9AA1A9",
                borderRight: "1px solid #9AA1A9",
              }}
            />
            <Box
              position="absolute"
              left={`${totalPct / 2}%`}
              top="14px"
              sx={{ transform: "translateX(-50%)" }}
            >
              <Typography fontSize="15px" fontWeight="700" color="#111417">
                {simpleFormatter(total)} full-year forecast
              </Typography>
            </Box>
            <Box
              position="absolute"
              left={`${budgetPct}%`}
              top="14px"
              sx={{ transform: "translateX(-100%)", textWrap: "nowrap" }}
            >
              <Typography fontSize="14px" color="#1A9E8F">
                {gap >= 0 ? "-" : "+"}
                {simpleFormatter(Math.abs(gap))} gap
              </Typography>
            </Box>
          </Box>
          <Box
            position="relative"
            width="100%"
            display="flex"
            justifyContent="space-between"
            marginTop="28px"
            paddingTop="8px"
            sx={{ borderTop: "1px solid #DFE3E5" }}
          >
            {ticks.map((tick) => (
              <Typography key={tick} fontSize="13px" color="#70777E">
                {simpleFormatter(tick) || "$0M"}
              </Typography>
            ))}
          </Box>
        </Box>
        <Box
          minWidth="180px"
          maxWidth="220px"
          paddingLeft="24px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Typography fontSize="30px" fontWeight="700" color="#00B5AE">
            {gap >= 0 ? "-" : "+"}
            {simpleFormatter(Math.abs(gap))}
          </Typography>
          <Typography fontSize="14px" color="#70777E">
            Projected {gap >= 0 ? "Underspend" : "Overspend"} vs Budget
          </Typography>
        </Box>
      </Box>
      {props.footnote && (
        <Typography
          fontSize="13px"
          color="#70777E"
          marginTop="16px"
          sx={{ "> b": { color: "#373D43" } }}
        >
          {props.footnote}
        </Typography>
      )}
    </Box>
  );
};
