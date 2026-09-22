import React from "react";
import get from "lodash/get";
import { LineChart2 } from "app/pages/datasets/opex/charts";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";

export const OpexPageBlock7: React.FC = () => {
  const dataIndexedTrends = useStoreState(
    (state) => state.OpexIndexedTrends.data,
  );
  const fetchIndexedTrends = useStoreActions(
    (actions) => actions.OpexIndexedTrends.fetch,
  );
  const loadingIndexedTrends = useStoreState(
    (state) => state.OpexIndexedTrends.loading,
  );

  const items = get(dataIndexedTrends, "data", []) as {
    name: string;
    data: number[];
  }[];
  const xAxisKeys = get(dataIndexedTrends, "years", []);

  const exportData = React.useMemo(() => {
    const data: (number | string)[][] = [];
    items.forEach((item) => {
      xAxisKeys.forEach((year, yearIndex) => {
        data.push([item.name, year, item.data[yearIndex]]);
      });
    });
    return {
      data,
      headers: ["Category", "Year", "Value %"],
    };
  }, [items, xAxisKeys]);

  React.useEffect(() => {
    fetchIndexedTrends({});
  }, []);

  return (
    <OpexPageChartBlock
      empty={false}
      data={exportData}
      loading={loadingIndexedTrends}
      infoType="opex"
      id="indexed-trends"
      title="Indexed Trends"
      subtitle=""
      exportName="indexed-trends"
      text={`Actuals indexed to ${get(xAxisKeys, "[0]", "")}, so fast movers are comparable against large slow movers. Click legend chips to show or hide`}
    >
      <LineChart2 xAxisKeys={xAxisKeys} data={items} />
    </OpexPageChartBlock>
  );
};
