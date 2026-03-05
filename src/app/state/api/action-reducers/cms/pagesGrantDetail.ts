import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const pagesGrantDetail: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-grant-detail`),
};

export const pagesGrantDocuments: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-grant-documents`),
};

export const pagesGrantGrantImplementation: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/pages-grant-grant-implementation`,
  ),
};

export const pagesGrantOverview: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-grant-overview`),
};

export const pagesGrantTargetResults: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-grant-target-results`),
};

export default pagesGrantDetail;
