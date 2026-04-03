import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const pagesGeography: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-geography`),
};

export default pagesGeography;
