import React from "react";
import get from "lodash/get";
import { BarChart } from "app/pages/datasets/opex/charts";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";
import {
  VIEWS,
  costCompositionOverTimeMainCategories,
} from "app/pages/datasets/opex/blocks/block-5/data";

export const OpexPageBlock5: React.FC = () => {
  const [selectedView, setSelectedView] = React.useState(VIEWS[0]);

  const dataCostComposition = useStoreState(
    (state) => state.OpexCostComposition.data,
  );
  const fetchCostComposition = useStoreActions(
    (actions) => actions.OpexCostComposition.fetch,
  );
  const loadingCostComposition = useStoreState(
    (state) => state.OpexCostComposition.loading,
  );

  console.log(dataCostComposition, "dataCostComposition");

  const xAxisKeys = get(dataCostComposition, "years", []);
  const allCategories = get(dataCostComposition, "categories", []);
  const values = get(dataCostComposition, "values", []) as number[][];

  const mainCategories = React.useMemo(() => {
    return allCategories.filter((category) =>
      costCompositionOverTimeMainCategories.includes(category),
    );
  }, [allCategories, costCompositionOverTimeMainCategories]);

  const transformedData = React.useMemo(() => {
    const mainCatIndexes = allCategories
      .map((category, index) =>
        costCompositionOverTimeMainCategories.includes(category) ? index : -1,
      )
      .filter((index) => index !== -1);
    const otherCatIndexes = allCategories
      .map((category, index) =>
        !costCompositionOverTimeMainCategories.includes(category) ? index : -1,
      )
      .filter((index) => index !== -1);

    const transformed = values.map((item) => {
      const mainCategoryValues = mainCatIndexes.map((index) => item[index]);
      const otherCategoryValues = otherCatIndexes.map((index) => item[index]);
      return [
        ...mainCategoryValues,
        otherCategoryValues.reduce((a, b) => a + b, 0),
      ];
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
    values,
    xAxisKeys,
    selectedView,
    allCategories,
    costCompositionOverTimeMainCategories,
  ]);

  const exportData = React.useMemo(() => {
    const data: (number | string)[][] = [];
    transformedData.forEach((yearData, yearIndex) => {
      costCompositionOverTimeMainCategories.forEach(
        (category, categoryIndex) => {
          data.push([xAxisKeys[yearIndex], category, yearData[categoryIndex]]);
        },
      );
      data.push([
        xAxisKeys[yearIndex],
        "Other (incl. non-recurring)",
        yearData[yearData.length - 1],
      ]);
    });
    return {
      data,
      headers: [
        "Year",
        "Category",
        selectedView === VIEWS[0] ? "Value" : "Share (%)",
      ],
    };
  }, [
    xAxisKeys,
    selectedView,
    transformedData,
    costCompositionOverTimeMainCategories,
  ]);

  React.useEffect(() => {
    fetchCostComposition({});
  }, []);

  console.log(transformedData, "transformedData");

  return (
    <OpexPageChartBlock
      views={VIEWS}
      empty={false}
      data={exportData}
      loading={loadingCostComposition}
      infoType="opex"
      id="cost-composition"
      title="Cost breakdown over time" // Modified
      viewSelected={selectedView}
      subtitle=""
      exportName="cost-composition"
      onViewChange={setSelectedView}
      // text="Workforce is the dominant and growing block. Travel collapses in 2020-21, partially recovers, then falls again in 2025. LFA fees and office infrastructure decline steadily in both absolute and share terms."
      text="Evolution of the cost breakdown over time"
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
        categories={[...mainCategories, "Other (incl. non-recurring)"]}
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
