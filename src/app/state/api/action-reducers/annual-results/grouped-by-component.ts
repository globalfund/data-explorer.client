import { APIModel } from "app/state/api";
import { ApiCallModel } from "app/state/api/interfaces";

export const AnnualResultsGroupedByComponent: ApiCallModel = {
  ...APIModel(
    `${import.meta.env.VITE_API}/results/grouped-by-component/{cycle}`,
  ),
};
