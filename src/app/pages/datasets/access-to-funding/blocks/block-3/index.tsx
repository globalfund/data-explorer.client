import React from "react";
import get from "lodash/get";
import uniq from "lodash/uniq";
import Box from "@mui/material/Box";
import isEqual from "lodash/isEqual";
import { useLocation } from "react-router-dom";
import { useCMSData } from "app/hooks/useCMSData";
import { Dropdown } from "app/components/dropdown";
import { Treemap } from "app/components/charts/treemap";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { SunburstChart } from "app/components/charts/sunburst";
import { TableContainer } from "app/components/table-container";
import TableIcon from "app/assets/vectors/Select_Table.svg?react";
import { FilterGroupModel } from "app/components/filters/list/data";
import { TreemapDataItem } from "app/components/charts/treemap/data";
import TreemapIcon from "app/assets/vectors/Select_Treemap.svg?react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { SunburstDataItem } from "app/components/charts/sunburst/data";
import { DatasetChartBlock } from "app/pages/datasets/common/chart-block";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import SunburstChartIcon from "app/assets/vectors/Select_SunburstChart.svg?react";
import { defaultAppliedFilters } from "app/state/api/action-reducers/sync/filters";
import {
  financialFormatter,
  cellBGColorFormatter,
} from "app/components/table/data";

interface AccessToFundingBlock3Props {
  filterGroups: FilterGroupModel[];
}

