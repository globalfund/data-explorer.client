import React from "react";
import get from "lodash/get";
import uniq from "lodash/uniq";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { BarChart } from "app/components/charts/bar";
import { LineChart } from "app/components/charts/line";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { TableContainer } from "app/components/table-container";
import { BarChartDataItem } from "app/components/charts/bar/data";
import { LineChartDataItem } from "app/components/charts/line/data";
import { FilterGroupModel } from "app/components/filters/list/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { getRange } from "app/utils/getFinancialValueWithMetricPrefix";
import { DatasetChartBlock } from "app/pages/datasets/common/chart-block";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { defaultAppliedFilters } from "app/state/api/action-reducers/sync/filters";
import {
  TableDataItem,
  TABLE_VARIATION_13_COLUMNS as DISBURSEMENTS_TABLE_COLUMNS,
} from "app/components/table/data";
import {
  componentsGroupingOptions,
  dropdownItemsDisbursements,
} from "app/pages/datasets/grant-implementation/data";
import isEqual from "lodash/isEqual";

interface GrantImplementationPageBlock2Props {
  geographyGrouping: string;
  componentsGrouping: string;
  filterGroups: FilterGroupModel[];
}

export const GrantImplementationPageBlock2: React.FC<
  GrantImplementationPageBlock2Props
