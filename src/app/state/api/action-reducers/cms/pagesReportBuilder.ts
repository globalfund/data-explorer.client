import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

export const componentsRBChartSelectModal: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/components-rb-chart-select-modal`,
  ),
};

export const componentsRBTemplatesLayoutsView: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/components-rb-templates-layouts-view`,
  ),
};

export const componentsRBAllAssetsEmpty: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/components-rb-all-assets-empty`),
};

export const componentsRBAllAssetsToolbar: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/components-rb-all-assets-toolbar`,
  ),
};

export const componentsRBSaveAsAssetModal: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/components-rb-save-as-asset-modal`,
  ),
};

export const componentsRBSelectGridModal: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/components-rb-select-grid-modal`,
  ),
};

export const componentsRBSelectColumnModal: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/components-rb-select-column-modal`,
  ),
};

export const componentsRBComponentOptions: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/components-rb-component-options`,
  ),
};

export const componentsRBGridElementsList: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/components-rb-grid-elements-list`,
  ),
};

export const pagesReportBuilderMain: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-report-builder-main`),
};

export const pagesReportBuilderBuilder: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-report-builder-builder`),
};

export const pagesReportBuilderPreview: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-report-builder-preview`),
};
