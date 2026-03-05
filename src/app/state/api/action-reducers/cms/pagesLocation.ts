import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const pagesLocation: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-location`),
};

export const pagesLocationAccessToFunding: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/pages-location-access-to-funding`,
  ),
};

export const pagesLocationGrantImplementation: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/pages-location-grant-implementation`,
  ),
};

export const pagesLocationOverview: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-location-overview`),
};

export const pagesLocationResourceMobilization: CMSApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_CMS_API}/pages-location-resource-mobilization`,
  ),
};

export const pagesLocationResults: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-location-results`),
};

export default pagesLocation;
