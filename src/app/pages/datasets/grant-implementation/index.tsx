import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import isEqual from "lodash/isEqual";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTitle, useUnmount } from "react-use";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import { Dropdown } from "app/components/dropdown";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { DatasetPage } from "app/pages/datasets/common/page";
import { FilterGroupModel } from "app/components/filters/list/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { GrantImplementationPageBlock1 } from "app/pages/datasets/grant-implementation/blocks/block-1";
import { GrantImplementationPageBlock2 } from "app/pages/datasets/grant-implementation/blocks/block-2";
import { GrantImplementationPageBlock21 } from "app/pages/datasets/grant-implementation/blocks/block-2-1";
import { GrantImplementationPageBlock3 } from "app/pages/datasets/grant-implementation/blocks/block-3";
import { GrantImplementationPageBlock4 } from "app/pages/datasets/grant-implementation/blocks/block-4";
import { GrantImplementationPageBlock5 } from "app/pages/datasets/grant-implementation/blocks/block-5";
import { GrantImplementationPageBlock6 } from "app/pages/datasets/grant-implementation/blocks/block-6";
import {
  FullWidthDivider,
  defaultGeographyGroupingOptions,
  defaultComponentsGroupingOptions,
} from "app/pages/datasets/grant-implementation/data";

export const GrantImplementationPage: React.FC = () => {
  const location = useLocation();
  useTitle("The Data Explorer - Financial Insights");
  const cmsData = useCMSData({ returnData: true });

  const geographyGroupingOptions = React.useMemo(
    () =>
      getCMSDataField(
        cmsData,
        "pagesDatasetsGrantImplementation.geographyGroupingDropdownOptions",
        defaultGeographyGroupingOptions,
      ),
    [cmsData],
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

  const [geographyGrouping, setGeographyGrouping] = React.useState(
    geographyGroupingOptions[0].value,
  );
  const [componentsGrouping] = React.useState(
    componentsGroupingOptions[1].value,
  );

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
  const dataPartnerTypeFilterOptions = useStoreState(
    (state) =>
      get(state.PartnerTypeFilterOptions, "data.data", {
        id: "",
        name: "",
        options: [],
      }) as FilterGroupModel,
  );
  const dataStatusFilterOptions = useStoreState(
    (state) =>
      get(state.StatusFilterOptions, "data.data", {
        id: "",
        name: "",
        options: [],
      }) as FilterGroupModel,
  );
  const dataCycleFilterOptions = useStoreState((state) => ({
    id: "cycle",
    name: "Cycle",
    options: get(state.DisbursementsCycles, "data.data", []).map((o: any) => ({
      name: o.value,
      value: o.value,
    })),
  }));
  const fetchComponentFilterOptions = useStoreActions(
    (actions) => actions.ComponentFilterOptions.fetch,
  );
  const fetchLocationFilterOptions = useStoreActions(
    (actions) => actions.LocationFilterOptions.fetch,
  );
  const pageAppliedFilters = useStoreState((state) => [
    ...state.TempAppliedFiltersState.components,
    ...state.TempAppliedFiltersState.locations,
    ...state.TempAppliedFiltersState.principalRecipientTypes,
    ...state.TempAppliedFiltersState.principalRecipientSubTypes,
    ...state.TempAppliedFiltersState.principalRecipients,
    ...state.TempAppliedFiltersState.status,
    ...state.TempAppliedFiltersState.cycles,
  ]);
  const appliedFiltersData = useStoreState(
    (state) => state.AppliedFiltersState,
  );
  const appliedFiltersActions = useStoreActions(
    (actions) => actions.AppliedFiltersState,
  );
  const tempAppliedFiltersData = useStoreState(
    (state) => state.TempAppliedFiltersState,
  );
  const tempAppliedFiltersActions = useStoreActions(
    (actions) => actions.TempAppliedFiltersState,
  );

  const handleGeographyGroupingChange = (value: string) => {
    setGeographyGrouping(value);
  };

  // const handleComponentsGroupingChange = (value: string) => {
  //   setComponentsGrouping(value);
  // };

  const handleResetFilters = () => {
    tempAppliedFiltersActions.clearAll();
    appliedFiltersActions.setAll({
      ...appliedFiltersData,
      cycles: [],
      components: [],
      locations: [],
      principalRecipients: [],
      principalRecipientSubTypes: [],
      principalRecipientTypes: [],
      status: [],
    });
  };
  const handleCancelFilters = () => {
    tempAppliedFiltersActions.setAll({ ...appliedFiltersData });
  };
  const handleApplyFilters = () => {
    if (isEqual(appliedFiltersData, tempAppliedFiltersData)) return;

    appliedFiltersActions.setAll({ ...tempAppliedFiltersData });
  };

  const toolbarRightContent = React.useMemo(() => {
    return (
      <Box
        gap="20px"
        display="flex"
        flexDirection="row"
        alignItems="center"
        sx={{
          "@media (max-width: 767px)": {
            gap: "16px",
            flexDirection: "column",
            alignItems: "flex-start",
          },
        }}
        data-cy="toolbar-right-content"
      >
        <Box gap="10px" display="flex" flexDirection="row" alignItems="center">
          <Typography variant="body2" fontWeight="700">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.toolbarRightText1",
              "Geography grouping",
            )}
          </Typography>
          <Dropdown
            width={250}
            dropdownSelected={geographyGrouping}
            dropdownItems={geographyGroupingOptions}
            handleDropdownChange={handleGeographyGroupingChange}
          />
        </Box>
        {/* <Box gap="10px" display="flex" flexDirection="row" alignItems="center">
          <Typography variant="body2" fontWeight="700">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.toolbarRightText2",
              "Components grouping"
            )}
          </Typography>
          <Dropdown
            width={120}
            dropdownSelected={componentsGrouping}
            dropdownItems={componentsGroupingOptions}
            handleDropdownChange={handleComponentsGroupingChange}
          />
        </Box> */}
      </Box>
    );
  }, [componentsGrouping, geographyGrouping]);

  const filterGroups = React.useMemo(() => {
    return [
      // dataCycleFilterOptions,
      dataLocationFilterOptions,
      dataComponentFilterOptions,
      dataPartnerTypeFilterOptions,
      dataStatusFilterOptions,
    ];
  }, [
    dataLocationFilterOptions,
    dataComponentFilterOptions,
    dataPartnerTypeFilterOptions,
    dataStatusFilterOptions,
    // dataCycleFilterOptions,
  ]);
  const filterGroupsDisbursements = React.useMemo(() => {
    return [
      dataCycleFilterOptions,
      dataLocationFilterOptions,
      dataComponentFilterOptions,
      dataPartnerTypeFilterOptions,
      dataStatusFilterOptions,
    ];
  }, [
    dataLocationFilterOptions,
    dataComponentFilterOptions,
    dataPartnerTypeFilterOptions,
    dataStatusFilterOptions,
    dataCycleFilterOptions,
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
    if (
      appliedFiltersData.principalRecipientTypes.length > 0 &&
      location.search.includes("principalRecipientTypes=")
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipientTypes=${encodeURIComponent(
        appliedFiltersData.principalRecipientTypes.join(","),
      )}`;
    }
    if (
      appliedFiltersData.principalRecipientSubTypes.length > 0 &&
      location.search.includes("principalRecipientSubTypes=")
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipientSubTypes=${encodeURIComponent(
        appliedFiltersData.principalRecipientSubTypes.join(","),
      )}`;
    }
    if (
      appliedFiltersData.principalRecipients.length > 0 &&
      location.search.includes("principalRecipients=")
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipients=${encodeURIComponent(
        appliedFiltersData.principalRecipients.join(","),
      )}`;
    }
    if (
      appliedFiltersData.status.length > 0 &&
      location.search.includes("status=")
    ) {
      value += `${value.length > 0 ? "&" : ""}status=${encodeURIComponent(
        appliedFiltersData.status.join(","),
      )}`;
    }
    if (
      appliedFiltersData.cycles.length > 0 &&
      location.search.includes("cycles=")
    ) {
      // const years = appliedFiltersData.cycles.map(
      //   (cycle) => cycle.replace(/ /g, "").split("-")[0]
      // );
      // const yearsTo = appliedFiltersData.cycles.map(
      //   (cycle) => cycle.replace(/ /g, "").split("-")[1]
      // );
      // value += `${
      //   value.length > 0 ? "&" : ""
      // }years=${encodeURIComponent(
      //   years.join(",")
      // )}&yearsTo=${encodeURIComponent(yearsTo.join(","))}`;
      value += `${
        value.length > 0 ? "&" : ""
      }cycleNames=${appliedFiltersData.cycles.join(",")}`;
    }
    return value;
  }, [appliedFiltersData, location.search]);

  React.useEffect(() => {
    fetchComponentFilterOptions({
      routeParams: {
        type:
          componentsGrouping === componentsGroupingOptions[0].value
            ? "grouped"
            : "ungrouped",
      },
    });
  }, [componentsGrouping]);

  React.useEffect(() => {
    fetchLocationFilterOptions({
      routeParams: {
        type: geographyGrouping,
      },
    });
  }, [geographyGrouping]);

  useUnmount(() => {
    fetchLocationFilterOptions({
      routeParams: {
        type: geographyGroupingOptions[0].value,
      },
    });
  });

  return (
    <>
      <Helmet>
        <link
          rel="canonical"
          href={`${window.location.origin}/financial-insights`}
        />
      </Helmet>
      <DatasetPage
        title={getCMSDataField(
          cmsData,
          "pagesDatasetsGrantImplementation.title",
          "Financial Insights",
        )}
        filterGroups={filterGroups}
        appliedFilters={pageAppliedFilters}
        handleResetFilters={handleResetFilters}
        subtitle={getCMSDataField(
          cmsData,
          "pagesDatasetsGrantImplementation.subtitle",
          "See the disbursements, budgets and expenditures datasets and relating insights.",
        )}
        toolbarRightContent={toolbarRightContent}
        handleApplyFilters={handleApplyFilters}
        handleCancelFilters={handleCancelFilters}
      >
        <Box width="100%" marginTop="50px">
          <GrantImplementationPageBlock1
            filterString={filterString}
            geographyGrouping={geographyGrouping}
            componentsGrouping={componentsGrouping}
          />
          <FullWidthDivider />
          <GrantImplementationPageBlock2
            geographyGrouping={geographyGrouping}
            componentsGrouping={componentsGrouping}
            filterGroups={filterGroupsDisbursements}
          />
          <FullWidthDivider />
          <GrantImplementationPageBlock21 />
          <FullWidthDivider />
          <GrantImplementationPageBlock3
            filterString={filterString}
            filterGroups={filterGroups}
            geographyGrouping={geographyGrouping}
            componentsGrouping={componentsGrouping}
          />
          <FullWidthDivider />
          <GrantImplementationPageBlock4
            filterString={filterString}
            geographyGrouping={geographyGrouping}
            componentsGrouping={componentsGrouping}
          />
          <FullWidthDivider />
          <GrantImplementationPageBlock5
            filterGroups={filterGroups}
            geographyGrouping={geographyGrouping}
            componentsGrouping={componentsGrouping}
          />
          <FullWidthDivider />
          <GrantImplementationPageBlock6
            filterGroups={filterGroups}
            geographyGrouping={geographyGrouping}
            componentsGrouping={componentsGrouping}
          />
        </Box>
      </DatasetPage>
    </>
  );
};
