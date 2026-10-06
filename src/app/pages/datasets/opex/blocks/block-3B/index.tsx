import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BarChart2 } from "app/pages/datasets/opex/charts/bar-2";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";

export const OpexPageBlock3B: React.FC = () => {
  const dataEfficiency = useStoreState((state) => state.OpexEfficiencyB.data);
  const fetchEfficiency = useStoreActions(
    (actions) => actions.OpexEfficiencyB.fetch,
  );
  const loadingEfficiency = useStoreState(
    (state) => state.OpexEfficiencyB.loading,
  );

  const items = get(dataEfficiency, "items", []).reverse() as {
    name: string;
    actual: number;
    pledge: number;
    gcNumber: string;
    efficiency: number;
    disbursement: number;
  }[];

  const barChartData = React.useMemo(() => {
    return items.map((item) => [parseFloat(item.efficiency.toFixed(2))]);
  }, [items]);

  const xAxisKeys = React.useMemo(() => {
    return items.map((item) => item.name);
  }, [items]);

  const exportData = React.useMemo(() => {
    return {
      data: items.map((item) => [
        item.gcNumber,
        item.name,
        item.efficiency,
        item.pledge,
      ]),
      headers: ["GC Number", "Period", "Efficiency", "Pledge"],
    };
  }, [items]);

  React.useEffect(() => {
    fetchEfficiency({ routeParams: { type: "pledge" } });
  }, []);

  return (
    <OpexPageChartBlock
      data={exportData}
      empty={false}
      loading={loadingEfficiency}
      infoType="opex"
      id="opex-efficiency"
      title="OPEX Efficiency"
      subtitle=""
      exportName="opex-efficiency"
      text="Total operating costs (plannedAmount) as a share of total pledge, grouped by grant cycle. Each bar shows the opex efficiency rate: total opex for the cycle divided by total pledge."
    >
      <Box>
        <Typography fontSize="24px" fontWeight="700">
          Opex as % of total pledge, by grant cycle
        </Typography>
        <Typography fontSize="16px" color="#373D43">
          Calculation: total opex (plannedAmount) ÷ total pledge
        </Typography>
        <BarChart2
          categories={["Opex Efficiency"]}
          data={barChartData}
          xAxisKeys={xAxisKeys}
          colors={["#013E77"]}
        />
        <Typography fontSize="14px" color="#373D43" marginTop="18px">
          Opex efficiency = total planned operating costs (plannedAmount) ÷
          total pledge for the grant cycle. Lower values indicate greater cost
          efficiency relative to pledged resources.
        </Typography>
      </Box>
    </OpexPageChartBlock>
  );
};
