import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const pagesDatasets: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-datasets`),
};

export const pagesDatasetsAccessToFunding: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/pages-datasets-access-to-funding`,
  ),
};

export const pagesDatasetsAnnualResults: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-datasets-annual-results`),
};

export const pagesDatasetsResourceMobilization: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/pages-datasets-resource-mobilization`,
  ),
};

export const pagesDatasetsGrantImplementation: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/pages-datasets-grant-implementation`,
  ),
};

export default pagesDatasets;
