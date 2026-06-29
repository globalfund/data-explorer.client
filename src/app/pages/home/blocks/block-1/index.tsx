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
    const v = applyResultValueFormula(
      sumBy(dataPledgesContributionsBarChart, "value"),
      3,
    );
    return `US$${v.number} ${v.text}`;
  }, [dataPledgesContributionsBarChart]);

  const totalContribution = React.useMemo(() => {
    const v = applyResultValueFormula(
      sumBy(dataPledgesContributionsBarChart, "value1"),
      3,
    );
    return `US$${v.number} ${v.text}`;
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
        title={totalPledge}
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
            value: getCMSDataField(
              cmsData,
              "pagesHome.pledgesContributionsLabel1",
              "Pledge",
            ),
            value1: getCMSDataField(
              cmsData,
              "pagesHome.pledgesContributionsLabel2",
              "Contribution",
            ),
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
          alignItems="center"
          flexDirection="column"
        >
          {!loadingPledgesContributionsBarChart ? (
            <Typography variant="h3" fontWeight="700">
              {totalPledge}
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
        </Box>
        <Box
          width="50%"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          {!loadingPledgesContributionsBarChart ? (
            <Typography variant="h3" fontWeight="700">
              {totalContribution}
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
        </Box>
      </Box>
    </React.Fragment>
  );
};
