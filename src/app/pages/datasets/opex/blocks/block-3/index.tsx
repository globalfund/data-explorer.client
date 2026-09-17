import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { LineChart } from "app/pages/datasets/opex/charts";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";
import {
  VIEWS,
  simpleFormatter,
} from "app/pages/datasets/opex/blocks/block-3/data";

export const OpexPageBlock3 = () => {
  const [selectedView, setSelectedView] = React.useState(VIEWS[0]);

  const efficiencyValue = 6.7;
  const opexValue = 2850000000;
  const pledgeValue = 4260000000;
  const remainingValue = 100 - efficiencyValue;
  const cumulativeValue = 6.7;
  const lineChartData = [{ name: "OPEX efficiency", data: [6.9, 6.6, 6.5] }];
  const xAxisKeys = ["GC5 · 2017-19", "GC6 · 2020-22", "GC7 · 2023-25"];
  const yAxisValues = [6.0, 6.5, 7.0];
  const xAxisSubLabels = [
    "of $12.9B pledged",
    "of $14.02B pledged",
    "of $15.7B pledged",
  ];
  const rateImprovement = 0.4;

  return (
    <OpexPageChartBlock
      data={null}
      views={VIEWS}
      empty={false}
      loading={false}
      infoType="opex"
      id="opex-efficiency"
      title="OPEX efficiency"
      viewSelected={selectedView}
      subtitle=""
      exportName="operating-costs"
      onViewChange={setSelectedView}
      text="Operating costs as a share of funds pledged at replenishment, by cycle. Every $1 pledged for GC7 carried 6.5¢ of Secretariat operating cost, down from 6.9¢ in GC5. Disbursement is money moved to grants; pledges is money raised."
    >
      <Box marginBottom="40px">
        <Box>
          <Box
            sx={{
              gap: "24px",
              display: "flex",
              marginBottom: "24px",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <Typography fontSize="44px" fontWeight="700">
              {efficiencyValue}¢
            </Typography>
            <Box>
              <Typography fontSize="20px" fontWeight="700" color="#373D43">
                of every $1 pledged went to operating costs
              </Typography>
              <Typography fontSize="16px" color="#5B6470">
                Cumulative across GC5-7, 2017-25 · ${simpleFormatter(opexValue)}{" "}
                opex ÷ ${simpleFormatter(pledgeValue)}B pledged
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "44px",
              display: "flex",
              alignItems: "center",
              bgcolor: "#F8F9FA",
              position: "relative",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                top: 0,
                left: 0,
                zIndex: 1,
                width: "100%",
                height: "100%",
                display: "flex",
                position: "absolute",
                justifyContent: "space-between",
              }}
            >
              {Array.from({ length: 11 }).map((_, i) => (
                <Divider
                  key={i}
                  flexItem
                  orientation="vertical"
                  sx={{ borderColor: "transparent" }}
                  color={i === 0 || i === 10 ? "transparent" : "#CFD4DA"}
                />
              ))}
            </Box>
            <Box
              sx={{
                zIndex: 2,
                height: "100%",
                position: "relative",
                bgcolor: "#013E77",
                width: `${efficiencyValue}%`,
                border: "1px solid #CFD4DA",
              }}
            >
              <Typography
                sx={{
                  top: "50%",
                  fontWeight: "700",
                  color: "#013E77",
                  textWrap: "nowrap",
                  position: "absolute",
                  left: "calc(100% + 20px)",
                  transform: "translateY(-50%)",
                }}
              >
                {efficiencyValue}¢ operating costs
              </Typography>
            </Box>
            <Typography fontSize="14px" color="#373D43" paddingRight="16px">
              {remainingValue}¢ of every pledged dollar remains for grants &
              programmes
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography fontSize="24px" fontWeight="700">
          OPEX cents per $1 pledged, by grant cycle
        </Typography>
        <Typography fontSize="16px" color="#373D43">
          Scale zoomed to 6-7¢
        </Typography>
        <LineChart
          height="280px"
          data={lineChartData}
          xAxisKeys={xAxisKeys}
          yAxisValues={yAxisValues}
          xAxisSubLabels={xAxisSubLabels}
          cumulativeLineValue={cumulativeValue}
        />
        <Typography fontSize="14px" color="#373D43" marginTop="18px">
          Rate improved {rateImprovement}¢ from GC5 to GC7. Cumulative{" "}
          {cumulativeValue}¢ is pledge-weighted (total opex ÷ total pledged),
          not an average of cycle rates.
        </Typography>
      </Box>
    </OpexPageChartBlock>
  );
};
