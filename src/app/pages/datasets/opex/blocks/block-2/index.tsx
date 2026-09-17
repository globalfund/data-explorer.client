import React from "react";
import get from "lodash/get";
import { xAxisKeys } from "app/pages/datasets/opex/charts/line/data";
import { BarChart, LineChart } from "app/pages/datasets/opex/charts";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";
import {
  VIEWS,
  operatingCostsData,
} from "app/pages/datasets/opex/blocks/block-2/data";

export const OpexPageBlock2: React.FC = () => {
  const [selectedView, setSelectedView] = React.useState(VIEWS[0]);

  const barChartData = React.useMemo(() => {
    const data: number[][] = [];
    xAxisKeys.forEach((_, index) => {
      const value =
        get(operatingCostsData, `[0].data[${index}]`, 0) -
        get(operatingCostsData, `[1].data[${index}]`, 0);
      data.push([value]);
    });
    return data;
  }, []);

  return (
    <OpexPageChartBlock
      data={null}
      views={VIEWS}
      empty={false}
      loading={false}
      infoType="opex"
      id="operating-costs"
      title="Operating Costs"
      viewSelected={selectedView}
      subtitle="Actual vs budget"
      exportName="operating-costs"
      onViewChange={setSelectedView}
      text="Total operating costs, including non-recurring and extraordinary items. Under budget in 7 of 9 completed years. For 2026 the line is solid over the actuals period (to 30 June, $156.1M booked) and dotted over the forecast remainder, landing at the full-year $330.5M."
    >
      <LineChart showLegend xAxisKeys={xAxisKeys} data={operatingCostsData} />
      <BarChart
        customLegends
        categories={[""]}
        data={barChartData}
        xAxisKeys={xAxisKeys}
        colors={["#013E77", "#EA1541"]}
      />
    </OpexPageChartBlock>
  );
};
