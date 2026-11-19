import React from "react";
import get from "lodash/get";
import sumBy from "lodash/sumBy";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import { BarChart } from "app/components/charts/bar";
import { ChartBlock } from "app/components/chart-block";
import { CYCLES, CycleProps } from "app/pages/home/data";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { BarChartDataItem } from "app/components/charts/bar/data";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { applyResultValueFormula } from "app/utils/applyResultValueFormula";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";

export const HomeBlock1: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "pledges-contributions",
  });

  const [chart1Cycles, setChart1Cycles] = React.useState<CycleProps[]>([]);

  const dataPledgesContributionsBarChart = useStoreState(
    (state) =>
      get(
        state.HomePledgesContributionsBarChart,
        "data.data",
        [],
      ) as BarChartDataItem[],
  );
  const loadingPledgesContributionsBarChart = useStoreState((state) =>
    Boolean(state.HomePledgesContributionsBarChart.loading),
  );
  const fetchPledgesContributionsBarChart = useStoreActions(
    (actions) => actions.HomePledgesContributionsBarChart.fetch,
  );
  const pledgesContributionsCycles = useStoreState(
    (state) =>
      get(state.PledgesContributionsCycles, "data.data", []) as {
        name: string;
        value: string;
      }[],
  );

  const handleChartCycleChange = (cycle: CycleProps) => {
    let cycles = [...chart1Cycles];
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

  const reloadPledgesContributionsBarChart = (
    cycles: {
      name: string;
      value: string;
    }[],
  ) => {
    let filterString = "";
    if (cycles.length > 0) {
      filterString = `periods=${cycles.map((c) => c.value).join(",")}`;
    }
    fetchPledgesContributionsBarChart({ filterString });
  };

  React.useEffect(() => {
    reloadPledgesContributionsBarChart(chart1Cycles);
  }, [chart1Cycles]);

  const totalPledge = React.useMemo(() => {
    const rawValue = sumBy(dataPledgesContributionsBarChart, "value");
    const v = applyResultValueFormula(rawValue, 3);
    return {
      raw: formatFinancialValue(rawValue),
      formatted: `US$${v.number} ${v.text}`,
    };
  }, [dataPledgesContributionsBarChart]);

  const totalContribution = React.useMemo(() => {
    const rawValue = sumBy(dataPledgesContributionsBarChart, "value1");
    const v = applyResultValueFormula(rawValue, 3);
    return {
      raw: formatFinancialValue(rawValue),
      formatted: `US$${v.number} ${v.text}`,
    };
  }, [dataPledgesContributionsBarChart]);

  const exportData = React.useMemo(() => {
    return {
      headers: [
        "Period",
        getCMSDataField(
          cmsData,
          "pagesHome.pledgesContributionsLabel1",
          "Pledge",
        ),
        getCMSDataField(
          cmsData,
          "pagesHome.pledgesContributionsLabel2",
          "Contribution",
        ),
      ],
      data: dataPledgesContributionsBarChart.map((d) => [
        d.name,
        d.value,
        d.value1,
      ]),
    };
  }, [cmsData, dataPledgesContributionsBarChart]);

  return (
    <React.Fragment>
      <ChartBlock
        showCycleAll
        id="pledges-contributions"
        exportName="pledges-contributions"
        selectedCycles={chart1Cycles}
        title={totalPledge.formatted}
        latestUpdate={latestUpdateDate}
        subtitle={getCMSDataField(
          cmsData,
          "pagesHome.pledgesContributionsSubtitle",
          "Pledges & Contributions",
        )}
        data={exportData}
        loading={loadingPledgesContributionsBarChart}
        empty={dataPledgesContributionsBarChart.length === 0}
        handleCycleChange={(value) => handleChartCycleChange(value)}
        cycles={pledgesContributionsCycles.map((c) => ({
          name: c.value,
          value: c.value,
        }))}
        infoType="pledges_contributions"
      >
        <BarChart
          data={dataPledgesContributionsBarChart}
          valueLabels={{
            value: "Pledge",
            value1: "Contribution",
          }}
        />
      </ChartBlock>
      <Box height="64px" />
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        sx={{
          "@media (max-width: 767px)": {
            gap: "76px",
            flexDirection: "column",
            "> div": {
              width: "100%",
            },
          },
        }}
      >
        <Box
          width="50%"
          display="flex"
          paddingRight="40px"
          flexDirection="column"
          alignItems="flex-start"
          borderRight="1px solid #CFD4DA"
          sx={{
            "@media (max-width: 767px)": {
              borderRightStyle: "none !important",
            },
          }}
        >
          {!loadingPledgesContributionsBarChart ? (
            <Typography variant="h3" fontWeight="700">
              {totalPledge.formatted}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ width: "250px", fontSize: "36px" }}
            />
          )}
          <Typography variant="subtitle2">
            {getCMSDataField(
              cmsData,
              "pagesHome.pledgesContributionsLabel1",
              "Pledged",
            )}
          </Typography>
          {!loadingPledgesContributionsBarChart ? (
            <Typography fontSize="14px" color="#373D43">
              {totalPledge.raw}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ width: "250px", fontSize: "14px" }}
            />
          )}
        </Box>
        <Box
          width="50%"
          display="flex"
          paddingLeft="40px"
          flexDirection="column"
          alignItems="flex-start"
        >
          {!loadingPledgesContributionsBarChart ? (
            <Typography variant="h3" fontWeight="700">
              {totalContribution.formatted}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ width: "250px", fontSize: "36px" }}
            />
          )}
          <Typography variant="subtitle2">
            {getCMSDataField(
              cmsData,
              "pagesHome.pledgesContributionsLabel2",
              "Contributed",
            )}
          </Typography>
          {!loadingPledgesContributionsBarChart ? (
            <Typography fontSize="14px" color="#373D43">
              {totalContribution.raw}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ width: "250px", fontSize: "14px" }}
            />
          )}
        </Box>
      </Box>
    </React.Fragment>
  );
};
