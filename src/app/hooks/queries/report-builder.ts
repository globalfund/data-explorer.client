import axiosInstance from "app/utils/axiosInstance";
import { RBItemTypes } from "app/pages/report-builder/data";
import { AssetViewType } from "app/pages/report-builder/main/components/all-assets-view/toolbar";
import {
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
} from "app/state/api/action-reducers/report-builder/sync";

export const useCreateReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderCreateReport"],
    mutationFn: (data: RBReportModel) =>
      axiosInstance.post<RBReportModel>(`/report`, data),
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderCreateAsset"],
    mutationFn: (data: RBAssetModel) =>
      axiosInstance.post<RBAssetModel>(`/asset`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetAssets"] });
    },
  });
};

export const useCreateFolder = () => {
  return useMutation({
    mutationKey: ["ReportBuilderCreateFolder"],
    mutationFn: (data: RBFolderModel) =>
      axiosInstance.post<RBFolderModel>(`/folder`, data),
  });
};

export const useGetReport = (reportId?: string) => {
  return useQuery({
    queryKey: ["ReportBuilderGetReport", reportId],
    queryFn: () => axiosInstance.get<RBReportModel>(`/report/${reportId}`),
    enabled: !!reportId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetAsset = (assetId?: string) => {
  return useQuery({
    queryKey: ["ReportBuilderGetAsset", assetId],
    queryFn: () => axiosInstance.get<RBAssetModelResponse>(`/asset/${assetId}`),
    enabled: !!assetId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetFolder = (folderId?: string) => {
  return useQuery({
    queryKey: ["ReportBuilderGetFolder", folderId],
    queryFn: () =>
      axiosInstance.get<RBFolderModelResponse>(`/folder/${folderId}`),
    enabled: !!folderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetReports = (params: {
  sort: string;
  search: string;
  onlyRootLevel?: boolean;
  includeFolders?: boolean;
}) => {
  // TODO: cache and manage invalidation
  let filter = "";
  if (params.search) {
    filter = `{"where":{"name":{"like":".*${params.search}.*","options":"i"}},"order":["${params.sort}"]}`;
  } else {
    filter = `{"order":["${params.sort}"]}`;
  }
  let folderFilter = "";
  if (params.search) {
    folderFilter = `{"where":{"name":{"like":".*${params.search}.*","options":"i"},"type":"report"},"order":["${params.sort}"]}`;
  } else {
    folderFilter = `{"where":{"type":"report"},"order":["${params.sort}"]}`;
  }
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
  let filter = "";
  if (params.search && params.type !== "all") {
    filter = `{"where":{"name":{"like":".*${params.search}.*","options":"i"},"type":"${params.type}"}},"order":["${params.sort}"]}`;
  } else if (params.search && params.type === "all") {
    filter = `{"where":{"name":{"like":".*${params.search}.*","options":"i"}},"order":["${params.sort}"]}`;
  } else if (!params.search && params.type !== "all") {
    filter = `{"where":{"type":"${params.type}"},"order":["${params.sort}"]}`;
  } else {
    filter = `{"order":["${params.sort}"]}`;
  }
  let folderFilter = "";
  if (params.search) {
    folderFilter = `{"where":{"name":{"like":".*${params.search}.*","options":"i"},"type":"asset"},"order":["${params.sort}"]}`;
  } else {
    folderFilter = `{"where":{"type":"asset"},"order":["${params.sort}"]}`;
  }
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
  let filter = "";
  if (params.search) {
    filter = `{"where":{"name":{"like":".*${params.search}.*","options":"i"},"type":"${params.type}"},"order":["${params.sort}"]}`;
  } else {
    filter = `{"where":{"type":"${params.type}"},"order":["${params.sort}"]}`;
  }
  return useQuery({
    queryKey: [
      "ReportBuilderGetFolders",
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
          });
        } else if (item.type === "folder") {
          return axiosInstance.get(`/folder/add-folder/${data.folderId}`, {
            params: { folderId: item.id },
          });
        } else if (item.type === "asset") {
          return axiosInstance.get(`/folder/add-asset/${data.folderId}`, {
            params: { assetId: item.id },
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
    mutationFn: (data: RBReportPatchModel) =>
      axiosInstance.patch<RBReportPatchModel>(`/report/${reportId}`, data),
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

export const usePatchReport2 = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderPatchReport"],
    mutationFn: (data: RBReportPatchModel) =>
      axiosInstance.patch<RBReportPatchModel>(`/report/${data.id}`, data),
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
      axiosInstance.patch<RBAssetModel>(`/asset/${assetId}`, data),
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
      axiosInstance.patch<RBAssetModel>(`/asset/${data.id}`, data),
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
      axiosInstance.patch<RBFolderModel>(`/folder/${folderId}`, data),
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
      axiosInstance.patch<RBFolderModel>(`/folder/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetFolders"] });
    },
  });
};

export const useDeleteReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderDeleteReport"],
    mutationFn: (id: string) => axiosInstance.delete(`/report/${id}`),
  });
};

export const useMultiDeleteReportsFolders = () => {
  return useMutation({
    mutationKey: ["ReportBuilderMultiDeleteReportsFolders"],
    mutationFn: (items: { id: string; type: RBItemTypes }[]) => {
      const deletePromises = items.map((item) => {
        if (item.type === "report") {
          return axiosInstance.delete(`/report/${item.id}`);
        } else if (item.type === "folder") {
          return axiosInstance.delete(`/folder/${item.id}`);
        } else if (item.type === "asset") {
          return axiosInstance.delete(`/asset/${item.id}`);
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
    mutationFn: (id: string) => axiosInstance.delete(`/asset/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetAssets"] });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderDeleteFolder"],
    mutationFn: (id: string) => axiosInstance.delete(`/folder/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetFolders"] });
    },
  });
};

export const useDuplicateReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderDuplicateReport"],
    mutationFn: (id: string) => axiosInstance.get(`/report/duplicate/${id}`),
  });
};

export const useDuplicateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderDuplicateAsset"],
    mutationFn: (id: string) => axiosInstance.get(`/asset/duplicate/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetAssets"] });
    },
  });
};

export const useDuplicateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderDuplicateFolder"],
    mutationFn: (id: string) => axiosInstance.get(`/folder/duplicate/${id}`),
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
      ),
  });
};

export const useGFSampleDataset = (datasetId: string) => {
  return useQuery({
    queryKey: ["ReportBuilderGFSampleDataset", datasetId],
    queryFn: () =>
      axiosInstance.get<RBSampledDatasetResponse>(
        `/report-builder/gf-sample-dataset/${datasetId}`,
      ),
    enabled: !!datasetId,
  });
};

export const useDatasetFilterOptions = (
  datasetId: string,
  appliedFilters: Record<string, any[]> = {},
) => {
  return useQuery({
    queryKey: ["ReportBuilderDatasetFilterOptions", datasetId],
    queryFn: () =>
      axiosInstance.post<FilterGroupModel[]>(`/report/filter-options`, {
        datasetId,
        appliedFilters,
      }),
    enabled: !!datasetId,
  });
};

export const useFilteredDataset = ({
  datasetId,
  filters,
  sorting = [],
  pageSize = 50,
}: {
  datasetId: string;
  filters: Record<string, any[]>;
  sorting: { column: string; order: "asc" | "desc" }[];
  pageSize: number;
}) => {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["ReportBuilderFilteredDataset", datasetId, pageSize],
    queryFn: ({ pageParam }) =>
      axiosInstance.post<RBFilteredDatasetResponse>(
        `/report/filter-dataset`,
        {
          filters,
          datasetId,
          sorting,
        },
        { params: { page: pageParam, pageSize } },
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
      "ReportBuilderGFDatasetPage",
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
        },
      ),
    enabled: !!datasetId,
    placeholderData: (previousData) => previousData,
  });
};
