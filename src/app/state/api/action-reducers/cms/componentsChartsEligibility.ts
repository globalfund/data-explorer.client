import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const componentsChartsEligibility: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/components-charts-eligibility`),
};

export default componentsChartsEligibility;
