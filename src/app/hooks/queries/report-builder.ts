import axiosInstance from "app/utils/axiosInstance";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  RBReportModel,
  RBDatasetResponse,
  RBRenderedChartData,
  RBRenderChartDataRequest,
  RBSampledDatasetResponse,
  RBChartModel,
} from "app/state/api/action-reducers/report-builder/sync";

export const useCreateReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderCreateReport"],
    mutationFn: (data: RBReportModel) =>
      axiosInstance.post<RBReportModel>(`/report-builder/reports`, data),
  });
};

export const useGetReport = (reportId?: string) => {
  return useQuery({
    queryKey: ["ReportBuilderGetReport"],
    queryFn: () =>
      axiosInstance.get<RBReportModel>(`/report-builder/reports/${reportId}`),
    enabled: !!reportId,
  });
};

export const useGetReports = () => {
  // TODO: cache and manage invalidation
  return useQuery({
    queryKey: ["ReportBuilderGetReports"],
    queryFn: () =>
      axiosInstance.get<RBReportModel[]>(`/report-builder/reports`),
  });
};

export const usePatchReport = (reportId?: string) => {
  return useMutation({
    mutationKey: ["ReportBuilderPatchReport"],
    mutationFn: (data: RBReportModel) =>
      axiosInstance.patch<RBReportModel>(
        `/report-builder/reports/${reportId}`,
        data,
      ),
  });
};

export const useRenderChartData = () => {
  return useMutation({
    mutationKey: ["ReportBuilderRenderChartData"],
    mutationFn: (data: RBRenderChartDataRequest) =>
      axiosInstance.post<RBRenderedChartData>(
        `/report-builder/render-chart-data`,
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

export const useGFCreateReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderGFCreateReport"],
    mutationFn: (data: {
      name: string;
      description: string;
      settings: {
        width: string;
        height: string;
        padding: string[];
        stroke: string;
        strokeColor: string;
        borderRadius: string;
        backgroundColor: string;
      };
    }) => axiosInstance.post<RBReportModel>("/report", data),
  });
};

export const useGFGetReport = (reportId?: string) => {
  return useQuery({
    queryKey: ["GFGetReport", reportId],
    queryFn: () => axiosInstance.get<RBReportModel>(`/report/${reportId}`),
    enabled: !!reportId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGFUpdateReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderGFUpdateReport"],
    mutationFn: (data: {
      reportId: string;
      name?: string;
      description?: string;
      width?: string;
      height?: string;
      padding?: string;
      stroke?: string;
      strokeColor?: string;
      borderRadius?: string;
      backgroundColor?: string;
      rows?: {
        items: any[];
        structure: string;
        contentWidths: {
          id: string;
          widths: number[];
        }[];
        contentHeights: {
          id: string;
          heights: number[];
        }[];
      }[];
    }) => {
      const _data: {
        name?: string;
        description?: string;
        settings?: {
          width?: string;
          height?: string;
          padding?: string;
          stroke?: string;
          strokeColor?: string;
          borderRadius?: string;
          backgroundColor?: string;
        };
      } = {};
      if (data.name) {
        Object.assign(_data, { name: data.name });
      }
      if (data.description) {
        Object.assign(_data, { description: data.description });
      }
      if (data.width) {
        Object.assign(_data, {
          settings: { ..._data.settings, width: data.width },
        });
      }
      if (data.height) {
        Object.assign(_data, {
          settings: { ..._data.settings, height: data.height },
        });
      }
      if (data.padding) {
        Object.assign(_data, {
          settings: { ..._data.settings, padding: data.padding },
        });
      }
      if (data.stroke) {
        Object.assign(_data, {
          settings: { ..._data.settings, stroke: data.stroke },
        });
      }
      if (data.strokeColor) {
        Object.assign(_data, {
          settings: { ..._data.settings, strokeColor: data.strokeColor },
        });
      }
      if (data.borderRadius) {
        Object.assign(_data, {
          settings: { ..._data.settings, borderRadius: data.borderRadius },
        });
      }
      if (data.backgroundColor) {
        Object.assign(_data, {
          settings: {
            ..._data.settings,
            backgroundColor: data.backgroundColor,
          },
        });
      }
      if (data.rows) {
        Object.assign(_data, { rows: data.rows });
      }
      return axiosInstance.patch<RBReportModel>(
        `/report/${data.reportId}`,
        _data,
      );
    },
  });
};

export const useGFDeleteReport = () => {
  return useMutation({
    mutationKey: ["ReportBuilderGFDeleteReport"],
    mutationFn: (id: string) => axiosInstance.delete(`/report/${id}`),
  });
};

export const useGFCreateChart = () => {
  return useMutation({
    mutationKey: ["ReportBuilderGFCreateChart"],
    mutationFn: (data: Omit<RBRenderChartDataRequest, "id">) =>
      axiosInstance.post<RBChartModel>("/chart", data),
  });
};
