import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import isEqual from "lodash/isEqual";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTitle, useUnmount } from "react-use";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { DatasetPage } from "app/pages/datasets/common/page";
import { FilterGroupModel } from "app/components/filters/list/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { FullWidthDivider } from "app/pages/datasets/access-to-funding/data";
import { AccessToFundingBlock1 } from "app/pages/datasets/access-to-funding/blocks/block-1";
import { AccessToFundingBlock2 } from "app/pages/datasets/access-to-funding/blocks/block-2";
import { AccessToFundingBlock3 } from "app/pages/datasets/access-to-funding/blocks/block-3";
import { AccessToFundingBlock4 } from "app/pages/datasets/access-to-funding/blocks/block-4";
import { AccessToFundingBlock5 } from "app/pages/datasets/access-to-funding/blocks/block-5";
import { AccessToFundingBlock6 } from "app/pages/datasets/access-to-funding/blocks/block-6";

export const AccessToFundingPage: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  useTitle("The Data Explorer - Access to Funding");
  const location = useLocation();

  const tempAppliedFiltersActions = useStoreActions(
    (actions) => actions.TempAppliedFiltersState,
  );
  useUnmount(() => {
    tempAppliedFiltersActions.clearAll();
  });
  const dataLocationFilterOptions = useStoreState(
    (state) =>
      get(state.LocationFilterOptions, "data.data", {
        id: "",
        name: "",
        options: [],
      }) as FilterGroupModel,
  );
  const dataComponentFilterOptions = useStoreState(
    (state) =>
      get(state.ComponentFilterOptions, "data.data", {
        id: "",
        name: "",
        options: [],
      }) as FilterGroupModel,
  );
  const pageAppliedFilters = useStoreState((state) => [
    ...state.TempAppliedFiltersState.components,
    ...state.TempAppliedFiltersState.locations,
    ...state.TempAppliedFiltersState.cycles,
  ]);
  const appliedFiltersData = useStoreState(
    (state) => state.AppliedFiltersState,
  );
  const tempAppliedFiltersData = useStoreState(
    (state) => state.TempAppliedFiltersState,
  );
  const appliedFiltersActions = useStoreActions(
    (actions) => actions.AppliedFiltersState,
  );

  const eligibilityYears = useStoreState(
    (state) =>
      get(state.EligibilityCycles, "data.data", []).map((item) => ({
        label: item,
        value: item,
      })) as { label: string; value: string }[],
  );

  const [eligibilityYear, setEligibilityYear] = React.useState(
    eligibilityYears.length > 0 ? eligibilityYears[0].value : "",
  );

  const handleResetFilters = () => {
    tempAppliedFiltersActions.clearAll();
    appliedFiltersActions.setAll({
      ...appliedFiltersData,
      cycles: [],
      locations: [],
      components: [],
    });
  };

  const handleCancelFilters = () => {
    tempAppliedFiltersActions.setAll({ ...appliedFiltersData });
  };

  const handleApplyFilters = () => {
    if (isEqual(appliedFiltersData, tempAppliedFiltersData)) return;
    appliedFiltersActions.setAll({ ...tempAppliedFiltersData });
  };

  const filterGroups = React.useMemo(() => {
    return [
      // dataCycleFilterOptions,
      dataLocationFilterOptions,
      dataComponentFilterOptions,
    ];
  }, [
    dataLocationFilterOptions,
    dataComponentFilterOptions,
    // dataCycleFilterOptions,
  ]);

  const filterString = React.useMemo(() => {
    let value = "";
    if (
      appliedFiltersData.locations.length > 0 &&
      location.search.includes("locations=")
    ) {
      value += `geographies=${encodeURIComponent(
        appliedFiltersData.locations.join(","),
      )}`;
    }
    if (
      appliedFiltersData.components.length > 0 &&
      location.search.includes("components=")
    ) {
      value += `${value.length > 0 ? "&" : ""}components=${encodeURIComponent(
        appliedFiltersData.components.join(","),
      )}`;
    }
    return value;
  }, [appliedFiltersData, location.search]);

  // const handleApplyFilters = (block: string) => {
  //   switch (block) {
  //     case "blockOne":
  //       return () => {
  //         if (eligibilityYears.length > 0) {
  //           fetchStats({
  //             filterString: filterString,
  //             routeParams: {
  //               year: eligibilityYear,
  //             },
  //           });
  //         }
  //       };
  //     case "blockTwo":
  //       return () => {};
  //     case "blockThree":
  //       return () => {};
  //     case "blockFour":
  //       return () => {};
  //     case "blockFive":
  //       return () => {};
  //     case "blockSix":
  //       return () => {};
  //     default:
  //       return () => {};
  //   }
  // };

  return (
    <>
      <Helmet>
        <link
          rel="canonical"
          href={`${window.location.origin}/access-to-funding`}
        />
      </Helmet>
      <DatasetPage
        title={getCMSDataField(
          cmsData,
          "pagesDatasetsAccessToFunding.title",
          "Access to Funding",
        )}
        subtitle=""
        filterGroups={filterGroups}
        appliedFilters={pageAppliedFilters}
        handleResetFilters={handleResetFilters}
        handleApplyFilters={handleApplyFilters}
        handleCancelFilters={handleCancelFilters}
      >
        <Box width="100%" marginTop="50px">
          {/* Eligible Countries */}
          <AccessToFundingBlock1
            filterString={filterString}
            eligibilityYear={eligibilityYear}
            eligibilityYears={eligibilityYears}
            setEligibilityYear={setEligibilityYear}
          />
          <FullWidthDivider />
          {/* Eligibility */}
          <AccessToFundingBlock2 filterGroups={filterGroups} />
          <FullWidthDivider />
          {/* Allocation */}
          <AccessToFundingBlock3 filterGroups={filterGroups} />
          <FullWidthDivider />
          {/* Cumulative Allocation by Cycles */}
          <AccessToFundingBlock4 filterString={filterString} />
          <FullWidthDivider />
          {/* Funding Requests */}
          <AccessToFundingBlock5 filterGroups={filterGroups} />
          <FullWidthDivider />
          {/* Documents */}
          <AccessToFundingBlock6 filterString={filterString} />
        </Box>
      </DatasetPage>
    </>
  );
};
