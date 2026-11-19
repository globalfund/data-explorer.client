import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { defaultComponentsGroupingOptions } from "app/pages/datasets/grant-implementation/data";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";

interface GrantImplementationPageBlock1Props {
  filterString: string;
  geographyGrouping: string;
  componentsGrouping: string;
}

export const GrantImplementationPageBlock1: React.FC<
  GrantImplementationPageBlock1Props
> = (props: GrantImplementationPageBlock1Props) => {
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "disbursements",
  });

  const dataFinancialInsightsStats = useStoreState((state) =>
    get(state.FinancialInsightsStats, "data.data[0]", {
      signed: 0,
      committed: 0,
      disbursed: 0,
    }),
  );
  const loadingStats = useStoreState(
    (state) => state.FinancialInsightsStats.loading,
  );
  const fetchFinancialInsightsStats = useStoreActions(
    (actions) => actions.FinancialInsightsStats.fetch,
  );

  const componentsGroupingOptions = React.useMemo(
    () =>
      getCMSDataField(
        cmsData,
        "pagesDatasetsGrantImplementation.componentsGroupingDropdownOptions",
        defaultComponentsGroupingOptions,
      ),
    [cmsData],
  );

  const totalSigned = React.useMemo(() => {
    const rawValue = dataFinancialInsightsStats.signed;
    const range = getRange([{ rawValue }], ["rawValue"]);
    const value = getFinancialValueWithMetricPrefix(rawValue, range.index, 1);
    return {
      raw: formatFinancialValue(rawValue),
      formatted: `US$${value} ${range.full}`,
    };
  }, [dataFinancialInsightsStats]);

  const totalCommitted = React.useMemo(() => {
    const rawValue = dataFinancialInsightsStats.committed;
    const range = getRange([{ rawValue }], ["rawValue"]);
    const value = getFinancialValueWithMetricPrefix(rawValue, range.index, 1);
    return {
      raw: formatFinancialValue(rawValue),
      formatted: `US$${value} ${range.full}`,
    };
  }, [dataFinancialInsightsStats]);

  const totalDisbursed = React.useMemo(() => {
    const rawValue = dataFinancialInsightsStats.disbursed;
    const range = getRange([{ rawValue }], ["rawValue"]);
    const value = getFinancialValueWithMetricPrefix(rawValue, range.index, 1);
    return {
      raw: formatFinancialValue(rawValue),
      formatted: `US$${value} ${range.full}`,
    };
  }, [dataFinancialInsightsStats]);

  React.useEffect(() => {
    fetchFinancialInsightsStats({
      filterString: props.filterString,
      routeParams: {
        componentField:
          props.componentsGrouping === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: props.geographyGrouping,
      },
    });
  }, [props.filterString, props.componentsGrouping, props.geographyGrouping]);

  return (
    <React.Fragment>
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        marginBottom="25px"
        position="relative"
        sx={{
          "> div": {
            width: "calc(100% / 3)",
            padding: "0 32px",
            "&:not(:last-child)": {
              borderRight: "1px solid #98A1AA",
            },
            "&:first-of-type": {
              paddingLeft: 0,
            },
            "@media (max-width: 920px)": {
              padding: "0 15px",
              h5: {
                fontSize: "20px",
              },
            },
            "@media (max-width: 767px)": {
              width: "100%",
              padding: "16px 0",
              borderRightStyle: "none !important",
              "&:not(:last-child)": {
                borderBottom: "1px solid #98A1AA",
              },
            },
          },
          "@media (max-width: 767px)": {
            marginBottom: 0,
            flexDirection: "column",
          },
        }}
      >
        <Box>
          {!loadingStats ? (
            <Typography variant="h3">{totalSigned.formatted}</Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ width: "400px", lineHeight: 1.2, fontSize: "36px" }}
            />
          )}
          <Typography fontSize="16px">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.statsText1",
              "Total Signed Amount",
            )}
          </Typography>
          {!loadingStats ? (
            <Typography fontSize="14px" color="#373D43">
              {totalSigned.raw}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ width: "250px", fontSize: "14px" }}
            />
          )}
        </Box>
        <Box>
          {!loadingStats ? (
            <Typography variant="h3">{totalCommitted.formatted}</Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ width: "400px", lineHeight: 1.2, fontSize: "36px" }}
            />
          )}
          <Typography fontSize="16px">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.statsText2",
              "Total Committed Amount",
            )}
          </Typography>
          {!loadingStats ? (
            <Typography fontSize="14px" color="#373D43">
              {totalCommitted.raw}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ width: "250px", fontSize: "14px" }}
            />
          )}
        </Box>
        <Box>
          {!loadingStats ? (
            <Typography variant="h3">{totalDisbursed.formatted}</Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ width: "400px", lineHeight: 1.2, fontSize: "36px" }}
            />
          )}
          <Typography fontSize="16px">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.statsText3",
              "Total Disbursed Amount",
            )}
          </Typography>
          {!loadingStats ? (
            <Typography fontSize="14px" color="#373D43">
              {totalDisbursed.raw}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ width: "250px", fontSize: "14px" }}
            />
          )}
        </Box>
      </Box>
      <Box marginBottom="50px">
        <Typography variant="overline" fontSize="14px">
          {getCMSDataField(
            cmsData,
            "pagesDatasetsGrantImplementation.latestUpdateText",
            "Latest Update",
          )}
          : <b>{latestUpdateDate}</b>
        </Typography>
      </Box>
    </React.Fragment>
  );
};
