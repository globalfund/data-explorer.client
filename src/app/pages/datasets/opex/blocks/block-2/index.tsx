import React from "react";
import get from "lodash/get";
import { BarChart, LineChart } from "app/pages/datasets/opex/charts";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";
import {
  VIEWS,
  operatingCostsData,
  tooltipFormatter,
  tooltipFormatterBar,
} from "app/pages/datasets/opex/blocks/block-2/data";
// import { simpleFormatter } from "../block-1/data";

export const OpexPageBlock2: React.FC = () => {
  const [selectedView, setSelectedView] = React.useState(VIEWS[0]);

  const years = useStoreState((state) => state.OpexYears.data);
  const endYear = get(years, "endYear", 0);

  const dataOperatingCosts = useStoreState(
    (state) => state.OpexOperatingCosts.data,
  );
  const fetchOperatingCosts = useStoreActions(
    (actions) => actions.OpexOperatingCosts.fetch,
  );

  const xAxisKeys = get(dataOperatingCosts, "xAxisValues", []) as string[];

  const dataFormatted = React.useMemo(() => {
    const data = [...operatingCostsData];
    data[0].name = `Actuals (to 30 Jun ${endYear})`;
    data[0].data = get(dataOperatingCosts, "actualsLineYValues", []);
    data[1].data = get(dataOperatingCosts, "budgetsLineYValues", []);
    data[2].data = data[0].data.map((v, i) => {
      if (i < xAxisKeys.length - 2) {
        return null;
      }
      return v;
    });
    data[0].data = data[0].data.slice(0, xAxisKeys.length - 1);
    return data;
  }, [dataOperatingCosts, endYear]);

  const barChartData = React.useMemo(() => {
    const data: number[][] = [];
    xAxisKeys.forEach((_, i) => {
      const value =
        get(
          dataFormatted,
          `[${i === xAxisKeys.length - 1 ? 2 : 0}].data[${i}]`,
          0,
        ) - get(dataFormatted, `[1].data[${i}]`, 0);
      data.push([value]);
    });
    return data;
  }, [xAxisKeys, dataFormatted]);

  const exportData = React.useMemo(() => {
    const data = xAxisKeys.map((key, i) => {
      return [
        key,
        get(dataFormatted, `[0].data[${i}]`, 0),
        get(dataFormatted, `[1].data[${i}]`, 0),
        i === xAxisKeys.length - 1
          ? get(dataFormatted, `[2].data[${i}]`, 0)
          : "",
      ];
    });
    return { data, headers: ["Year", "Actual", "Budget", "Forecast"] };
  }, [xAxisKeys, dataFormatted]);

  React.useEffect(() => {
    let category = "Total";
    if (selectedView === VIEWS[1]) {
      category = "Workforce";
    } else if (selectedView === VIEWS[2]) {
      category = "NonWorkforce";
    }
    fetchOperatingCosts({ routeParams: { category } });
  }, [selectedView]);

  const textToDisplay = React.useMemo(() => {
    switch (selectedView) {
      case VIEWS[0]:
        return `Total operating costs. The solid line shows actual expenditure to date; the dotted line shows the forecast for the rest of the year.`;
      case VIEWS[1]:
        return `Costs for staff, individual consultants and temporary consultants. The solid line shows actual expenditure to date; the dotted line shows the forecast for the rest of the year.`;
      case VIEWS[2]:
        return `All operating costs outside workforce. The solid line shows actual expenditure to date; the dotted line shows the forecast for the rest of the year.`;
      default:
        return "";
    }
  }, [selectedView]);

  return (
    <OpexPageChartBlock
      views={VIEWS}
      empty={false}
      loading={false}
      infoType="opex"
      data={exportData}
      id="operating-costs"
      title="Operating Expenditures"
      viewSelected={selectedView}
      subtitle="Actual vs budget"
      exportName="operating-costs"
      onViewChange={setSelectedView}
      text={textToDisplay}
      // text={`Total operating costs, including non-recurring and extraordinary items. Under budget in 7 of 9 completed years. For ${endYear} the line is solid over the actuals period (to 30 June, ${simpleFormatter(get(dataOperatingCosts, "actualsLineYValues[0]", 0))} booked) and dotted over the forecast remainder, landing at the full-year ${simpleFormatter(get(dataFormatted, `[2].data[${xAxisKeys.length - 1}]`, 0))}.`}
    >
      <LineChart
        showLegend
        data={dataFormatted}
        xAxisKeys={xAxisKeys}
        tooltipFormatter={tooltipFormatter}
      />
      <BarChart
        customLegends
        categories={[""]}
        data={barChartData}
        xAxisKeys={xAxisKeys}
        colors={["#007B50", "#144BC0"]}
        tooltipFormatter={tooltipFormatterBar}
      />
    </OpexPageChartBlock>
  );
};
