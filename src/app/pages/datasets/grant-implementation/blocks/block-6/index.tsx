import React from "react";
import get from "lodash/get";
import uniq from "lodash/uniq";
import sumBy from "lodash/sumBy";
import filter from "lodash/filter";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import { useLocation } from "react-router-dom";
import { useCMSData } from "app/hooks/useCMSData";
import { Dropdown } from "app/components/dropdown";
import { Heatmap } from "app/components/charts/heatmap";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { TableContainer } from "app/components/table-container";
import { FilterGroupModel } from "app/components/filters/list/data";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { DatasetChartBlock } from "app/pages/datasets/common/chart-block";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { defaultAppliedFilters } from "app/state/api/action-reducers/sync/filters";
import { ExpandableHorizontalBar } from "app/components/charts/expandable-horizontal-bar";
import { ExpandableHorizontalBarChartDataItem } from "app/components/charts/expandable-horizontal-bar/data";
import {
  HeatmapDataItem,
  getPercentageColor,
} from "app/components/charts/heatmap/data";
import {
  TableDataItem,
  TABLE_VARIATION_15_COLUMNS as EXPENDITURES_TABLE_COLUMNS,
} from "app/components/table/data";
import {
  componentsGroupingOptions,
  dropdownItemsExpenditures,
} from "app/pages/datasets/grant-implementation/data";
import orderBy from "lodash/orderBy";
import isEqual from "lodash/isEqual";
import IconButton from "@mui/material/IconButton";

interface GrantImplementationPageBlock6Props {
  geographyGrouping: string;
  componentsGrouping: string;
  filterGroups: FilterGroupModel[];
}

export const GrantImplementationPageBlock6: React.FC<
  GrantImplementationPageBlock6Props
