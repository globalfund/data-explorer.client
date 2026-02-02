import React from "react";
import get from "lodash/get";
import remove from "lodash/remove";
import Box from "@mui/material/Box";
import { Helmet } from "react-helmet-async";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { Results } from "app/pages/location/views/results";
import CircularProgress from "@mui/material/CircularProgress";
import { DetailPageTabs } from "app/components/detail-page-tabs";
import { LocationOverview } from "app/pages/location/views/overview";
import { RESULT_YEARS } from "app/pages/location/views/results/data";
import { getLocationTabs } from "app/components/detail-page-tabs/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { AccessToFunding } from "app/pages/location/views/access-to-funding";
import { GrantImplementation } from "app/pages/location/views/grant-implementation";
import { ResourceMobilization } from "app/pages/location/views/resource-mobilization";

export const Location: React.FC = () => {
  const params = useParams<{ id: string; tab: string }>();
  const routeParamsId = params.id as string;
  const paramsId = params.id?.replace("|", "%2F") as string;

  const cmsData = useCMSData({ returnData: true });
  const cyclesResultsTable = useStoreState(
    (state) =>
      get(state.AnnualResultsCycles, "data.data", []).map(
        (c: { name: number; value: number }) => ({
          name: c.name.toString(),
          value: c.value.toString(),
        }),
      ) as {
        name: string;
        value: string;
      }[],
  );
  const [resultsYear, setResultsYear] = React.useState(
    cyclesResultsTable[0] ?? new Date().getFullYear().toString(),
  );

  const dataOverview = useStoreState((state) =>
    get(state.GeographyOverview, "data.data[0]", {
      name: "",
      region: "",
      description: "",
      isDonor: false,
      FPMName: "",
      FPMEmail: "",
      currentPrincipalRecipients: [],
      formerPrincipalRecipients: [],
    }),
  );
  const loadingOverview = useStoreState(
    (state) => state.GeographyOverview.loading,
  );
  const fetchOverview = useStoreActions(
    (actions) => actions.GeographyOverview.fetch,
  );
  const clearOverview = useStoreActions(
    (actions) => actions.GeographyOverview.clear,
  );
  const fetchCCMContacts = useStoreActions(
    (actions) => actions.GeographyOverviewCoordinatingMechanismsContacts.fetch,
  );
  const loadingCCMContacts = useStoreState(
    (state) => state.GeographyOverviewCoordinatingMechanismsContacts.loading,
  );
  const clearCCMContacts = useStoreActions(
    (actions) => actions.GeographyOverviewCoordinatingMechanismsContacts.clear,
  );
  const fetchRMBarChart = useStoreActions(
    (actions) => actions.GeographyResourceMobilizationBarChart.fetch,
  );
  const loadingRMBarChart = useStoreState(
    (state) => state.GeographyResourceMobilizationBarChart.loading,
  );
  const clearRMBarChart = useStoreActions(
    (actions) => actions.GeographyResourceMobilizationBarChart.clear,
  );
  const fetchAllocationsRadialChart = useStoreActions(
    (actions) => actions.GeographyAllocationsRadialChart.fetch,
  );
  const loadingAllocationsRadialChart = useStoreState(
    (state) => state.GeographyAllocationsRadialChart.loading,
  );
  const clearAllocationsRadialChart = useStoreActions(
    (actions) => actions.GeographyAllocationsRadialChart.clear,
  );
  const fetchFundingRequestsTable = useStoreActions(
    (actions) => actions.GeographyFundingRequestsTable.fetch,
  );
  const loadingFundingRequestsTable = useStoreState(
    (state) => state.GeographyFundingRequestsTable.loading,
  );
  const clearFundingRequestsTable = useStoreActions(
    (actions) => actions.GeographyFundingRequestsTable.clear,
  );
  const fetchEligibilityTable = useStoreActions(
    (actions) => actions.GeographyEligibilityTable.fetch,
  );
  const loadingEligibilityTable = useStoreState(
    (state) => state.GeographyEligibilityTable.loading,
  );
  const clearEligibilityTable = useStoreActions(
    (actions) => actions.GeographyEligibilityTable.clear,
  );
  const fetchDocumentsTable = useStoreActions(
    (actions) => actions.GeographyDocumentsTable.fetch,
  );
  const loadingDocumentsTable = useStoreState(
    (state) => state.GeographyDocumentsTable.loading,
  );
  const clearDocumentsTable = useStoreActions(
    (actions) => actions.GeographyDocumentsTable.clear,
  );
  const fetchDisbursementsLineChart = useStoreActions(
    (actions) => actions.GeographyDisbursementsLineChart.fetch,
  );
  const loadingDisbursementsLineChart = useStoreState(
    (state) => state.GeographyDisbursementsLineChart.loading,
  );
  const clearDisbursementsLineChart = useStoreActions(
    (actions) => actions.GeographyDisbursementsLineChart.clear,
  );
  const fetchBudgetSankeyChart = useStoreActions(
    (actions) => actions.GeographyBudgetSankeyChart.fetch,
  );
  const loadingBudgetSankeyChart = useStoreState(
    (state) => state.GeographyBudgetSankeyChart.loading,
  );
  const clearBudgetSanketChart = useStoreActions(
    (actions) => actions.GeographyBudgetSankeyChart.clear,
  );
  const fetchExpendituresHeatmap = useStoreActions(
    (actions) => actions.GeographyExpendituresHeatmap.fetch,
  );
  const loadingExpendituresHeatmap = useStoreState(
    (state) => state.GeographyExpendituresHeatmap.loading,
  );
  const clearExpendituresHeatmap = useStoreActions(
    (actions) => actions.GeographyExpendituresHeatmap.clear,
  );
  const fetchGrantsPieCharts = useStoreActions(
    (actions) => actions.GeographyGrantsPieCharts.fetch,
  );
  const loadingGrantsPieCharts = useStoreState(
    (state) => state.GeographyGrantsPieCharts.loading,
  );
  const clearGrantsPieCharts = useStoreActions(
    (actions) => actions.GeographyGrantsPieCharts.clear,
  );
  const fetchGrantsTable = useStoreActions(
    (actions) => actions.GeographyGrantsTable.fetch,
  );
  const loadingGrantsTable = useStoreState(
    (state) => state.GeographyGrantsTable.loading,
  );
  const clearGrantsTable = useStoreActions(
    (actions) => actions.GeographyGrantsTable.clear,
  );
  const dataResultsTable = useStoreState((state) =>
    get(state.GeographyResultsTable, "data.data", []),
  );
  const fetchResultStats = useStoreActions(
    (actions) => actions.GeographyResultStats.fetch,
  );
  const loadingResultStats = useStoreState(
    (state) => state.GeographyResultStats.loading,
  );
  const clearResultStats = useStoreActions(
    (actions) => actions.GeographyResultStats.clear,
  );
  const fetchResultsTable = useStoreActions(
    (actions) => actions.GeographyResultsTable.fetch,
  );
  const loadingResultsTable = useStoreState(
    (state) => state.GeographyResultsTable.loading,
  );
  const clearResultsTable = useStoreActions(
    (actions) => actions.GeographyResultsTable.clear,
  );
  const dataResultsDocumentsTable = useStoreState((state) =>
    get(state.GeographyResultsDocumentsTable, "data.data", []),
  );
  const fetchResultsDocumentsTable = useStoreActions(
    (actions) => actions.GeographyResultsDocumentsTable.fetch,
  );
  const loadingResultsDocumentsTable = useStoreState(
    (state) => state.GeographyResultsDocumentsTable.loading,
  );
  const clearResultsDocumentsTable = useStoreActions(
    (actions) => actions.GeographyResultsDocumentsTable.clear,
  );
  const fetchAllocationsCycles = useStoreActions(
    (actions) => actions.GeographyAllocationsCycles.fetch,
  );
  const fetchAnnualResultsCycles = useStoreActions(
    (actions) => actions.GeographyAnnualResultsCycles.fetch,
  );
  const fetchDisbursementsCycles = useStoreActions(
    (actions) => actions.GeographyDisbursementsCycles.fetch,
  );
  const fetchExpendituresCycles = useStoreActions(
    (actions) => actions.GeographyExpendituresCycles.fetch,
  );
  const fetchEligibilityCycles = useStoreActions(
    (actions) => actions.GeographyEligibilityCycles.fetch,
  );
  const fetchPledgesContributionsCycles = useStoreActions(
    (actions) => actions.GeographyPledgesContributionsCycles.fetch,
  );
  const fetchFundingRequestsCycles = useStoreActions(
    (actions) => actions.GeographyFundingRequestsCycles.fetch,
  );
  const fetchBudgetsCycles = useStoreActions(
    (actions) => actions.GeographyBudgetsCycles.fetch,
  );
  const clearAllocationsCycles = useStoreActions(
    (actions) => actions.GeographyAllocationsCycles.clear,
  );
  const clearAnnualResultsCycles = useStoreActions(
    (actions) => actions.GeographyAnnualResultsCycles.clear,
  );
  const clearDisbursementsCycles = useStoreActions(
    (actions) => actions.GeographyDisbursementsCycles.clear,
  );
  const clearExpendituresCycles = useStoreActions(
    (actions) => actions.GeographyExpendituresCycles.clear,
  );
  const clearEligibilityCycles = useStoreActions(
    (actions) => actions.GeographyEligibilityCycles.clear,
  );
  const clearPledgesContributionsCycles = useStoreActions(
    (actions) => actions.GeographyPledgesContributionsCycles.clear,
  );
  const clearFundingRequestsCycles = useStoreActions(
    (actions) => actions.GeographyFundingRequestsCycles.clear,
  );
  const clearBudgetsCycles = useStoreActions(
    (actions) => actions.GeographyBudgetsCycles.clear,
  );

  const LOCATION_TABS = React.useMemo(
    () => getLocationTabs(cmsData),
    [cmsData],
  );

  const loading = React.useMemo(() => {
    switch (`/${params.tab}`) {
      case LOCATION_TABS[0].link:
        return loadingOverview || loadingCCMContacts;
      case LOCATION_TABS[1].link:
        return loadingRMBarChart;
      case LOCATION_TABS[2].link:
        return (
          loadingAllocationsRadialChart ||
          loadingFundingRequestsTable ||
          loadingEligibilityTable ||
          loadingDocumentsTable
        );
      case LOCATION_TABS[3].link:
        return (
          loadingDisbursementsLineChart ||
          loadingBudgetSankeyChart ||
          loadingExpendituresHeatmap ||
          loadingGrantsPieCharts ||
          loadingGrantsTable
        );
      case LOCATION_TABS[4].link:
        return (
          loadingResultStats ||
          loadingResultsTable ||
          loadingResultsDocumentsTable
        );
      default:
        return false;
    }
  }, [
    params.tab,
    loadingOverview,
    loadingCCMContacts,
    loadingRMBarChart,
    loadingAllocationsRadialChart,
    loadingFundingRequestsTable,
    loadingEligibilityTable,
    loadingDocumentsTable,
    loadingDisbursementsLineChart,
    loadingBudgetSankeyChart,
    loadingExpendituresHeatmap,
    loadingGrantsPieCharts,
    loadingGrantsTable,
    loadingResultStats,
    loadingResultsTable,
    loadingResultsDocumentsTable,
    LOCATION_TABS,
  ]);

  const view = React.useMemo(() => {
    switch (params.tab) {
      case "overview":
        return <LocationOverview />;
      case "financial-insights":
        return <GrantImplementation />;
      case "resource-mobilization":
        return <ResourceMobilization />;
      case "access-to-funding":
        return <AccessToFunding />;
      case "results":
        return (
          <Results resultsYear={resultsYear} setResultsYear={setResultsYear} />
        );
      default:
        return <div />;
    }
  }, [params.tab, resultsYear]);

  const tabs = React.useMemo(() => {
    const newTabs = [...LOCATION_TABS];
    if (!dataOverview.isDonor) {
      remove(newTabs, (tab) => tab.label === LOCATION_TABS[1].label);
    }
    if (
      dataResultsTable.length === 0 &&
      dataResultsDocumentsTable.length === 0
    ) {
      remove(newTabs, (tab) => tab.label === LOCATION_TABS[4].label);
    }
    return newTabs;
  }, [
    dataOverview,
    dataResultsTable,
    dataResultsDocumentsTable,
    LOCATION_TABS,
  ]);

  React.useEffect(() => {
    if (paramsId) {
      fetchOverview({
        routeParams: {
          code: routeParamsId,
        },
      });
      fetchCCMContacts({
        routeParams: {
          code: routeParamsId,
        },
      });
      fetchAllocationsRadialChart({
        routeParams: {
          code: routeParamsId,
        },
      });
      fetchFundingRequestsTable({
        routeParams: {
          code: routeParamsId,
        },
      });
      fetchEligibilityTable({
        filterString: `geographies=${paramsId}`,
      });
      fetchDisbursementsLineChart({
        filterString: `geographies=${paramsId}`,
        routeParams: {
          componentField: "activityAreaGroup",
        },
      });
      fetchBudgetSankeyChart({
        filterString: `geographies=${paramsId}`,
        routeParams: {
          componentField: "activityAreaGroup",
        },
      });
      fetchExpendituresHeatmap({
        filterString: `geographies=${paramsId}`,
        routeParams: {
          row: "principalRecipientType,principalRecipientSubType,principalRecipient",
          column: "component",
          componentField: "activityAreaGroup",
        },
      });
      fetchGrantsPieCharts({
        routeParams: {
          code: routeParamsId,
        },
      });
      fetchResultStats({
        filterString: `geographies=${paramsId}&cycle=${
          RESULT_YEARS[RESULT_YEARS.length - 1].value
        }`,
      });
      fetchDocumentsTable({
        filterString: `types=Application&geographies=${paramsId}`,
      });
      fetchResultsDocumentsTable({
        filterString: `types=Profile&geographies=${paramsId}`,
      });
      fetchAllocationsCycles({
        filterString: `geographies=${paramsId}`,
      });
      fetchAnnualResultsCycles({
        filterString: `geographies=${paramsId}`,
      });
      fetchDisbursementsCycles({
        filterString: `geographies=${paramsId}`,
      });
      fetchExpendituresCycles({
        filterString: `geographies=${paramsId}`,
      });
      fetchEligibilityCycles({
        filterString: `geographies=${paramsId}`,
      });
      fetchPledgesContributionsCycles({
        filterString: `geographies=${paramsId}`,
      });
      fetchFundingRequestsCycles({
        filterString: `geographies=${paramsId}`,
      });
      fetchBudgetsCycles({
        filterString: `geographies=${paramsId}`,
      });
      fetchGrantsTable({
        filterString: `geographies=${paramsId}`,
        routeParams: {
          page: "1",
          pageSize: "all",
        },
      });
    }
  }, [paramsId]);

  React.useEffect(() => {
    if (dataOverview.isDonor) {
      fetchRMBarChart({
        filterString: `geographies=${paramsId}`,
      });
    }
  }, [dataOverview]);

  React.useEffect(() => {
    if (paramsId) {
      fetchResultsTable({
        routeParams: {
          code: routeParamsId,
          cycle: resultsYear.value,
        },
      });
    }
  }, [paramsId, resultsYear]);

  React.useEffect(() => {
    return () => {
      clearOverview();
      clearCCMContacts();
      clearRMBarChart();
      clearAllocationsRadialChart();
      clearFundingRequestsTable();
      clearEligibilityTable();
      clearDocumentsTable();
      clearDisbursementsLineChart();
      clearBudgetSanketChart();
      clearExpendituresHeatmap();
      clearGrantsPieCharts();
      clearGrantsTable();
      clearResultStats();
      clearResultsTable();
      clearResultsDocumentsTable();
      clearAllocationsCycles();
      clearAnnualResultsCycles();
      clearDisbursementsCycles();
      clearExpendituresCycles();
      clearEligibilityCycles();
      clearPledgesContributionsCycles();
      clearFundingRequestsCycles();
      clearBudgetsCycles();
    };
  }, []);

  const fullWidthDivider = (
    <Divider
      sx={{
        left: "-50vw",
        width: "200vw",
        position: "relative",
        borderTopColor: "#868E96",
        "@media (max-width: 767px)": {
          display: "none",
        },
      }}
    />
  );

  return (
    <>
      <Helmet>
        <link
          rel="canonical"
          href={`${window.location.origin}/location/${paramsId}/${params.tab}`}
        />
      </Helmet>
      <Box
        padding="50px 0"
        sx={{
          "@media (max-width: 767px)": {
            padding: "32px 0",
          },
        }}
      >
        <Typography
          variant="h1"
          lineHeight={1.2}
          sx={{
            "@media (max-width: 767px)": {
              wordBreak: "break-word",
            },
          }}
        >
          {dataOverview.name}
          {loading && <CircularProgress sx={{ marginLeft: "16px" }} />}
        </Typography>
        <Typography
          variant="h4"
          lineHeight={1}
          marginBottom="50px"
          sx={{
            "@media (max-width: 767px)": {
              marginBottom: "4px",
              wordBreak: "break-word",
            },
          }}
        >
          {dataOverview.region}
        </Typography>
        {fullWidthDivider}
        <DetailPageTabs
          tabs={tabs}
          activeTab={params.tab}
          baseRoute={`/location`}
        />
        {fullWidthDivider}
        <Box
          marginTop="40px"
          sx={{
            "@media (max-width: 767px)": {
              marginTop: 0,
            },
          }}
        >
          {view}
        </Box>
      </Box>
    </>
  );
};
