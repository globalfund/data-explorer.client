import { createStore, persist } from "easy-peasy";
import { StoreModel } from "app/state/api/interfaces";
import { CMSData } from "app/state/api/action-reducers/sync";
import GlobalSearch from "app/state/api/action-reducers/search";
import { GrantInfo } from "app/state/api/action-reducers/grant/info";
import { GrantList } from "app/state/api/action-reducers/grants/list";
import { HomeResultsStats } from "app/state/api/action-reducers/home/stats";
import { GeographyList } from "app/state/api/action-reducers/geography/list";
import { GrantOverview } from "app/state/api/action-reducers/grant/overview";
import DonorFilterOptions from "app/state/api/action-reducers/filters/donors";
import StatusFilterOptions from "app/state/api/action-reducers/filters/status";
import {
  AppliedFiltersState,
  AppliedFilterStringState,
  TempAppliedFiltersState,
} from "app/state/api/action-reducers/sync/filters";
import componentsSearch from "app/state/api/action-reducers/cms/componentsSearch";
import LocationFilterOptions from "app/state/api/action-reducers/filters/locations";
import ResultsDocuments from "app/state/api/action-reducers/annual-results/documents";
import { AnnualResultsStats } from "app/state/api/action-reducers/annual-results/stats";
import { AnnualResultsTable } from "app/state/api/action-reducers/annual-results/table";
import { HomeBudgetsTreemap } from "app/state/api/action-reducers/home/budgets-treemap";
import PartnerTypeFilterOptions from "app/state/api/action-reducers/filters/partnerTypes";
import { GeographyResultStats } from "app/state/api/action-reducers/geography/results-stats";
import { AccessToFundingStats } from "app/state/api/action-reducers/access-to-funding/stats";
import { GeographyResultsTable } from "app/state/api/action-reducers/geography/results-table";
import { FundingRequestsTableGeneric } from "app/state/api/action-reducers/viz/fundingRequests";
import { FinancialInsightsStats } from "app/state/api/action-reducers/financial-insights/stats";
import AccessToFundingDocuments from "app/state/api/action-reducers/access-to-funding/documents";
import { GrantBudgetSankeyChart } from "app/state/api/action-reducers/grant/budget-sankey-chart";
import { HomeExpendituresHeatmap } from "app/state/api/action-reducers/home/expenditures-heatmap";
import { GeographyDocumentsTable } from "app/state/api/action-reducers/geography/documents-table";
import { AnnualResultsPolyline } from "app/state/api/action-reducers/annual-results/polyline-tree";
import {
  GrantHasExpenditures,
  GrantExpendituresHeatmap,
} from "app/state/api/action-reducers/grant/expenditures-heatmap";
import { GrantTargetsResultsTable } from "app/state/api/action-reducers/grant/targets-results-table";
import { GeographyEligibilityTable } from "app/state/api/action-reducers/geography/eligibility-table";
import { ResourceMobilizationStats } from "app/state/api/action-reducers/resource-mobilization/stats";
import componentsChartsEligibility from "app/state/api/action-reducers/cms/componentsChartsEligibility";
import { GrantDisbursementsBarChart } from "app/state/api/action-reducers/grant/disbursements-bar-chart";
import { HomeAllocationsRadialChart } from "app/state/api/action-reducers/home/allocations-radial-chart";
import { HomeDisbursementsLineChart } from "app/state/api/action-reducers/home/disbursements-line-chart";
import { GeographyBudgetSankeyChart } from "app/state/api/action-reducers/geography/budgets-sankey-chart";
import { GeographyEligibilityHeatmap } from "app/state/api/action-reducers/geography/eligibility-heatmap";
import ReplenishmentPeriodFilterOptions from "app/state/api/action-reducers/filters/replenishment-periods";
import { GeographyExpendituresHeatmap } from "app/state/api/action-reducers/geography/expenditures-heatmap";
import { FinancialInsightsBudgetTable } from "app/state/api/action-reducers/financial-insights/budget-table";
import { GeographyFundingRequestsTable } from "app/state/api/action-reducers/geography/funding-requests-table";
import { FinancialInsightsBudgetSankey } from "app/state/api/action-reducers/financial-insights/budget-sankey";
import { GeographyResultsDocumentsTable } from "app/state/api/action-reducers/geography/results-documents-table";
import { FinancialInsightsBudgetTreemap } from "app/state/api/action-reducers/financial-insights/budget-treemap";
import { AccessToFundingAllocationTable } from "app/state/api/action-reducers/access-to-funding/allocation-table";
import { GeographyAllocationsRadialChart } from "app/state/api/action-reducers/geography/allocations-radial-chart";
import { GeographyDisbursementsLineChart } from "app/state/api/action-reducers/geography/disbursements-line-chart";
import { AccessToFundingEligibilityTable } from "app/state/api/action-reducers/access-to-funding/eligibility-table";
import { FinancialInsightsBudgetBreakdown } from "app/state/api/action-reducers/financial-insights/budget-breakdown";
import { HomePledgesContributionsBarChart } from "app/state/api/action-reducers/home/pledges-contributions-bar-chart";
import { AccessToFundingAllocationTreemap } from "app/state/api/action-reducers/access-to-funding/allocation-treemap";
import { AccessToFundingAllocationSunburst } from "app/state/api/action-reducers/access-to-funding/allocation-sunburst";
import { FinancialInsightsCountryAbsorption } from "app/state/api/action-reducers/financial-insights/country-absorption";
import { FinancialInsightsExpendituresTable } from "app/state/api/action-reducers/financial-insights/expenditures-table";
import { FinancialInsightsBudgetUtilisation } from "app/state/api/action-reducers/financial-insights/budget-utilisation";
import { FinancialInsightsDisbursementsTable } from "app/state/api/action-reducers/financial-insights/disbursements-table";
import { AccessToFundingAllocationBarSeries } from "app/state/api/action-reducers/access-to-funding/allocation-bar-series";
import { ResourceMobilizationTable } from "app/state/api/action-reducers/resource-mobilization/pledges-contributions-table";
import { AccessToFundingFundingRequestsTable } from "app/state/api/action-reducers/access-to-funding/funding-requests-table";
import { FinancialInsightsExpendituresHeatmap } from "app/state/api/action-reducers/financial-insights/expenditures-heatmap";
import { GeographyResourceMobilizationBarChart } from "app/state/api/action-reducers/geography/resource-mobilization-bar-chart";
import { FinancialInsightsExpendituresBarChart } from "app/state/api/action-reducers/financial-insights/expenditures-bar-chart";
import { FinancialInsightsDisbursementsBarChart } from "app/state/api/action-reducers/financial-insights/disbursements-bar-chart";
import { FinancialInsightsDisbursementsLineChart } from "app/state/api/action-reducers/financial-insights/disbursements-line-chart";
import { FinancialInsightsDisbursementUtilisation } from "app/state/api/action-reducers/financial-insights/disbursement-utilisation";
import { ResourceMobilizationExpandableBarChart } from "app/state/api/action-reducers/resource-mobilization/pledges-contributions-expandable-bar-chart";
import ComponentFilterOptions, {
  ResultsComponentFilterOptions,
} from "app/state/api/action-reducers/filters/components";
import {
  GeographyGrantsTable,
  GeographyGrantsPieCharts,
} from "app/state/api/action-reducers/geography/grants";
import {
  GeographyOverview,
  GeographyOverviewCoordinatingMechanismsContacts,
} from "app/state/api/action-reducers/geography/overview";
import {
  EligibilityYears,
  EligibilityStatusCodelist,
  EligibilityDiseaseBurdenCodelist,
} from "app/state/api/action-reducers/viz/eligibility";
import {
  BudgetsCycles,
  AllocationsCycles,
  EligibilityCycles,
  ExpendituresCycles,
  AnnualResultsCycles,
  DisbursementsCycles,
  FundingRequestsCycles,
  GeographyBudgetsCycles,
  GeographyAllocationsCycles,
  PledgesContributionsCycles,
  GeographyEligibilityCycles,
  GeographyExpendituresCycles,
  GeographyAnnualResultsCycles,
  GeographyDisbursementsCycles,
  GeographyFundingRequestsCycles,
  GeographyPledgesContributionsCycles,
  FinancialMetricsCycles,
} from "app/state/api/action-reducers/filters/cycles";
import pagesDatasets, {
  pagesDatasetsAccessToFunding,
  pagesDatasetsAnnualResults,
  pagesDatasetsGrantImplementation,
  pagesDatasetsResourceMobilization,
} from "app/state/api/action-reducers/cms/pagesDatasets";
import pagesGeography from "app/state/api/action-reducers/cms/pagesGeography";
import pagesGrantDetail, {
  pagesGrantDocuments,
  pagesGrantGrantImplementation,
  pagesGrantOverview,
  pagesGrantTargetResults,
} from "app/state/api/action-reducers/cms/pagesGrantDetail";
import pagesGrants from "app/state/api/action-reducers/cms/pagesGrants";
import pagesHome from "app/state/api/action-reducers/cms/pagesHome";
import pagesLocation, {
  pagesLocationAccessToFunding,
  pagesLocationGrantImplementation,
  pagesLocationOverview,
  pagesLocationResourceMobilization,
  pagesLocationResults,
} from "app/state/api/action-reducers/cms/pagesLocation";
import general from "app/state/api/action-reducers/cms/general";
import { FinancialInsightsHGISankey } from "app/state/api/action-reducers/financial-insights/hgi-sankey";
import { FinancialInsightsHGITable } from "app/state/api/action-reducers/financial-insights/hgi-table";
import { DatasetsLatestUpdate } from "app/state/api/action-reducers/latest-update";
import { countrySummary } from "../api/action-reducers/cms/collections";
import { formattedCollections } from "../api/action-reducers/cms/formatted";
import componentHeader from "../api/action-reducers/cms/componentsHeader";
import componentFooter from "../api/action-reducers/cms/componentsFooter";
import {
  RBReportItemOrderState,
  RBReportItemsControllerState,
  RBReportItemsState,
  RBReportNotesState,
  RBReportRTEState,
  RBReportSettings,
  RBTooltipTriggerState,
} from "../api/action-reducers/report-builder/sync";

