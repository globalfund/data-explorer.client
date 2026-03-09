import { action } from "easy-peasy";
import { CMSFormattedCollectionsModel } from "app/state/api/interfaces";

export const formattedCollections: CMSFormattedCollectionsModel = {
  countrySummary: {},
  glossary: {},
  setPagesData: action((state, payload) => {
    state.countrySummary = payload.countrySummary;
    state.glossary = payload.glossary;
  }),
};
