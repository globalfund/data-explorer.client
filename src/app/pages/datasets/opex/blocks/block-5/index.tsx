import React from "react";
import { BarChart } from "app/pages/datasets/opex/charts";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";
import {
  VIEWS,
  xAxisKeys,
  costCompositionOverTimeData,
  costCompositionOverTimeCategories,
  costCompositionOverTimeMainCategories,
} from "app/pages/datasets/opex/blocks/block-5/data";

export const OpexPageBlock5: React.FC = () => {
  const [selectedView, setSelectedView] = React.useState(VIEWS[0]);

  const transformedData = React.useMemo(() => {
    const mainCatInexes = costCompositionOverTimeCategories
      .map((category, index) =>
        costCompositionOverTimeMainCategories.includes(category) ? index : -1,
      )
      .filter((index) => index !== -1);
    const otherCatIndexes = costCompositionOverTimeCategories
      .map((category, index) =>
        !costCompositionOverTimeMainCategories.includes(category) ? index : -1,
      )
      .filter((index) => index !== -1);

    const transformed = costCompositionOverTimeData.map((item) => {
      const mainCategories = mainCatInexes.map((index) => item[index]);
      const otherCategories = otherCatIndexes.map((index) => item[index]);
      return [...mainCategories, otherCategories.reduce((a, b) => a + b, 0)];
    });

    if (selectedView === VIEWS[0]) {
      return transformed;
    }

    const totalPerRow = transformed.map((row) =>
      row.reduce((a, b) => a + b, 0),
    );
    return transformed.map((row, rowIndex) =>
      row.map((value) =>
        totalPerRow[rowIndex] ? (value / totalPerRow[rowIndex]) * 100 : 0,
      ),
    );
  }, [
    selectedView,
    costCompositionOverTimeData,
    costCompositionOverTimeCategories,
    costCompositionOverTimeMainCategories,
  ]);

  return (
    <OpexPageChartBlock
      data={null}
      views={VIEWS}
      empty={false}
      loading={false}
      infoType="opex"
      id="cost-composition"
      title="Cost composition over time"
      viewSelected={selectedView}
      subtitle=""
      exportName="cost-composition"
      onViewChange={setSelectedView}
      text="Workforce is the dominant and growing block. Travel collapses in 2020-21, partially recovers, then falls again in 2025. LFA fees and office infrastructure decline steadily in both absolute and share terms."
    >
      <BarChart
        stack
        xAxisKeys={xAxisKeys}
        data={transformedData}
        max={selectedView === VIEWS[0] ? undefined : 100}
        yAxisFormatter={
          selectedView === VIEWS[0]
            ? undefined
            : (value) => `${value.toFixed(1).replace(".0", "")}%`
        }
        tooltipValueFormatter={
          selectedView === VIEWS[0]
            ? undefined
            : (value) => `${value.toFixed(1).replace(".0", "")}%`
        }
        categories={[
          ...costCompositionOverTimeMainCategories,
          "Other (incl. non-recurring)",
        ]}
        colors={[
          "#0A2840",
          "#00B5AE",
          "#007B50",
          "#C3EDFD",
          "#108E09",
          "#D9D9D9",
          "#144BC0",
        ]}
      />
    </OpexPageChartBlock>
  );
};
