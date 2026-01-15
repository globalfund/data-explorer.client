import { Action, Thunk } from "easy-peasy";
import { CMSDataModel } from "app/state/api/action-reducers/sync";
import {
  RBReportItemControllerModel,
  RBReportItemOrderModel,
  RBReportItemsModel,
  RBReportNotesModel,
  RBReportRTEModel,
  RBReportSettingsModel,
  RBReportTooltipModel,
} from "app/state/api/action-reducers/report-builder/sync";
import {
  AppliedFiltersStateModel,
  AppliedFilterStringModel,
} from "app/state/api/action-reducers/sync/filters";
import {
  CMSApiComponentsChartsEligibility,
  CMSApiComponentsSearch,
  CMSApiPagesDatasets,
  CMSApiPagesGeography,
  CMSApiPagesGrantDetail,
  CMSApiPagesGrants,
  CMSApiPagesHome,
  CMSApiPagesLocation,
  CMSApiGeneral,
  CMSApiPagesDatatsetsAccessToFunding,
  CMSApiPagesDatatsetsAnnualResults,
  CMSApiPagesDatatsetsGrantImplementation,
  CMSApiPagesDatatsetsResourceMobilization,
  CMSApiPagesLocationAccessToFunding,
  CMSApiPagesLocationGrantImplementation,
  CMSApiPagesLocationOverview,
  CMSApiPagesLocationResults,
  CMSApiPagesLocationResourceMobilization,
  CMSApiPagesGrantDocuments,
  CMSApiPagesGrantGrantImplementation,
  CMSApiPagesGrantOverview,
  CMSApiPagesGrantTargetResults,
  CMSApiCountrySummary,
  CMSApiComponentsHeader,
  CMSApiComponentsFooter,
} from "app/state/api/interfaces/cms";

export interface RequestValues<T> {
  values?: T;
  addOnData?: boolean;
  isCMSfetch?: boolean;
  filterString?: string;
  getCountOnly?: boolean;
  routeParams?: {
    [key: string]: string;
  };
}

export interface ResponseData<T> {
  data: T[];
  count: number;
  addOnData?: boolean;
  getCountOnly?: boolean;
}

export interface Errors {
  status: number | null;
  statusText: string | null;
  result: object | null;
}

export interface ApiModel<QueryModel, ResponseModel> {
  loading: boolean;
  success: boolean;
  data: ResponseData<ResponseModel> | null | ResponseData<ResponseModel>[];
  setData: Action<ApiModel<QueryModel, ResponseModel>, any>;
  errorData: Errors | null;
  onError: Action<ApiModel<QueryModel, ResponseModel>, Errors>;
  setSuccess: Action<ApiModel<QueryModel, ResponseModel>>;
  onSuccess: Action<
    ApiModel<QueryModel, ResponseModel>,
    ResponseData<ResponseModel> | ResponseData<ResponseModel>[]
  >;
  onRequest: Action<ApiModel<QueryModel, ResponseModel>>;
  fetch: Thunk<ApiModel<QueryModel, ResponseModel>, RequestValues<QueryModel>>;
  clear: Action<ApiModel<QueryModel, ResponseModel>>;
  post: Thunk<ApiModel<QueryModel, ResponseModel>, RequestValues<QueryModel>>;
}

export interface ApiResponseModel {
  data: any[];
  count: number;
}

export type ApiCallModel = ApiModel<
  object | object[] | string,
  ApiResponseModel
>;
export interface CMSFormattedCollectionsModel {
  countrySummary: {
    [key: string]: string;
  };
  setPagesData: Action<
    CMSFormattedCollectionsModel,
    {
      countrySummary: {
        [key: string]: string;
      };
    }
  >;
}
// CMS API Call model for
export type CMSApiCallModel = ApiModel<
  object,
  | CMSApiComponentsChartsEligibility
  | CMSApiComponentsSearch
  | CMSApiComponentsHeader
  | CMSApiComponentsFooter
  | CMSApiPagesDatasets
  | CMSApiPagesGeography
  | CMSApiPagesGrantDetail
  | CMSApiPagesGrants
  | CMSApiPagesHome
  | CMSApiPagesLocation
  | CMSApiGeneral
  | CMSApiPagesDatatsetsAccessToFunding
  | CMSApiPagesDatatsetsAnnualResults
  | CMSApiPagesDatatsetsGrantImplementation
  | CMSApiPagesDatatsetsResourceMobilization
  | CMSApiPagesLocationAccessToFunding
  | CMSApiPagesLocationGrantImplementation
  | CMSApiPagesLocationOverview
  | CMSApiPagesLocationResults
  | CMSApiPagesLocationResourceMobilization
  | CMSApiPagesGrantDocuments
  | CMSApiPagesGrantGrantImplementation
  | CMSApiPagesGrantOverview
  | CMSApiPagesGrantTargetResults
  | CMSApiCountrySummary
