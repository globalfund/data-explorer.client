export interface CMSApiComponentsChartsEligibility {
  data: {
    statusEligible: string;
    statusNotEligible: string;
    statusTransitionFunding: string;
    eligibility: string;
    year: string;
    countryName: string;
    hiv: string;
    malaria: string;
    tuberculosis: string;
    diseaseBurdenExtreme: string;
    diseaseBurdenSevere: string;
    diseaseBurdenHigh: string;
    diseaseBurdenNotHigh: string;
    diseaseBurdenModerate: string;
    diseaseBurdenLow: string;
    diseaseBurdenNone: string;
    incomeLevelsNone: string;
    incomeLevelsLow: string;
    incomeLevelsLowerLower: string;
    incomeLevelsLowerMiddle: string;
    incomeLevelsUpperLower: string;
    incomeLevelsUpperMiddle: string;
    incomeLevelsHigh: string;
    scatterplotEligibility: string;
    scatterplotDiseaseBurden: string;
    scatterplotIncomeLevel: string;
    incomeLevel: string;
    diseaseBurden: string;
  };
}

export interface CMSApiComponentsSearch {
  data: {
    placeholder: string;
    loading: string;
    noResults: string;
  };
}

export interface CMSApiComponentsFooter {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiComponentsHeader {
  data: { [key: string]: { [key: string]: string } };
}
export interface CMSApiPagesDatasets {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesGeography {
  data: { [key: string]: { [key: string]: string } };
}
export interface CMSApiPagesGrantDetail {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesGrants {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesHome {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesLocation {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiGeneral {
  data: {
    million: string;
    billion: string;
  };
}

export interface CMSApiPagesDatatsetsAccessToFunding {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesDatatsetsGrantImplementation {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesDatatsetsAnnualResults {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesDatatsetsResourceMobilization {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesLocationAccessToFunding {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesLocationGrantImplementation {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesLocationOverview {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesLocationResourceMobilization {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesLocationResults {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesGrantDocuments {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesGrantGrantImplementation {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesGrantOverview {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesGrantTargetResults {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiComponentsRBChartSelectModal {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiComponentsRBTemplatesLayoutsView {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiComponentsRBAllAssetsEmpty {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiComponentsRBAllAssetsToolbar {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiComponentsRBSaveAsAssetModal {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiComponentsRBSelectGridModal {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiComponentsRBSelectColumnModal {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiComponentsRBComponentOptions {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiComponentsRBGridElementsList {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesReportBuilderMain {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesReportBuilderBuilder {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiPagesReportBuilderPreview {
  data: { [key: string]: { [key: string]: string } };
}

export interface CMSApiCountrySummary {
  data: {
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalRecords: number;
      };
    };
    data: {
      id: string;
      type: string;
      attributes: {
        locale: string;
        title: string;
        description: string;
        content: string;
        image: string;
        url: string;
        createdAt: string;
        updatedAt: string;
      };
    }[];
  };
}

export interface CMSApiGlossary {
  data: {
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalRecords: number;
      };
    };
    data: {
      Content: string;
      Keyword: string;
    }[];
  };
}

export interface CMSApiChangelog {
  data: {
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalRecords: number;
      };
    };
    data: {
      Date: string;
      Title: string;
      Version: string;
      Notes: string[];
    }[];
  };
}
