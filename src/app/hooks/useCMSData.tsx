import React from "react";
import get from "lodash/get";
import { useUpdateEffect } from "react-use";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { CMSDataValueModel } from "app/state/api/action-reducers/sync";

interface UseCMSDataProps {
  loadData?: boolean;
  returnData?: boolean;
}

export function useCMSData(props: UseCMSDataProps) {
  const cmsData = useStoreState((state) => state.CMSData.value);
  const setCMSData = useStoreActions((actions) => actions.CMSData.setValue);

  const currentLanguage = "en";

  // COMPONENTS
  const componentsChartsEligibilityCMSAction = useStoreActions(
    (actions) => actions.cms.componentsChartsEligibility.fetch,
  );
  const componentsChartsEligibilityCMSData = useStoreState(
    (state) => state.cms.componentsChartsEligibility.data,
  );

  const componentsSearchCMSAction = useStoreActions(
    (actions) => actions.cms.componentsSearch.fetch,
  );
  const componentsSearchCMSData = useStoreState(
    (state) => state.cms.componentsSearch.data,
  );

  const componentsHeaderCMSAction = useStoreActions(
    (actions) => actions.cms.componentsHeader.fetch,
  );
  const componentsHeaderCMSData = useStoreState(
    (state) => state.cms.componentsHeader.data,
  );
  const componentsFooterCMSAction = useStoreActions(
    (actions) => actions.cms.componentsFooter.fetch,
  );
  const componentsFooterCMSData = useStoreState(
    (state) => state.cms.componentsFooter.data,
  );

  // PAGES

  const pagesDatasetsCMSAction = useStoreActions(
    (actions) => actions.cms.pagesDatasets.fetch,
  );
  const pagesDatasetsCMSData = useStoreState(
    (state) => state.cms.pagesDatasets.data,
  );

  const pagesGeographyCMSAction = useStoreActions(
    (actions) => actions.cms.pagesGeography.fetch,
  );
  const pagesGeographyCMSData = useStoreState(
    (state) => state.cms.pagesGeography.data,
  );

  const pagesGrantDetailCMSAction = useStoreActions(
    (actions) => actions.cms.pagesGrantDetail.fetch,
  );
  const pagesGrantDetailCMSData = useStoreState(
    (state) => state.cms.pagesGrantDetail.data,
  );

  const pagesGrantsCMSAction = useStoreActions(
    (actions) => actions.cms.pagesGrants.fetch,
  );
  const pagesGrantsCMSData = useStoreState(
    (state) => state.cms.pagesGrants.data,
  );

  const pagesHomeCMSAction = useStoreActions(
    (actions) => actions.cms.pagesHome.fetch,
  );
  const pagesHomeCMSData = useStoreState((state) => state.cms.pagesHome.data);

  const pagesLocationCMSAction = useStoreActions(
    (actions) => actions.cms.pagesLocation.fetch,
  );
  const pagesLocationCMSData = useStoreState(
    (state) => state.cms.pagesLocation.data,
  );

  const pagesDatasetsAccessToFundingCMSAction = useStoreActions(
    (actions) => actions.cms.pagesDatasetsAccessToFunding.fetch,
  );
  const pagesDatasetsAccessToFundingCMSData = useStoreState(
    (state) => state.cms.pagesDatasetsAccessToFunding.data,
  );

  const pagesDatasetsAnnualResultsCMSAction = useStoreActions(
    (actions) => actions.cms.pagesDatasetsAnnualResults.fetch,
  );
  const pagesDatasetsAnnualResultsCMSData = useStoreState(
    (state) => state.cms.pagesDatasetsAnnualResults.data,
  );

  const pagesDatasetsGrantImplementationCMSAction = useStoreActions(
    (actions) => actions.cms.pagesDatasetsGrantImplementation.fetch,
  );
  const pagesDatasetsGrantImplementationCMSData = useStoreState(
    (state) => state.cms.pagesDatasetsGrantImplementation.data,
  );

  const pagesDatasetsResourceMobilizationCMSAction = useStoreActions(
    (actions) => actions.cms.pagesDatasetsResourceMobilization.fetch,
  );
  const pagesDatasetsResourceMobilizationCMSData = useStoreState(
    (state) => state.cms.pagesDatasetsResourceMobilization.data,
  );

  const pagesLocationAccessToFundingCMSAction = useStoreActions(
    (actions) => actions.cms.pagesLocationAccessToFunding.fetch,
  );
  const pagesLocationAccessToFundingCMSData = useStoreState(
    (state) => state.cms.pagesLocationAccessToFunding.data,
  );

  const pagesLocationGrantImplementationCMSAction = useStoreActions(
    (actions) => actions.cms.pagesLocationGrantImplementation.fetch,
  );
  const pagesLocationGrantImplementationCMSData = useStoreState(
    (state) => state.cms.pagesLocationGrantImplementation.data,
  );

  const pagesLocationOverviewCMSAction = useStoreActions(
    (actions) => actions.cms.pagesLocationOverview.fetch,
  );
  const pagesLocationOverviewCMSData = useStoreState(
    (state) => state.cms.pagesLocationOverview.data,
  );

  const pagesLocationResourceMobilizationCMSAction = useStoreActions(
    (actions) => actions.cms.pagesLocationResourceMobilization.fetch,
  );
  const pagesLocationResourceMobilizationCMSData = useStoreState(
    (state) => state.cms.pagesLocationResourceMobilization.data,
  );

  const pagesLocationResultsCMSAction = useStoreActions(
    (actions) => actions.cms.pagesLocationResults.fetch,
  );
  const pagesLocationResultsCMSData = useStoreState(
    (state) => state.cms.pagesLocationResults.data,
  );

  const pagesGrantDocumentsCMSAction = useStoreActions(
    (actions) => actions.cms.pagesGrantDocuments.fetch,
  );
  const pagesGrantDocumentsCMSData = useStoreState(
    (state) => state.cms.pagesGrantDocuments.data,
  );

  const pagesGrantGrantImplementationCMSAction = useStoreActions(
    (actions) => actions.cms.pagesGrantGrantImplementation.fetch,
  );
  const pagesGrantGrantImplementationCMSData = useStoreState(
    (state) => state.cms.pagesGrantGrantImplementation.data,
  );

  const pagesGrantOverviewCMSAction = useStoreActions(
    (actions) => actions.cms.pagesGrantOverview.fetch,
  );
  const pagesGrantOverviewCMSData = useStoreState(
    (state) => state.cms.pagesGrantOverview.data,
  );

  const pagesGrantTargetResultsCMSAction = useStoreActions(
    (actions) => actions.cms.pagesGrantTargetResults.fetch,
  );
  const pagesGrantTargetResultsCMSData = useStoreState(
    (state) => state.cms.pagesGrantTargetResults.data,
  );

  const pagesGlossaryCMSAction = useStoreActions(
    (actions) => actions.cms.pagesGlossary.fetch,
  );
  const pagesGlossaryCMSData = useStoreState(
    (state) => state.cms.pagesGlossary.data,
  );

  const pagesChangelogCMSAction = useStoreActions(
    (actions) => actions.cms.pagesChangelog.fetch,
  );
  const pagesChangelogCMSData = useStoreState(
    (state) => state.cms.pagesChangelog.data,
  );
  const componentsRBChartSelectModalCMSAction = useStoreActions(
    (actions) => actions.cms.componentsRBChartSelectModal.fetch,
  );
  const componentsRBChartSelectModalCMSData = useStoreState(
    (state) => state.cms.componentsRBChartSelectModal.data,
  );
  const componentsRBTemplatesLayoutsViewCMSAction = useStoreActions(
    (actions) => actions.cms.componentsRBTemplatesLayoutsView.fetch,
  );
  const componentsRBTemplatesLayoutsViewCMSData = useStoreState(
    (state) => state.cms.componentsRBTemplatesLayoutsView.data,
  );
  const componentsRBAllAssetsEmptyCMSAction = useStoreActions(
    (actions) => actions.cms.componentsRBAllAssetsEmpty.fetch,
  );
  const componentsRBAllAssetsEmptyCMSData = useStoreState(
    (state) => state.cms.componentsRBAllAssetsEmpty.data,
  );
  const componentsRBAllAssetsToolbarCMSAction = useStoreActions(
    (actions) => actions.cms.componentsRBAllAssetsToolbar.fetch,
  );
  const componentsRBAllAssetsToolbarCMSData = useStoreState(
    (state) => state.cms.componentsRBAllAssetsToolbar.data,
  );
  const componentsRBSaveAsAssetModalCMSAction = useStoreActions(
    (actions) => actions.cms.componentsRBSaveAsAssetModal.fetch,
  );
  const componentsRBSaveAsAssetModalCMSData = useStoreState(
    (state) => state.cms.componentsRBSaveAsAssetModal.data,
  );
  const componentsRBSelectGridModalCMSAction = useStoreActions(
    (actions) => actions.cms.componentsRBSelectGridModal.fetch,
  );
  const componentsRBSelectGridModalCMSData = useStoreState(
    (state) => state.cms.componentsRBSelectGridModal.data,
  );
  const componentsRBSelectColumnModalCMSAction = useStoreActions(
    (actions) => actions.cms.componentsRBSelectColumnModal.fetch,
  );
  const componentsRBSelectColumnModalCMSData = useStoreState(
    (state) => state.cms.componentsRBSelectColumnModal.data,
  );
  const componentsRBComponentOptionsCMSAction = useStoreActions(
    (actions) => actions.cms.componentsRBComponentOptions.fetch,
  );
  const componentsRBComponentOptionsCMSData = useStoreState(
    (state) => state.cms.componentsRBComponentOptions.data,
  );
  const componentsRBGridElementsListCMSAction = useStoreActions(
    (actions) => actions.cms.componentsRBGridElementsList.fetch,
  );
  const componentsRBGridElementsListCMSData = useStoreState(
    (state) => state.cms.componentsRBGridElementsList.data,
  );
  const pagesReportBuilderMainCMSAction = useStoreActions(
    (actions) => actions.cms.pagesReportBuilderMain.fetch,
  );
  const pagesReportBuilderMainCMSData = useStoreState(
    (state) => state.cms.pagesReportBuilderMain.data,
  );
  const pagesReportBuilderBuilderCMSAction = useStoreActions(
    (actions) => actions.cms.pagesReportBuilderBuilder.fetch,
  );
  const pagesReportBuilderBuilderCMSData = useStoreState(
    (state) => state.cms.pagesReportBuilderBuilder.data,
  );
  const pagesReportBuilderPreviewCMSAction = useStoreActions(
    (actions) => actions.cms.pagesReportBuilderPreview.fetch,
  );
  const pagesReportBuilderPreviewCMSData = useStoreState(
    (state) => state.cms.pagesReportBuilderPreview.data,
  );
  const pagesReportBuilderExportViewCMSAction = useStoreActions(
    (actions) => actions.cms.pagesReportBuilderExportView.fetch,
  );
  const pagesReportBuilderExportViewCMSData = useStoreState(
    (state) => state.cms.pagesReportBuilderExportView.data,
  );

  // GENERAL

  const generalCMSAction = useStoreActions(
    (actions) => actions.cms.general.fetch,
  );
  const generalCMSData = useStoreState((state) => state.cms.general.data);

  React.useEffect(() => {
    if (props.loadData) {
      // COMPONENTS
      componentsChartsEligibilityCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsSearchCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsHeaderCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsFooterCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      // PAGES
      pagesDatasetsCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesGeographyCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesGrantDetailCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesGrantsCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesHomeCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesLocationCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesDatasetsAccessToFundingCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesDatasetsAnnualResultsCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesDatasetsGrantImplementationCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesDatasetsResourceMobilizationCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesLocationAccessToFundingCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesLocationGrantImplementationCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesLocationOverviewCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesLocationResourceMobilizationCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesLocationResultsCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesGrantDocumentsCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesGrantGrantImplementationCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesGrantOverviewCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesGrantTargetResultsCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesGlossaryCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesChangelogCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsRBChartSelectModalCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsRBTemplatesLayoutsViewCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsRBAllAssetsEmptyCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsRBAllAssetsToolbarCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsRBSaveAsAssetModalCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsRBSelectGridModalCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsRBSelectColumnModalCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsRBComponentOptionsCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsRBGridElementsListCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesReportBuilderMainCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesReportBuilderBuilderCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesReportBuilderPreviewCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      pagesReportBuilderExportViewCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      // GENERAL
      generalCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
    }
  }, []);

  function formatCMSData() {
    let newData = {};

    const items = [
      // COMPONENTS
      {
        key: "componentsChartsEligibility",
        data: componentsChartsEligibilityCMSData || {},
      },
      {
        key: "componentsSearch",
        data: componentsSearchCMSData || {},
      },
      {
        key: "componentsHeader",
        data: componentsHeaderCMSData || {},
      },
      {
        key: "componentsFooter",
        data: componentsFooterCMSData || {},
      },
      // PAGES
      {
        key: "pagesDatasets",
        data: pagesDatasetsCMSData || {},
      },
      {
        key: "pagesGeography",
        data: pagesGeographyCMSData || {},
      },
      {
        key: "pagesGrantDetail",
        data: pagesGrantDetailCMSData || {},
      },
      {
        key: "pagesGrants",
        data: pagesGrantsCMSData || {},
      },
      {
        key: "pagesHome",
        data: pagesHomeCMSData || {},
      },
      {
        key: "pagesLocation",
        data: pagesLocationCMSData || {},
      },
      {
        key: "pagesDatasetsAccessToFunding",
        data: pagesDatasetsAccessToFundingCMSData || {},
      },
      {
        key: "pagesDatasetsAnnualResults",
        data: pagesDatasetsAnnualResultsCMSData || {},
      },
      {
        key: "pagesDatasetsGrantImplementation",
        data: pagesDatasetsGrantImplementationCMSData || {},
      },
      {
        key: "pagesDatasetsResourceMobilization",
        data: pagesDatasetsResourceMobilizationCMSData || {},
      },
      {
        key: "pagesLocationAccessToFunding",
        data: pagesLocationAccessToFundingCMSData || {},
      },
      {
        key: "pagesLocationGrantImplementation",
        data: pagesLocationGrantImplementationCMSData || {},
      },
      {
        key: "pagesLocationOverview",
        data: pagesLocationOverviewCMSData || {},
      },
      {
        key: "pagesLocationResourceMobilization",
        data: pagesLocationResourceMobilizationCMSData || {},
      },
      {
        key: "pagesLocationResults",
        data: pagesLocationResultsCMSData || {},
      },
      {
        key: "pagesGrantDocuments",
        data: pagesGrantDocumentsCMSData || {},
      },
      {
        key: "pagesGrantGrantImplementation",
        data: pagesGrantGrantImplementationCMSData || {},
      },
      {
        key: "pagesGrantOverview",
        data: pagesGrantOverviewCMSData || {},
      },
      {
        key: "pagesGrantTargetResults",
        data: pagesGrantTargetResultsCMSData || {},
      },
      {
        key: "pagesGlossary",
        data: pagesGlossaryCMSData || {},
      },
      {
        key: "pagesChangelog",
        data: pagesChangelogCMSData || {},
      },
      {
        key: "componentsRBChartSelectModal",
        data: componentsRBChartSelectModalCMSData || {},
      },
      {
        key: "componentsRBTemplatesLayoutsView",
        data: componentsRBTemplatesLayoutsViewCMSData || {},
      },
      {
        key: "componentsRBAllAssetsEmpty",
        data: componentsRBAllAssetsEmptyCMSData || {},
      },
      {
        key: "componentsRBAllAssetsToolbar",
        data: componentsRBAllAssetsToolbarCMSData || {},
      },
      {
        key: "componentsRBSaveAsAssetModal",
        data: componentsRBSaveAsAssetModalCMSData || {},
      },
      {
        key: "componentsRBSelectGridModal",
        data: componentsRBSelectGridModalCMSData || {},
      },
      {
        key: "componentsRBSelectColumnModal",
        data: componentsRBSelectColumnModalCMSData || {},
      },
      {
        key: "componentsRBComponentOptions",
        data: componentsRBComponentOptionsCMSData || {},
      },
      {
        key: "componentsRBGridElementsList",
        data: componentsRBGridElementsListCMSData || {},
      },
      {
        key: "pagesReportBuilderMain",
        data: pagesReportBuilderMainCMSData || {},
      },
      {
        key: "pagesReportBuilderBuilder",
        data: pagesReportBuilderBuilderCMSData || {},
      },
      {
        key: "pagesReportBuilderPreview",
        data: pagesReportBuilderPreviewCMSData || {},
      },
      {
        key: "pagesReportBuilderExportView",
        data: pagesReportBuilderExportViewCMSData || {},
      },
      // GENERAL
      {
        key: "general",
        data: generalCMSData || {},
      },
    ];
    items.forEach((item) => {
      newData = {
        ...newData,
        [item.key]: get(item, "data.data"),
      };
    });
    setCMSData(newData as CMSDataValueModel);
  }

  useUpdateEffect(() => {
    if (props.loadData) {
      formatCMSData();
    }
  }, [
    // COMPONENTS
    componentsChartsEligibilityCMSData,
    componentsSearchCMSData,
    componentsHeaderCMSData,
    componentsFooterCMSData,
    // PAGES
    pagesDatasetsCMSData,
    pagesGeographyCMSData,
    pagesGrantDetailCMSData,
    pagesGrantsCMSData,
    pagesHomeCMSData,
    pagesLocationCMSData,
    pagesDatasetsAccessToFundingCMSData,
    pagesDatasetsAnnualResultsCMSData,
    pagesDatasetsGrantImplementationCMSData,
    pagesDatasetsResourceMobilizationCMSData,
    pagesLocationAccessToFundingCMSData,
    pagesLocationGrantImplementationCMSData,
    pagesLocationOverviewCMSData,
    pagesLocationResourceMobilizationCMSData,
    pagesLocationResultsCMSData,
    pagesGrantDocumentsCMSData,
    pagesGrantGrantImplementationCMSData,
    pagesGrantOverviewCMSData,
    pagesGrantTargetResultsCMSData,
    pagesGlossaryCMSData,
    componentsRBChartSelectModalCMSData,
    componentsRBTemplatesLayoutsViewCMSData,
    componentsRBAllAssetsEmptyCMSData,
    componentsRBAllAssetsToolbarCMSData,
    componentsRBSaveAsAssetModalCMSData,
    componentsRBSelectGridModalCMSData,
    componentsRBSelectColumnModalCMSData,
    componentsRBComponentOptionsCMSData,
    componentsRBGridElementsListCMSData,
    pagesReportBuilderMainCMSData,
    pagesReportBuilderBuilderCMSData,
    pagesReportBuilderPreviewCMSData,
    pagesReportBuilderExportViewCMSData,
    // GENERAL
    generalCMSData,
  ]);

  if (props.returnData) {
    return cmsData;
  }

  return null;
}
