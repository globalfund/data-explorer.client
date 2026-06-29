import React from "react";
import get from "lodash/get";
import uniq from "lodash/uniq";
import sumBy from "lodash/sumBy";
import Box from "@mui/material/Box";
import isEqual from "lodash/isEqual";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";
import { useCMSData } from "app/hooks/useCMSData";
import { Dropdown } from "app/components/dropdown";
import { Treemap } from "app/components/charts/treemap";
import { SankeyChart } from "app/components/charts/sankey";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { TableContainer } from "app/components/table-container";
import TableIcon from "app/assets/vectors/Select_Table.svg?react";
import { FilterGroupModel } from "app/components/filters/list/data";
import { TreemapDataItem } from "app/components/charts/treemap/data";
import TreemapIcon from "app/assets/vectors/Select_Treemap.svg?react";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { DatasetChartBlock } from "app/pages/datasets/common/chart-block";
import SankeyChartIcon from "app/assets/vectors/Select_SankeyChart.svg?react";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { defaultAppliedFilters } from "app/state/api/action-reducers/sync/filters";
import { defaultComponentsGroupingOptions } from "app/pages/datasets/grant-implementation/data";
import {
  TableDataItem,
  TABLE_VARIATION_14_COLUMNS as BUDGET_TABLE_COLUMNS,
} from "app/components/table/data";

interface GrantImplementationPageBlock3Props {
  filterString: string;
  geographyGrouping: string;
  componentsGrouping: string;
  filterGroups: FilterGroupModel[];
}

export const GrantImplementationPageBlock3: React.FC<
  GrantImplementationPageBlock3Props
