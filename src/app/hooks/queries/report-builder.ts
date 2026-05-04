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

export const useGetReports = (params: { sort: string; search: string }) => {
  // TODO: cache and manage invalidation
  let filter = "";
  if (params.search) {
    filter = `{"where":{"name":{"like":".*${params.search}.*","options":"i"}},"order":["${params.sort}"]}`;
  } else {
    filter = `{"order":["${params.sort}"]}`;
  }
  return useQuery({
    queryKey: ["ReportBuilderGetReports", params.search, params.sort],
    queryFn: () =>
      axiosInstance.get<RBReportModelResponse[]>(`/reports`, {
        params: { filter },
      }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAssets = (params: {
  sort: string;
  search: string;
  type: AssetViewType;
}) => {
  return useQuery({
    queryKey: [
      "ReportBuilderGetAssets",
      params.search,
      params.sort,
      params.type,
    ],
    queryFn: () =>
      axiosInstance.get<RBAssetModelResponse[]>(`/assets`, {
        params: {
          filter: `{"where":{"name":{"like":".*${params.search}.*","options":"i"}${params.type !== "all" ? `,"type":"${params.type}"` : ""}},"order":["${params.sort}"]}`,
        },
      }),
    staleTime: 1000 * 60 * 5,
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

export const useGFDataset = (datasetId: string) => {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["ReportBuilderGFDataset", datasetId],
    queryFn: ({ pageParam }) =>
      axiosInstance.get<RBDatasetResponse>(
        `/report-builder/gf-dataset/${datasetId}`,
        {
          params: {
            page: pageParam,
            pageSize: 50,
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
