import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import { getCMSDataField } from "app/utils/getCMSDataField";
import CircularProgress from "@mui/material/CircularProgress";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { componentsGroupingOptions } from "app/pages/datasets/grant-implementation/data";

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
            padding: "0 10px",
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
              "&:not(:last-child)": {
                borderRightStyle: "none",
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
        {loadingStats && (
          <Box
            height="100%"
            display="flex"
            position="absolute"
            alignItems="center"
            justifyContent="center"
            bgcolor="rgba(255, 255, 255, 0.8)"
            sx={{
              width: "100% !important",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Box>
          <Typography variant="h3">
            {formatFinancialValue(dataFinancialInsightsStats.signed)}
          </Typography>
          <Typography fontSize="16px">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.statsText1",
              "Total Signed Amount",
            )}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3">
            {formatFinancialValue(dataFinancialInsightsStats.committed)}
          </Typography>
          <Typography fontSize="16px">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.statsText2",
              "Total Committed Amount",
            )}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3">
            {formatFinancialValue(dataFinancialInsightsStats.disbursed)}
          </Typography>
          <Typography fontSize="16px">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.statsText3",
              "Total Disbursed Amount",
            )}
          </Typography>
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
