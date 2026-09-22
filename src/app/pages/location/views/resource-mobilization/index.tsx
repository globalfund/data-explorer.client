import React from "react";
import get from "lodash/get";
import sumBy from "lodash/sumBy";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import { useParams } from "react-router-dom";
import { CycleProps } from "app/pages/home/data";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { BarChart } from "app/components/charts/bar";
import { ChartBlock } from "app/components/chart-block";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { NarrativePanel } from "app/components/narrative-section";
import { useCountryNarratives } from "app/hooks/useCountryNarratives";
import useUpdateEffect from "react-use/lib/useUpdateEffect";
import { BarChartDataItem } from "app/components/charts/bar/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";

export const ResourceMobilization: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "pledges-contributions",
  });
  const params = useParams<{ id: string; tab: string }>();
  const paramsId = params.id?.replace("|", "%2F");
  const narratives = useCountryNarratives();

  const locationName = useStoreState((state) =>
    get(state.GeographyOverview, "data.data[0].name", params.id),
  );
  useTitle(`The Data Explorer - ${locationName}`);

  const [chart1Cycles, setChart1Cycles] = React.useState<CycleProps[]>([]);

  const dataRMBarChart = useStoreState(
    (state) =>
      get(
        state.GeographyResourceMobilizationBarChart,
        "data.data",
        [],
      ) as BarChartDataItem[],
  );
  const loadingRMBarChart = useStoreState(
    (state) => state.GeographyResourceMobilizationBarChart.loading,
  );
  const fetchRMBarChart = useStoreActions(
    (actions) => actions.GeographyResourceMobilizationBarChart.fetch,
  );
  const cycles = useStoreState(
    (state) =>
      get(state.GeographyPledgesContributionsCycles, "data.data", []).map(
        (item: any) => ({
          name: item.value,
          value: item.value,
        }),
      ) as {
        name: string;
        value: string;
      }[],
  );

  const handleChartCycleChange = (cycle: CycleProps) => {
    const cycleIndex = chart1Cycles.findIndex((c) => c.value === cycle.value);

    if (cycleIndex === -1) {
      setChart1Cycles((prev) => [...prev, cycle]);
    } else {
      setChart1Cycles((prev) => prev.filter((c) => c.value !== cycle.value));
    }
  };

  useUpdateEffect(() => {
    let filterString = `geographies=${paramsId}`;
    if (chart1Cycles.length > 0) {
      filterString += `&periods=${chart1Cycles.map((c) => c.value).join(",")}`;
    }
    fetchRMBarChart({ filterString });
  }, [chart1Cycles]);

  const totalPledge = React.useMemo(() => {
    const value = sumBy(dataRMBarChart, "value");
    const range = getRange([{ value }], ["value"]);
    return `${getFinancialValueWithMetricPrefix(value, range.index, 2)} ${
      range.full
    }`;
  }, [dataRMBarChart]);

  const totalContribution = React.useMemo(() => {
    const value = sumBy(dataRMBarChart, "value1");
    const range = getRange([{ value }], ["value"]);
    return `${getFinancialValueWithMetricPrefix(value, range.index, 2)} ${
      range.full
    }`;
  }, [dataRMBarChart]);

  const exportChartData = React.useMemo(() => {
    return {
      headers: ["Period", "Pledge", "Contribution"],
      data: dataRMBarChart.map((item) => [item.name, item.value, item.value1]),
    };
  }, [dataRMBarChart]);

  return (
    <Box>
      <ChartBlock
        cycles={cycles}
        id="resource-mobilization"
        exportName="pledges-contributions"
        loading={loadingRMBarChart}
        title={`US$${totalPledge}`}
        selectedCycles={chart1Cycles}
        latestUpdate={latestUpdateDate}
        subtitle={getCMSDataField(
          cmsData,
          "pagesLocationResourceMobilization.title",
          "Pledges & Contributions",
        )}
        data={exportChartData}
        handleCycleChange={handleChartCycleChange}
        empty={dataRMBarChart.length === 0 && chart1Cycles.length === 0}
        infoType="pledges_contributions"
      >
        <BarChart
          data={dataRMBarChart}
          valueLabels={{
            value: getCMSDataField(
              cmsData,
              "pagesLocationResourceMobilization.barchartLabel1",
              "Pledge",
            ),
            value1: getCMSDataField(
              cmsData,
              "pagesLocationResourceMobilization.barchartLabel2",
              "Contribution",
            ),
          }}
        />
      </ChartBlock>
      <NarrativePanel
        state={narratives}
        sectionId="resource_mobilization.pledges_contributions"
      />
      <Box
        width="100%"
        display="flex"
        marginTop="64px"
        flexDirection="row"
        justifyContent="center"
        sx={{
          "@media (max-width: 767px)": {
            gap: "32px",
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
          <Typography variant="h3" fontWeight="900">
            US${totalPledge}
          </Typography>
          <Typography variant="subtitle2">
            {getCMSDataField(
              cmsData,
              "pagesLocationResourceMobilization.statsLabel1",
              "Total Pledge",
            )}
            {chart1Cycles.length > 0
              ? ` ${chart1Cycles.map((c) => c.name).join(",")}`
              : ""}
          </Typography>
        </Box>
        <Box
          width="50%"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <Typography variant="h3" fontWeight="900">
            US${totalContribution}
          </Typography>
          <Typography variant="subtitle2">
            {getCMSDataField(
              cmsData,
              "pagesLocationResourceMobilization.statsLabel2",
              "Total Contribution",
            )}
            {chart1Cycles.length > 0
              ? ` ${chart1Cycles.map((c) => c.name).join(",")}`
              : ""}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
