import React from "react";
import get from "lodash/get";
import uniq from "lodash/uniq";
import Box from "@mui/material/Box";
import isEqual from "lodash/isEqual";
import { useTitle } from "react-use";
import Divider from "@mui/material/Divider";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { RowComponent } from "tabulator-tables";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { Dropdown } from "app/components/dropdown";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { DatasetPage } from "app/pages/datasets/common/page";
import CircularProgress from "@mui/material/CircularProgress";
import { TableContainer } from "app/components/table-container";
import { PolylineTree } from "app/components/charts/polyline-tree";
import { FilterGroupModel } from "app/components/filters/list/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { DatasetChartBlock } from "app/pages/datasets/common/chart-block";
import { HomeResultsStats } from "app/pages/home/components/results-stats";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { PolylineTreeDataItem } from "app/components/charts/polyline-tree/data";
import TableIcon from "app/assets/vectors/Select_Table.svg?react";
import { defaultAppliedFilters } from "app/state/api/action-reducers/sync/filters";
import BarChartIcon from "app/assets/vectors/Select_BarChart.svg?react";
import {
  TABLE_VARIATION_9_COLUMNS,
  TABLE_VARIATION_6_COLUMNS as DOCUMENTS_TABLE_COLUMNS,
} from "app/components/table/data";

