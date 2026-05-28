import { action, Action } from "easy-peasy";

export interface CMSDataValueModel {
  componentsAppBar: {
    [key: string]: any;
  };
  componentsChartsBudgets: {
    [key: string]: any;
  };
  componentsChartsCommon: {
    [key: string]: any;
  };
  componentsChartsEligibility: {
    [key: string]: any;
  };
  componentsChartsGeomap: {
    [key: string]: any;
  };
  componentsChartsGrants: {
    [key: string]: any;
  };
  componentsChartsInvestments: {
    [key: string]: any;
  };
  componentsChartsNetwork: {
    [key: string]: any;
  };
  componentsChartsPerformanceRating: {
    [key: string]: any;
  };
  componentsChartsPledges: {
    [key: string]: any;
  };
  componentsCookieDialog: {
    [key: string]: any;
  };
  componentsDatasetCarousel: {
    [key: string]: any;
  };
  componentsInformationPanel: {
    [key: string]: any;
  };
  componentsMobile: {
    [key: string]: any;
  };
  componentsPageHeader: {
    [key: string]: any;
  };
  componentsPerformanceFrameworkComponents: {
    [key: string]: any;
  };
  componentsSearch: {
    [key: string]: any;
  };
  componentsSlideInPanel: {
    [key: string]: any;
  };
  modulesLanding: {
    [key: string]: any;
  };
  modulesAbout: {
    [key: string]: any;
  };
  modulesCommon: {
    [key: string]: any;
  };
  modulesCountryDetail: {
    [key: string]: any;
  };
  modulesDatasets: {
    [key: string]: any;
  };
  modulesGrantDetail: {
    [key: string]: any;
  };
  modulesGrants: {
    [key: string]: any;
  };
  pagesDatasets: { [key: string]: any };
  pagesGeography: { [key: string]: any };
  pagesGrantDetail: { [key: string]: any };
  pagesGrants: { [key: string]: any };
  pagesHome: { [key: string]: any };
  pagesLocation: { [key: string]: any };
  general: { [key: string]: any };
  pagesDatasetsAccessToFunding: { [key: string]: any };
  pagesDatasetsGrantImplementation: { [key: string]: any };
  pagesDatasetsAnnualResults: { [key: string]: any };
  pagesDatasetsResourceMobilization: { [key: string]: any };
  pagesLocationAccessToFunding: { [key: string]: any };
  pagesLocationGrantImplementation: { [key: string]: any };
  pagesLocationOverview: { [key: string]: any };
  pagesLocationResourceMobilization: { [key: string]: any };
  pagesLocationResults: { [key: string]: any };
  pagesGrantDocuments: { [key: string]: any };
  pagesGrantGrantImplementation: { [key: string]: any };
  pagesGrantOverview: { [key: string]: any };
  pagesGrantTargetResults: { [key: string]: any };
  componentsRBChartSelectModal: { [key: string]: any };
  componentsRBTemplatesLayoutsView: { [key: string]: any };
  componentsRBAllAssetsEmpty: { [key: string]: any };
  componentsRBAllAssetsToolbar: { [key: string]: any };
  componentsRBSaveAsAssetModal: { [key: string]: any };
  componentsRBSelectGridModal: { [key: string]: any };
  componentsRBSelectColumnModal: { [key: string]: any };
  componentsRBComponentOptions: { [key: string]: any };
  componentsRBGridElementsList: { [key: string]: any };
  pagesReportBuilderMain: { [key: string]: any };
  pagesReportBuilderBuilder: { [key: string]: any };
  pagesReportBuilderPreview: { [key: string]: any };
}

export interface CMSDataModel {
  value: CMSDataValueModel;
  setValue: Action<CMSDataModel, CMSDataValueModel>;
}

export const CMSData: CMSDataModel = {
  value: {
    componentsAppBar: {},
    componentsChartsBudgets: {},
    componentsChartsCommon: {},
    componentsChartsEligibility: {},
    componentsChartsGeomap: {},
    componentsChartsGrants: {},
    componentsChartsInvestments: {},
    componentsChartsNetwork: {},
    componentsChartsPerformanceRating: {},
    componentsChartsPledges: {},
    componentsCookieDialog: {},
    componentsDatasetCarousel: {},
    componentsInformationPanel: {},
    componentsMobile: {},
    componentsPageHeader: {},
    componentsPerformanceFrameworkComponents: {},
    componentsSearch: {},
    componentsSlideInPanel: {},
    modulesLanding: {},
    modulesAbout: {},
    modulesCommon: {},
    modulesCountryDetail: {},
    modulesDatasets: {},
    modulesGrantDetail: {},
    modulesGrants: {},
    pagesDatasets: {},
    pagesGeography: {},
    pagesGrantDetail: {},
    pagesGrants: {},
    pagesHome: {},
    pagesLocation: {},
    general: {},
    pagesDatasetsAccessToFunding: {},
    pagesDatasetsGrantImplementation: {},
    pagesDatasetsAnnualResults: {},
    pagesDatasetsResourceMobilization: {},
    pagesLocationAccessToFunding: {},
    pagesLocationGrantImplementation: {},
    pagesLocationOverview: {},
    pagesLocationResourceMobilization: {},
    pagesLocationResults: {},
    pagesGrantDocuments: {},
    pagesGrantGrantImplementation: {},
    pagesGrantOverview: {},
    pagesGrantTargetResults: {},
    componentsRBChartSelectModal: {},
    componentsRBTemplatesLayoutsView: {},
    componentsRBAllAssetsEmpty: {},
    componentsRBAllAssetsToolbar: {},
    componentsRBSaveAsAssetModal: {},
    componentsRBSelectGridModal: {},
    componentsRBSelectColumnModal: {},
    componentsRBComponentOptions: {},
    componentsRBGridElementsList: {},
    pagesReportBuilderMain: {},
    pagesReportBuilderBuilder: {},
    pagesReportBuilderPreview: {},
  },
  setValue: action((state, payload: CMSDataValueModel) => {
    state.value = payload;
  }),
};
