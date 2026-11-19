import axiosInstance from "app/utils/axiosInstance";
import { RBItemTypes } from "app/pages/report-builder/data";
import { AssetViewType } from "app/pages/report-builder/main/components/all-assets-view/toolbar";
import {
  QueryClient,
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  RBReportModel,
  RBDatasetResponse,
  RBFilteredDatasetResponse,
  RBRenderedChartData,
  RBRenderChartDataRequest,
  RBSampledDatasetResponse,
  RBReportModelResponse,
  RBReportPatchModel,
  RBAssetModel,
  RBAssetModelResponse,
  RBFolderModel,
  RBFolderModelResponse,
  FilterGroupModel,
  RBUserDatasetModel,
  RBExternalDatasetModel,
  RBExternalSource,
} from "app/state/api/action-reducers/report-builder/sync";

export const useCreateReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderCreateReport"],
    mutationFn: (data: RBReportModel) =>
      axiosInstance.post<RBReportModel>(`/report`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderCreateAsset"],
    mutationFn: (data: RBAssetModel) =>
      axiosInstance.post<RBAssetModel>(`/asset`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetAssets"] });
    },
  });
};

export const useCreateFolder = () => {
  return useMutation({
    mutationKey: ["ReportBuilderCreateFolder"],
    mutationFn: (data: RBFolderModel) =>
      axiosInstance.post<RBFolderModel>(`/folder`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
  });
};

export const useGetReport = (reportId?: string) => {
  return useQuery({
    queryKey: ["ReportBuilderGetReport", reportId],
    queryFn: () =>
      axiosInstance.get<RBReportModel>(`/report/${reportId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    enabled: !!reportId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetAsset = (assetId?: string) => {
  return useQuery({
    queryKey: ["ReportBuilderGetAsset", assetId],
    queryFn: () =>
      axiosInstance.get<RBAssetModelResponse>(`/asset/${assetId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    enabled: !!assetId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetFolder = (folderId?: string) => {
  return useQuery({
    queryKey: ["ReportBuilderGetFolder", folderId],
    queryFn: () =>
      axiosInstance.get<RBFolderModelResponse>(`/folder/${folderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    enabled: !!folderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// LoopBack list filter. The search text is matched literally and
// case-insensitively; the server turns `like` into a regex, so characters
// such as "[" or "(" are escaped rather than breaking the query.
export const buildListFilter = (
  sort: string,
  search: string,
  where: Record<string, unknown> = {},
) => {
  const fullWhere = search
    ? { name: { like: `.*${escapeRegExp(search)}.*`, options: "i" }, ...where }
    : where;
  return JSON.stringify({
    ...(Object.keys(fullWhere).length > 0 && { where: fullWhere }),
    order: [sort],
  });
};

export const useGetReports = (params: {
  sort: string;
  search: string;
  onlyRootLevel?: boolean;
  includeFolders?: boolean;
}) => {
  // TODO: cache and manage invalidation
  const filter = buildListFilter(params.sort, params.search);
  const folderFilter = buildListFilter(params.sort, params.search, {
    type: "report",
  });
  return useQuery({
    queryKey: [
      "ReportBuilderGetReports",
      params.search,
      params.sort,
      params.onlyRootLevel,
      params.includeFolders,
    ],
    queryFn: () =>
      axiosInstance.get<RBReportModelResponse[]>(`/reports`, {
        params: {
          filter,
          folderFilter,
          onlyRootLevel: params.onlyRootLevel,
          includeFolders: params.includeFolders,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAssets = (params: {
  sort: string;
  search: string;
  type: AssetViewType;
  onlyRootLevel?: boolean;
  includeFolders?: boolean;
}) => {
  const filter = buildListFilter(
    params.sort,
    params.search,
    params.type !== "all" ? { type: params.type } : {},
  );
  const folderFilter = buildListFilter(params.sort, params.search, {
    type: "asset",
  });
  return useQuery({
    queryKey: [
      "ReportBuilderGetAssets",
      params.search,
      params.sort,
      params.type,
      params.onlyRootLevel,
      params.includeFolders,
    ],
    queryFn: () =>
      axiosInstance.get<RBAssetModelResponse[]>(`/assets`, {
        params: {
          filter,
          folderFilter,
          onlyRootLevel: params.onlyRootLevel,
          includeFolders: params.includeFolders,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetFolders = (params: {
  sort: string;
  search: string;
  type: "report" | "asset";
  includeSubFolders?: boolean;
}) => {
  const filter = buildListFilter(params.sort, params.search, {
    type: params.type,
  });
  return useQuery({
    queryKey: [
      "ReportBuilderGetFolders",
      params.type,
      params.search,
      params.sort,
      params.includeSubFolders,
    ],
    queryFn: () =>
      axiosInstance.get<RBFolderModelResponse[]>(`/folders`, {
        params: {
          filter,
          includeSubFolders: Boolean(params.includeSubFolders),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddReportToFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderAddReportToFolder"],
    mutationFn: (data: { folderId: string; reportId: string }) =>
      axiosInstance.get(`/folder/add-report/${data.folderId}`, {
        params: { reportId: data.reportId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetFolders"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetReports"],
      });
    },
  });
};

export const useAddAssetToFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderAddAssetToFolder"],
    mutationFn: (data: { folderId: string; assetId: string }) =>
      axiosInstance.get(`/folder/add-asset/${data.folderId}`, {
        params: { assetId: data.assetId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetFolders"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetAssets"],
      });
    },
  });
};

export const useAddFolderToFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderAddFolderToFolder"],
    mutationFn: (data: { folderId: string; folderIdToAdd: string }) =>
      axiosInstance.get(`/folder/add-folder/${data.folderId}`, {
        params: { folderId: data.folderIdToAdd },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetFolders"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetReports"],
      });
    },
  });
};

export const useMultiAddItemsToFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderMultiAddItemsToFolder"],
    mutationFn: (data: {
      folderId: string;
      items: { id: string; type: RBItemTypes }[];
    }) => {
      const addPromises = data.items.map((item) => {
        if (item.type === "report") {
          return axiosInstance.get(`/folder/add-report/${data.folderId}`, {
            params: { reportId: item.id },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
        } else if (item.type === "folder") {
          return axiosInstance.get(`/folder/add-folder/${data.folderId}`, {
            params: { folderId: item.id },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
        } else if (item.type === "asset") {
          return axiosInstance.get(`/folder/add-asset/${data.folderId}`, {
            params: { assetId: item.id },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
        }
      });
      return Promise.all(addPromises);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetFolders"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetReports"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetAssets"],
      });
    },
  });
};

export const usePatchReport = (reportId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderPatchReport", reportId],
    // Saves of the same report run one at a time, in order, so an older
    // payload can never land after a newer one.
    scope: { id: `ReportBuilderPatchReport-${reportId}` },
    mutationFn: (data: RBReportPatchModel) =>
      axiosInstance.patch<RBReportPatchModel>(`/report/${reportId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetReports"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetReport", reportId],
      });
    },
  });
};

/** Resolves once no save of the report from usePatchReport is running or queued. */
const reportSavesSettled = (queryClient: QueryClient, reportId?: string) => {
  const filters = { mutationKey: ["ReportBuilderPatchReport", reportId] };
  return new Promise<void>((resolve) => {
    const settled = () => queryClient.isMutating(filters) === 0;
    if (settled()) {
      resolve();
      return;
    }
    const unsubscribe = queryClient.getMutationCache().subscribe(() => {
      if (!settled()) return;
      unsubscribe();
      resolve();
    });
  });
};

export const usePatchReport2 = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderPatchReport"],
    mutationFn: async (data: RBReportPatchModel) => {
      // Leaving the editor saves the whole report, old name included. Its
      // report's queue can't be joined from here (the report varies per call),
      // so wait for it instead, or that save can land after a rename here.
      await reportSavesSettled(queryClient, data.id);
      return axiosInstance.patch<RBReportPatchModel>(
        `/report/${data.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetReports"],
      });
    },
  });
};

export const usePatchAsset = (assetId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderPatchAsset", assetId],
    mutationFn: (data: Partial<RBAssetModel>) =>
      axiosInstance.patch<RBAssetModel>(`/asset/${assetId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetAssets"] });
      queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetAsset", assetId],
      });
    },
  });
};

export const usePatchAsset2 = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderPatchAsset"],
    mutationFn: (data: Partial<RBAssetModel>) =>
      axiosInstance.patch<RBAssetModel>(`/asset/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetAssets"] });
    },
  });
};

export const usePatchFolder = (folderId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderPatchFolder", folderId],
    mutationFn: (data: Partial<RBFolderModel>) =>
      axiosInstance.patch<RBFolderModel>(`/folder/${folderId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetFolders"] });
      queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetFolder", folderId],
      });
    },
  });
};