export const AnnualResultsPage: React.FC = () => {
  useTitle("The Data Explorer - Annual Results");

  const location = useLocation();
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "results",
  });

  const dropdownItems = React.useMemo(
    () => [
      {
        label: getCMSDataField(
          cmsData,
          "generic.polylineChartDropdownOptionLabel",
          "Polyline Tree",
        ),
        value: "Polyline Tree",
        icon: <BarChartIcon />,
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
  const [chartAppliedFilters, setChartAppliedFilters] = React.useState<
    string[]
  >([]);
  const [chartAppliedFiltersData, setChartAppliedFiltersData] = React.useState({
    ...defaultAppliedFilters,
  });

  const [chartTempAppliedFilters, setChartTempAppliedFilters] = React.useState<
    string[]
  >([]);
  const [chartTempAppliedFiltersData, setChartTempAppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });

  const annualResultsCycles = useStoreState(
    (state) =>
      get(state.AnnualResultsCycles, "data.data", []) as {
        name: number;
        value: number;
      }[],
  );
  const [yearSelected, setYearSelected] = React.useState(
    annualResultsCycles.length > 0
      ? annualResultsCycles[0].value.toString()
      : null,
  );

  const [tableSearch, setTableSearch] = React.useState("");
  const [tableSearch2, setTableSearch2] = React.useState("");

  const dataStats = useStoreState(
    (state) =>
      get(state.AnnualResultsStats, "data.stats", []) as {
        label: string;
        value: number;
      }[],
  );
  const fetchStats = useStoreActions(
    (actions) => actions.AnnualResultsStats.fetch,
  );
  const dataPolyline = useStoreState(
    (state) =>
      get(state.AnnualResultsPolyline, "data.data", {
        name: "",
      }) as PolylineTreeDataItem,
  );
  const fetchPolyline = useStoreActions(
    (actions) => actions.AnnualResultsPolyline.fetch,
  );
  const dataTable = useStoreState(
    (state) =>
      get(state.AnnualResultsTable, "data.data", []) as {
        [key: string]:
          | string
          | number
          | boolean
          | null
          | object
          | Array<object>;
      }[],
  );
  const fetchTable = useStoreActions(
    (actions) => actions.AnnualResultsTable.fetch,
  );
  const loadingResults = useStoreState((state) => {
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        return state.AnnualResultsPolyline.loading;
      case dropdownItems[1].value:
        return state.AnnualResultsTable.loading;
      default:
        return false;
    }
  });
  const dataDocumentsTable = useStoreState((state) =>
    get(state.AnnualResultsDocumentsTable, "data.data", []),
  );
  const loadingDocumentsTable = useStoreState(
    (state) => state.AnnualResultsDocumentsTable.loading,
  );
  const fetchDocumentsTable = useStoreActions(
    (actions) => actions.AnnualResultsDocumentsTable.fetch,
  );
  const dataLocationFilterOptions = useStoreState(
    (state) =>
      get(state.LocationFilterOptions, "data.data", {
        id: "",
        name: "",
        options: [],
      }) as FilterGroupModel,
  );
  const dataComponentFilterOptions = useStoreState(
    (state) =>
      get(state.ComponentFilterOptions, "data.data", {
        id: "",
        name: "",
        options: [],
      }) as FilterGroupModel,
  );
  const pageAppliedFilters = useStoreState((state) => [
    ...state.TempAppliedFiltersState.components,
    ...state.TempAppliedFiltersState.locations,
  ]);
  const appliedFiltersData = useStoreState(
    (state) => state.AppliedFiltersState,
  );
  const appliedFiltersActions = useStoreActions(
    (actions) => actions.AppliedFiltersState,
  );
  const tempAppliedFiltersData = useStoreState(
    (state) => state.TempAppliedFiltersState,
  );
  const tempAppliedFiltersActions = useStoreActions(
    (actions) => actions.TempAppliedFiltersState,
  );

  const handleSelectionChange = (value: string) => {
    setDropdownSelected(value);
  };

  const handleResetFilters = () => {
    tempAppliedFiltersActions.clearAll();
    appliedFiltersActions.setAll({
      ...appliedFiltersData,
      locations: [],
      components: [],
    });
  };

  const handleCancelFilters = () => {
    const clone = structuredClone(appliedFiltersData);
    tempAppliedFiltersActions.setAll(clone);
  };

  const handleApplyFilters = () => {
    if (isEqual(appliedFiltersData, tempAppliedFiltersData)) return;
    const clone = structuredClone(tempAppliedFiltersData);
    appliedFiltersActions.setAll(clone);
  };

  const handleResetChartFilters = () => {
    setChartAppliedFiltersData({
      ...chartAppliedFiltersData,
      locations: [],
      components: [],
    });
    setChartAppliedFilters([]);
    setChartTempAppliedFiltersData({
      ...chartTempAppliedFiltersData,
      locations: [],
      components: [],
    });
    setChartTempAppliedFilters([]);
  };

  const handleCancelChartFilters = () => {
    setChartTempAppliedFiltersData(structuredClone(chartAppliedFiltersData));
    setChartTempAppliedFilters(chartAppliedFilters);
  };

  const handleApplyChartFilters = () => {
    if (isEqual(chartAppliedFilters, chartTempAppliedFiltersData)) return;
    setChartAppliedFiltersData(structuredClone(chartTempAppliedFiltersData));
    setChartAppliedFilters(chartTempAppliedFilters);
  };

  const handleToggleChartFilter = (
    checked: boolean,
    value: string,
    type: string,
  ) => {
    const state = structuredClone(chartTempAppliedFiltersData);
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
    setChartTempAppliedFiltersData(structuredClone(state));
    setChartTempAppliedFilters([...state.locations, ...state.components]);
  };

  const handleRemoveChartFilter = (value: string, types: string[]) => {
    const state = structuredClone(chartTempAppliedFiltersData);
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
    setChartTempAppliedFiltersData(structuredClone(state));
    setChartTempAppliedFilters([...state.locations, ...state.components]);
  };

  const chartEmpty = React.useMemo(() => {
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        return (
          !dataPolyline ||
          !dataPolyline.children ||
          !dataPolyline.children.length
        );
      case dropdownItems[1].value:
        return (!dataTable || !dataTable.length) && tableSearch.length === 0;
      default:
        return false;
    }
  }, [tableSearch, dropdownSelected, dataPolyline, dataTable]);

  const filterGroups = React.useMemo(() => {
    return [dataLocationFilterOptions, dataComponentFilterOptions];
  }, [dataLocationFilterOptions, dataComponentFilterOptions]);

  const filterString = React.useMemo(() => {
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
    return value;
  }, [appliedFiltersData, location.search]);

  const chartFilterString = React.useMemo(() => {
    let value = "";
    if (
      (appliedFiltersData.locations.length > 0 &&
        location.search.includes("locations=")) ||
      chartAppliedFiltersData.locations.length > 0
    ) {
      value += `geographies=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.locations,
          ...chartAppliedFiltersData.locations,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.components.length > 0 &&
        location.search.includes("components=")) ||
      chartAppliedFiltersData.components.length > 0
    ) {
      value += `${value.length > 0 ? "&" : ""}components=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.components,
          ...chartAppliedFiltersData.components,
        ]).join(","),
      )}`;
    }
    return value;
  }, [appliedFiltersData, chartAppliedFiltersData, location.search]);

  const toolbarRightContent = React.useMemo(() => {
    return (
      <Box
        gap="20px"
        display="flex"
        flexDirection="row"
        alignItems="center"
        data-cy="toolbar-right-content"
      >
        <Box gap="10px" display="flex" flexDirection="row" alignItems="center">
          <Typography variant="body2" fontWeight="700">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsAnnualResults.toolBarRightText",
              "Reporting Result Year",
            )}
          </Typography>
          <Dropdown
            width={100}
            dropdownSelected={yearSelected ?? ""}
            dropdownItems={annualResultsCycles.map((c) => ({
              label: c.name.toString(),
              value: c.value.toString(),
            }))}
            handleDropdownChange={(value) => {
              setYearSelected(value);
            }}
          />
        </Box>
      </Box>
    );
  }, [yearSelected]);

  const onSearchChange = (search: string) => {
    setTableSearch(search);
    let localFilterString = chartFilterString;
    if (search) {
      localFilterString += `${localFilterString.length > 0 ? "&" : ""}q=${search}`;
    }
    fetchTable({ filterString: localFilterString });
  };

  const onSearchChange2 = (search: string) => {
    setTableSearch2(search);
    let filterString2 = `types=Profile&${filterString}${
      filterString.length ? "&" : ""
    }cycle=${yearSelected}`;
    if (search) {
      filterString2 += `&q=${search}`;
    }
    fetchDocumentsTable({ filterString: filterString2 });
  };

  const chartContent = React.useMemo(() => {
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        return <PolylineTree data={dataPolyline} />;
      case dropdownItems[1].value:
        return (
          <TableContainer
            dataTree
            data={dataTable}
            search={tableSearch}
            id="annual-results-table"
            onSearchChange={onSearchChange}
            columns={TABLE_VARIATION_9_COLUMNS}
            dataTreeStartExpandedFn={(row: RowComponent, level: number) => {
              if (level === 0) return row.getData().name === yearSelected;
              if (level === 1) {
                const parent = row.getTreeParent();
                if (parent) {
                  return parent.getData().name === yearSelected;
                }
              }
              return false;
            }}
          />
        );
      default:
        return null;
    }
  }, [dropdownSelected, dataPolyline, dataTable, yearSelected]);

  const exportChartData = React.useMemo(() => {
    const result: (string | number)[][] = [];
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        dataPolyline.children?.forEach((component) => {
          component.children?.forEach((indicator) => {
            result.push([
              dataPolyline.name,
              `"${component.name}"`,
              `"${indicator.name}"`,
              indicator.value ?? "",
            ]);
          });
        });
        break;
      case dropdownItems[1].value:
        dataTable.forEach((year) => {
          if (year !== null) {
            // @ts-expect-error object is possibly null
            get(year, "_children", []).forEach((component: any) => {
              get(component, "_children", []).forEach((indicator: any) => {
                result.push([
                  year.name,
                  `"${component.name}"`,
                  `"${indicator.name}"`,
                  indicator.value ?? "",
                ]);
              });
            });
          }
        });
        break;
      default:
        break;
    }
    return {
      headers: ["Year", "Component", "Indicator", "Amount"],
      data: result,
    };
  }, [dropdownSelected, dataPolyline, dataTable]);

  React.useEffect(() => {
    if (annualResultsCycles.length > 0) {
      setYearSelected(annualResultsCycles[0].value.toString());
    }
  }, [annualResultsCycles]);

  React.useEffect(() => {
    if (yearSelected) {
      fetchStats({
        filterString: `${filterString}${
          filterString.length ? "&" : ""
        }cycle=${yearSelected}`,
      });
    }
    fetchDocumentsTable({
      filterString: `types=Profile&${filterString}${
        filterString.length ? "&" : ""
      }cycle=${yearSelected}`,
    });
  }, [filterString, yearSelected]);

  React.useEffect(() => {
    if (yearSelected) {
      fetchPolyline({
        filterString: chartFilterString,
        routeParams: {
          cycle: yearSelected,
        },
      });
      fetchTable({ filterString: chartFilterString });
    }
  }, [chartFilterString, yearSelected]);

  React.useEffect(() => {
    if (location.hash) {
      const blockId = location.hash.slice(1).split("|")[0];
      const blockChartType = location.hash.slice(1).split("|")[1];
      if (blockId && blockChartType && blockId === "annual-results") {
        setDropdownSelected(decodeURIComponent(blockChartType));
      }
    }
  }, [location.hash]);
  const canonicalUrl = `${window.location.origin}/annual-results`;
  return (
    <>
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <DatasetPage
        title={get(
          cmsData,
          "pagesDatasetsAnnualResults.title",
          "Annual Results",
        )}
        filterGroups={filterGroups}
        appliedFilters={pageAppliedFilters}
        handleResetFilters={handleResetFilters}
        toolbarRightContent={toolbarRightContent}
        subtitle={get(
          cmsData,
          "pagesDatasetsAnnualResults.subtitle",
          "Indicator results reported as part of annual Results Report.",
        )}
        handleApplyFilters={handleApplyFilters}
        handleCancelFilters={handleCancelFilters}
      >
        <Box width="100%" marginTop="50px">
          <HomeResultsStats stats={dataStats} loading={loadingResults} />
          <Box height="50px" />
          <Divider
            sx={{
              left: 0,
              width: "100vw",
              position: "absolute",
              borderColor: "#CFD4DA",
              "@media (max-width: 767px)": {
                display: "none",
              },
            }}
          />
          <Box
            paddingTop="50px"
            sx={{
              "#content": {
                padding: 0,
              },
            }}
          >
            <DatasetChartBlock
              id="annual-results"
              exportName="annual-results"
              title={get(
                cmsData,
                "pagesDatasetsAnnualResults.chartTitle",
                "Annual Results",
              )}
              subtitle=""
              data={exportChartData}
              loading={loadingResults}
              dropdownWidth={170}
              dropdownItems={dropdownItems}
              latestUpdate={latestUpdateDate}
              dropdownSelected={dropdownSelected}
              handleApplyFilters={handleApplyChartFilters}
              handleCancelFilters={handleCancelChartFilters}
              handleDropdownChange={handleSelectionChange}
              disableCollapse={dropdownSelected === dropdownItems[1].value}
              empty={chartEmpty}
              filterGroups={filterGroups}
              toggleFilter={handleToggleChartFilter}
              removeFilter={handleRemoveChartFilter}
              handleResetFilters={handleResetChartFilters}
              appliedFilters={chartTempAppliedFilters}
              tempAppliedFiltersData={chartTempAppliedFiltersData}
              infoType="global"
            >
              {chartContent}
            </DatasetChartBlock>
          </Box>
          <Divider
            sx={{
              left: 0,
              width: "100vw",
              marginTop: "50px",
              position: "absolute",
              borderColor: "#CFD4DA",
              "@media (max-width: 767px)": {
                display: "none",
              },
            }}
          />
          <Box
            paddingTop="50px"
            sx={{
              "#content": {
                padding: 0,
              },
            }}
          >
            <Box id="documents" padding="50px 0" data-cy="documents-block">
              <Typography variant="h2" lineHeight={1.2}>
                {getCMSDataField(
                  cmsData,
                  "pagesDatasetsAnnualResults.documentsTitle",
                  "Documents",
                )}
              </Typography>
              <Divider
                sx={{
                  margin: "20px 0",
                  "@media (max-width: 767px)": {
                    display: "none",
                  },
                }}
              />
              {loadingDocumentsTable && (
                <Box
                  width="100%"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CircularProgress />
                </Box>
              )}
              {dataDocumentsTable.length === 0 && tableSearch2.length === 0 ? (
                <Box
                  width="100%"
                  height="100%"
                  minHeight="250px"
                  alignItems="center"
                  justifyContent="center"
                  display={!loadingDocumentsTable ? "flex" : "none"}
                >
                  <Typography>No data available</Typography>
                </Box>
              ) : (
                <React.Fragment>
                  <Box height="40px" />
                  <TableContainer
                    dataTree
                    id="documents-table"
                    search={tableSearch2}
                    dataTreeStartExpanded
                    data={dataDocumentsTable}
                    onSearchChange={onSearchChange2}
                    columns={DOCUMENTS_TABLE_COLUMNS}
                  />
                </React.Fragment>
              )}
            </Box>
          </Box>
        </Box>
      </DatasetPage>
    </>
  );
};
