import { action } from "easy-peasy";
import { CMSFormattedCollectionsModel } from "app/state/api/interfaces";

export const formattedCollections: CMSFormattedCollectionsModel = {
  countrySummary: {},
  glossary: [],
  changelog: [],
  setPagesData: action((state, payload) => {
    state.countrySummary = payload.countrySummary;
    state.glossary = payload.glossary;
    state.changelog = payload.changelog;
  }),
};
