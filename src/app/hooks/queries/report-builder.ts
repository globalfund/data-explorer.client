import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  RBDatasetResponse,
  RBRenderChartDataRequest,
  RBRenderedChartData,
  RBSampledDatasetResponse,
} from "app/state/api/action-reducers/report-builder/sync";
import axiosInstance from "app/utils/axiosInstance";

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
    getPreviousPageParam: (firstPage, allPages) => {
      if (allPages.length > 1) {
        return allPages.length - 1; // previous page number
      } else {
        return undefined; // no previous page
      }
    },
    enabled: !!datasetId,
  });
};
