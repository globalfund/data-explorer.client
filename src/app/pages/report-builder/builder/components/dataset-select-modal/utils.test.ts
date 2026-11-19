import {
  formatDatasetDate,
  getApiErrorMessage,
  getExternalDatasetKey,
} from "./utils";

test.each([
  ["2026-11-10T16:46:42.000Z", /^\d{2}-11-2026$/],
  ["2019-11-27 04:41:47.297000", /^27-11-2019$/],
])("formats the date %s", (value, expected) => {
  expect(formatDatasetDate(value)).toMatch(expected);
});

test.each([undefined, "", "not a date"])(
  "formats the missing or invalid date %p as empty",
  (value) => expect(formatDatasetDate(value)).toBe(""),
);

test("a search result and the dataset it was connected as share a key", () => {
  const url = "https://www.kaggle.com/datasets/unsdsn/world-happiness";
  const name = "World Happiness Report - Data file: 2017";
  expect(getExternalDatasetKey({ url, name })).toBe(
    getExternalDatasetKey({
      sourceUrl: url,
      externalName: name,
      name: "World Happiness Report - 2017",
    }),
  );
  expect(getExternalDatasetKey({ url, name })).not.toBe(
    getExternalDatasetKey({ url, name: name.replace("2017", "2018") }),
  );
});

test("reads the message of an API error, and falls back otherwise", () => {
  const error = { response: { data: { error: { message: "Too large" } } } };
  expect(getApiErrorMessage(error, "Fallback")).toBe("Too large");
  expect(getApiErrorMessage(new Error("Network Error"), "Fallback")).toBe(
    "Fallback",
  );
  expect(getApiErrorMessage(undefined, "Fallback")).toBe("Fallback");
});
