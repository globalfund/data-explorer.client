import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const general: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/general`),
};

export const pagesGlossary: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-glossary`),
};

export const pagesChangelog: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-changelog`),
};

export default general;
