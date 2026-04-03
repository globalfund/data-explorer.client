import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const componentHeader: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/components-header`),
};

export default componentHeader;
