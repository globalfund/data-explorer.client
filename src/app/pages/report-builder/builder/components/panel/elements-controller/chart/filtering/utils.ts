import type { FilterGroupOptionModel } from "app/state/api/action-reducers/report-builder/sync";

export const getFilterValues = (options: FilterGroupOptionModel[]): string[] =>
  Array.from(
    new Set(
      options.flatMap((option) => [
        option.value,
        ...getFilterValues(option.subOptions ?? []),
      ]),
    ),
  );

export const searchFilterOptions = (
  options: FilterGroupOptionModel[],
  search: string,
): FilterGroupOptionModel[] => {
  const query = search.trim().toLowerCase();
  if (!query) return options;

  return options.flatMap((option) => {
    if (String(option.label).toLowerCase().includes(query)) return [option];

    const subOptions = searchFilterOptions(option.subOptions ?? [], query);
    return subOptions.length ? [{ ...option, subOptions }] : [];
  });
};

// Ancestors kept for search context must not broaden a Select all operation.
export const getMatchingFilterValues = (
  options: FilterGroupOptionModel[],
  search: string,
): string[] => {
  const query = search.trim().toLowerCase();
  return Array.from(
    new Set(
      options.flatMap((option) =>
        String(option.label).toLowerCase().includes(query)
          ? getFilterValues([option])
          : getMatchingFilterValues(option.subOptions ?? [], query),
      ),
    ),
  );
};

export const updateFieldFilter = (
  filters: Record<string, any[]>,
  field: string,
  values: string[],
): Record<string, any[]> => {
  const nextFilters = { ...filters };
  if (values.length) {
    nextFilters[field] = Array.from(new Set(values));
  } else {
    delete nextFilters[field];
  }
  return nextFilters;
};
