import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const general: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/general`),
};

export default general;
