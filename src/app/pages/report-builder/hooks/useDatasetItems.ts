import React from "react";
import { useUserDatasets } from "app/hooks/queries/report-builder";
import { RBUserDatasetModel } from "app/state/api/action-reducers/report-builder/sync";
import { datasetItems } from "app/pages/report-builder/builder/components/chart/data";

export type DatasetItem = {
  id: string;
  name: string;
  description: string;
  /** Only set for datasets the user uploaded or connected. */
  userDataset?: RBUserDatasetModel;
};

const EMPTY: RBUserDatasetModel[] = [];

/**
 * The datasets that can be used in a report: the Global Fund ones, and the
 * ones the user uploaded or connected from an external source.
 */
const useDatasetItems = () => {
  const userDatasetsQuery = useUserDatasets();
  const userDatasets = userDatasetsQuery.data?.data ?? EMPTY;

  const userDatasetItems = React.useMemo<DatasetItem[]>(
    () =>
      userDatasets.map((dataset) => ({
        id: dataset.id,
        name: dataset.name,
        description: dataset.description,
        userDataset: dataset,
      })),
    [userDatasets],
  );

  const getDatasetItem = React.useCallback(
    (id?: string | null): DatasetItem | undefined =>
      id
        ? (datasetItems.find((dataset) => dataset.id === id) ??
          userDatasetItems.find((dataset) => dataset.id === id))
        : undefined,
    [userDatasetItems],
  );

  return {
    getDatasetItem,
    userDatasetItems,
    userDatasetsLoading: userDatasetsQuery.isLoading,
  };
};

export default useDatasetItems;
