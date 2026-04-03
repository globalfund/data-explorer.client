import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const componentFooter: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/components-footer`),
};

export default componentFooter;
