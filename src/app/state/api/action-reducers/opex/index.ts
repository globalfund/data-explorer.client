import { APIModel } from "app/state/api";
import { ApiCallModel } from "app/state/api/interfaces";

export const OpexYears: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/opex/years`),
};

export const OpexStats: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/opex/stats`),
};

export const OpexOperatingCosts: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/opex/operating-costs/{category}`),
};

export const OpexEfficiency: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/opex/efficiency/{type}`),
};

export const OpexYearStats: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/opex/year-stats`),
};

export const OpexCostComposition: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/opex/cost-composition`),
};

export const OpexKeyCosts: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/opex/key-costs`),
};

export const OpexIndexedTrends: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/opex/indexed-trends`),
};

export const OpexTable: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/opex/table`),
};