> = (props: GrantImplementationPageBlock6Props) => {
  const location = useLocation();
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "expenditures",
  });

  const [expendituresDropdownSelected, setExpendituresDropdownSelected] =
    React.useState(dropdownItemsExpenditures[0].value);
  const [unit, setUnit] = React.useState<"amount" | "percentage">("percentage");
  const [chart4AppliedFiltersData, setChart4AppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });
  const [chart4AppliedFilters, setChart4AppliedFilters] = React.useState<
    string[]
  >([]);
  const [chart4TempAppliedFiltersData, setChart4TempAppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });
  const [chart4TempAppliedFilters, setChart4TempAppliedFilters] =
    React.useState<string[]>([]);

  const [tableSearch, setTableSearch] = React.useState("");

  const dataExpendituresHeatmap = useStoreState(
    (state) =>
      get(
        state.FinancialInsightsExpendituresHeatmap,
        "data.data",
        [],
      ) as HeatmapDataItem[],
  );
  const fetchExpendituresHeatmap = useStoreActions(
    (actions) => actions.FinancialInsightsExpendituresHeatmap.fetch,
  );
  const loadingExpenditures = useStoreState((state) => {
    switch (expendituresDropdownSelected) {
      case dropdownItemsExpenditures[0].value:
        return state.FinancialInsightsExpendituresHeatmap.loading;
      case dropdownItemsExpenditures[1].value:
        return state.FinancialInsightsExpendituresBarChart.loading;
      case dropdownItemsExpenditures[2].value:
        return state.FinancialInsightsExpendituresTable.loading;
      default:
        return false;
    }
  });
  const dataExpendituresBarChart = useStoreState(
    (state) =>
      get(
        state.FinancialInsightsExpendituresBarChart,
        "data.data",
        [],
      ) as ExpandableHorizontalBarChartDataItem[],
  );
  const fetchExpendituresBarChart = useStoreActions(
    (actions) => actions.FinancialInsightsExpendituresBarChart.fetch,
  );
  const dataExpendituresTable = useStoreState(
    (state) =>
      get(state.FinancialInsightsExpendituresTable, "data.data", []) as {
        [key: string]: TableDataItem;
      }[],
  );
  const fetchExpendituresTable = useStoreActions(
    (actions) => actions.FinancialInsightsExpendituresTable.fetch,
  );
  const expenditureCycles = useStoreState((state) =>
    get(state.ExpendituresCycles, "data.data", [])
      .map((cycle: any) => ({
        label: cycle.value,
        value: cycle.value,
      }))
      .reverse(),
  );
  const appliedFiltersData = useStoreState(
    (state) => state.AppliedFiltersState,
  );

  const [
    expendituresCycleDropdownSelected,
    setExpendituresCycleDropdownSelected,
  ] = React.useState(
    expenditureCycles.length > 0 ? expenditureCycles[0].value : null,
  );

  const handleResetChartFilters = () => {
    setChart4AppliedFiltersData({
      ...chart4AppliedFiltersData,
      locations: [],
      components: [],
      principalRecipients: [],
      principalRecipientSubTypes: [],
      principalRecipientTypes: [],
      status: [],
      cycles: [],
    });
    setChart4AppliedFilters([]);

    setChart4TempAppliedFiltersData({
      ...chart4TempAppliedFiltersData,
      locations: [],
      components: [],
      principalRecipients: [],
      principalRecipientSubTypes: [],
      principalRecipientTypes: [],
      status: [],
      cycles: [],
    });
    setChart4TempAppliedFilters([]);
  };

  const handleToggleChartFilter = (
    checked: boolean,
    value: string,
    type: string,
  ) => {
    const state = structuredClone(chart4TempAppliedFiltersData);
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
    setChart4TempAppliedFiltersData(structuredClone(state));
    setChart4TempAppliedFilters([
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
    const state = structuredClone(chart4TempAppliedFiltersData);
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
    setChart4TempAppliedFiltersData(structuredClone(state));
    setChart4TempAppliedFilters([
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
    setChart4TempAppliedFiltersData(structuredClone(chart4AppliedFiltersData));
    setChart4TempAppliedFilters(chart4AppliedFilters);
  };

  const handleApplyChartFilters = () => {
    if (isEqual(chart4AppliedFilters, chart4TempAppliedFiltersData)) return;
    setChart4AppliedFiltersData(structuredClone(chart4TempAppliedFiltersData));
    setChart4AppliedFilters(chart4TempAppliedFilters);
  };

  const expendituresCycleDropdown = React.useMemo(() => {
    if (!expendituresCycleDropdownSelected) {
      return <React.Fragment />;
    }
    return (
      <Dropdown
        dropdownItems={expenditureCycles}
        dropdownSelected={expendituresCycleDropdownSelected}
        handleDropdownChange={setExpendituresCycleDropdownSelected}
      />
    );
  }, [expenditureCycles, expendituresCycleDropdownSelected]);

  const unitButtons = React.useMemo(
    () => (
      <Box
        gap="8px"
        display="flex"
        flexDirection="row"
        sx={{
          "& > button": {
            width: "40px",
            height: "35px",
            fontSize: "16px",
            borderRadius: "4px",
            border: `1px solid ${appColors.CHART_BLOCK_CYCLES.BUTTON_BORDER_COLOR}`,
            "&:hover": {
              color: appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_TEXT_COLOR,
              background:
                appColors.CHART_BLOCK_CYCLES.BUTTON_HOVER_BACKGROUND_COLOR,
              borderColor: appColors.CHART_BLOCK_CYCLES.BUTTON_BORDER_COLOR,
            },
          },
        }}
      >
        <IconButton
          onClick={() => setUnit("percentage")}
          sx={{
            color:
              unit === "percentage"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_TEXT_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_TEXT_COLOR,
            background:
              unit === "percentage"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BACKGROUND_COLOR,
            borderColor:
              unit === "percentage"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BORDER_COLOR,
          }}
        >
          %
        </IconButton>
        <IconButton
          onClick={() => setUnit("amount")}
          sx={{
            color:
              unit === "amount"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_TEXT_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_TEXT_COLOR,
            background:
              unit === "amount"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BACKGROUND_COLOR,
            borderColor:
              unit === "amount"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BORDER_COLOR,
          }}
        >
          $
        </IconButton>
      </Box>
    ),
    [unit],
  );

  const expendituresChartEmpty = React.useMemo(() => {
    switch (expendituresDropdownSelected) {
      case dropdownItemsExpenditures[0].value:
        return !dataExpendituresHeatmap.length;
      case dropdownItemsExpenditures[1].value:
        return !dataExpendituresBarChart.length;
      case dropdownItemsExpenditures[2].value:
        return !dataExpendituresTable.length && !tableSearch.length;
      default:
        return false;
    }
  }, [
    tableSearch,
    expendituresDropdownSelected,
    dataExpendituresHeatmap,
    dataExpendituresBarChart,
    dataExpendituresTable,
  ]);

  const totalExpenditure = React.useMemo(() => {
    return formatFinancialValue(
      sumBy(
        filter(
          dataExpendituresHeatmap,
          (item) => !item.parentRow && !item.parentColumn,
        ),
        "value",
      ),
    );
  }, [dataExpendituresHeatmap]);

  const chart4FilterString = React.useMemo(() => {
    let value = "";
    if (
      (appliedFiltersData.locations.length > 0 &&
        location.search.includes("locations=")) ||
      chart4AppliedFiltersData.locations.length > 0
    ) {
      value += `geographies=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.locations,
          ...chart4AppliedFiltersData.locations,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.components.length > 0 &&
        location.search.includes("components=")) ||
      chart4AppliedFiltersData.components.length > 0
    ) {
      value += `${value.length > 0 ? "&" : ""}components=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.components,
          ...chart4AppliedFiltersData.components,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.principalRecipients.length > 0 &&
        location.search.includes("principalRecipients=")) ||
      chart4AppliedFiltersData.principalRecipients.length > 0
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipients=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.principalRecipients,
          ...chart4AppliedFiltersData.principalRecipients,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.principalRecipientSubTypes.length > 0 &&
        location.search.includes("principalRecipientSubTypes=")) ||
      chart4AppliedFiltersData.principalRecipientSubTypes.length > 0
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipientSubTypes=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.principalRecipientSubTypes,
          ...chart4AppliedFiltersData.principalRecipientSubTypes,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.principalRecipientTypes.length > 0 &&
        location.search.includes("principalRecipientTypes=")) ||
      chart4AppliedFiltersData.principalRecipientTypes.length > 0
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipientTypes=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.principalRecipientTypes,
          ...chart4AppliedFiltersData.principalRecipientTypes,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.status.length > 0 &&
        location.search.includes("status=")) ||
      chart4AppliedFiltersData.status.length > 0
    ) {
      value += `${value.length > 0 ? "&" : ""}status=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.status,
          ...chart4AppliedFiltersData.status,
        ]).join(","),
      )}`;
    }
    if (expendituresCycleDropdownSelected) {
      // const year = expendituresCycleDropdownSelected
      //   .replace(/ /g, "")
      //   .split("-")[0];
      // const yearTo = expendituresCycleDropdownSelected
      //   .replace(/ /g, "")
      //   .split("-")[1];
      // value += `${
      //   value.length > 0 ? "&" : ""
      // }years=${encodeURIComponent(year)}&yearsTo=${encodeURIComponent(yearTo)}`;
      value += `${
        value.length > 0 ? "&" : ""
      }cycleNames=${expendituresCycleDropdownSelected}`;
    }
    return value;
  }, [
    location.search,
    appliedFiltersData,
    chart4AppliedFiltersData,
    expendituresCycleDropdownSelected,
  ]);

  const onSearchChange = (search: string) => {
    setTableSearch(search);
    let filterString = chart4FilterString;
    if (search) {
      filterString += `${filterString.length > 0 ? "&" : ""}q=${search}`;
    }
    fetchExpendituresTable({
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

  const expendituresChartContent = React.useMemo(() => {
    switch (expendituresDropdownSelected) {
      case dropdownItemsExpenditures[0].value:
        return (
          <Heatmap
            valueType={unit}
            contentProp={unit === "percentage" ? "percentage" : "value"}
            hoveredLegend={null}
            columnCategory="cycle"
            rowCategory="component"
            data={dataExpendituresHeatmap}
            getItemColor={getPercentageColor}
            columnHeader={getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.expendituresHeatmapColumnHeader",
              "Principal Recipients",
            )}
            rowHeader={getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.expendituresHeatmapRowHeader",
              "Components",
            )}
          />
        );
      case dropdownItemsExpenditures[1].value:
        return (
          <ExpandableHorizontalBar
            data={dataExpendituresBarChart}
            yAxisLabel={getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.expendituresBarchartYLabel",
              "Modules & Interventions",
            )}
            xAxisLabel={getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.expendituresBarchartXLabel",
              "Expenditure",
            )}
            valueLabels={{
              value: "amount",
            }}
            itemStyle={{
              color: () => appColors.TIME_CYCLE.BAR_COLOR_1,
            }}
          />
        );
      case dropdownItemsExpenditures[2].value:
        return (
          <TableContainer
            dataTree
            search={tableSearch}
            id="expenditures-table"
            data={dataExpendituresTable}
            onSearchChange={onSearchChange}
            columns={EXPENDITURES_TABLE_COLUMNS}
          />
        );
      default:
        return null;
    }
  }, [
    unit,
    tableSearch,
    expendituresDropdownSelected,
    dataExpendituresHeatmap,
    dataExpendituresBarChart,
    dataExpendituresTable,
  ]);

  const exportChartData = React.useMemo(() => {
    const result: (string | number)[][] = [];
    switch (expendituresDropdownSelected) {
      case dropdownItemsExpenditures[0].value:
        let sortedData: HeatmapDataItem[] = [];
        orderBy(dataExpendituresHeatmap, "row", "asc").forEach((item) => {
          if (!item.parentRow && !item.parentColumn) {
            sortedData.push(item);
            const children = dataExpendituresHeatmap.filter(
              (child) =>
                child.parentRow === item.row ||
                child.parentColumn === item.column,
            );
            sortedData = sortedData.concat(children);
          }
        });
        return {
          headers: ["Principal Recipient", "Component", "Amount", "Percentage"],
          data: sortedData.map((item) => [
            `"${item.row}"`,
            `"${item.column}"`,
            item.value,
            item.percentage,
          ]),
        };
      case dropdownItemsExpenditures[1].value:
        dataExpendituresBarChart.forEach((item) => {
          result.push([`"${item.name}"`, "", item.value]);
          get(item, "items", []).forEach((subItem) => {
            result.push([`"${item.name}"`, `"${subItem.name}"`, subItem.value]);
          });
        });
        return {
          headers: ["Module", "Intervention", "Amount"],
          data: result,
        };
      case dropdownItemsExpenditures[2].value:
        dataExpendituresTable.forEach((item) => {
          result.push([
            `"${item.name}"`,
            "",
            item.cumulativeExpenditure as number,
            item.periodExpenditure as number,
          ]);
          if (item._children) {
            (item._children as any[]).forEach((subItem) => {
              result.push([
                `"${item.name}"`,
                `"${subItem.name}"`,
                subItem.cumulativeExpenditure,
                subItem.periodExpenditure,
              ]);
            });
          }
        });
        return {
          headers: [
            "Module",
            "Intervention",
            "Cumulative Expenditure",
            "Expenditure for Reported Period",
          ],
          data: result,
        };
      default:
        return {
          headers: [],
          data: [],
        };
    }
  }, [
    expendituresDropdownSelected,
    dataExpendituresHeatmap,
    dataExpendituresBarChart,
    dataExpendituresTable,
  ]);

  React.useEffect(() => {
    fetchExpendituresHeatmap({
      filterString: chart4FilterString,
      routeParams: {
        row: "principalRecipientType,principalRecipientSubType,principalRecipient",
        column: "component",
        componentField:
          props.componentsGrouping === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: props.geographyGrouping,
      },
    });
    fetchExpendituresBarChart({
      filterString: chart4FilterString,
      routeParams: {
        componentField:
          props.componentsGrouping === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: props.geographyGrouping,
      },
    });
    fetchExpendituresTable({
      filterString: chart4FilterString,
      routeParams: {
        componentField:
          props.componentsGrouping === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: props.geographyGrouping,
      },
    });
  }, [chart4FilterString, props.componentsGrouping, props.geographyGrouping]);

  React.useEffect(() => {
    if (location.hash) {
      const blockId = location.hash.slice(1).split("|")[0];
      const blockChartType = location.hash.slice(1).split("|")[1];
      if (blockId && blockChartType && blockId === "expenditures") {
        setExpendituresDropdownSelected(decodeURIComponent(blockChartType));
      }
    }
  }, [location.hash]);

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
        id="expenditures"
        exportName="expenditures"
        title={getCMSDataField(
          cmsData,
          "pagesDatasetsGrantImplementation.expendituresTitle",
          "Expenditures",
        )}
        subtitle={`${totalExpenditure} ${getCMSDataField(
          cmsData,
          "pagesDatasetsGrantImplementation.expendituresSubtitle",
          "reported expenditure.",
        )}`}
        dropdownItems={dropdownItemsExpenditures}
        dropdownSelected={expendituresDropdownSelected}
        loading={loadingExpenditures}
        latestUpdate={latestUpdateDate}
        handleDropdownChange={(value) => setExpendituresDropdownSelected(value)}
        disableCollapse={
          expendituresDropdownSelected === dropdownItemsExpenditures[2].value
        }
        empty={expendituresChartEmpty}
        filterGroups={props.filterGroups}
        handleApplyFilters={handleApplyChartFilters}
        handleCancelFilters={handleCancelChartFilters}
        appliedFilters={chart4TempAppliedFilters}
        toggleFilter={handleToggleChartFilter}
        removeFilter={handleRemoveChartFilter}
        handleResetFilters={handleResetChartFilters}
        tempAppliedFiltersData={chart4TempAppliedFiltersData}
        extraDropdown={expendituresCycleDropdown}
        unitButtons={
          expendituresDropdownSelected === dropdownItemsExpenditures[0].value
            ? unitButtons
            : undefined
        }
        data={exportChartData}
        infoType="expenditures"
      >
        <Box
          sx={{
            width: "100%",
            height: "16px",
            "@media (min-width: 768px)": {
              display: "none",
            },
          }}
        />
        {expendituresChartContent}
      </DatasetChartBlock>
    </Box>
  );
};
