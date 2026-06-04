import axiosInstance from "app/utils/axiosInstance";
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  RBReportModel,
  RBDatasetResponse,
  RBRenderedChartData,
  RBRenderChartDataRequest,
  RBSampledDatasetResponse,
  RBReportModelResponse,
  RBReportPatchModel,
  RBAssetModel,
  RBAssetModelResponse,
  RBFolderModel,
  RBFolderModelResponse,
} from "app/state/api/action-reducers/report-builder/sync";
import { AssetViewType } from "app/pages/report-builder/main/components/all-assets-view/toolbar";

export const useCreateReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderCreateReport"],
    mutationFn: (data: RBReportModel) =>
      axiosInstance.post<RBReportModel>(`/report`, data),
  });
};

export const useCreateAsset = () => {
  return useMutation({
    mutationKey: ["ReportBuilderCreateAsset"],
    mutationFn: (data: RBAssetModel) =>
      axiosInstance.post<RBAssetModel>(`/asset`, data),
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
          folderFilter: filter,
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
  return useQuery({
    queryKey: [
      "ReportBuilderGetAssets",
      params.search,
      params.sort,
      params.type,
    ],
    queryFn: () =>
      axiosInstance.get<RBAssetModelResponse[]>(`/assets`, {
        params: { filter },
      }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetFolders = (params: {
  sort: string;
  search: string;
  includeSubFolders?: boolean;
}) => {
  let filter = "";
  if (params.search) {
    filter = `{"where":{"name":{"like":".*${params.search}.*","options":"i"}},"order":["${params.sort}"]}`;
  } else {
    filter = `{"order":["${params.sort}"]}`;
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
