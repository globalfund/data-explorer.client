import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axiosInstance from "app/utils/axiosInstance";
import {
  useGetReport,
  useGetReports,
  usePatchReport,
  useCreateReport,
  useDeleteReport,
  useDuplicateReport,
  useFilteredDataset,
  useGFDatasetPage,
  useMultiDeleteReportsFolders,
} from "./report-builder";
import { createReportItem } from "app/pages/report-builder/component-registry/model";
import { RBReportItemsState } from "app/state/api/action-reducers/report-builder/sync";

jest.mock("app/utils/axiosInstance", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
const clients: QueryClient[] = [];
const setup = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  clients.push(client);
  return {
    client,
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  };
};
afterEach(() => {
  clients.splice(0).forEach((client) => client.clear());
});
beforeEach(() => {
  localStorage.setItem("accessToken", "test-token");
});
const auth = { headers: { Authorization: "Bearer test-token" } };

test("report fetch is disabled without an ID and fetches when an ID arrives", async () => {
  const { wrapper } = setup();
  jest
    .mocked(axiosInstance.get)
    .mockResolvedValue({ data: { id: "one", name: "Report" } });
  const { result, rerender } = renderHook(
    ({ id }: { id?: string }) => useGetReport(id),
    { wrapper, initialProps: { id: undefined as string | undefined } },
  );
  expect(axiosInstance.get).not.toHaveBeenCalled();
  rerender({ id: "one" });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(axiosInstance.get).toHaveBeenCalledWith("/report/one", auth);
  expect(result.current.data?.data.name).toBe("Report");
});
test("report fetch exposes server errors", async () => {
  const { wrapper } = setup();
  jest
    .mocked(axiosInstance.get)
    .mockRejectedValueOnce(new Error("Unavailable"));
  const { result } = renderHook(() => useGetReport("one"), { wrapper });
  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result.current.error?.message).toBe("Unavailable");
});
test("report search sends report and folder filters with sorting", async () => {
  const { wrapper } = setup();
  jest.mocked(axiosInstance.get).mockResolvedValue({ data: [] });
  const { result } = renderHook(
    () =>
      useGetReports({
        sort: "name ASC",
        search: "Health",
        onlyRootLevel: true,
        includeFolders: true,
      }),
    { wrapper },
  );
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  const [url, config] = jest.mocked(axiosInstance.get).mock.calls[0];
  expect(url).toBe("/reports");
  expect(JSON.parse(config!.params.filter)).toEqual({
    where: { name: { like: ".*Health.*", options: "i" } },
    order: ["name ASC"],
  });
  expect(JSON.parse(config!.params.folderFilter).where.type).toBe("report");
  expect(config).toMatchObject({
    ...auth,
    params: { onlyRootLevel: true, includeFolders: true },
  });
});
test("patch sends persisted content and invalidates both list and detail caches", async () => {
  const { client, wrapper } = setup();
  const invalidate = jest.spyOn(client, "invalidateQueries");
  jest.mocked(axiosInstance.patch).mockResolvedValue({ data: {} });
  const { result } = renderHook(() => usePatchReport("one"), { wrapper });
  const payload = { name: "Changed", items: [createReportItem("text")] };
  await act(async () => {
    await result.current.mutateAsync(payload);
  });
  expect(axiosInstance.patch).toHaveBeenCalledWith(
    "/report/one",
    payload,
    auth,
  );
  expect(invalidate).toHaveBeenCalledWith({
    queryKey: ["ReportBuilderGetReports"],
  });
  expect(invalidate).toHaveBeenCalledWith({
    queryKey: ["ReportBuilderGetReport", "one"],
  });
});
test("failed saves expose errors and do not invalidate saved report caches", async () => {
  const { client, wrapper } = setup();
  const invalidate = jest.spyOn(client, "invalidateQueries");
  jest
    .mocked(axiosInstance.patch)
    .mockRejectedValueOnce(new Error("Save failed"));
  const { result } = renderHook(() => usePatchReport("one"), { wrapper });
  await act(async () => {
    await expect(result.current.mutateAsync({ name: "Draft" })).rejects.toThrow(
      "Save failed",
    );
  });
  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(invalidate).not.toHaveBeenCalled();
});
test("create sends report metadata, settings and items", async () => {
  const { wrapper } = setup();
  jest.mocked(axiosInstance.post).mockResolvedValue({ data: {} });
  const { result } = renderHook(useCreateReport, { wrapper });
  const payload = {
    id: "one",
    name: "New",
    description: "Description",
    items: [],
    settings: RBReportItemsState.settings,
  };
  await act(async () => {
    await result.current.mutateAsync(payload);
  });
  expect(axiosInstance.post).toHaveBeenCalledWith("/report", payload, auth);
});
test("delete and duplicate use authenticated report endpoints", async () => {
  const { wrapper } = setup();
  jest.mocked(axiosInstance.delete).mockResolvedValue({});
  jest.mocked(axiosInstance.get).mockResolvedValue({});
  const remove = renderHook(useDeleteReport, { wrapper });
  const duplicate = renderHook(useDuplicateReport, { wrapper });
  await act(async () => {
    await remove.result.current.mutateAsync("one");
    await duplicate.result.current.mutateAsync("one");
  });
  expect(axiosInstance.delete).toHaveBeenCalledWith("/report/one", auth);
  expect(axiosInstance.get).toHaveBeenCalledWith("/report/duplicate/one", auth);
});
test("bulk deletion dispatches each item type and reports partial failures", async () => {
  const { wrapper } = setup();
  jest.mocked(axiosInstance.delete).mockResolvedValue({});
  const { result } = renderHook(useMultiDeleteReportsFolders, { wrapper });
  await act(async () => {
    await result.current.mutateAsync([
      { id: "r", type: "report" },
      { id: "f", type: "folder" },
      { id: "a", type: "asset" },
    ]);
  });
  for (const url of ["/report/r", "/folder/f", "/asset/a"])
    expect(axiosInstance.delete).toHaveBeenCalledWith(url, auth);
  jest
    .mocked(axiosInstance.delete)
    .mockRejectedValueOnce(new Error("Delete failed"));
  await act(async () => {
    await expect(
      result.current.mutateAsync([{ id: "r", type: "report" }]),
    ).rejects.toThrow("Delete failed");
  });
});
const datasetParams = {
  datasetId: "results",
  filters: { country: ["Kenya"] },
  sorting: [{ column: "amount", order: "desc" as const }],
  pageSize: 2,
  limitToTop: true,
  limitToTopValue: "10",
  groupRemainderAsOther: false,
};
test("filtered dataset paginates until total count and preserves filtering/sorting", async () => {
  const { wrapper } = setup();
  jest
    .mocked(axiosInstance.post)
    .mockResolvedValueOnce({
      data: { result: [{ id: 1 }, { id: 2 }], count: 3 },
    })
    .mockResolvedValueOnce({ data: { result: [{ id: 3 }], count: 3 } });
  const { result } = renderHook(() => useFilteredDataset(datasetParams), {
    wrapper,
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.hasNextPage).toBe(true);
  await act(async () => {
    await result.current.fetchNextPage();
  });
  await waitFor(() => expect(result.current.hasNextPage).toBe(false));
  const { pageSize, ...payload } = datasetParams;
  expect(axiosInstance.post).toHaveBeenNthCalledWith(
    2,
    "/report/filter-dataset",
    payload,
    { ...auth, params: { page: 2, pageSize } },
  );
  expect(
    result.current.data?.pages.flatMap((page) => page.data.result),
  ).toHaveLength(3);
});
test("empty datasets stop pagination and missing dataset IDs disable requests", async () => {
  const { wrapper } = setup();
  jest
    .mocked(axiosInstance.post)
    .mockResolvedValue({ data: { result: [], count: 0 } });
  const { result, rerender } = renderHook(
    ({ datasetId }) => useFilteredDataset({ ...datasetParams, datasetId }),
    { wrapper, initialProps: { datasetId: "" } },
  );
  expect(axiosInstance.post).not.toHaveBeenCalled();
  rerender({ datasetId: "results" });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.hasNextPage).toBe(false);
});
test("dataset page changes request the correct page and page size", async () => {
  const { wrapper } = setup();
  jest.mocked(axiosInstance.get).mockResolvedValue({ data: {} });
  const { result, rerender } = renderHook(
    ({ page }) => useGFDatasetPage("results", page, 25),
    { wrapper, initialProps: { page: 1 } },
  );
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  rerender({ page: 2 });
  await waitFor(() =>
    expect(axiosInstance.get).toHaveBeenLastCalledWith(
      "/report-builder/gf-dataset/results",
      { ...auth, params: { page: 2, pageSize: 25 } },
    ),
  );
});