> = (props: GrantImplementationPageBlock3Props) => {
  const location = useLocation();
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "budgets",
  });

  const componentsGroupingOptions = React.useMemo(
    () =>
      getCMSDataField(
        cmsData,
        "pagesDatasetsGrantImplementation.componentsGroupingDropdownOptions",
        defaultComponentsGroupingOptions,
      ),
    [cmsData],
  );

  const dropdownItemsBudgets = React.useMemo(
    () => [
      {
        label: getCMSDataField(
          cmsData,
          "generic.sankeyChartDropdownOptionLabel",
          "Sankey Chart",
        ),
        value: "Sankey Chart",
        icon: <SankeyChartIcon />,
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

  const dropdownItemsBudgetsTableDataTypes = React.useMemo(
    () => [
      {
        label: getCMSDataField(
          cmsData,
          "generic.investementLandscapeDropdownOptionLabel",
          "Investment Landscape",
        ),
        value: "Investment Landscape",
      },
      {
        label: getCMSDataField(
          cmsData,
          "generic.modulesInterventionsDropdownOptionLabel",
          "Modules & Interventions",
        ),
        value: "Modules & Interventions",
      },
    ],
    [cmsData],
  );

  const [budgetsDropdownSelected, setBudgetsDropdownSelected] = React.useState(
    dropdownItemsBudgets[0].value,
  );
  const [chart2AppliedFilters, setChart2AppliedFilters] = React.useState<
    string[]
  >([]);
  const [chart2AppliedFiltersData, setChart2AppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });

  const [chart2TempAppliedFilters, setChart2TempAppliedFilters] =
    React.useState<string[]>([]);
  const [chart2TempAppliedFiltersData, setChart2TempAppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });

  const [tableSearch, setTableSearch] = React.useState("");

  const dataBudgetSankey = useStoreState((state) => {
    const nodes = get(
      state.FinancialInsightsBudgetSankey,
      "data.data.nodes",
      [],
    );
    const links = get(
      state.FinancialInsightsBudgetSankey,
      "data.data.links",
      [],
    );
    return {
      nodes,
      links,
    };
  });
  const fetchBudgetSankey = useStoreActions(
    (actions) => actions.FinancialInsightsBudgetSankey.fetch,
  );
  const dataBudgetTreemap = useStoreState(
    (state) =>
      get(
        state.FinancialInsightsBudgetTreemap,
        "data.data",
        [],
      ) as TreemapDataItem[],
  );
  const fetchBudgetTreemap = useStoreActions(
    (actions) => actions.FinancialInsightsBudgetTreemap.fetch,
  );
  const dataBudgetTable = useStoreState(
    (state) =>
      get(state.FinancialInsightsBudgetTable, "data.data", []) as {
        [key: string]: TableDataItem;
      }[],
  );
  const fetchBudgetTable = useStoreActions(
    (actions) => actions.FinancialInsightsBudgetTable.fetch,
  );
  const loadingBudget = useStoreState((state) => {
    switch (budgetsDropdownSelected) {
      case dropdownItemsBudgets[0].value:
        return state.FinancialInsightsBudgetSankey.loading;
      case dropdownItemsBudgets[1].value:
        return state.FinancialInsightsBudgetTreemap.loading;
      case dropdownItemsBudgets[2].value:
        return state.FinancialInsightsBudgetTable.loading;
      default:
        return false;
    }
  });
  const cycles = useStoreState((state) =>
    get(state.BudgetsCycles, "data.data", [])
      .map((cycle: any) => ({
        label: cycle.value,
        value: cycle.value,
      }))
      .reverse(),
  );
  const appliedFiltersData = useStoreState(
    (state) => state.AppliedFiltersState,
  );

  const [budgetCycleDropdownSelected, setBudgetCycleDropdownSelected] =
    React.useState(cycles.length > 0 ? cycles[0].value : null);

  const [budgetTableDataType, setBudgetTableDataType] = React.useState(
    dropdownItemsBudgetsTableDataTypes[0].value,
  );

  const handleBudgetTableDataTypeChange = (value: string) => {
    setBudgetTableDataType(value);
  };

  const handleResetChartFilters = () => {
    setChart2AppliedFiltersData({
      ...chart2AppliedFiltersData,
      locations: [],
      components: [],
      principalRecipients: [],
      principalRecipientSubTypes: [],
      principalRecipientTypes: [],
      status: [],
      cycles: [],
    });
    setChart2AppliedFilters([]);

    setChart2TempAppliedFiltersData({
      ...chart2TempAppliedFiltersData,
      locations: [],
      components: [],
      principalRecipients: [],
      principalRecipientSubTypes: [],
      principalRecipientTypes: [],
      status: [],
      cycles: [],
    });
    setChart2TempAppliedFilters([]);
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
      case "principalRecipient":
        if (checked) {
          state.principalRecipients.push(value);
        } else {
          state.principalRecipients = state.principalRecipients.filter(
            (item) => item !== value,
          );
        }
        break;
      case "principalRecipientSubType":
        if (checked) {
          state.principalRecipientSubTypes.push(value);
        } else {
          state.principalRecipientSubTypes =
            state.principalRecipientSubTypes.filter((item) => item !== value);
        }
        break;
      case "principalRecipientType":
        if (checked) {
          state.principalRecipientTypes.push(value);
        } else {
          state.principalRecipientTypes = state.principalRecipientTypes.filter(
            (item) => item !== value,
          );
        }
        break;
      case "status":
        if (checked) {
          state.status.push(value);
        } else {
          state.status = state.status.filter((item) => item !== value);
        }
        break;
      case "cycle":
        if (checked) {
          state.cycles.push(value);
        } else {
          state.cycles = state.cycles.filter((item) => item !== value);
        }
        break;
      default:
        break;
    }
    setChart2TempAppliedFiltersData(structuredClone(state));
    setChart2TempAppliedFilters([
      ...state.locations,
      ...state.components,
      ...state.principalRecipients,
      ...state.principalRecipientSubTypes,
      ...state.principalRecipientTypes,
      ...state.status,
      ...state.cycles,
    ]);
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
        case "principalRecipient":
          state.principalRecipients = state.principalRecipients.filter(
            (item) => item !== value,
          );
          break;
        case "principalRecipientSubType":
          state.principalRecipientSubTypes =
            state.principalRecipientSubTypes.filter((item) => item !== value);
          break;
        case "principalRecipientType":
          state.principalRecipientTypes = state.principalRecipientTypes.filter(
            (item) => item !== value,
          );
          break;
        case "status":
          state.status = state.status.filter((item) => item !== value);
          break;
        case "cycle":
          state.cycles = state.cycles.filter((item) => item !== value);
          break;
        default:
          break;
      }
    });
    setChart2TempAppliedFiltersData(structuredClone(state));
    setChart2TempAppliedFilters([
      ...state.locations,
      ...state.components,
      ...state.principalRecipients,
      ...state.principalRecipientSubTypes,
      ...state.principalRecipientTypes,
      ...state.status,
      ...state.cycles,
    ]);
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

  const budgetsCycleDropdown = React.useMemo(() => {
    if (!budgetCycleDropdownSelected) {
      return <React.Fragment />;
    }
    return (
      <Dropdown
        dropdownItems={cycles}
        dropdownSelected={budgetCycleDropdownSelected}
        handleDropdownChange={setBudgetCycleDropdownSelected}
      />
    );
  }, [cycles, budgetCycleDropdownSelected]);

  const budgetsTableDataTypeDropdown = React.useMemo(() => {
    return (
      <Box gap="10px" display="flex" flexDirection="row">
        {budgetsCycleDropdown}
        <Dropdown
          width={200}
          dropdownSelected={budgetTableDataType}
          dropdownItems={dropdownItemsBudgetsTableDataTypes}
          handleDropdownChange={handleBudgetTableDataTypeChange}
        />
      </Box>
    );
  }, [budgetsDropdownSelected, budgetTableDataType, budgetsCycleDropdown]);

  const budgetsChartEmpty = React.useMemo(() => {
    switch (budgetsDropdownSelected) {
      case dropdownItemsBudgets[0].value:
        return !dataBudgetSankey.nodes.length;
      case dropdownItemsBudgets[1].value:
        return !dataBudgetTreemap.length;
      case dropdownItemsBudgets[2].value:
        return !dataBudgetTable.length && !tableSearch.length;
      default:
        return false;
    }
  }, [
    tableSearch,
    budgetsDropdownSelected,
    dataBudgetSankey,
    dataBudgetTreemap,
    dataBudgetTable,
  ]);

  const totalBudget = React.useMemo(() => {
    return formatFinancialValue(sumBy(dataBudgetTreemap, "value"));
  }, [dataBudgetTreemap]);

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
    if (
      (appliedFiltersData.principalRecipients.length > 0 &&
        location.search.includes("principalRecipients=")) ||
      chart2AppliedFiltersData.principalRecipients.length > 0
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipients=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.principalRecipients,
          ...chart2AppliedFiltersData.principalRecipients,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.principalRecipientSubTypes.length > 0 &&
        location.search.includes("principalRecipientSubTypes=")) ||
      chart2AppliedFiltersData.principalRecipientSubTypes.length > 0
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipientSubTypes=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.principalRecipientSubTypes,
          ...chart2AppliedFiltersData.principalRecipientSubTypes,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.principalRecipientTypes.length > 0 &&
        location.search.includes("principalRecipientTypes=")) ||
      chart2AppliedFiltersData.principalRecipientTypes.length > 0
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipientTypes=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.principalRecipientTypes,
          ...chart2AppliedFiltersData.principalRecipientTypes,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.status.length > 0 &&
        location.search.includes("status=")) ||
      chart2AppliedFiltersData.status.length > 0
    ) {
      value += `${value.length > 0 ? "&" : ""}status=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.status,
          ...chart2AppliedFiltersData.status,
        ]).join(","),
      )}`;
    }
    if (budgetCycleDropdownSelected) {
      // const year = budgetCycleDropdownSelected.replace(/ /g, "").split("-")[0];
      // const yearTo = budgetCycleDropdownSelected
      //   .replace(/ /g, "")
      //   .split("-")[1];
      // value += `${
      //   value.length > 0 ? "&" : ""
      // }years=${encodeURIComponent(year)}&yearsTo=${encodeURIComponent(yearTo)}`;
      value += `${
        value.length > 0 ? "&" : ""
      }cycleNames=${budgetCycleDropdownSelected}`;
    }
    return value;
  }, [
    location.search,
    appliedFiltersData,
    chart2AppliedFiltersData,
    budgetCycleDropdownSelected,
  ]);

  const onSearchChange = (search: string) => {
    setTableSearch(search);
    let filterString = chart2FilterString;
    if (search) {
      filterString += `${filterString.length > 0 ? "&" : ""}q=${search}`;
    }
    fetchBudgetTable({
      filterString,
      routeParams: {
        componentField:
          props.componentsGrouping === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: props.geographyGrouping,
      },
    });
  };

  const budgetsChartContent = React.useMemo(() => {
    switch (budgetsDropdownSelected) {
      case dropdownItemsBudgets[0].value:
        return (
          <React.Fragment>
            <Grid
              container
              spacing={4}
              sx={{
                color: "#464646",
                fontSize: "10px",
                fontWeight: "700",
                "@media (max-width: 767px)": {
                  marginTop: "16px",
                },
              }}
            >
              <Grid item xs={3}>
                {getCMSDataField(
                  cmsData,
                  "pagesDatasetsGrantImplementation.budgetsLabel1",
                  "Total budget",
                )}
              </Grid>
              <Grid item xs={3}>
                {getCMSDataField(
                  cmsData,
                  "pagesDatasetsGrantImplementation.budgetsLabel2",
                  "Investment Landscape 1",
                )}
              </Grid>
              <Grid item xs={3}>
                {getCMSDataField(
                  cmsData,
                  "pagesDatasetsGrantImplementation.budgetsLabel3",
                  "Investment Landscape 2",
                )}
              </Grid>
              <Grid item xs={3}>
                {getCMSDataField(
                  cmsData,
                  "pagesDatasetsGrantImplementation.budgetsLabel4",
                  "Cost Category",
                )}
              </Grid>
            </Grid>
            <SankeyChart data={dataBudgetSankey} />
          </React.Fragment>
        );
      case dropdownItemsBudgets[1].value:
        return <Treemap data={dataBudgetTreemap} />;
      case dropdownItemsBudgets[2].value:
        const columns = [...BUDGET_TABLE_COLUMNS];
        if (
          budgetTableDataType === dropdownItemsBudgetsTableDataTypes[1].value
        ) {
          columns[0].title = "Modules & Interventions";
        } else {
          columns[0].title = "Investment Landscapes & Cost Category";
        }
        return (
          <TableContainer
            dataTree
            id="budgets-table"
            search={tableSearch}
            data={dataBudgetTable}
            columns={BUDGET_TABLE_COLUMNS}
            onSearchChange={onSearchChange}
          />
        );
      default:
        return null;
    }
  }, [
    tableSearch,
    budgetsDropdownSelected,
    dataBudgetSankey,
    dataBudgetTreemap,
    dataBudgetTable,
    budgetTableDataType,
  ]);

  const chartData = React.useMemo(() => {
    let headers: string[] = [];
    const data: (string | number)[][] = [];
    switch (budgetsDropdownSelected) {
      case dropdownItemsBudgets[0].value:
        headers = ["Source", "Target", "Value"];
        dataBudgetSankey.links.forEach((link: any) => {
          data.push([link.source, link.target, link.value]);
        });
        break;
      case dropdownItemsBudgets[1].value:
        headers = ["Component", "Amount"];
        dataBudgetTreemap.forEach((item: any) => {
          data.push([item.name, item.value]);
        });
        break;
      case dropdownItemsBudgets[2].value:
        headers = [
          "Investment Landscape 1",
          "Investment Landscape 2",
          "Cost Category",
          "Amount",
        ];
        dataBudgetTable.forEach((item: any) => {
          get(item, "_children", []).forEach((subItem: any) => {
            get(subItem, "_children", []).forEach((subSubItem: any) => {
              data.push([
                item.name,
                subItem.name,
                subSubItem.name,
                subSubItem.amount,
              ]);
            });
          });
        });
        break;
      default:
        break;
    }
    return { headers, data };
  }, [
    budgetsDropdownSelected,
    dataBudgetSankey,
    dataBudgetTreemap,
    dataBudgetTable,
  ]);

  React.useEffect(() => {
    fetchBudgetSankey({
      filterString: chart2FilterString,
      routeParams: {
        componentField:
          props.componentsGrouping === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: props.geographyGrouping,
      },
    });
    fetchBudgetTreemap({
      filterString: chart2FilterString,
      routeParams: {
        componentField:
          props.componentsGrouping === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: props.geographyGrouping,
      },
    });
  }, [chart2FilterString, props.componentsGrouping, props.geographyGrouping]);

  React.useEffect(() => {
    let value = chart2FilterString;
    if (budgetTableDataType === dropdownItemsBudgetsTableDataTypes[1].value) {
      value += `${value.length > 0 ? "&" : ""}var2=${
        props.componentsGrouping === componentsGroupingOptions[0].value
          ? "activityAreaGroup"
          : "activityArea"
      }`;
    }
    fetchBudgetTable({
      filterString: value,
      routeParams: {
        componentField:
          props.componentsGrouping === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: props.geographyGrouping,
      },
    });
  }, [
    chart2FilterString,
    budgetTableDataType,
    props.componentsGrouping,
    props.geographyGrouping,
  ]);

  React.useEffect(() => {
    if (cycles.length > 0 && !budgetCycleDropdownSelected) {
      setBudgetCycleDropdownSelected(cycles[cycles.length - 1].value);
    }
  }, [cycles]);

  React.useEffect(() => {
    if (
      budgetTableDataType === dropdownItemsBudgetsTableDataTypes[1].value &&
      budgetsDropdownSelected !== dropdownItemsBudgets[2].value
    ) {
      setBudgetsDropdownSelected(dropdownItemsBudgets[2].value);
    }
  }, [budgetTableDataType]);

  return (
    <Box
      padding="50px 0"
      sx={{
        "#content": {
          padding: 0,
        },
      }}
    >
      <DatasetChartBlock
        id="budgets"
        exportName="budgets"
        title={getCMSDataField(
          cmsData,
          "pagesDatasetsGrantImplementation.budgetsTitle",
          "Budgets",
        )}
        subtitle={`${totalBudget} ${getCMSDataField(
          cmsData,
          "pagesDatasetsGrantImplementation.budgetsSubtitle",
          "total budget.",
        )}`}
        handleApplyFilters={handleApplyChartFilters}
        handleCancelFilters={handleCancelChartFilters}
        dropdownWidth={170}
        dropdownItems={dropdownItemsBudgets}
        dropdownSelected={budgetsDropdownSelected}
        handleDropdownChange={(value) => {
          if (value !== dropdownItemsBudgets[2].value) {
            setBudgetTableDataType(dropdownItemsBudgetsTableDataTypes[0].value);
          }
          setBudgetsDropdownSelected(value);
        }}
        loading={loadingBudget}
        latestUpdate={latestUpdateDate}
        disableCollapse={
          budgetsDropdownSelected === dropdownItemsBudgets[2].value
        }
        empty={budgetsChartEmpty}
        filterGroups={props.filterGroups}
        appliedFilters={chart2TempAppliedFilters}
        toggleFilter={handleToggleChartFilter}
        removeFilter={handleRemoveChartFilter}
        handleResetFilters={handleResetChartFilters}
        tempAppliedFiltersData={chart2TempAppliedFiltersData}
        extraDropdown={budgetsTableDataTypeDropdown}
        data={chartData}
        infoType="budgets"
      >
        {budgetsChartContent}
      </DatasetChartBlock>
    </Box>
  );
};
