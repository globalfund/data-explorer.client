import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const componentsSearch: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/components-search`),
};

export default componentsSearch;
