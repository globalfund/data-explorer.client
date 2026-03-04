import React from "react";
import get from "lodash/get";
import sumBy from "lodash/sumBy";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { LineChart } from "app/components/charts/line";
import { ChartBlock } from "app/components/chart-block";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { LineChartProps } from "app/components/charts/line/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import {
  CYCLES,
  CycleProps,
  CHART_4_DROPDOWN_ITEMS,
} from "app/pages/home/data";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";

export const HomeBlock4: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "disbursements",
  });

  const [chart4Cycles, setChart4Cycles] = React.useState<CycleProps[]>([]);

  const [chart4Dropdown, setChart4Dropdown] = React.useState(
    CHART_4_DROPDOWN_ITEMS[0].value,
  );

  const dataDisbursementsLineChart = useStoreState(
    (state) =>
      get(state.HomeDisbursementsLineChart, "data", {
        data: [],
        xAxisKeys: [],
      }) as LineChartProps,
  );
  const loadingDisbursementsLineChart = useStoreState((state) =>
    Boolean(state.HomeDisbursementsLineChart.loading),
  );
  const fetchDisbursementsLineChart = useStoreActions(
    (actions) => actions.HomeDisbursementsLineChart.fetch,
  );
  const disbursementsCycles = useStoreState(
    (state) =>
      get(state.DisbursementsCycles, "data.data", []) as {
        name: string;
        value: string;
      }[],
  );

  const handleChartCycleChange = (cycle: CycleProps) => {
    let cycles = chart4Cycles;
    const setCycle = setChart4Cycles;
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

  const reloadDisbursementsLineChart = (
    cycles: {
      name: string;
      value: string;
    }[],
    componentField: string,
  ) => {
    let filterString = "";
    if (cycles.length > 0) {
      // const yearFrom: string[] = [];
      // const yearTo: string[] = [];
      // cycles.forEach((cycle) => {
      //   const years = cycle.value.split(" - ");
      //   yearFrom.push(years[0]);
      //   yearTo.push(years[1]);
      // });
      // if (yearFrom.length > 0) {
      //   filterString = `years=${yearFrom.join(",")}`;
      // }
      // if (yearTo.length > 0) {
      //   filterString += `${
      //     filterString.length > 0 ? "&" : ""
      //   }yearsTo=${yearTo.join(",")}`;
      // }
      filterString = `${filterString.length > 0 ? "&" : ""}cycleNames=${cycles
        .map((c) => c.value)
        .join(",")}`;
    }
    fetchDisbursementsLineChart({
      filterString,
      routeParams: {
        componentField:
          componentField === CHART_4_DROPDOWN_ITEMS[0].value
            ? "activityAreaGroup"
            : "activityArea",
      },
    });
  };

  React.useEffect(() => {
    reloadDisbursementsLineChart(chart4Cycles, chart4Dropdown);
  }, [chart4Cycles, chart4Dropdown]);

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

  return (
    <ChartBlock
      showCycleAll
      id="disbursements"
      exportName="disbursements"
      subtitle={getCMSDataField(
        cmsData,
        "pagesHome.disbursementsSubtitle",
        "Disbursements",
      )}
      data={exportChartData}
      title={disbursementsTotal}
      selectedCycles={chart4Cycles}
      latestUpdate={latestUpdateDate}
      dropdownSelected={chart4Dropdown}
      dropdownItems={CHART_4_DROPDOWN_ITEMS}
      loading={loadingDisbursementsLineChart}
      handleDropdownChange={setChart4Dropdown}
      empty={dataDisbursementsLineChart.data.length === 0}
      handleCycleChange={(value) => handleChartCycleChange(value)}
      cycles={disbursementsCycles.map((c) => ({
        name: c.value,
        value: c.value,
      }))}
      infoType="financials"
    >
      <Box position="relative">
        <Typography
          bottom="20px"
          fontSize="10px"
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
          fontSize="10px"
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
