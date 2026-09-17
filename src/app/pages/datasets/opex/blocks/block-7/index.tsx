import React from "react";
import { LineChart2 } from "app/pages/datasets/opex/charts";
import { xAxisKeys } from "app/pages/datasets/opex/charts/line/data";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";
import { OPEX_INDEXED_TRENDS_DATA } from "app/pages/datasets/opex/blocks/block-7/data";

export const OpexPageBlock7: React.FC = () => {
  return (
    <OpexPageChartBlock
      data={null}
      empty={false}
      loading={false}
      infoType="opex"
      id="indexed-trends"
      title="Indexed Trends"
      subtitle=""
      exportName="indexed-trends"
      text="Actuals indexed to 2017, so fast movers are comparable against large slow movers. Click legend chips to show or hide"
    >
      <LineChart2 xAxisKeys={xAxisKeys} data={OPEX_INDEXED_TRENDS_DATA} />
    </OpexPageChartBlock>
  );
};
