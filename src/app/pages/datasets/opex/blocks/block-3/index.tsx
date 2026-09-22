import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { LineChart } from "app/pages/datasets/opex/charts";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";
import {
  VIEWS,
  calculateYAxisTicks,
  simpleFormatter,
} from "app/pages/datasets/opex/blocks/block-3/data";

export const OpexPageBlock3: React.FC = () => {
  const [selectedView, setSelectedView] = React.useState(VIEWS[0]);

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
    `cumulative${selectedView === VIEWS[0] ? "Pledge" : "Disbursement"}`,
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

  const xAxisSubLabels = React.useMemo(() => {
    if (selectedView === VIEWS[0]) {
      return items.map((item) => `of ${simpleFormatter(item.pledge)} pledged`);
    }
    return [];
  }, [items, selectedView]);

  const rateImprovement = React.useMemo(() => {
    return items.length > 1
      ? items[items.length - 1].efficiency - items[0].efficiency
      : 0;
  }, [items, selectedView]);

  const yAxisValues = React.useMemo(() => {
    return calculateYAxisTicks(lineChartData[0].data);
  }, [lineChartData]);

  const datasetText = React.useMemo(() => {
    if (selectedView === VIEWS[0] && items.length > 0) {
      return `Operating costs as a share of funds pledged at replenishment, by cycle. Every $1 pledged for GC${get(items[items.length - 1], "gcNumber")} carried ${items[items.length - 1].efficiency.toFixed(2)}¢ of Secretariat operating cost, ${rateImprovement > 0 ? "up" : "down"} from ${items[0].efficiency.toFixed(2)}¢ in GC${get(items[0], "gcNumber")}. Pledges is money raised.`;
    } else if (selectedView === VIEWS[1] && items.length > 0) {
      return `Operating costs as a share of funds disbursed at replenishment, by cycle. Every $1 disbursed for ${items[items.length - 1].name} carried ${items[items.length - 1].efficiency.toFixed(2)}¢ of Secretariat operating cost, ${rateImprovement > 0 ? "up" : "down"} from ${items[0].efficiency.toFixed(2)}¢ in ${items[0].name}. Disbursement is money moved to grants.`;
    }
    return "";
  }, [selectedView, items, rateImprovement]);

  const cumulativeText = React.useMemo(() => {
    if (selectedView === VIEWS[0] && items.length > 0) {
      return `Cumulative across ${items[0].name.split("-")[0]}-${items[items.length - 1].name.split("-")[1]}`;
    } else if (selectedView === VIEWS[1] && items.length > 0) {
      return `Cumulative across ${items[0].name}-${items[items.length - 1].name}`;
    }
    return "";
  }, [items, selectedView]);

  const rateImprovementText = React.useMemo(() => {
    if (items.length > 1) {
      return `Rate ${rateImprovement < 0 ? "improved" : "declined"} ${Math.abs(rateImprovement).toFixed(2)}¢ from ${items[0].name} to ${items[items.length - 1].name}. Cumulative ${efficiencyValue}¢ is ${selectedView === VIEWS[0] ? "pledge" : "disbursement"}-weighted (total opex ÷ total ${selectedView === VIEWS[0] ? "pledged" : "disbursed"}), not an average of cycle rates.`;
    }
    return "";
  }, [rateImprovement, items, efficiencyValue, selectedView]);

  const exportData = React.useMemo(() => {
    if (selectedView === VIEWS[0]) {
      return {
        data: items.map((item) => [
          item.gcNumber,
          item.name,
          item.efficiency,
          item.pledge,
        ]),
        headers: ["GC Number", "Period", "Efficiency", "Pledge"],
      };
    }
    return {
      data: items.map((item) => [
        item.name,
        item.efficiency,
        item.disbursement,
      ]),
      headers: ["Year", "Efficiency", "Disbursement"],
    };
  }, [items, selectedView]);

  React.useEffect(() => {
    fetchEfficiency({
      routeParams: {
        type: selectedView === VIEWS[0] ? "pledge" : "disbursement",
      },
    });
  }, [selectedView]);

  return (
    <OpexPageChartBlock
      data={exportData}
      views={VIEWS}
      empty={false}
      loading={loadingEfficiency}
      infoType="opex"
      id="opex-efficiency"
      title="OPEX efficiency"
      viewSelected={selectedView}
      subtitle=""
      exportName="opex-efficiency"
      onViewChange={setSelectedView}
      text={datasetText}
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
                {cumulativeText} · {simpleFormatter(opexValue)} opex ÷{" "}
                {simpleFormatter(pledgeOrDisbursementValue)}{" "}
                {selectedView === VIEWS[0] ? "pledged" : "disbursed"}
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
          Scale zoomed to {yAxisValues[0]}-{yAxisValues[yAxisValues.length - 1]}
          ¢
        </Typography>
        <LineChart
          boundaryGap
          height="280px"
          data={lineChartData}
          xAxisKeys={xAxisKeys}
          yAxisValues={yAxisValues}
          xAxisSubLabels={xAxisSubLabels}
          cumulativeLineValue={efficiencyValue}
        />
        <Typography fontSize="14px" color="#373D43" marginTop="18px">
          {rateImprovementText}
        </Typography>
      </Box>
    </OpexPageChartBlock>
  );
};
