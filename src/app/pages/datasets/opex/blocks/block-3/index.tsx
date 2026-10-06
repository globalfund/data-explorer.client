import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { LineChart } from "app/pages/datasets/opex/charts";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";
import {
  simpleFormatter,
  calculateYAxisTicks,
} from "app/pages/datasets/opex/blocks/block-3/data";

export const OpexPageBlock3: React.FC = () => {
  const dataEfficiency = useStoreState((state) => state.OpexEfficiency.data);
  const fetchEfficiency = useStoreActions(
    (actions) => actions.OpexEfficiency.fetch,
  );
  const loadingEfficiency = useStoreState(
    (state) => state.OpexEfficiency.loading,
  );

  const items = get(dataEfficiency, "items", []) as {
    name: string;
    actual: number;
    pledge: number;
    gcNumber: string;
    efficiency: number;
    disbursement: number;
  }[];

  let efficiencyValue: number = get(dataEfficiency, "cumulativeEfficiency", 0);
  const opexValue = get(dataEfficiency, "cumulativeActual", 0);
  const pledgeOrDisbursementValue = get(
    dataEfficiency,
    `cumulativeDisbursement`,
    0,
  );
  const remainingValue = (100 - efficiencyValue).toFixed(2);
  efficiencyValue = parseFloat(efficiencyValue.toFixed(2));

  const lineChartData = React.useMemo(() => {
    return [
      {
        name: "OPEX efficiency",
        data: items.map((item) => parseFloat(item.efficiency.toFixed(2))),
      },
    ];
  }, [items]);

  const xAxisKeys = React.useMemo(() => {
    return items.map((item) => item.name);
  }, [items]);

  const rateImprovement = React.useMemo(() => {
    return items.length > 1
      ? items[items.length - 1].efficiency - items[0].efficiency
      : 0;
  }, [items]);

  const yAxisValues = React.useMemo(() => {
    return calculateYAxisTicks(lineChartData[0].data);
  }, [lineChartData]);

  const cumulativeText = React.useMemo(() => {
    if (items.length === 0) {
      return "";
    }
    return `Cumulative across ${items[0].name}-${items[items.length - 1].name}`;
  }, [items]);

  const rateImprovementText = React.useMemo(() => {
    if (items.length > 1) {
      return `Rate ${rateImprovement < 0 ? "improved" : "declined"} ${Math.abs(rateImprovement).toFixed(2)}¢ from ${items[0].name} to ${items[items.length - 1].name}. Cumulative ${efficiencyValue}¢ is disbursement-weighted (total opex ÷ total disbursed), not an average of cycle rates.`;
    }
    return "";
  }, [rateImprovement, items, efficiencyValue]);

  const exportData = React.useMemo(() => {
    return {
      data: items.map((item) => [
        item.name,
        item.efficiency,
        item.disbursement,
      ]),
      headers: ["Year", "Efficiency", "Disbursement"],
    };
  }, [items]);

  React.useEffect(() => {
    fetchEfficiency({ routeParams: { type: "disbursement" } });
  }, []);

  return (
    <OpexPageChartBlock
      data={exportData}
      empty={false}
      loading={loadingEfficiency}
      infoType="opex"
      id="opex-vs-grant-disbursement"
      title="OPEX vs. Grant Disbursement"
      subtitle=""
      exportName="opex-vs-grant-disbursement"
      text="Secretariat operating costs relative to grant disbursements by year, shown as operating cost per US dollar disbursed or forecast to be disbursed."
    >
      <Box
        marginBottom="40px"
        sx={{
          "@media (max-width: 767px)": {
            marginBottom: "80px",
          },
        }}
      >
        <Box>
          <Box
            sx={{
              gap: "24px",
              display: "flex",
              marginBottom: "24px",
              flexDirection: "row",
              alignItems: "flex-end",
              "@media (max-width: 767px)": {
                gap: "8px",
                flexDirection: "column",
                alignItems: "flex-start",
              },
            }}
          >
            <Typography fontSize="44px" fontWeight="700">
              {efficiencyValue}¢
            </Typography>
            <Box>
              <Typography fontSize="20px" fontWeight="700" color="#373D43">
                of every $1 disbursed went to operating costs
              </Typography>
              <Typography fontSize="16px" color="#5B6470">
                {cumulativeText} · {simpleFormatter(opexValue)} opex ÷{" "}
                {simpleFormatter(pledgeOrDisbursementValue)} disbursed
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
            <Typography
              fontSize="14px"
              color="#373D43"
              paddingRight="16px"
              sx={{
                "@media (max-width: 767px)": {
                  left: 0,
                  padding: 0,
                  position: "absolute",
                  top: "calc(100% + 8px)",
                },
              }}
            >
              {remainingValue}¢ of every disbursed dollar remains for grants &
              programmes
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography fontSize="24px" fontWeight="700">
          OPEX cents per $1 disbursed, by grant cycle
        </Typography>
        <Typography fontSize="16px" color="#373D43">
          Scale zoomed to {yAxisValues[0]}-{yAxisValues[yAxisValues.length - 1]}
          ¢
        </Typography>
        <LineChart
          boundaryGap
          height="280px"
          data={lineChartData}
          xAxisKeys={xAxisKeys}
          yAxisValues={yAxisValues}
          cumulativeLineValue={efficiencyValue}
          yAxisLabelFormatter={(value: number) => `${value}¢`}
        />
        <Typography fontSize="14px" color="#373D43" marginTop="18px">
          {rateImprovementText}
        </Typography>
      </Box>
    </OpexPageChartBlock>
  );
};
