import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const pagesHome: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-home`),
};

export default pagesHome;
