import React from "react";
import isEqual from "lodash/isEqual";
import { ACCESS_TO_FUNDING_DEFAULT_CYCLES } from "app/pages/datasets/access-to-funding/data";
import { PageNarrativePanel } from "app/components/narrative-section";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import Info from "@mui/icons-material/InfoOutlined";
import { getCMSDataField } from "app/utils/getCMSDataField";
import CircularProgress from "@mui/material/CircularProgress";
import { BarSeriesChart } from "app/components/charts/bar-series";
import { getRange } from "app/utils/getFinancialValueWithMetricPrefix";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { BarSeriesChartDataItem } from "app/components/charts/bar-series/data";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";

interface AccessToFundingBlock4Props {
  filterString: string;
}

export const AccessToFundingBlock4: React.FC<AccessToFundingBlock4Props> = (
  props: AccessToFundingBlock4Props,
) => {
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "allocations",
  });

  const keysAllocationsBarSeries = useStoreState(
    (state) =>
      get(
        state.AccessToFundingAllocationBarSeries,
        "data.keys",
        [],
      ) as string[],
  );
  const dataAllocationsBarSeries = useStoreState(
    (state) =>
      get(
        state.AccessToFundingAllocationBarSeries,
        "data.data",
        [],
      ) as BarSeriesChartDataItem[],
  );
  const fetchAllocationsBarSeries = useStoreActions(
    (actions) => actions.AccessToFundingAllocationBarSeries.fetch,
  );
  const loadingAllocationsBarSeries = useStoreState(
    (state) => state.AccessToFundingAllocationBarSeries.loading,
  );

  const range = React.useMemo(() => {
    const values: {
      value: number;
    }[] = [];
    dataAllocationsBarSeries.forEach((item) => {
      item.values.forEach((value) => {
        values.push({ value });
      });
    });
    return getRange(values, ["value"]);
  }, [dataAllocationsBarSeries]);

  React.useEffect(() => {
    fetchAllocationsBarSeries({ filterString: props.filterString });
  }, [props.filterString]);

  return (
    <Box
      padding="50px 0"
      sx={{
        "@media (max-width: 767px)": {
          padding: "20px 0",
        },
      }}
      data-cy="allocation-block-2"
    >
      <Typography variant="h4" fontSize="36px">
        {getCMSDataField(
          cmsData,
          "pagesDatasetsAccessToFunding.cumulativeAllocationTitle",
          "Cumulative Allocation by Cycles",
        )}
      </Typography>
      <Typography fontSize="20px">
        {getCMSDataField(
          cmsData,
          "pagesDatasetsAccessToFunding.cumulativeAllocationSubtitle",
          "Accompanied by the Component Breakdown.",
        )}
      </Typography>
      <Box marginTop="25px" position="relative">
        {!loadingAllocationsBarSeries ? (
          <React.Fragment>
            <Typography
              left="10px"
              bottom="40px"
              fontSize="10px"
              fontWeight="700"
              position="absolute"
              sx={{
                transformOrigin: "left",
                transform: "rotate(-90deg)",
              }}
            >
              {getCMSDataField(
                cmsData,
                "pagesDatasetsAccessToFunding.cumulativeAllocationYAxisLabel",
                "Allocated Amount",
              )}{" "}
              (USD {range.abbr})
            </Typography>
            <BarSeriesChart
              data={dataAllocationsBarSeries}
              keys={keysAllocationsBarSeries}
            />
            <Info
              htmlColor="#373D43"
              sx={{
                top: "4px",
                width: "14px",
                height: "14px",
                right: "-25px",
                position: "absolute",
              }}
            />
          </React.Fragment>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
      <Typography variant="overline" fontSize="14px">
        Latest Update: <b>{latestUpdateDate}</b>
      </Typography>

      <PageNarrativePanel
        sectionId="access_to_funding.allocation_cycles"
        scopeMatches={
          props.filterString.length === 0 &&
          !loadingAllocationsBarSeries &&
          isEqual(keysAllocationsBarSeries, ACCESS_TO_FUNDING_DEFAULT_CYCLES)
        }
      />
    </Box>
  );
};
