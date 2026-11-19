import React from "react";
import { BulletBudgetChart } from "app/pages/datasets/opex/charts";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";

const actual = 156.1e6;
const forecast = 174.4e6;
const budget = 338.8e6;

export const OpexPageBlock4: React.FC = () => {
  return (
    <OpexPageChartBlock
      data={null}
      empty={false}
      loading={false}
      infoType="opex"
      id="opex-actuals-forecast"
      title="2026 — actuals to 30 June + forecast"
      subtitle=""
      exportName="opex-actuals-forecast"
      text="Actuals booked through 30 June 2026, forecast for July-December. Full-year forecast $330.5M against a $338.8M budget — an underspend of $8.3M if the forecast holds."
    >
      <BulletBudgetChart
        actual={actual}
        forecast={forecast}
        budget={budget}
        footnote="Solid = booked actuals · dashed fill = H2 forecast · teal dashed line = approved full-year budget."
      />
    </OpexPageChartBlock>
  );
};