> = (props: GrantImplementationPageBlock2Props) => {
  const location = useLocation();
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "disbursements",
  });

  const [disbursementsDropdownSelected, setDisbursementsDropdownSelected] =
    React.useState(dropdownItemsDisbursements[0].value);
  const [chart1AppliedFilters, setChart1AppliedFilters] = React.useState<
    string[]
  >([]);
  const [chart1AppliedFiltersData, setChart1AppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });
  const [chart1TempAppliedFilters, setChart1TempAppliedFilters] =
    React.useState<string[]>([]);
  const [chart1TempAppliedFiltersData, setChart1TempAppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });

  const [tableSearch, setTableSearch] = React.useState("");

  const dataFinancialInsightsDisbursementsBarChart = useStoreState(
    (state) =>
      get(
        state.FinancialInsightsDisbursementsBarChart,
        "data.data",
        [],
      ) as BarChartDataItem[],
  );
  const fetchFinancialInsightsDisbursementsBarChart = useStoreActions(
    (actions) => actions.FinancialInsightsDisbursementsBarChart.fetch,
  );
  const dataFinancialInsightsDisbursementsLineChart = useStoreState(
    (state) =>
      get(
        state.FinancialInsightsDisbursementsLineChart,
        "data.data",
        [],
      ) as LineChartDataItem[],
  );
  const keysFinancialInsightsDisbursementsLineChart = useStoreState(
    (state) =>
      get(
        state.FinancialInsightsDisbursementsLineChart,
        "data.xAxisKeys",
        [],
      ) as string[],
  );
  const fetchFinancialInsightsDisbursementsLineChart = useStoreActions(
    (actions) => actions.FinancialInsightsDisbursementsLineChart.fetch,
  );
  const dataFinancialInsightsDisbursementsTable = useStoreState(
    (state) =>
      get(state.FinancialInsightsDisbursementsTable, "data.data", []) as {
        [key: string]: TableDataItem;
      }[],
  );
  const fetchFinancialInsightsDisbursementsTable = useStoreActions(
    (actions) => actions.FinancialInsightsDisbursementsTable.fetch,
  );
  const loadingFinancialInsightsDisbursements = useStoreState((state) => {
    switch (disbursementsDropdownSelected) {
      case dropdownItemsDisbursements[0].value:
        return state.FinancialInsightsDisbursementsBarChart.loading;
      case dropdownItemsDisbursements[1].value:
        return state.FinancialInsightsDisbursementsLineChart.loading;
      case dropdownItemsDisbursements[2].value:
        return state.FinancialInsightsDisbursementsTable.loading;
      default:
        return false;
    }
  });

  const appliedFiltersData = useStoreState(
    (state) => state.AppliedFiltersState,
  );

  const handleDisbursementsSelectionChange = (value: string) => {
    setDisbursementsDropdownSelected(value);
  };

  const handleResetChartFilters = () => {
    setChart1AppliedFiltersData({
      ...chart1AppliedFiltersData,
      locations: [],
      components: [],
      principalRecipients: [],
      principalRecipientSubTypes: [],
      principalRecipientTypes: [],
      status: [],
      cycles: [],
    });
    setChart1AppliedFilters([]);
    setChart1TempAppliedFiltersData({
      ...chart1TempAppliedFiltersData,
      locations: [],
      components: [],
      principalRecipients: [],
      principalRecipientSubTypes: [],
      principalRecipientTypes: [],
      status: [],
      cycles: [],
    });
    setChart1TempAppliedFilters([]);
  };

  const handleToggleChartFilter = (
    checked: boolean,
    value: string,
    type: string,
  ) => {
    const state = structuredClone(chart1TempAppliedFiltersData);
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
    setChart1TempAppliedFiltersData(structuredClone(state));
    setChart1TempAppliedFilters([
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
    const state = structuredClone(chart1TempAppliedFiltersData);
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
    setChart1TempAppliedFiltersData(structuredClone(state));
    setChart1TempAppliedFilters([
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
    setChart1TempAppliedFiltersData(structuredClone(chart1AppliedFiltersData));
    setChart1TempAppliedFilters(chart1AppliedFilters);
  };

  const handleApplyChartFilters = () => {
    if (isEqual(chart1AppliedFilters, chart1TempAppliedFiltersData)) return;
    setChart1AppliedFiltersData(structuredClone(chart1TempAppliedFiltersData));
    setChart1AppliedFilters(chart1TempAppliedFilters);
  };

  const disbursementsChartEmpty = React.useMemo(() => {
    switch (disbursementsDropdownSelected) {
      case dropdownItemsDisbursements[0].value:
        return !dataFinancialInsightsDisbursementsBarChart.length;
      case dropdownItemsDisbursements[1].value:
        return !dataFinancialInsightsDisbursementsLineChart.length;
      case dropdownItemsDisbursements[2].value:
        return (
          !dataFinancialInsightsDisbursementsTable.length && !tableSearch.length
        );
      default:
        return false;
    }
  }, [
    tableSearch,
    disbursementsDropdownSelected,
    dataFinancialInsightsDisbursementsBarChart,
    dataFinancialInsightsDisbursementsLineChart,
    dataFinancialInsightsDisbursementsTable,
  ]);

  const chart1FilterString = React.useMemo(() => {
    let value = "";
    if (
      (appliedFiltersData.locations.length > 0 &&
        location.search.includes("locations=")) ||
      chart1AppliedFiltersData.locations.length > 0
    ) {
      value += `geographies=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.locations,
          ...chart1AppliedFiltersData.locations,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.components.length > 0 &&
        location.search.includes("components=")) ||
      chart1AppliedFiltersData.components.length > 0
    ) {
      value += `${value.length > 0 ? "&" : ""}components=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.components,
          ...chart1AppliedFiltersData.components,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.principalRecipients.length > 0 &&
        location.search.includes("principalRecipients=")) ||
      chart1AppliedFiltersData.principalRecipients.length > 0
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipients=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.principalRecipients,
          ...chart1AppliedFiltersData.principalRecipients,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.principalRecipientSubTypes.length > 0 &&
        location.search.includes("principalRecipientSubTypes=")) ||
      chart1AppliedFiltersData.principalRecipientSubTypes.length > 0
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipientSubTypes=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.principalRecipientSubTypes,
          ...chart1AppliedFiltersData.principalRecipientSubTypes,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.principalRecipientTypes.length > 0 &&
        location.search.includes("principalRecipientTypes=")) ||
      chart1AppliedFiltersData.principalRecipientTypes.length > 0
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipientTypes=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.principalRecipientTypes,
          ...chart1AppliedFiltersData.principalRecipientTypes,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.status.length > 0 &&
        location.search.includes("status=")) ||
      chart1AppliedFiltersData.status.length > 0
    ) {
      value += `${value.length > 0 ? "&" : ""}status=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.status,
          ...chart1AppliedFiltersData.status,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.cycles.length > 0 &&
        location.search.includes("cycles=")) ||
      chart1AppliedFiltersData.cycles.length > 0
    ) {
      // const years = uniq([
      //   ...appliedFiltersData.cycles,
      //   ...chart1AppliedFiltersData.cycles,
      // ]).map((cycle) => cycle.replace(/ /g, "").split("-")[0]);
      // const yearsTo = uniq([
      //   ...appliedFiltersData.cycles,
      //   ...chart1AppliedFiltersData.cycles,
      // ]).map((cycle) => cycle.replace(/ /g, "").split("-")[1]);
      // value += `${
      //   value.length > 0 ? "&" : ""
      // }years=${encodeURIComponent(
      //   years.join(",")
      // )}&yearsTo=${encodeURIComponent(yearsTo.join(","))}`;
      value += `${value.length > 0 ? "&" : ""}cycleNames=${uniq([
        ...appliedFiltersData.cycles,
        ...chart1AppliedFiltersData.cycles,
      ]).join(",")}`;
    }
    return value;
  }, [appliedFiltersData, chart1AppliedFiltersData, location.search]);

  const onSearchChange = (search: string) => {
    setTableSearch(search);
    let filterString = chart1FilterString;
    if (search) {
      filterString += `${filterString.length > 0 ? "&" : ""}q=${search}`;
    }
    fetchFinancialInsightsDisbursementsTable({
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

  const disbursementsChartContent = React.useMemo(() => {
    let range;
    switch (disbursementsDropdownSelected) {
      case dropdownItemsDisbursements[0].value:
        range = getRange(dataFinancialInsightsDisbursementsBarChart, ["value"]);
        return (
          <Box position="relative">
            <Typography
              left="-15px"
              bottom="20px"
              fontSize="10px"
              padding="7px 12px"
              borderRadius="4px"
              position="absolute"
              border="1px solid #98A1AA"
              sx={{
                transformOrigin: "left",
                transform: "rotate(-90deg)",
                "@media (max-width: 767px)": {
                  left: 0,
                },
              }}
            >
              Y Axis/<b>Disbursed Amount (US$ {range.abbr})</b>
            </Typography>
            <BarChart
              data={dataFinancialInsightsDisbursementsBarChart}
              valueLabels={{
                value: "disbursement",
              }}
              itemStyle={{
                color: () => appColors.TIME_CYCLE.BAR_COLOR_2,
              }}
            />
            <Typography
              left="40px"
              bottom="-20px"
              fontSize="10px"
              padding="7px 12px"
              borderRadius="4px"
              position="absolute"
              border="1px solid #98A1AA"
              sx={{
                "@media (max-width: 767px)": {
                  bottom: 0,
                },
              }}
            >
              X Axis/<b>Components</b>
            </Typography>
          </Box>
        );
      case dropdownItemsDisbursements[1].value:
        const values: { value: number }[] = [];
        dataFinancialInsightsDisbursementsLineChart.forEach((item) => {
          item.data.forEach((value) => {
            values.push({ value });
          });
        });
        range = getRange(values, ["value"]);
        return (
          <Box position="relative">
            <Typography
              left="-5px"
              bottom="20px"
              fontSize="10px"
              padding="7px 12px"
              borderRadius="4px"
              position="absolute"
              border="1px solid #98A1AA"
              sx={{
                transformOrigin: "left",
                transform: "rotate(-90deg)",
              }}
            >
              Y Axis/<b>Disbursed Amount (US$ {range.abbr})</b>
            </Typography>
            <LineChart
              data={dataFinancialInsightsDisbursementsLineChart}
              xAxisKeys={keysFinancialInsightsDisbursementsLineChart}
            />
            <Typography
              left="40px"
              bottom="-20px"
              fontSize="10px"
              padding="7px 12px"
              borderRadius="4px"
              position="absolute"
              border="1px solid #98A1AA"
            >
              X Axis/<b>Years</b>
            </Typography>
          </Box>
        );
      case dropdownItemsDisbursements[2].value:
        return (
          <TableContainer
            dataTree
            search={tableSearch}
            id="disbursements-table"
            onSearchChange={onSearchChange}
            columns={DISBURSEMENTS_TABLE_COLUMNS}
            data={dataFinancialInsightsDisbursementsTable}
          />
        );
      default:
        return null;
    }
  }, [
    tableSearch,
    disbursementsDropdownSelected,
    dataFinancialInsightsDisbursementsBarChart,
    dataFinancialInsightsDisbursementsLineChart,
    keysFinancialInsightsDisbursementsLineChart,
    dataFinancialInsightsDisbursementsTable,
  ]);

  const chartData = React.useMemo(() => {
    let headers: string[] = [];
    const data: (string | number)[][] = [];
    switch (disbursementsDropdownSelected) {
      case dropdownItemsDisbursements[0].value:
        headers = ["Component", "Amount"];
        dataFinancialInsightsDisbursementsBarChart.forEach((item: any) => {
          data.push([item.name, item.value]);
        });
        break;
      case dropdownItemsDisbursements[1].value:
        headers = ["Component", "Year", "Amount"];
        dataFinancialInsightsDisbursementsLineChart.forEach((item: any) => {
          item.data.forEach((value: number, index: number) => {
            if (value) {
              data.push([
                item.name,
                keysFinancialInsightsDisbursementsLineChart[index],
                value,
              ]);
            }
          });
        });
        break;
      case dropdownItemsDisbursements[2].value:
        headers = ["Component", "Signed", "Committed", "Disbursed"];
        dataFinancialInsightsDisbursementsTable.forEach((item: any) => {
          data.push([
            item.component,
            item.signed,
            item.committed,
            item.disbursed,
          ]);
        });
        break;
      default:
        break;
    }
    return { headers, data };
  }, [
    disbursementsDropdownSelected,
    dataFinancialInsightsDisbursementsBarChart,
    dataFinancialInsightsDisbursementsLineChart,
    dataFinancialInsightsDisbursementsTable,
  ]);

  React.useEffect(() => {
    fetchFinancialInsightsDisbursementsBarChart({
      filterString: chart1FilterString,
      routeParams: {
        componentField:
          props.componentsGrouping === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: props.geographyGrouping,
      },
    });
    fetchFinancialInsightsDisbursementsLineChart({
      filterString: chart1FilterString,
      routeParams: {
        componentField:
          props.componentsGrouping === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: props.geographyGrouping,
      },
    });
    fetchFinancialInsightsDisbursementsTable({
      filterString: chart1FilterString,
      routeParams: {
        componentField:
          props.componentsGrouping === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: props.geographyGrouping,
      },
    });
  }, [chart1FilterString, props.componentsGrouping, props.geographyGrouping]);

  React.useEffect(() => {
    if (location.hash) {
      const blockId = location.hash.slice(1).split("|")[0];
      const blockChartType = location.hash.slice(1).split("|")[1];
      if (blockId && blockChartType && blockId === "disbursements") {
        setDisbursementsDropdownSelected(decodeURIComponent(blockChartType));
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
        id="disbursements"
        exportName="disbursements"
        title={getCMSDataField(
          cmsData,
          "pagesDatasetsGrantImplementation.disbursementsTitle",
          "Disbursements",
        )}
        subtitle={getCMSDataField(
          cmsData,
          "pagesDatasetsGrantImplementation.disbursementsSubtitle",
          "Disbursement transactions for all grants across the porfolio.",
        )}
        dropdownItems={dropdownItemsDisbursements}
        dropdownSelected={disbursementsDropdownSelected}
        handleApplyFilters={handleApplyChartFilters}
        handleCancelFilters={handleCancelChartFilters}
        handleDropdownChange={handleDisbursementsSelectionChange}
        loading={loadingFinancialInsightsDisbursements}
        latestUpdate={latestUpdateDate}
        disableCollapse={
          disbursementsDropdownSelected === dropdownItemsDisbursements[2].value
        }
        empty={disbursementsChartEmpty}
        appliedFilters={chart1TempAppliedFilters}
        filterGroups={props.filterGroups}
        toggleFilter={handleToggleChartFilter}
        removeFilter={handleRemoveChartFilter}
        handleResetFilters={handleResetChartFilters}
        tempAppliedFiltersData={chart1TempAppliedFiltersData}
        data={chartData}
        infoType="financials"
      >
        {disbursementsChartContent}
      </DatasetChartBlock>
    </Box>
  );
};
