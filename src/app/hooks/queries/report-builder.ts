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
} from "app/state/api/action-reducers/report-builder/sync";

export const useCreateReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderCreateReport"],
    mutationFn: (data: RBReportModel) =>
      axiosInstance.post<RBReportModel>(`/report`, data),
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

export const useGetReports = (params: { sort: string; search: string }) => {
  // TODO: cache and manage invalidation
  return useQuery({
    queryKey: ["ReportBuilderGetReports", params.search, params.sort],
    queryFn: () =>
      axiosInstance.get<RBReportModelResponse[]>(`/reports`, {
        params: {
          filter: `{"where":{"name":{"like":".*${params.search}.*","options":"i"}},"order":["${params.sort}"]}`,
        },
      }),
    staleTime: 1000 * 60 * 5,
  });
};

export const usePatchReport = (reportId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ReportBuilderPatchReport"],
    mutationFn: (data: RBReportPatchModel) =>
      axiosInstance.patch<RBReportPatchModel>(`/report/${reportId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ReportBuilderGetReports"] });
      queryClient.invalidateQueries({
        queryKey: ["ReportBuilderGetReport", reportId],
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

export const useDuplicateReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderDuplicateReport"],
    mutationFn: (id: string) => axiosInstance.get(`/report/duplicate/${id}`),
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