export const usePatchFolder2 = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderPatchFolder"],
    mutationFn: (data: Partial<RBFolderModel>) =>
      axiosInstance.patch<RBFolderModel>(`/folder/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetFolders"] });
    },
  });
};

export const useDeleteReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderDeleteReport"],
    mutationFn: (id: string) =>
      axiosInstance.delete(`/report/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
  });
};

export const useMultiDeleteReportsFolders = () => {
  return useMutation({
    mutationKey: ["ReportBuilderMultiDeleteReportsFolders"],
    mutationFn: (items: { id: string; type: RBItemTypes }[]) => {
      const deletePromises = items.map((item) => {
        if (item.type === "report") {
          return axiosInstance.delete(`/report/${item.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
        } else if (item.type === "folder") {
          return axiosInstance.delete(`/folder/${item.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
        } else if (item.type === "asset") {
          return axiosInstance.delete(`/asset/${item.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
        }
      });
      return Promise.all(deletePromises);
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderDeleteAsset"],
    mutationFn: (id: string) =>
      axiosInstance.delete(`/asset/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetAssets"] });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderDeleteFolder"],
    mutationFn: (id: string) =>
      axiosInstance.delete(`/folder/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetFolders"] });
    },
  });
};

export const useDuplicateReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderDuplicateReport"],
    mutationFn: (id: string) =>
      axiosInstance.get(`/report/duplicate/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
  });
};

export const useDuplicateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderDuplicateAsset"],
    mutationFn: (id: string) =>
      axiosInstance.get(`/asset/duplicate/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetAssets"] });
    },
  });
};

export const useDuplicateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderDuplicateFolder"],
    mutationFn: (id: string) =>
      axiosInstance.get(`/folder/duplicate/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetFolders"] });
    },
  });
};

export const useRenderChartData = () => {
  return useMutation({
    mutationKey: ["ReportBuilderRenderChartData"],
    mutationFn: (data: RBRenderChartDataRequest) =>
      axiosInstance.post<RBRenderedChartData>(
        `/report/render-chart-data`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
  });
};

export const useGFSampleDataset = (datasetId: string) => {
  return useQuery({
    queryKey: ["ReportBuilderGFSampleDataset", datasetId],
    queryFn: () =>
      axiosInstance.get<RBSampledDatasetResponse>(
        `/report-builder/gf-sample-dataset/${datasetId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
    enabled: !!datasetId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDatasetFilterOptions = (
  datasetId: string,
  appliedFilters: Record<string, any[]> = {},
) => {
  return useQuery({
    queryKey: ["ReportBuilderDatasetFilterOptions", datasetId, appliedFilters],
    queryFn: () =>
      axiosInstance.post<FilterGroupModel[]>(
        `/report/filter-options`,
        {
          datasetId,
          filters: appliedFilters,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
    enabled: !!datasetId,
  });
};

export const useFilteredDataset = ({
  datasetId,
  filters,
  sorting = [],
  pageSize = 50,
  limitToTop,
  limitToTopValue,
  groupRemainderAsOther,
}: {
  datasetId: string;
  filters: Record<string, any[]>;
  sorting: { column: string; order: "asc" | "desc" }[];
  pageSize: number;
  limitToTop: boolean;
  limitToTopValue: string;
  groupRemainderAsOther: boolean;
}) => {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [
      "ReportBuilderFilteredDataset",
      datasetId,
      pageSize,
      filters,
      sorting,
      limitToTop,
      limitToTopValue,
      groupRemainderAsOther,
    ],
    queryFn: ({ pageParam }) =>
      axiosInstance.post<RBFilteredDatasetResponse>(
        `/report/filter-dataset`,
        {
          filters,
          datasetId,
          sorting,
          limitToTop,
          limitToTopValue,
          groupRemainderAsOther,
        },
        {
          params: { page: pageParam, pageSize },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
    getNextPageParam: (lastPage, allPages) => {
      const loadedDataCount = allPages.reduce(
        (acc, page) => acc + page?.data?.result?.length,
        0,
      );
      if (loadedDataCount < lastPage?.data?.count) {
        return allPages.length + 1; // next page number
      } else {
        return undefined; // no more pages
      }
    },
    getPreviousPageParam: (_firstPage, allPages) => {
      if (allPages.length > 1) {
        return allPages.length - 1; // previous page number
      } else {
        return undefined; // no previous page
      }
    },
    enabled: !!datasetId,
  });
};

export const useGFDataset = (datasetId: string, pageSize = 50) => {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["ReportBuilderGFDataset", datasetId, pageSize],
    queryFn: ({ pageParam }) =>
      axiosInstance.get<RBDatasetResponse>(
        `/report-builder/gf-dataset/${datasetId}`,
        {
          params: {
            page: pageParam,
            pageSize,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
    getNextPageParam: (lastPage, allPages) => {
      const loadedDataCount = allPages.reduce(
        (acc, page) => acc + page?.data?.data?.result?.data?.length,
        0,
      );
      if (loadedDataCount < lastPage?.data?.data?.result?.count) {
        return allPages.length + 1; // next page number
      } else {
        return undefined; // no more pages
      }
    },
    getPreviousPageParam: (_firstPage, allPages) => {
      if (allPages.length > 1) {
        return allPages.length - 1; // previous page number
      } else {
        return undefined; // no previous page
      }
    },
    enabled: !!datasetId,
  });
};

export const useGFDatasetPage = (
  datasetId: string,
  page: number,
  pageSize: number,
) => {
  return useQuery({
    queryKey: ["ReportBuilderGFDatasetPage", datasetId, page, pageSize],
    queryFn: () =>
      axiosInstance.get<RBDatasetResponse>(
        `/report-builder/gf-dataset/${datasetId}`,
        {
          params: {
            page,
            pageSize,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
    enabled: !!datasetId,
    placeholderData: (previousData) => previousData,
  });
};

export const useFilteredDatasetPage = ({
  datasetId,
  filters,
  pageSize = 50,
  page,
  sorting = [],
}: {
  datasetId: string;
  filters: Record<string, any[]>;
  sorting: { column: string; order: "asc" | "desc" }[];
  pageSize: number;
  page: number;
}) => {
  return useQuery({
    queryKey: [
      "ReportBuilderFilteredDatasetPage",
      datasetId,
      pageSize,
      filters,
      sorting,
      page,
    ],
    queryFn: () =>
      axiosInstance.post<RBFilteredDatasetResponse>(
        `/report/filter-dataset`,
        {
          filters,
          datasetId,
          sorting,
        },
        {
          params: {
            page,
            pageSize,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
    enabled: !!datasetId,
    placeholderData: (previousData) => previousData,
  });
};

export const useSendErrorReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderSendErrorReport"],
    mutationFn: (data: {
      action: string | null;
      details: string;
      reportId: string | undefined;
      reportName: string | undefined;
      errorMessage: string | null;
    }) =>
      axiosInstance.post(`/report/report-an-error`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
  });
};

const USER_DATASETS_QUERY_KEY = ["ReportBuilderUserDatasets"];
// Connecting or uploading a dataset includes processing it, which can take
// minutes for large files.
const DATASET_PROCESSING_TIMEOUT = 10 * 60 * 1000;
export const EXTERNAL_SOURCE_PAGE_SIZE = 20;

export const useUserDatasets = () => {
  return useQuery({
    queryKey: USER_DATASETS_QUERY_KEY,
    queryFn: () =>
      axiosInstance.get<RBUserDatasetModel[]>(`/report-builder/datasets`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useExternalSourceCounts = (enabled = true) => {
  return useQuery({
    queryKey: ["ReportBuilderExternalSourceCounts"],
    queryFn: () =>
      axiosInstance.get<Record<RBExternalSource, number>>(
        `/report-builder/external-sources/counts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useExternalSourceSearch = (params: {
  source: RBExternalSource | null;
  search: string;
  sortBy?: "name";
}) => {
  return useInfiniteQuery({
    queryKey: [
      "ReportBuilderExternalSourceSearch",
      params.source,
      params.search,
      params.sortBy,
    ],
    queryFn: ({ pageParam }) =>
      axiosInstance.get<RBExternalDatasetModel[]>(
        `/report-builder/external-sources/search`,
        {
          params: {
            source: params.source,
            q: params.search,
            sortBy: params.sortBy,
            limit: EXTERNAL_SOURCE_PAGE_SIZE,
            offset: pageParam,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
    initialPageParam: 0,
    // A dataset can have several files, so a page can hold more or fewer
    // results than its size: the source is exhausted once a page is empty.
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length > 0
        ? allPages.length * EXTERNAL_SOURCE_PAGE_SIZE
        : undefined,
    enabled: !!params.source,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useConnectExternalDataset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderConnectExternalDataset"],
    mutationFn: (data: RBExternalDatasetModel) =>
      axiosInstance.post<RBUserDatasetModel>(
        `/report-builder/external-sources/connect`,
        data,
        {
          timeout: DATASET_PROCESSING_TIMEOUT,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: USER_DATASETS_QUERY_KEY }),
  });
};

export const useUploadDataset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderUploadDataset"],
    mutationFn: (file: File) => {
      const data = new FormData();
      data.append("file", file);
      return axiosInstance.post<RBUserDatasetModel>(
        `/report-builder/datasets/upload`,
        data,
        {
          timeout: DATASET_PROCESSING_TIMEOUT,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: USER_DATASETS_QUERY_KEY }),
  });
};
