import { renderHook } from "@testing-library/react";
import useDatasetItems from "./useDatasetItems";

const mockUserDatasets: { data?: { data: object[] }; isLoading: boolean } = {
  data: undefined,
  isLoading: true,
};
jest.mock("app/hooks/queries/report-builder", () => ({
  useUserDatasets: () => mockUserDatasets,
}));

const uploaded = {
  id: "65f0c0ffee",
  name: "Clinic visits",
  description: "Uploaded from Clinic visits.csv",
  source: "Upload",
};

test("only knows the Global Fund datasets while the user's are loading", () => {
  mockUserDatasets.data = undefined;
  mockUserDatasets.isLoading = true;
  const { result } = renderHook(() => useDatasetItems());

  expect(result.current.userDatasetsLoading).toBe(true);
  expect(result.current.userDatasetItems).toEqual([]);
  expect(result.current.getDatasetItem("gf_results")?.name).toBe(
    "Reported Results",
  );
  expect(result.current.getDatasetItem(uploaded.id)).toBeUndefined();
});

test("finds the datasets the user uploaded or connected", () => {
  mockUserDatasets.data = { data: [uploaded] };
  mockUserDatasets.isLoading = false;
  const { result } = renderHook(() => useDatasetItems());

  expect(result.current.getDatasetItem(uploaded.id)).toEqual({
    id: uploaded.id,
    name: "Clinic visits",
    description: "Uploaded from Clinic visits.csv",
    userDataset: uploaded,
  });
  expect(result.current.getDatasetItem("gf_results")?.userDataset).toBe(
    undefined,
  );
  expect(result.current.getDatasetItem("")).toBeUndefined();
  expect(result.current.getDatasetItem(undefined)).toBeUndefined();
});