export const AccessToFundingBlock3: React.FC<AccessToFundingBlock3Props> = (
  props: AccessToFundingBlock3Props,
) => {
  const location = useLocation();
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "allocations",
  });

  const dropdownItems = React.useMemo(
    () => [
      {
        label: getCMSDataField(
          cmsData,
          "generic.sunburstChartDropdownOptionLabel",
          "Sunburst Chart",
        ),
        value: "Sunburst Chart",
        icon: <SunburstChartIcon />,
      },
      {
        label: getCMSDataField(
          cmsData,
          "generic.treemapDropdownOptionLabel",
          "Treemap",
        ),
        value: "Treemap",
        icon: <TreemapIcon />,
      },
      {
        label: getCMSDataField(
          cmsData,
          "generic.tableViewDropdownOptionLabel",
          "Table View",
        ),
        value: "Table View",
        icon: <TableIcon />,
      },
    ],
    [cmsData],
  );

  const [dropdownSelected, setDropdownSelected] = React.useState(
    dropdownItems[0].value,
  );
  const [allocationCycleDropdownSelected, setAllocationCycleDropdownSelected] =
    React.useState<string | null>(null);
  const [chart2AppliedFilters, setChart2AppliedFilters] = React.useState<
    string[]
  >([]);
  const [chart2TempAppliedFilters, setChart2TempAppliedFilters] =
    React.useState<string[]>([]);

  const [chart2AppliedFiltersData, setChart2AppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });

  const [chart2TempAppliedFiltersData, setChart2TempAppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });

  const [tableSearch, setTableSearch] = React.useState("");

  const dataAllocationsSunburst = useStoreState((state) =>
    get(state.AccessToFundingAllocationSunburst, "data.data", []),
  );
  const fetchAllocationsSunburst = useStoreActions(
    (actions) => actions.AccessToFundingAllocationSunburst.fetch,
  );
  const dataAllocationsTreemap = useStoreState(
    (state) =>
      get(
        state.AccessToFundingAllocationTreemap,
        "data.data",
        [],
      ) as TreemapDataItem[],
  );
  const fetchAllocationsTreemap = useStoreActions(
    (actions) => actions.AccessToFundingAllocationTreemap.fetch,
  );
  const dataAllocationsTable = useStoreState((state) =>
    get(state.AccessToFundingAllocationTable, "data.data", []),
  );
  const fetchAllocationsTable = useStoreActions(
    (actions) => actions.AccessToFundingAllocationTable.fetch,
  );
  const loadingAllocations = useStoreState((state) => {
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        return state.AccessToFundingAllocationSunburst.loading;
      case dropdownItems[1].value:
        return state.AccessToFundingAllocationTreemap.loading;
      case dropdownItems[2].value:
        return state.AccessToFundingAllocationTable.loading;
      default:
        return false;
    }
  });
  const dataCycleFilterOptions = useStoreState((state) => ({
    id: "cycle",
    name: "Cycle",
    options: get(state.AllocationsCycles, "data.data", []).map(
      (item: { value: string }) => ({
        name: item.value,
        value: item.value,
      }),
    ),
  }));
  const appliedFiltersData = useStoreState(
    (state) => state.AppliedFiltersState,
  );

  const chart2FilterString = React.useMemo(() => {
    let value = "";
    if (
      (appliedFiltersData.locations.length > 0 &&
        location.search.includes("locations=")) ||
      chart2AppliedFiltersData.locations.length > 0
    ) {
      value += `geographies=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.locations,
          ...chart2AppliedFiltersData.locations,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.components.length > 0 &&
        location.search.includes("components=")) ||
      chart2AppliedFiltersData.components.length > 0
    ) {
      value += `${value.length > 0 ? "&" : ""}components=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.components,
          ...chart2AppliedFiltersData.components,
        ]).join(","),
      )}`;
    }
    if (allocationCycleDropdownSelected) {
      value += `${value.length > 0 ? "&" : ""}cycles=${encodeURIComponent(
        allocationCycleDropdownSelected,
      )}`;
    }
    return value;
  }, [
    location.search,
    appliedFiltersData,
    chart2AppliedFiltersData,
    allocationCycleDropdownSelected,
  ]);

  const allocationCycleDropdown = React.useMemo(() => {
    if (!allocationCycleDropdownSelected) {
      return <React.Fragment />;
    }
    return (
      <Dropdown
        dropdownItems={dataCycleFilterOptions.options.map((item) => ({
          label: item.name,
          value: item.value,
        }))}
        dropdownSelected={allocationCycleDropdownSelected}
        handleDropdownChange={setAllocationCycleDropdownSelected}
      />
    );
  }, [dataCycleFilterOptions, allocationCycleDropdownSelected]);

  const onSearchChange = (search: string) => {
    setTableSearch(search);
    let filterString = chart2FilterString;
    if (search) {
      filterString += `${filterString.length > 0 ? "&" : ""}q=${search}`;
    }
    fetchAllocationsTable({ filterString });
  };

  const [selectedItem, setSelectedItem] = React.useState<{
    dataIndex: number;
    item: SunburstDataItem;
  } | null>(null);

  const chartContent = React.useMemo(() => {
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        return (
          <SunburstChart
            tooltipLabel="Allocation"
            selectedItem={selectedItem}
            data={dataAllocationsSunburst}
            centerLabel="Total Allocation"
            setSelectedItem={setSelectedItem}
          />
        );
      case dropdownItems[1].value:
        return <Treemap data={dataAllocationsTreemap} />;
      case dropdownItems[2].value:
        return (
          <TableContainer
            dataTree
            search={tableSearch}
            id="allocations-table"
            data={dataAllocationsTable}
            onSearchChange={onSearchChange}
            columns={[
              {
                title: "Geography",
                field: "name",
                formatter: cellBGColorFormatter,
                width: "33%",
              },
              {
                title: "Amount ($US)",
                field: allocationCycleDropdownSelected ?? "",
                formatter: financialFormatter,
                width: "66%",
              },
            ]}
          />
        );
      default:
        return null;
    }
  }, [
    tableSearch,
    dropdownSelected,
    dataAllocationsSunburst,
    dataAllocationsTreemap,
    dataAllocationsTable,
    selectedItem,
    setSelectedItem,
  ]);

  const chartData = React.useMemo(() => {
    const result: (string | number)[][] = [];
    let headers: string[] = [];
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        headers = ["Sub-Region", "Country", "Amount"];
        dataAllocationsSunburst.forEach((item: any) => {
          const items = get(item, "children", []);
          if (items.length > 0) {
            items.forEach((child: any) => {
              result.push([item.name, child.name, child.value]);
            });
          } else {
            result.push([item.name, "", item.value]);
          }
        });
        break;
      case dropdownItems[1].value:
        headers = ["Component", "Amount"];
        dataAllocationsTreemap.forEach((item: any) => {
          result.push([item.name, item.value]);
        });
        break;
      case dropdownItems[2].value:
        headers = ["Geography", "Component", "Period", "Amount"];
        dataAllocationsTable.forEach((item: any) => {
          get(item, "_children", []).forEach((child: any) => {
            Object.keys(child).forEach((key) => {
              if (key !== "name") {
                result.push([item.name, child.name, key, child[key]]);
              }
            });
          });
        });
        break;
      default:
        break;
    }
    return {
      headers,
      data: result,
    };
  }, [
    dropdownSelected,
    dataAllocationsSunburst,
    dataAllocationsTreemap,
    dataAllocationsTable,
  ]);

  const chartEmpty = React.useMemo(() => {
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        return dataAllocationsSunburst.length === 0;
      case dropdownItems[1].value:
        return dataAllocationsTreemap.length === 0;
      case dropdownItems[2].value:
        return dataAllocationsTable.length === 0 && tableSearch.length === 0;
      default:
        return false;
    }
  }, [
    tableSearch,
    dropdownSelected,
    dataAllocationsSunburst,
    dataAllocationsTreemap,
    dataAllocationsTable,
  ]);

  const handleSelectionChange = (value: string) => {
    setDropdownSelected(value);
  };

  const handleToggleChartFilter = (
    checked: boolean,
    value: string,
    type: string,
  ) => {
    const state = structuredClone(chart2TempAppliedFiltersData);
    switch (type) {
      case "geography":
      case "geographyType":
      case "geographySubType":
        if (checked) {
          state.locations.push(value);
        } else {
          state.locations = state.locations.filter((item) => item !== value);
        }
        break;
      case "component":
        if (checked) {
          state.components.push(value);
        } else {
          state.components = state.components.filter((item) => item !== value);
        }
        break;
      default:
        break;
    }
    setChart2TempAppliedFiltersData(structuredClone(state));
    setChart2TempAppliedFilters([...state.locations, ...state.components]);
  };

  const handleRemoveChartFilter = (value: string, types: string[]) => {
    const state = structuredClone(chart2TempAppliedFiltersData);
    types.forEach((type) => {
      switch (type) {
        case "geography":
        case "geographyType":
        case "geographySubType":
          state.locations = state.locations.filter((item) => item !== value);
          break;
        case "component":
          state.components = state.components.filter((item) => item !== value);
          break;
        default:
          break;
      }
    });
    setChart2TempAppliedFiltersData(structuredClone(state));
    setChart2TempAppliedFilters([...state.locations, ...state.components]);
  };

  const handleResetChartFilters = () => {
    setChart2AppliedFiltersData({
      ...chart2AppliedFiltersData,
      locations: [],
      components: [],
    });
    setChart2AppliedFilters([]);
    setChart2TempAppliedFiltersData({
      ...chart2TempAppliedFiltersData,
      locations: [],
      components: [],
    });
    setChart2TempAppliedFilters([]);
  };

  const handleCancelChartFilters = () => {
    setChart2TempAppliedFiltersData(structuredClone(chart2AppliedFiltersData));
    setChart2TempAppliedFilters(chart2AppliedFilters);
  };

  const handleApplyChartFilters = () => {
    if (isEqual(chart2AppliedFilters, chart2TempAppliedFiltersData)) return;
    setChart2AppliedFiltersData(structuredClone(chart2TempAppliedFiltersData));
    setChart2AppliedFilters(chart2TempAppliedFilters);
  };

  React.useEffect(() => {
    if (location.hash) {
      const blockId = location.hash.slice(1).split("|")[0];
      const blockChartType = location.hash.slice(1).split("|")[1];
      if (blockId && blockChartType && blockId === "allocation") {
        setDropdownSelected(decodeURIComponent(blockChartType));
      }
    }
  }, [location.hash]);

  React.useEffect(() => {
    if (allocationCycleDropdownSelected) {
      fetchAllocationsSunburst({ filterString: chart2FilterString });
      fetchAllocationsTreemap({ filterString: chart2FilterString });
      fetchAllocationsTable({ filterString: chart2FilterString });
    }
  }, [chart2FilterString]);

  React.useEffect(() => {
    if (
      dataCycleFilterOptions.options.length > 0 &&
      !allocationCycleDropdownSelected
    ) {
      setAllocationCycleDropdownSelected(
        dataCycleFilterOptions.options[
          dataCycleFilterOptions.options.length - 1
        ].value,
      );
    }
  }, [dataCycleFilterOptions]);

  return (
    <Box
      padding="50px 0"
      sx={{
        "#content": {
          padding: 0,
        },
        "@media (max-width: 767px)": {
          padding: "20px 0",
        },
      }}
    >
      <DatasetChartBlock
        id="allocation"
        exportName="allocation"
        title={getCMSDataField(
          cmsData,
          "pagesDatasetsAccessToFunding.allocationTitle",
          "Allocation",
        )}
        subtitle={getCMSDataField(
          cmsData,
          "pagesDatasetsAccessToFunding.allocationSubtitle",
          "Allocations amounts for countries.",
        )}
        handleApplyFilters={handleApplyChartFilters}
        handleCancelFilters={handleCancelChartFilters}
        dropdownItems={dropdownItems}
        latestUpdate={latestUpdateDate}
        dropdownSelected={dropdownSelected}
        handleDropdownChange={handleSelectionChange}
        loading={loadingAllocations}
        empty={chartEmpty}
        disableCollapse={dropdownSelected === dropdownItems[2].value}
        filterGroups={props.filterGroups}
        appliedFilters={chart2TempAppliedFilters}
        toggleFilter={handleToggleChartFilter}
        removeFilter={handleRemoveChartFilter}
        handleResetFilters={handleResetChartFilters}
        tempAppliedFiltersData={chart2TempAppliedFiltersData}
        extraDropdown={allocationCycleDropdown}
        data={chartData}
        infoType="global"
      >
        {chartContent}
      </DatasetChartBlock>
    </Box>
  );
};
