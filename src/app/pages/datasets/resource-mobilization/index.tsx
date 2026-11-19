import React from "react";
import get from "lodash/get";
import uniq from "lodash/uniq";
import sumBy from "lodash/sumBy";
import Box from "@mui/material/Box";
import orderBy from "lodash/orderBy";
import isEqual from "lodash/isEqual";
import Grid from "@mui/material/Grid";
import { Helmet } from "react-helmet-async";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import { useLocation } from "react-router-dom";
import { useTitle, useUnmount } from "react-use";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { DatasetPage } from "app/pages/datasets/common/page";
import CircularProgress from "@mui/material/CircularProgress";
import { TableContainer } from "app/components/table-container";
import TableIcon from "app/assets/vectors/Select_Table.svg?react";
import { FilterGroupModel } from "app/components/filters/list/data";
import { TABLE_VARIATION_8_COLUMNS } from "app/components/table/data";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import BarChartIcon from "app/assets/vectors/Select_BarChart.svg?react";
import { DatasetChartBlock } from "app/pages/datasets/common/chart-block";
import {
  AnimateInView,
  useAnimateInView,
} from "app/components/animate-in-view";
import { applyResultValueFormula } from "app/utils/applyResultValueFormula";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { defaultAppliedFilters } from "app/state/api/action-reducers/sync/filters";
import { ExpandableHorizontalBar } from "app/components/charts/expandable-horizontal-bar";
import { ExpandableHorizontalBarChartDataItem } from "app/components/charts/expandable-horizontal-bar/data";

