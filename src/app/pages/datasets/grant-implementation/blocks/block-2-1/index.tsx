import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";
import { Dropdown } from "app/components/dropdown";
import { useCMSData } from "app/hooks/useCMSData";
import { SankeyChart } from "app/components/charts/sankey";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { TableContainer } from "app/components/table-container";
import TableIcon from "app/assets/vectors/Select_Table.svg?react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { DatasetChartBlock } from "app/pages/datasets/common/chart-block";
import SankeyChartIcon from "app/assets/vectors/Select_SankeyChart.svg?react";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { defaultAppliedFilters } from "app/state/api/action-reducers/sync/filters";
import {
  TableDataItem,
  TABLE_VARIATION_16_COLUMNS as HGI_TABLE_COLUMNS,
} from "app/components/table/data";

export const GrantImplementationPageBlock21: React.FC = () => {
  const location = useLocation();
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "disbursements",
  });

  const dropdownItemsHolisticGrantInvestments = React.useMemo(
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
    dropdownItemsHolisticGrantInvestments[0].value,
  );

  const [tableSearch, setTableSearch] = React.useState("");

  const dataSankey = useStoreState((state) => {
    const nodes = get(state.FinancialInsightsHGISankey, "data.data.nodes", []);
    const links = get(state.FinancialInsightsHGISankey, "data.data.links", []);
    return {
      nodes,
      links,
    };
  });
  const fetchSankey = useStoreActions(
    (actions) => actions.FinancialInsightsHGISankey.fetch,
  );
  const dataTable = useStoreState(
    (state) =>
      get(state.FinancialInsightsHGITable, "data.data", []) as {
        [key: string]: TableDataItem;
      }[],
  );
  const fetchTable = useStoreActions(
    (actions) => actions.FinancialInsightsHGITable.fetch,
  );
  const loading = useStoreState((state) => {
    switch (dropdownSelected) {
      case dropdownItemsHolisticGrantInvestments[0].value:
        return state.FinancialInsightsHGISankey.loading;
      case dropdownItemsHolisticGrantInvestments[1].value:
        return state.FinancialInsightsHGITable.loading;
      default:
        return false;
    }
  });
  const cycles = useStoreState((state) =>
    get(state.DisbursementsCycles, "data.data", [])
      .map((cycle: any) => ({
        label: cycle.value,
        value: cycle.value,
      }))
      .reverse()
      .slice(0, 3),
  );
  const appliedFiltersData = useStoreState(
    (state) => state.AppliedFiltersState,
  );

  const [cycleDropdownSelected, setCycleDropdownSelected] = React.useState(
    cycles.length > 0 ? cycles[0].value : null,
  );

  const handleDropdownSelectionChange = (value: string) => {
    setDropdownSelected(value);
  };

  const cycleDropdown = React.useMemo(() => {
    if (!cycleDropdownSelected) {
      return <React.Fragment />;
    }
    return (
      <Dropdown
        dropdownItems={cycles}
        dropdownSelected={cycleDropdownSelected}
        handleDropdownChange={setCycleDropdownSelected}
      />
    );
  }, [cycles, cycleDropdownSelected]);

  const chartEmpty = React.useMemo(() => {
    switch (dropdownSelected) {
      case dropdownItemsHolisticGrantInvestments[0].value:
        return !dataSankey.nodes.length;
      case dropdownItemsHolisticGrantInvestments[1].value:
        return !dataTable.length;
      default:
        return false;
    }
  }, [tableSearch, dropdownSelected, dataSankey.nodes, dataTable]);

  const chartFilterString = React.useMemo(() => {
    let value = "";
    if (
      appliedFiltersData.locations.length > 0 &&
      location.search.includes("locations=")
    ) {
      value += `geographies=${encodeURIComponent(
        appliedFiltersData.locations.join(","),
      )}`;
    }
    if (
      appliedFiltersData.components.length > 0 &&
      location.search.includes("components=")
    ) {
      value += `${value.length > 0 ? "&" : ""}components=${encodeURIComponent(
        appliedFiltersData.components.join(","),
      )}`;
    }
    if (
      appliedFiltersData.principalRecipients.length > 0 &&
      location.search.includes("principalRecipients=")
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipients=${encodeURIComponent(
        appliedFiltersData.principalRecipients.join(","),
      )}`;
    }
    if (
      appliedFiltersData.principalRecipientSubTypes.length > 0 &&
      location.search.includes("principalRecipientSubTypes=")
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipientSubTypes=${encodeURIComponent(
        appliedFiltersData.principalRecipientSubTypes.join(","),
      )}`;
    }
    if (
      appliedFiltersData.principalRecipientTypes.length > 0 &&
      location.search.includes("principalRecipientTypes=")
    ) {
      value += `${
        value.length > 0 ? "&" : ""
      }principalRecipientTypes=${encodeURIComponent(
        appliedFiltersData.principalRecipientTypes.join(","),
      )}`;
    }
    if (
      appliedFiltersData.status.length > 0 &&
      location.search.includes("status=")
    ) {
      value += `${value.length > 0 ? "&" : ""}status=${encodeURIComponent(
        appliedFiltersData.status.join(","),
      )}`;
    }
    if (cycleDropdownSelected) {
      value += `${
        value.length > 0 ? "&" : ""
      }cycleNames=${cycleDropdownSelected}`;
    }
    return value;
  }, [appliedFiltersData, location.search, cycleDropdownSelected]);

  const onSearchChange = (search: string) => {
    setTableSearch(search);
    let filterString = chartFilterString;
    if (search) {
      filterString += `${filterString.length > 0 ? "&" : ""}q=${search}`;
    }
    fetchTable({ filterString });
  };

  const chartContent = React.useMemo(() => {
    switch (dropdownSelected) {
      case dropdownItemsHolisticGrantInvestments[0].value:
        return (
          <React.Fragment>
            <Grid
              container
              spacing={4}
              sx={{
                color: "#464646",
                fontSize: "10px",
                marginTop: "8px",
                fontWeight: "700",
              }}
            >
              <Grid item xs={4}>
                {getCMSDataField(
                  cmsData,
                  "pagesDatasetsGrantImplementation.hgiSankeyLabel1",
                  "Total Disbursed",
                )}
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {getCMSDataField(
                  cmsData,
                  "pagesDatasetsGrantImplementation.hgiSankeyLabel2",
                  "Disbursement Area",
                )}
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {getCMSDataField(
                  cmsData,
                  "pagesDatasetsGrantImplementation.hgiSankeyLabel3",
                  "Disbursement Sub-Area",
                )}
              </Grid>
            </Grid>
            <SankeyChart formatLabel data={dataSankey} />
          </React.Fragment>
        );
      case dropdownItemsHolisticGrantInvestments[1].value:
        return (
          <TableContainer
            dataTree
            id="hgi-table"
            data={dataTable}
            search={tableSearch}
            dataTreeStartExpanded
            columns={HGI_TABLE_COLUMNS}
            onSearchChange={onSearchChange}
          />
        );
      default:
        return null;
    }
  }, [
    tableSearch,
    dropdownSelected,
    dataSankey,
    dataTable,
    cmsData,
    cycleDropdownSelected,
  ]);

  const chartData = React.useMemo(() => {
    let headers: string[] = [];
    const data: (string | number)[][] = [];
    switch (dropdownSelected) {
      case dropdownItemsHolisticGrantInvestments[0].value:
        headers = ["Source", "Target", "Value"];
        dataSankey.links.forEach((link: any) => {
          data.push([link.source, link.target, link.value]);
        });
        break;
      case dropdownItemsHolisticGrantInvestments[1].value:
        headers = ["Disbursement Area", "Disbursement Sub-Area", "Amount"];
        get(dataTable, "[0]._children", []).forEach((item: any) => {
          get(item, "_children", []).forEach((subItem: any) => {
            data.push([item.name, subItem.name, subItem.amount]);
          });
        });
        break;
      default:
        break;
    }
    return { headers, data };
  }, [dropdownSelected, dataSankey, dataTable]);

  React.useEffect(() => {
    if (!cycleDropdownSelected) return;
    fetchSankey({ filterString: chartFilterString });
    fetchTable({ filterString: chartFilterString });
  }, [chartFilterString]);

  React.useEffect(() => {
    if (!cycleDropdownSelected && cycles.length > 0) {
      setCycleDropdownSelected(cycles[0].value);
    }
  }, [cycles]);

  React.useEffect(() => {
    if (location.hash) {
      const blockId = location.hash.slice(1).split("|")[0];
      const blockChartType = location.hash.slice(1).split("|")[1];
      if (blockId && blockChartType && blockId === "hgi") {
        setDropdownSelected(decodeURIComponent(blockChartType));
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
        hr: {
          display: "none",
        },
      }}
    >
      <DatasetChartBlock
        id="hgi"
        titleVariant="h3"
        loading={loading}
        empty={chartEmpty}
        exportName="investments-by-disbursement-area"
        title={getCMSDataField(
          cmsData,
          "pagesDatasetsGrantImplementation.hgiTitle",
          "Investments by Disbursement Area",
        )}
        subtitle={getCMSDataField(
          cmsData,
          "pagesDatasetsGrantImplementation.hgiSubtitle",
          "Cumulative disbursements by disbursement area",
        )}
        extraDropdown={cycleDropdown}
        dropdownWidth={170}
        dropdownSelected={dropdownSelected}
        dropdownItems={dropdownItemsHolisticGrantInvestments}
        handleDropdownChange={handleDropdownSelectionChange}
        disableCollapse={
          dropdownSelected === dropdownItemsHolisticGrantInvestments[1].value
        }
        handleResetFilters={() => {}}
        filterGroups={[]}
        appliedFilters={[]}
        handleApplyFilters={() => {}}
        handleCancelFilters={() => {}}
        tempAppliedFiltersData={defaultAppliedFilters}
        removeFilter={() => {}}
        toggleFilter={() => {}}
        latestUpdate={latestUpdateDate}
        data={chartData}
        infoType="financials"
      >
        {chartContent}
      </DatasetChartBlock>
    </Box>
  );
};