>;

export interface StoreModel {
  // homepage
  HomeResultsStats: ApiCallModel;
  HomePledgesContributionsBarChart: ApiCallModel;
  HomeAllocationsRadialChart: ApiCallModel;
  HomeBudgetsTreemap: ApiCallModel;
  HomeDisbursementsLineChart: ApiCallModel;
  HomeExpendituresHeatmap: ApiCallModel;
  // resource mobilization
  ResourceMobilizationStats: ApiCallModel;
  ResourceMobilizationExpandableBarChart: ApiCallModel;
  ResourceMobilizationTable: ApiCallModel;
  // geographies
  GeographyList: ApiCallModel;
  // access to funding
  AccessToFundingStats: ApiCallModel;
  AccessToFundingEligibilityTable: ApiCallModel;
  AccessToFundingAllocationBarSeries: ApiCallModel;
  AccessToFundingAllocationSunburst: ApiCallModel;
  AccessToFundingAllocationTreemap: ApiCallModel;
  AccessToFundingAllocationTable: ApiCallModel;
  AccessToFundingFundingRequestsTable: ApiCallModel;
  AccessToFundingDocumentsTable: ApiCallModel;
  // financial insights
  FinancialInsightsStats: ApiCallModel;
  FinancialInsightsDisbursementsBarChart: ApiCallModel;
  FinancialInsightsDisbursementsLineChart: ApiCallModel;
  FinancialInsightsDisbursementsTable: ApiCallModel;
  FinancialInsightsHGISankey: ApiCallModel;
  FinancialInsightsHGITable: ApiCallModel;
  FinancialInsightsBudgetBreakdown: ApiCallModel;
  FinancialInsightsBudgetUtilisation: ApiCallModel;
  FinancialInsightsCountryAbsorption: ApiCallModel;
  FinancialInsightsDisbursementUtilisation: ApiCallModel;
  FinancialInsightsBudgetSankey: ApiCallModel;
  FinancialInsightsBudgetTreemap: ApiCallModel;
  FinancialInsightsBudgetTable: ApiCallModel;
  FinancialInsightsExpendituresHeatmap: ApiCallModel;
  FinancialInsightsExpendituresBarChart: ApiCallModel;
  FinancialInsightsExpendituresTable: ApiCallModel;
  // annual results
  AnnualResultsStats: ApiCallModel;
  AnnualResultsPolyline: ApiCallModel;
  AnnualResultsTable: ApiCallModel;
  AnnualResultsDocumentsTable: ApiCallModel;
  // grants
  GrantList: ApiCallModel;
  // location
  GeographyOverview: ApiCallModel;
  GeographyOverviewCoordinatingMechanismsContacts: ApiCallModel;
  GeographyResourceMobilizationBarChart: ApiCallModel;
  GeographyAllocationsRadialChart: ApiCallModel;
  GeographyFundingRequestsTable: ApiCallModel;
  GeographyEligibilityHeatmap: ApiCallModel;
  GeographyEligibilityTable: ApiCallModel;
  GeographyDocumentsTable: ApiCallModel;
  GeographyDisbursementsLineChart: ApiCallModel;
  GeographyBudgetSankeyChart: ApiCallModel;
  GeographyExpendituresHeatmap: ApiCallModel;
  GeographyGrantsPieCharts: ApiCallModel;
  GeographyGrantsTable: ApiCallModel;
  GeographyResultStats: ApiCallModel;
  GeographyResultsTable: ApiCallModel;
  GeographyResultsDocumentsTable: ApiCallModel;
  GeographyAllocationsCycles: ApiCallModel;
  GeographyFundingRequestsCycles: ApiCallModel;
  GeographyAnnualResultsCycles: ApiCallModel;
  GeographyBudgetsCycles: ApiCallModel;
  GeographyPledgesContributionsCycles: ApiCallModel;
  GeographyDisbursementsCycles: ApiCallModel;
  GeographyExpendituresCycles: ApiCallModel;
  GeographyEligibilityCycles: ApiCallModel;
  // grant
  GrantInfo: ApiCallModel;
  GrantOverview: ApiCallModel;
  GrantDisbursementsBarChart: ApiCallModel;
  GrantBudgetSankeyChart: ApiCallModel;
  GrantExpendituresHeatmap: ApiCallModel;
  GrantHasExpenditures: ApiCallModel;
  GrantTargetsResultsTable: ApiCallModel;
  // search
  GlobalSearch: ApiCallModel;
  // filter options api
  LocationFilterOptions: ApiCallModel;
  ComponentFilterOptions: ApiCallModel;
  PartnerTypeFilterOptions: ApiCallModel;
  StatusFilterOptions: ApiCallModel;
  ReplenishmentPeriodFilterOptions: ApiCallModel;
  DonorFilterOptions: ApiCallModel;
  EligibilityStatusCodelist: ApiCallModel;
  EligibilityDiseaseBurdenCodelist: ApiCallModel;
  EligibilityYearsCodelist: ApiCallModel;
  EligibilityYears: ApiCallModel;
  FundingRequestsTRPWindowCodelist: ApiCallModel;
  FundingRequestsPortfolioCategoryCodelist: ApiCallModel;
  LocationAccessToFunding: {
    GrantCycles: ApiCallModel;
  };
  AllocationsCycles: ApiCallModel;
  FundingRequestsCycles: ApiCallModel;
  AnnualResultsCycles: ApiCallModel;
  BudgetsCycles: ApiCallModel;
  FinancialMetricsCycles: ApiCallModel;
  PledgesContributionsCycles: ApiCallModel;
  DisbursementsCycles: ApiCallModel;
  ExpendituresCycles: ApiCallModel;
  EligibilityCycles: ApiCallModel;
  ResultsComponentFilterOptions: ApiCallModel;
  // general
  datasetsLatestUpdate: ApiCallModel;
  // sync state variables
  AppliedFiltersState: AppliedFiltersStateModel;
  AppliedFilterStringState: AppliedFilterStringModel;
  TempAppliedFiltersState: AppliedFiltersStateModel;
  // report builder
  RBReportItemsState: RBReportItemsModel;
  RBTooltipTriggerState: RBReportTooltipModel;
  RBReportItemsControllerState: RBReportItemControllerModel;
  RBReportRTEState: RBReportRTEModel;
  RBReportItemOrderState: RBReportItemOrderModel;
  RBReportSettingsState: RBReportSettingsModel;
  RBReportNotesState: RBReportNotesModel;
  // CMS
  CMSData: CMSDataModel;
  cms: {
    componentsChartsEligibility: CMSApiCallModel;
    componentsSearch: CMSApiCallModel;
    componentsFooter: CMSApiCallModel;
    componentsHeader: CMSApiCallModel;
    pagesDatasets: CMSApiCallModel;
    pagesGeography: CMSApiCallModel;
    pagesGrantDetail: CMSApiCallModel;
    pagesGrants: CMSApiCallModel;
    pagesHome: CMSApiCallModel;
    pagesLocation: CMSApiCallModel;
    general: CMSApiCallModel;
    pagesDatasetsAccessToFunding: CMSApiCallModel;
    pagesDatasetsGrantImplementation: CMSApiCallModel;
    pagesDatasetsAnnualResults: CMSApiCallModel;
    pagesDatasetsResourceMobilization: CMSApiCallModel;
    pagesLocationAccessToFunding: CMSApiCallModel;
    pagesLocationGrantImplementation: CMSApiCallModel;
    pagesLocationOverview: CMSApiCallModel;
    pagesLocationResourceMobilization: CMSApiCallModel;
    pagesLocationResults: CMSApiCallModel;
    pagesGrantDocuments: CMSApiCallModel;
    pagesGrantGrantImplementation: CMSApiCallModel;
    pagesGrantOverview: CMSApiCallModel;
    pagesGrantTargetResults: CMSApiCallModel;
    formattedCollections: CMSFormattedCollectionsModel;
    collections: {
      countrySummary: CMSApiCallModel;
    };
  };
}