const DonorByTypeComponent: React.FC<{
  name: string;
  value: number;
  percentage: number;
}> = (props) => {
  const { inView } = useAnimateInView();
  return (
    <Grid item xs={12} sm={12} md={3} lg={3}>
      <Box
        sx={{
          gap: "6px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            gap: "6px",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <Typography variant="h4" fontSize="24px" fontWeight="700">
            {props.value}
          </Typography>
          <Typography fontSize="16px" color="#373D43">
            {props.percentage.toFixed(1)}%
          </Typography>
        </Box>
        <Typography fontSize="16px" color="#373D43">
          {props.name}
        </Typography>
        <Box
          sx={{
            gap: "6px",
            width: "70%",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          {Array.from({ length: props.value }, (_, index) => (
            <Box
              key={index}
              sx={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                bgcolor: "#108E09",
                opacity: inView ? 1 : 0,
                transform: inView ? "scale(1)" : "scale(0)",
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                transitionDelay: `${Math.min(index * 15, 1500)}ms`,
                "@media (prefers-reduced-motion: reduce)": {
                  opacity: 1,
                  transform: "none",
                  transition: "none",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Grid>
  );
};

export const ResourceMobilizationPage: React.FC = () => {
  useTitle("The Data Explorer - Resource Mobilization");
  useUnmount(() => {
    tempAppliedFiltersActions.clearAll();
  });
  const location = useLocation();
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "pledges-contributions",
  });

  const dropdownItems = React.useMemo(
    () => [
      {
        label: getCMSDataField(
          cmsData,
          "generic.barChartDropdownOptionLabel",
          "Bar Chart",
        ),
        value: "Bar Chart",
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
  const [chartTempAppliedFilters, setChartTempAppliedFilters] = React.useState<
    string[]
  >([]);
  const [chartAppliedFiltersData, setChartAppliedFiltersData] = React.useState({
    ...defaultAppliedFilters,
  });
  const [chartTempAppliedFiltersData, setChartTempAppliedFiltersData] =
    React.useState({
      ...defaultAppliedFilters,
    });

  const [tableSearch, setTableSearch] = React.useState("");

  const dataStats = useStoreState(
    (state) =>
      get(state.ResourceMobilizationStats, "data.data", {
        totalPledges: 0,
        totalContributions: 0,
        percentage: 0,
        donorTypesCount: [],
      }) as {
        totalPledges: number;
        totalContributions: number;
        percentage: number;
        donorTypesCount: { name: string; value: number }[];
      },
  );
  const loadingStats = useStoreState(
    (state) => state.ResourceMobilizationStats.loading,
  );
  const fetchStats = useStoreActions(
    (actions) => actions.ResourceMobilizationStats.fetch,
  );
  const dataBarChart = useStoreState(
    (state) =>
      get(
        state.ResourceMobilizationExpandableBarChart,
        "data.data",
        [],
      ) as ExpandableHorizontalBarChartDataItem[],
  );
  const fetchBarChart = useStoreActions(
    (actions) => actions.ResourceMobilizationExpandableBarChart.fetch,
  );
  const dataTable = useStoreState((state) =>
    get(state.ResourceMobilizationTable, "data.data", []),
  );
  const fetchTable = useStoreActions(
    (actions) => actions.ResourceMobilizationTable.fetch,
  );
  const dataChartLoading = useStoreState((state) => {
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        return state.ResourceMobilizationExpandableBarChart.loading;
      case dropdownItems[1].value:
        return state.ResourceMobilizationTable.loading;
      default:
        return false;
    }
  });
  const dataDonorFilterOptions = useStoreState(
    (state) =>
      get(state.DonorFilterOptions, "data.data", {
        id: "",
        name: "",
        options: [],
      }) as FilterGroupModel,
  );
  const dataReplenishmentPeriodFilterOptions = useStoreState(
    (state) =>
      get(state.ReplenishmentPeriodFilterOptions, "data.data", {
        id: "",
        name: "",
        options: [],
      }) as FilterGroupModel,
  );
  const pageAppliedFilters = useStoreState((state) => [
    ...state.TempAppliedFiltersState.donorTypes,
    ...state.TempAppliedFiltersState.donors,
    ...state.TempAppliedFiltersState.replenishmentPeriods,
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
      donorTypes: [],
      donors: [],
      replenishmentPeriods: [],
    });
  };

  const handleCancelFilters = () => {
    if (isEqual(appliedFiltersData, tempAppliedFiltersData)) return;
    tempAppliedFiltersActions.setAll({ ...appliedFiltersData });
  };

  const handleApplyFilters = () => {
    if (isEqual(appliedFiltersData, tempAppliedFiltersData)) return;
    appliedFiltersActions.setAll({ ...tempAppliedFiltersData });
  };

  const handleResetChartFilters = () => {
    setChartTempAppliedFiltersData({
      ...chartTempAppliedFiltersData,
      donorTypes: [],
      donors: [],
      replenishmentPeriods: [],
    });
    setChartTempAppliedFilters([]);

    setChartAppliedFiltersData({
      ...chartAppliedFiltersData,
      donorTypes: [],
      donors: [],
      replenishmentPeriods: [],
    });
    setChartAppliedFilters([]);
  };

  const handleCancelChartFilters = () => {
    setChartTempAppliedFiltersData(structuredClone(chartAppliedFiltersData));
    setChartTempAppliedFilters(chartAppliedFilters);
  };

  const handleToggleChartFilter = (
    checked: boolean,
    value: string,
    type: string,
  ) => {
    const state = structuredClone(chartTempAppliedFiltersData);
    switch (type) {
      case "donor":
        if (checked) {
          state.donors.push(value);
        } else {
          state.donors = state.donors.filter((item) => item !== value);
        }
        break;
      case "donorType":
        if (checked) {
          state.donorTypes.push(value);
        } else {
          state.donorTypes = state.donorTypes.filter((item) => item !== value);
        }
        break;
      case "replenishmentPeriod":
        if (checked) {
          state.replenishmentPeriods.push(value);
        } else {
          state.replenishmentPeriods = state.replenishmentPeriods.filter(
            (item) => item !== value,
          );
        }
        break;
      default:
        break;
    }
    setChartTempAppliedFiltersData(structuredClone(state));
    setChartTempAppliedFilters([
      ...state.donorTypes,
      ...state.donors,
      ...state.replenishmentPeriods,
    ]);
  };

  const handleRemoveChartFilter = (value: string, types: string[]) => {
    const state = { ...chartTempAppliedFiltersData };
    types.forEach((type) => {
      switch (type) {
        case "donor":
        case "donorType":
          state.donors = state.donors.filter((item) => item !== value);
          state.donorTypes = state.donorTypes.filter((item) => item !== value);
          break;
        case "replenishmentPeriod":
          state.replenishmentPeriods = state.replenishmentPeriods.filter(
            (item) => item !== value,
          );
          break;
        default:
          break;
      }
    });
    setChartTempAppliedFiltersData(state);
    setChartTempAppliedFilters([
      ...state.donorTypes,
      ...state.donors,
      ...state.replenishmentPeriods,
    ]);
  };

  const handleApplyChartFilters = () => {
    if (isEqual(chartAppliedFilters, chartTempAppliedFiltersData)) return;
    setChartAppliedFiltersData(structuredClone(chartTempAppliedFiltersData));
    setChartAppliedFilters(chartTempAppliedFilters);
  };

  const chartEmpty = React.useMemo(() => {
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        return !dataBarChart || !dataBarChart.length;
      case dropdownItems[1].value:
        return (!dataTable || !dataTable.length) && !tableSearch.length;
      default:
        return false;
    }
  }, [dropdownSelected, dataBarChart, dataTable, tableSearch]);

  const filterGroups = React.useMemo(() => {
    return [dataDonorFilterOptions, dataReplenishmentPeriodFilterOptions];
  }, [dataDonorFilterOptions, dataReplenishmentPeriodFilterOptions]);

  const appliedFilterString = React.useMemo(() => {
    let value = "";
    if (
      appliedFiltersData.donorTypes.length > 0 &&
      location.search.includes("donorTypes=")
    ) {
      value += `donorTypes=${encodeURIComponent(
        appliedFiltersData.donorTypes.join(","),
      )}`;
    }
    if (
      appliedFiltersData.donors.length > 0 &&
      location.search.includes("donors=")
    ) {
      value += `${value.length > 0 ? "&" : ""}donors=${encodeURIComponent(
        appliedFiltersData.donors.join(","),
      )}`;
    }
    if (
      appliedFiltersData.replenishmentPeriods.length > 0 &&
      location.search.includes("replenishmentPeriods=")
    ) {
      value += `${value.length > 0 ? "&" : ""}periods=${encodeURIComponent(
        appliedFiltersData.replenishmentPeriods.join(","),
      )}`;
    }
    return value;
  }, [appliedFiltersData, location.search]);

  const chartFilterString = React.useMemo(() => {
    let value = "";
    if (
      (appliedFiltersData.donorTypes.length > 0 &&
        location.search.includes("donorTypes=")) ||
      chartAppliedFiltersData.donorTypes.length > 0
    ) {
      value += `donorTypes=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.donorTypes,
          ...chartAppliedFiltersData.donorTypes,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.donors.length > 0 &&
        location.search.includes("donors=")) ||
      chartAppliedFiltersData.donors.length > 0
    ) {
      value += `${value.length > 0 ? "&" : ""}donors=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.donors,
          ...chartAppliedFiltersData.donors,
        ]).join(","),
      )}`;
    }
    if (
      (appliedFiltersData.replenishmentPeriods.length > 0 &&
        location.search.includes("replenishmentPeriods=")) ||
      chartAppliedFiltersData.replenishmentPeriods.length > 0
    ) {
      value += `${value.length > 0 ? "&" : ""}periods=${encodeURIComponent(
        uniq([
          ...appliedFiltersData.replenishmentPeriods,
          ...chartAppliedFiltersData.replenishmentPeriods,
        ]).join(","),
      )}`;
    }
    return value;
  }, [appliedFiltersData, chartAppliedFiltersData, location.search]);

  const onSearchChange = (search: string) => {
    setTableSearch(search);
    let filterString = chartFilterString;
    if (search) {
      filterString += `${filterString.length > 0 ? "&" : ""}q=${search}`;
    }
    fetchTable({ filterString });
  };

  const totalPledges = React.useMemo(() => {
    const raw = get(dataStats, "totalPledges", 0);
    const v = applyResultValueFormula(raw, 3);
    return {
      raw: formatFinancialValue(raw),
      formatted: `US$${v.number} ${v.text}`,
    };
  }, [dataStats]);

  const totalContributions = React.useMemo(() => {
    const raw = get(dataStats, "totalContributions", 0);
    const v = applyResultValueFormula(raw, 3);
    return {
      raw: formatFinancialValue(raw),
      formatted: `US$${v.number} ${v.text}`,
    };
  }, [dataStats]);

  const donorsByType = React.useMemo(() => {
    const data = get(dataStats, "donorTypesCount", []);
    const total = sumBy(data, "value");
    return orderBy(
      data.map((item) => ({
        ...item,
        percentage: total > 0 ? (item.value / total) * 100 : 0,
      })),
      "value",
      "desc",
    );
  }, [dataStats]);

  const chartContent = React.useMemo(() => {
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        return (
          <ExpandableHorizontalBar
            data={dataBarChart}
            yAxisLabel={getCMSDataField(
              cmsData,
              "pagesDatasetsResourceMobilization.barchartYLabel",
              "Donor Types & Donors",
            )}
            xAxisLabel={getCMSDataField(
              cmsData,
              "pagesDatasetsResourceMobilization.barchartXLabel",
              "Amount",
            )}
            valueLabels={{
              value: getCMSDataField(
                cmsData,
                "pagesDatasetsResourceMobilization.barchartValueLabel1",
                "Pledge",
              ),
              value1: getCMSDataField(
                cmsData,
                "pagesDatasetsResourceMobilization.barchartValueLabel2",
                "Contribution",
              ),
            }}
          />
        );
      case dropdownItems[1].value:
        return (
          <TableContainer
            dataTree
            data={dataTable}
            search={tableSearch}
            onSearchChange={onSearchChange}
            id="pledges-contributions-table"
            columns={TABLE_VARIATION_8_COLUMNS}
          />
        );
      default:
        return null;
    }
  }, [dropdownSelected, dataBarChart, dataTable, tableSearch]);

  const chartData = React.useMemo(() => {
    const data: (string | number)[][] = [];
    switch (dropdownSelected) {
      case dropdownItems[0].value:
        dataBarChart.forEach((item) => {
          get(item, "items", []).forEach((subItem) => {
            if (!subItem.items) {
              data.push([
                `"${item.name}"`,
                "",
                `"${subItem.name}"`,
                subItem.value,
                subItem.value1 ?? "",
              ]);
            } else {
              subItem.items.forEach((subSubItem) => {
                data.push([
                  `"${item.name}"`,
                  `"${subItem.name}"`,
                  `"${subSubItem.name}"`,
                  subSubItem.value,
                  subSubItem.value1 ?? "",
                ]);
              });
            }
          });
        });
        break;
      case dropdownItems[1].value:
        dataTable.forEach((item: any) => {
          get(item, "_children", []).forEach((subItem: any) => {
            if (!subItem._children) {
              data.push([
                `"${item.name}"`,
                "",
                `"${subItem.name}"`,
                subItem.pledge,
                subItem.contribution ?? "",
              ]);
            } else {
              subItem._children.forEach((subSubItem: any) => {
                data.push([
                  `"${item.name}"`,
                  `"${subItem.name}"`,
                  `"${subSubItem.name}"`,
                  subSubItem.pledge,
                  subSubItem.contribution ?? "",
                ]);
              });
            }
          });
        });
        break;
      default:
        return [];
    }
    return {
      headers: [
        "Donor Type",
        "Donor Sub-Type",
        "Donor",
        "Pledge",
        "Contribution",
      ],
      data,
    };
  }, [dropdownSelected, dataBarChart, dataTable]);

  React.useEffect(() => {
    fetchStats({ filterString: appliedFilterString });
  }, [appliedFilterString]);

  React.useEffect(() => {
    fetchBarChart({ filterString: chartFilterString });
    fetchTable({ filterString: chartFilterString });
  }, [chartFilterString]);

  React.useEffect(() => {
    if (location.hash) {
      const blockId = location.hash.slice(1).split("|")[0];
      const blockChartType = location.hash.slice(1).split("|")[1];
      if (blockId === "disbursements" && blockChartType) {
        setDropdownSelected(decodeURIComponent(blockChartType));
      }
    }
  }, [location.hash]);

  return (
    <>
      <Helmet>
        <link
          rel="canonical"
          href={`${window.location.origin}/resource-mobilization`}
        />
      </Helmet>
      <DatasetPage
        title={getCMSDataField(
          cmsData,
          "pagesDatasetsResourceMobilization.title",
          "Resource Mobilization",
        )}
        filterGroups={filterGroups}
        appliedFilters={pageAppliedFilters}
        handleResetFilters={handleResetFilters}
        subtitle={getCMSDataField(
          cmsData,
          "pagesDatasetsResourceMobilization.subtitle",
          "Government, private sector, non-government and other donor pledges and contributions",
        )}
        handleApplyFilters={handleApplyFilters}
        handleCancelFilters={handleCancelFilters}
      >
        <Box width="100%" marginTop="50px">
          <Box
            width="100%"
            display="flex"
            flexDirection="row"
            marginBottom="25px"
            position="relative"
            sx={{
              "> div": {
                width: "calc(100% / 3)",
                padding: "0 10px 0 32px",
                "&:not(:last-child)": {
                  borderRight: "1px solid #CFD4DA",
                },
                "&:first-of-type": {
                  paddingLeft: 0,
                },
                "@media (max-width: 920px)": {
                  padding: "0 15px",
                  h5: {
                    fontSize: "20px",
                  },
                },
                "@media (max-width: 767px)": {
                  width: "100%",
                  padding: "16px 0",
                  borderRightStyle: "none !important",
                  "&:not(:last-child)": {
                    borderRightStyle: "none",
                    borderBottom: "1px solid #98A1AA",
                  },
                },
              },
              "@media (max-width: 767px)": {
                marginBottom: 0,
                flexDirection: "column",
              },
            }}
          >
            <Box>
              {!loadingStats ? (
                <Typography variant="h3">{totalPledges.formatted}</Typography>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ width: "400px", lineHeight: 1.2, fontSize: "36px" }}
                />
              )}
              <Typography fontSize="16px">
                {getCMSDataField(
                  cmsData,
                  "pagesDatasetsResourceMobilization.statsText2",
                  "Total Pledged",
                )}
              </Typography>
              {!loadingStats ? (
                <Typography fontSize="14px" color="#373D43">
                  {totalPledges.raw}
                </Typography>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ width: "250px", fontSize: "14px" }}
                />
              )}
            </Box>
            <Box>
              {!loadingStats ? (
                <Typography variant="h3">
                  {totalContributions.formatted}
                </Typography>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ width: "400px", lineHeight: 1.2, fontSize: "36px" }}
                />
              )}
              <Typography fontSize="16px">
                {getCMSDataField(
                  cmsData,
                  "pagesDatasetsResourceMobilization.statsText3",
                  "Total Contributed",
                )}
              </Typography>
              {!loadingStats ? (
                <Typography fontSize="14px" color="#373D43">
                  {totalContributions.raw}
                </Typography>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ width: "250px", fontSize: "14px" }}
                />
              )}
            </Box>
            <Box>
              {!loadingStats ? (
                <Typography variant="h3">
                  {sumBy(get(dataStats, "donorTypesCount", []), "value")}
                </Typography>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ width: "400px", lineHeight: 1.2, fontSize: "36px" }}
                />
              )}
              <Typography fontSize="16px">
                {getCMSDataField(
                  cmsData,
                  "pagesDatasetsResourceMobilization.statsText4Titlee",
                  "Donors Mobilized",
                )}
              </Typography>
              {!loadingStats ? (
                <Typography fontSize="14px" color="#373D43">
                  Across {get(dataStats, "donorTypesCount", []).length} donor
                  types
                </Typography>
              ) : (
                <Skeleton
                  variant="text"
                  sx={{ width: "250px", fontSize: "14px" }}
                />
              )}
            </Box>
          </Box>
          <Divider
            sx={{
              margin: "15px 0 30px 0",
              borderColor: "#CFD4DA",
            }}
          />
          {loadingStats && (
            <Box
              width="100%"
              height="100%"
              display="flex"
              position="absolute"
              alignItems="center"
              justifyContent="center"
              bgcolor="rgba(255, 255, 255, 0.8)"
            >
              <CircularProgress />
            </Box>
          )}
          <AnimateInView>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "20px",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h3">
                  {getCMSDataField(
                    cmsData,
                    "pagesDatasetsResourceMobilization.statsText4Titlee",
                    "Donors by type",
                  )}
                </Typography>
                <Typography variant="body2" fontSize="20px">
                  {getCMSDataField(
                    cmsData,
                    "pagesDatasetsResourceMobilization.statsText4Subtitlee",
                    "Public sector donors account for more than half of all donors mobilized.",
                  )}
                </Typography>
              </Box>
              <Box
                sx={{
                  gap: "6px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    bgcolor: "#108E09",
                  }}
                />
                <Typography fontSize="16px" color="#373D43">
                  = 1 donor
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2} marginBottom="40px">
              {donorsByType.length > 0 && (
                <DonorByTypeComponent
                  {...donorsByType[0]}
                  key={donorsByType[0].name}
                />
              )}
              <Grid item container rowSpacing={4} xs={12} sm={12} md={9} lg={9}>
                {donorsByType.slice(1).map((item) => (
                  <DonorByTypeComponent key={item.name} {...item} />
                ))}
              </Grid>
            </Grid>
          </AnimateInView>
          <Typography variant="overline" fontSize="14px">
            Latest Update: <b>{latestUpdateDate}</b>
          </Typography>
          <Box width="100%" height="50px" />
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
            sx={
              dropdownSelected === dropdownItems[1].value
                ? {
                    "#content": {
                      padding: 0,
                    },
                  }
                : {}
            }
          >
            <AnimateInView>
              <DatasetChartBlock
                id="pledges-contributions"
                exportName="pledges-and-contributions"
                title={getCMSDataField(
                  cmsData,
                  "pagesDatasetsResourceMobilization.pledgesTitle",
                  "Pledges & Contributions",
                )}
                subtitle={getCMSDataField(
                  cmsData,
                  "pagesDatasetsResourceMobilization.pledgesSubtitle",
                  "Government, private sector, non-government and other donor pledges and contributions.",
                )}
                dropdownItems={dropdownItems}
                dropdownSelected={dropdownSelected}
                handleDropdownChange={handleSelectionChange}
                disableCollapse={dropdownSelected === dropdownItems[1].value}
                loading={dataChartLoading}
                empty={chartEmpty}
                filterGroups={filterGroups}
                latestUpdate={latestUpdateDate}
                appliedFilters={chartTempAppliedFilters}
                toggleFilter={handleToggleChartFilter}
                removeFilter={handleRemoveChartFilter}
                handleResetFilters={handleResetChartFilters}
                tempAppliedFiltersData={chartTempAppliedFiltersData}
                handleApplyFilters={handleApplyChartFilters}
                handleCancelFilters={handleCancelChartFilters}
                data={chartData}
                infoType="pledges_contributions"
              >
                {chartContent}
              </DatasetChartBlock>
            </AnimateInView>
          </Box>
        </Box>
      </DatasetPage>
    </>
  );
};
