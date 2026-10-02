import React from "react";
import { PageNarrativePanel } from "app/components/narrative-section";
import get from "lodash/get";
import uniq from "lodash/uniq";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { TableContainer } from "app/components/table-container";
import { FilterGroupModel } from "app/components/filters/list/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { DatasetChartBlock } from "app/pages/datasets/common/chart-block";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { defaultAppliedFilters } from "app/state/api/action-reducers/sync/filters";
import { TABLE_VARIATION_12_COLUMNS as FUNDING_REQUESTS_TABLE_COLUMNS } from "app/components/table/data";
import isEqual from "lodash/isEqual";

interface AccessToFundingBlock5Props {
  filterGroups: FilterGroupModel[];
  defaultScopeMatches: boolean;
}

export const AccessToFundingBlock5: React.FC<AccessToFundingBlock5Props> = (
  props: AccessToFundingBlock5Props,
) => {
  const location = useLocation();
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "funding_requests",
  });

  const [chart3AppliedFilters, setChart3AppliedFilters] = React.useState<
    string[]
  >([]);
  const [chart3AppliedFiltersData, setChart3AppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });
  const [chart3TempAppliedFilters, setChart3TempAppliedFilters] =
    React.useState<string[]>([]);
  const [chart3TempAppliedFiltersData, setChart3TempAppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });

  const [tableSearch, setTableSearch] = React.useState("");

  const dataFundingRequestsTable = useStoreState((state) =>
    get(state.AccessToFundingFundingRequestsTable, "data.data", []).map(
      (item: any, index) => {
        if (index === 0) {
          return {
            ...item,
            top: true,
            _children: item._children.map((subItem: any) => ({
              ...subItem,
              top: true,
            })),
          };
        }
        return item;
      },
    ),
  );
  const loadingFundingRequestsTable = useStoreState(
    (state) => state.AccessToFundingFundingRequestsTable.loading,
  );
  const fetchFundingRequestsTable = useStoreActions(
    (actions) => actions.AccessToFundingFundingRequestsTable.fetch,
  );
  const appliedFiltersData = useStoreState(
    (state) => state.AppliedFiltersState,
  );

  const handleToggleChartFilter = (
    checked: boolean,
    value: string,
    type: string,
  ) => {
    const state = structuredClone(chart3TempAppliedFiltersData);
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
    setChart3TempAppliedFiltersData(structuredClone(state));
    setChart3TempAppliedFilters([...state.locations, ...state.components]);
  };

  const handleRemoveChartFilter = (value: string, types: string[]) => {
    const state = structuredClone(chart3TempAppliedFiltersData);
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
    setChart3TempAppliedFiltersData(structuredClone(state));
    setChart3TempAppliedFilters([...state.locations, ...state.components]);
  };

  const handleResetChartFilters = () => {
    setChart3AppliedFiltersData({
      ...chart3AppliedFiltersData,
      locations: [],
      components: [],
    });
    setChart3AppliedFilters([]);
    setChart3TempAppliedFiltersData({
      ...chart3AppliedFiltersData,
      locations: [],
      components: [],
    });
    setChart3TempAppliedFilters([]);
  };

  const handleCancelChartFilters = () => {
    setChart3TempAppliedFiltersData(structuredClone(chart3AppliedFiltersData));
    setChart3TempAppliedFilters(chart3AppliedFilters);
  };
  const handleApplyChartFilters = () => {
    if (isEqual(chart3AppliedFilters, chart3TempAppliedFiltersData)) return;
    setChart3AppliedFiltersData(structuredClone(chart3TempAppliedFiltersData));
    setChart3AppliedFilters(chart3TempAppliedFilters);
  };

  const chart3FilterString = React.useMemo(() => {
    let value = "";
    if (
      (appliedFiltersData.locations.length > 0 &&
        location.search.includes("locations=")) ||
      chart3AppliedFiltersData.locations.length > 0
    ) {
      value += `geographies=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.locations,
          ...chart3AppliedFiltersData.locations,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.components.length > 0 &&
        location.search.includes("components=")) ||
      chart3AppliedFiltersData.components.length > 0
    ) {
      value += `${value.length > 0 ? "&" : ""}components=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.components,
          ...chart3AppliedFiltersData.components,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.cycles.length > 0 &&
        location.search.includes("cycles=")) ||
      chart3AppliedFiltersData.cycles.length > 0
    ) {
      value += `${value.length > 0 ? "&" : ""}periods=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.cycles.map((c) => c.split("-")[0]),
          ...chart3AppliedFiltersData.cycles.map((c) => c.split("-")[0]),
        ]).join(","),
      )}`;
    }
    return value;
  }, [appliedFiltersData, chart3AppliedFiltersData, location.search]);

  const onSearchChange = (search: string) => {
    setTableSearch(search);
    let filterString = chart3FilterString;
    if (search) {
      filterString += `${filterString.length > 0 ? "&" : ""}q=${search}`;
    }
    fetchFundingRequestsTable({ filterString });
  };

  React.useEffect(() => {
    fetchFundingRequestsTable({ filterString: chart3FilterString });
  }, [chart3FilterString]);

  const exportChartData = React.useMemo(() => {
    const result: (string | number)[][] = [];

    dataFundingRequestsTable.forEach((row) => {
      get(row, "_children", []).forEach((subRow: any) => {
        get(subRow, "_children", []).forEach((subSubRow: any) => {
          result.push([
            `"${row.components}"`,
            `"${subRow.components}"`,
            `"${subRow.submissionDate}"`,
            `"${subRow.approach}"`,
            `"${subRow.trpWindow}"`,
            `"${subRow.trpOutcome}"`,
            `"${subRow.portfolioCategorization}"`,
            `"${subSubRow.boardApproval}"`,
            `"${subSubRow.gacMeeting}"`,
            `"${subSubRow.grant}"`,
            `"${subSubRow.startingDate}"`,
            `"${subSubRow.endingDate}"`,
            `"${subSubRow.principalRecipient}"`,
          ]);
        });
      });
    });

    return {
      headers: [
        "Geography",
        "Components",
        "Submission Date",
        "Approach",
        "TRP Window",
        "TRP Outcome",
        "Portfolio Categorization",
        "Board Approval",
        "GAC Meeting",
        "Grant",
        "Starting Date",
        "Ending Date",
        "Principal Recipient",
      ],
      data: result,
    };
  }, [dataFundingRequestsTable]);

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
        infoType="global"
        id="funding-requests"
        title={getCMSDataField(
          cmsData,
          "pagesDatasetsAccessToFunding.fundingRequestsTitle",
          "Funding Requests",
        )}
        subtitle={getCMSDataField(
          cmsData,
          "pagesDatasetsAccessToFunding.fundingRequestsSubtitle",
          "Funding request applications by countries.",
        )}
        disableCollapse
        handleApplyFilters={handleApplyChartFilters}
        handleCancelFilters={handleCancelChartFilters}
        dropdownItems={[]}
        data={exportChartData}
        exportName="funding-requests"
        latestUpdate={latestUpdateDate}
        loading={loadingFundingRequestsTable}
        filterGroups={props.filterGroups}
        appliedFilters={chart3TempAppliedFilters}
        toggleFilter={handleToggleChartFilter}
        removeFilter={handleRemoveChartFilter}
        handleResetFilters={handleResetChartFilters}
        tempAppliedFiltersData={chart3TempAppliedFiltersData}
        empty={
          dataFundingRequestsTable.length === 0 && tableSearch.length === 0
        }
      >
        <TableContainer
          dataTree
          search={tableSearch}
          id="funding-requests-table"
          data={dataFundingRequestsTable}
          onSearchChange={onSearchChange}
          columns={FUNDING_REQUESTS_TABLE_COLUMNS}
          dataTreeStartExpandedFn={(row) => row.getData().top}
        />
      </DatasetChartBlock>

      <PageNarrativePanel
        sectionId="access_to_funding.funding_requests"
        scopeMatches={
          props.defaultScopeMatches &&
          chart3FilterString.length === 0 &&
          tableSearch.length === 0
        }
      />
    </Box>
  );
};
