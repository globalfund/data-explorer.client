import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import { Dropdown } from "app/components/dropdown";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";

interface AccessToFundingBlock1Props {
  filterString: string;
  eligibilityYear: string;
  eligibilityYears: {
    label: string;
    value: string;
  }[];
  setEligibilityYear: React.Dispatch<React.SetStateAction<string>>;
}

export const AccessToFundingBlock1: React.FC<AccessToFundingBlock1Props> = (
  props: AccessToFundingBlock1Props,
) => {
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "eligibility",
  });

  const dataStats = useStoreState(
    (state) =>
      get(state.AccessToFundingStats, "data.data", []) as {
        name: string;
        value: string;
        incomeLevelCounts: {
          incomeLevel: string;
          count: number;
        }[];
      }[],
  );
  const loadingStats = useStoreState(
    (state) => state.AccessToFundingStats.loading,
  );
  const fetchStats = useStoreActions(
    (actions) => actions.AccessToFundingStats.fetch,
  );

  const handleEligibilityYearChange = (value: string) => {
    props.setEligibilityYear(value);
  };

  React.useEffect(() => {
    if (props.eligibilityYears.length > 0 && props.eligibilityYear === "") {
      props.setEligibilityYear(props.eligibilityYears[0].value);
    }
  }, [props.eligibilityYears]);

  React.useEffect(() => {
    if (props.eligibilityYears.length > 0) {
      fetchStats({
        filterString: props.filterString,
        routeParams: {
          year: props.eligibilityYear,
        },
      });
    }
  }, [props.filterString, props.eligibilityYear]);

  return (
    <Box marginBottom="25px">
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          "@media (max-width: 767px)": {
            flexDirection: "column",
            gap: "20px",
          },
        }}
      >
        <Box>
          <Typography variant="h3">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsAccessToFunding.statsTitle",
              "Eligible Countries",
            )}
          </Typography>
          <Typography variant="body2" fontSize="20px">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsAccessToFunding.statsSubtitle",
              "Assessed against disease burden and income level. Countries may qualify for more than one component.",
            )}
          </Typography>
        </Box>
        <Box
          gap="10px"
          display="flex"
          flexDirection="row"
          alignItems="center"
          sx={{
            "@media (max-width: 767px)": {
              width: "100%",
              justifyContent: "flex-end",
            },
          }}
        >
          <Typography fontSize="16px" fontWeight="700">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsAccessToFunding.statsDropDownLabel",
              "Eligibility Year",
            )}
          </Typography>
          <Dropdown
            width={100}
            dropdownItems={props.eligibilityYears}
            dropdownSelected={props.eligibilityYear}
            handleDropdownChange={handleEligibilityYearChange}
          />
        </Box>
      </Box>
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        position="relative"
        margin="32px 0 25px 0"
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
        {dataStats.map((item) => (
          <Box key={item.name}>
            {!loadingStats ? (
              <Typography variant="h3">{item.value}</Typography>
            ) : (
              <Skeleton
                variant="text"
                sx={{ width: "400px", lineHeight: 1.2, fontSize: "36px" }}
              />
            )}
            <Typography fontSize="16px">
              {getCMSDataField(
                cmsData,
                "pagesDatasetsAccessToFunding.countriesEligible",
                "Countries Eligible for",
              )}{" "}
              {item.name}
            </Typography>
            {!loadingStats ? (
              <Typography fontSize="14px" color="#373D43">
                {item.incomeLevelCounts
                  .map(
                    (incomeLevelCount) =>
                      `${incomeLevelCount.count} ${incomeLevelCount.incomeLevel}`,
                  )
                  .join(" · ")}
              </Typography>
            ) : (
              <Skeleton
                variant="text"
                sx={{ width: "250px", fontSize: "14px" }}
              />
            )}
          </Box>
        ))}
      </Box>
      <Typography variant="overline" fontSize="14px">
        Latest Update: <b>{latestUpdateDate}</b>
      </Typography>
    </Box>
  );
};
