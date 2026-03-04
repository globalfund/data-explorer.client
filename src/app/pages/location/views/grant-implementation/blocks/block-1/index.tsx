import React from "react";
import get from "lodash/get";
import sumBy from "lodash/sumBy";
import Box from "@mui/material/Box";
import findIndex from "lodash/findIndex";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { LineChart } from "app/components/charts/line";
import { ChartBlock } from "app/components/chart-block";
import { CYCLES, CycleProps } from "app/pages/home/data";
import useUpdateEffect from "react-use/lib/useUpdateEffect";
import { LineChartProps } from "app/components/charts/line/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { CHART_1_DROPDOWN_ITEMS } from "app/pages/location/views/grant-implementation/data";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";

export const LocationGrantImplementationBlock1 = () => {
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "disbursements",
  });

  const params = useParams<{ id: string; tab: string }>();
  const paramsId = params.id?.replace("|", "%2F");

  const [chart1Cycles, setChart1Cycles] = React.useState<CycleProps[]>([]);

  const [chart1Dropdown, setChart1Dropdown] = React.useState(
    CHART_1_DROPDOWN_ITEMS[0].value,
  );

  const dataDisbursementsLineChart = useStoreState(
    (state) =>
      get(state.GeographyDisbursementsLineChart, "data", {
        data: [],
        xAxisKeys: [],
      }) as LineChartProps,
  );
  const fetchDisbursementsLineChart = useStoreActions(
    (actions) => actions.GeographyDisbursementsLineChart.fetch,
  );
  const loadingDisbursementsLineChart = useStoreState(
    (state) => state.GeographyDisbursementsLineChart.loading,
  );
  const disbursementsCycles = useStoreState(
    (state) =>
      get(state.GeographyDisbursementsCycles, "data.data", []) as {
        name: string;
        value: string;
      }[],
  );
  const disbursementsCyclesAll = useStoreState(
    (state) =>
      get(state.DisbursementsCycles, "data.data", []) as {
        name: string;
        value: string;
      }[],
  );

  const handleChartCycleChange = (cycle: CycleProps) => {
    let cycles: CycleProps[] = chart1Cycles;
    const setCycle = setChart1Cycles;
    const multi = true;
    const cycleIndex = cycles.findIndex((c) => c.value === cycle.value);
    if (cycleIndex > -1) {
      cycles.splice(cycleIndex, 1);
    } else {
      cycles.push(cycle);
    }
    if (cycle.value === CYCLES[0].value) {
      cycles = [];
    }
    if (!multi) {
      cycles = [cycle];
    }
    setCycle([...cycles]);
  };

  useUpdateEffect(() => {
    let filterString = `geographies=${paramsId}`;
    if (chart1Cycles.length > 0) {
      // const yearFrom: string[] = [];
      // const yearTo: string[] = [];
      // chart1Cycles.forEach((cycle) => {
      //   const years = cycle.value.split(" - ");
      //   yearFrom.push(years[0]);
      //   yearTo.push(years[1]);
      // });
      // if (yearFrom.length > 0) {
      //   filterString += `&years=${yearFrom.join(",")}`;
      // }
      // if (yearTo.length > 0) {
      //   filterString += `${
      //     filterString.length > 0 ? "&" : ""
      //   }yearsTo=${yearTo.join(",")}`;
      // }
      filterString += `&cycleNames=${chart1Cycles
        .map((c) => c.value)
        .join(",")}`;
    }
    fetchDisbursementsLineChart({
      filterString,
      routeParams: {
        componentField:
          chart1Dropdown === CHART_1_DROPDOWN_ITEMS[0].value
            ? "activityAreaGroup"
            : "activityArea",
      },
    });
  }, [chart1Cycles, chart1Dropdown]);

  const disbursementsTotal = React.useMemo(() => {
    let total = 0;
    dataDisbursementsLineChart.data.forEach((item) => {
      total += sumBy(item.data);
    });
    const range = getRange([{ value: total }], ["value"]);
    return `US$${getFinancialValueWithMetricPrefix(total, range.index, 2)} ${
      range.full
    }`;
  }, [dataDisbursementsLineChart]);

  const lineChartRange = React.useMemo(() => {
    const values: { value: number }[] = [];
    dataDisbursementsLineChart.data.forEach((item) => {
      item.data.forEach((value) => {
        values.push({ value });
      });
    });
    return getRange(values, ["value"]);
  }, [dataDisbursementsLineChart.data]);

  const exportChartData = React.useMemo(() => {
    const data: (string | number)[][] = [];
    dataDisbursementsLineChart.data.forEach((item) => {
      item.data.forEach((value, index) => {
        if (value) {
          data.push([
            dataDisbursementsLineChart.xAxisKeys[index],
            item.name,
            value,
          ]);
        }
      });
    });
    return {
      headers: ["Year", "Component", "Amount"],
      data,
    };
  }, [dataDisbursementsLineChart.data]);

  const showDisbursementsLineChart = dataDisbursementsLineChart.data.length > 0;

  return (
    <ChartBlock
      showCycleAll
      id="disbursements"
      subtitle="Disbursements"
      exportName="disbursements"
      title={disbursementsTotal}
      selectedCycles={chart1Cycles}
      dropdownSelected={chart1Dropdown}
      dropdownItems={CHART_1_DROPDOWN_ITEMS}
      loading={loadingDisbursementsLineChart}
      handleDropdownChange={setChart1Dropdown}
      handleCycleChange={(value) => handleChartCycleChange(value)}
      empty={!showDisbursementsLineChart && chart1Cycles.length === 0}
      cycles={disbursementsCyclesAll.map((c) => ({
        name: c.value,
        value: c.value,
        disabled: findIndex(disbursementsCycles, { value: c.value }) === -1,
      }))}
      latestUpdate={latestUpdateDate}
      data={exportChartData}
      infoType="financials"
    >
      <Box position="relative">
        <Typography
          bottom="20px"
          fontSize="12px"
          padding="7px 12px"
          borderRadius="4px"
          position="absolute"
          border="1px solid #98A1AA"
          sx={{
            transformOrigin: "left",
            transform: "rotate(-90deg)",
          }}
        >
          Y Axis/<b>Disbursed Amount (US$ {lineChartRange.abbr})</b>
        </Typography>
        <LineChart {...dataDisbursementsLineChart} />
        <Typography
          left="40px"
          bottom="-20px"
          fontSize="12px"
          padding="7px 12px"
          borderRadius="4px"
          position="absolute"
          border="1px solid #98A1AA"
        >
          X Axis/<b>Years</b>
        </Typography>
      </Box>
    </ChartBlock>
  );
};