const storeContent: StoreModel = {
  // homepage
  HomeResultsStats: persist(HomeResultsStats),
  HomePledgesContributionsBarChart: persist(HomePledgesContributionsBarChart),
  HomeAllocationsRadialChart: persist(HomeAllocationsRadialChart),
  HomeBudgetsTreemap: persist(HomeBudgetsTreemap),
  HomeDisbursementsLineChart: persist(HomeDisbursementsLineChart),
  HomeExpendituresHeatmap: persist(HomeExpendituresHeatmap),
  // resource mobilization
  ResourceMobilizationStats: persist(ResourceMobilizationStats),
  ResourceMobilizationExpandableBarChart: persist(
    ResourceMobilizationExpandableBarChart,
  ),
  ResourceMobilizationTable: persist(ResourceMobilizationTable),
  // geographies
  GeographyList: persist(GeographyList),
  // access to funding
  AccessToFundingStats: persist(AccessToFundingStats),
  AccessToFundingEligibilityTable: persist(AccessToFundingEligibilityTable),
  AccessToFundingAllocationBarSeries: persist(
    AccessToFundingAllocationBarSeries,
  ),
  AccessToFundingAllocationSunburst: persist(AccessToFundingAllocationSunburst),
  AccessToFundingAllocationTreemap: persist(AccessToFundingAllocationTreemap),
  AccessToFundingAllocationTable: persist(AccessToFundingAllocationTable),
  AccessToFundingFundingRequestsTable: persist(
    AccessToFundingFundingRequestsTable,
  ),
  AccessToFundingDocumentsTable: persist(AccessToFundingDocuments),
  // financial insights
  FinancialInsightsStats: persist(FinancialInsightsStats),
  FinancialInsightsDisbursementsBarChart: persist(
    FinancialInsightsDisbursementsBarChart,
  ),
  FinancialInsightsDisbursementsLineChart: persist(
    FinancialInsightsDisbursementsLineChart,
  ),
  FinancialInsightsDisbursementsTable: persist(
    FinancialInsightsDisbursementsTable,
  ),
  FinancialInsightsHGISankey: persist(FinancialInsightsHGISankey),
  FinancialInsightsHGITable: persist(FinancialInsightsHGITable),
  FinancialInsightsBudgetBreakdown: persist(FinancialInsightsBudgetBreakdown),
  FinancialInsightsBudgetUtilisation: persist(
    FinancialInsightsBudgetUtilisation,
  ),
  FinancialInsightsCountryAbsorption: persist(
    FinancialInsightsCountryAbsorption,
  ),
  FinancialInsightsDisbursementUtilisation: persist(
    FinancialInsightsDisbursementUtilisation,
  ),
  FinancialInsightsBudgetSankey: persist(FinancialInsightsBudgetSankey),
  FinancialInsightsBudgetTreemap: persist(FinancialInsightsBudgetTreemap),
  FinancialInsightsBudgetTable: persist(FinancialInsightsBudgetTable),
  FinancialInsightsExpendituresHeatmap: persist(
    FinancialInsightsExpendituresHeatmap,
  ),
  FinancialInsightsExpendituresBarChart: persist(
    FinancialInsightsExpendituresBarChart,
  ),
  FinancialInsightsExpendituresTable: persist(
    FinancialInsightsExpendituresTable,
  ),
  // annual results
  AnnualResultsStats: persist(AnnualResultsStats),
  AnnualResultsPolyline: persist(AnnualResultsPolyline),
  AnnualResultsTable: persist(AnnualResultsTable),
  AnnualResultsDocumentsTable: persist(ResultsDocuments),
  // grants
  GrantList: persist(GrantList),
  // location
  GeographyOverview: persist(GeographyOverview),
  GeographyOverviewCoordinatingMechanismsContacts: persist(
    GeographyOverviewCoordinatingMechanismsContacts,
  ),
  GeographyResourceMobilizationBarChart: persist(
    GeographyResourceMobilizationBarChart,
  ),
  GeographyAllocationsRadialChart: persist(GeographyAllocationsRadialChart),
  GeographyFundingRequestsTable: persist(GeographyFundingRequestsTable),
  GeographyEligibilityHeatmap: persist(GeographyEligibilityHeatmap),
  GeographyEligibilityTable: persist(GeographyEligibilityTable),
  GeographyDocumentsTable: persist(GeographyDocumentsTable),
  GeographyDisbursementsLineChart: persist(GeographyDisbursementsLineChart),
  GeographyBudgetSankeyChart: persist(GeographyBudgetSankeyChart),
  GeographyExpendituresHeatmap: persist(GeographyExpendituresHeatmap),
  GeographyGrantsPieCharts: persist(GeographyGrantsPieCharts),
  GeographyGrantsTable: persist(GeographyGrantsTable),
  GeographyResultStats: persist(GeographyResultStats),
  GeographyResultsTable: persist(GeographyResultsTable),
  GeographyResultsDocumentsTable: persist(GeographyResultsDocumentsTable),
  GeographyAllocationsCycles: persist(GeographyAllocationsCycles),
  GeographyFundingRequestsCycles: persist(GeographyFundingRequestsCycles),
  GeographyAnnualResultsCycles: persist(GeographyAnnualResultsCycles),
  GeographyBudgetsCycles: persist(GeographyBudgetsCycles),
  GeographyPledgesContributionsCycles: persist(
    GeographyPledgesContributionsCycles,
  ),
  GeographyDisbursementsCycles: persist(GeographyDisbursementsCycles),
  GeographyExpendituresCycles: persist(GeographyExpendituresCycles),
  GeographyEligibilityCycles: persist(GeographyEligibilityCycles),
  // grant
  GrantInfo: persist(GrantInfo),
  GrantOverview: persist(GrantOverview),
  GrantDisbursementsBarChart: persist(GrantDisbursementsBarChart),
  GrantBudgetSankeyChart: persist(GrantBudgetSankeyChart),
  GrantExpendituresHeatmap: persist(GrantExpendituresHeatmap),
  GrantHasExpenditures: persist(GrantHasExpenditures),
  GrantTargetsResultsTable: persist(GrantTargetsResultsTable),
  // search
  GlobalSearch: persist(GlobalSearch),
  // filter options api
  LocationFilterOptions: persist(LocationFilterOptions),
  ComponentFilterOptions: persist(ComponentFilterOptions),
  PartnerTypeFilterOptions: persist(PartnerTypeFilterOptions),
  StatusFilterOptions: persist(StatusFilterOptions),
  ReplenishmentPeriodFilterOptions: persist(ReplenishmentPeriodFilterOptions),
  DonorFilterOptions: persist(DonorFilterOptions),
  EligibilityStatusCodelist: persist(EligibilityStatusCodelist),
  EligibilityDiseaseBurdenCodelist: persist(EligibilityDiseaseBurdenCodelist),
  EligibilityYearsCodelist: persist(EligibilityStatusCodelist),
  EligibilityYears: persist(EligibilityYears),
  FundingRequestsTRPWindowCodelist: persist(FundingRequestsTableGeneric),
  FundingRequestsPortfolioCategoryCodelist: persist(
    FundingRequestsTableGeneric,
  ),
  LocationAccessToFunding: {
    GrantCycles: persist(FundingRequestsTableGeneric),
  },
  AllocationsCycles: persist(AllocationsCycles),
  FundingRequestsCycles: persist(FundingRequestsCycles),
  AnnualResultsCycles: persist(AnnualResultsCycles),
  BudgetsCycles: persist(BudgetsCycles),
  FinancialMetricsCycles: persist(FinancialMetricsCycles),
  PledgesContributionsCycles: persist(PledgesContributionsCycles),
  DisbursementsCycles: persist(DisbursementsCycles),
  ExpendituresCycles: persist(ExpendituresCycles),
  EligibilityCycles: persist(EligibilityCycles),
  ResultsComponentFilterOptions: persist(ResultsComponentFilterOptions),
  // general
  datasetsLatestUpdate: persist(DatasetsLatestUpdate),
  // sync state variables
  AppliedFiltersState: persist(AppliedFiltersState),
  AppliedFilterStringState: persist(AppliedFilterStringState),
  TempAppliedFiltersState: persist(TempAppliedFiltersState),
  // report builder
  RBReportItemsState: persist(RBReportItemsState),
  RBTooltipTriggerState: persist(RBTooltipTriggerState),
  RBReportItemsControllerState: persist(RBReportItemsControllerState),
  RBReportRTEState: persist(RBReportRTEState),
  RBReportItemOrderState: persist(RBReportItemOrderState),
  RBReportSettingsState: persist(RBReportSettings),
  RBReportNotesState: persist(RBReportNotesState),
  // CMS API
  CMSData: persist(CMSData),
  cms: {
    componentsChartsEligibility: persist(componentsChartsEligibility),
    componentsSearch: persist(componentsSearch),
    componentsHeader: persist(componentHeader),
    componentsFooter: persist(componentFooter),
    pagesDatasets: persist(pagesDatasets),
    pagesGeography: persist(pagesGeography),
    pagesGrantDetail: persist(pagesGrantDetail),
    pagesGrants: persist(pagesGrants),
    pagesHome: persist(pagesHome),
    pagesLocation: persist(pagesLocation),
    general: persist(general),
    pagesDatasetsAccessToFunding: persist(pagesDatasetsAccessToFunding),
    pagesDatasetsGrantImplementation: persist(pagesDatasetsGrantImplementation),
    pagesDatasetsAnnualResults: persist(pagesDatasetsAnnualResults),
    pagesDatasetsResourceMobilization: persist(
      pagesDatasetsResourceMobilization,
    ),
    pagesLocationAccessToFunding: persist(pagesLocationAccessToFunding),
    pagesLocationGrantImplementation: persist(pagesLocationGrantImplementation),
    pagesLocationOverview: persist(pagesLocationOverview),
    pagesLocationResourceMobilization: persist(
      pagesLocationResourceMobilization,
    ),
    pagesLocationResults: persist(pagesLocationResults),
    pagesGrantDocuments: persist(pagesGrantDocuments),
    pagesGrantGrantImplementation: persist(pagesGrantGrantImplementation),
    pagesGrantOverview: persist(pagesGrantOverview),
    pagesGrantTargetResults: persist(pagesGrantTargetResults),
    collections: {
      countrySummary: persist(countrySummary),
    },
    formattedCollections: persist(formattedCollections),
  },
};

export const store = createStore(storeContent);
