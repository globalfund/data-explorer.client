import React from "react";
import get from "lodash/get";
import sumBy from "lodash/sumBy";
import filter from "lodash/filter";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import { appColors } from "app/theme";
import findIndex from "lodash/findIndex";
import Divider from "@mui/material/Divider";
import { Table } from "app/components/table";
import { useParams } from "react-router-dom";
import { CycleProps } from "app/pages/home/data";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import { ChartBlock } from "app/components/chart-block";
import { RadialChart } from "app/components/charts/radial";
import { getCMSDataField } from "app/utils/getCMSDataField";
import useUpdateEffect from "react-use/lib/useUpdateEffect";
import { RaceBarChart } from "app/components/charts/race-bar";
import { TableContainer } from "app/components/table-container";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { RadialChartDataItem } from "app/components/charts/radial/data";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";
import {
  TABLE_VARIATION_2_COLUMNS,
  TABLE_VARIATION_6_COLUMNS,
  TABLE_VARIATION_10_COLUMNS as ELIGIBILITY_TABLE_COLUMNS,
} from "app/components/table/data";

export const AccessToFunding: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  const params = useParams<{ id: string; tab: string }>();
  const routeParamsId = params.id as string;
  const paramsId = params.id?.replace("|", "%2F") as string;

  const latestUpdateDateChart1 = useGetDatasetLatestUpdate({
    dataset: "allocations",
  });
  const latestUpdateDateChart2 = useGetDatasetLatestUpdate({
    dataset: "funding_requests",
  });
  const latestUpdateDateChart3 = useGetDatasetLatestUpdate({
    dataset: "eligibility",
  });

  const locationName = useStoreState((state) =>
    get(state.GeographyOverview, "data.data[0].name", params.id),
  );
  useTitle(`The Data Explorer - ${locationName}`);

  const [chart1Cycles, setChart1Cycles] = React.useState<CycleProps[]>([]);
  const [chart2Cycles, setChart2Cycles] = React.useState<CycleProps[]>([]);

  const [tableSearch, setTableSearch] = React.useState("");
  const [tableSearch2, setTableSearch2] = React.useState("");

  const dataAllocationsRadialChart = useStoreState(
    (state) =>
      get(
        state.GeographyAllocationsRadialChart,
        "data.data",
        [],
      ) as RadialChartDataItem[],
  );
  const fetchAllocationsRadialChart = useStoreActions(
    (actions) => actions.GeographyAllocationsRadialChart.fetch,
  );
  const loadingAllocationsRadialChart = useStoreState(
    (state) => state.GeographyAllocationsRadialChart.loading,
  );
  const dataFundingRequestsTable = useStoreState((state) =>
    get(state.GeographyFundingRequestsTable, "data.data[0]", {
      _children: [],
    }),
  );
  const fetchFundingRequestsTable = useStoreActions(
    (actions) => actions.GeographyFundingRequestsTable.fetch,
  );
  const loadingFundingRequestsTable = useStoreState(
    (state) => state.GeographyFundingRequestsTable.loading,
  );
  const dataFundingRequestStats = useStoreState((state) => ({
    submitted: get(
      state.GeographyFundingRequestsTable,
      "data.submittedCount[0].count",
      0,
    ),
    signed: get(
      state.GeographyFundingRequestsTable,
      "data.signedCount[0].count",
      0,
    ),
  }));
  const dataEligibilityTable = useStoreState((state) =>
    get(state.GeographyEligibilityTable, "data.data", []),
  );
  const dataDocumentsTable = useStoreState((state) =>
    get(state.GeographyDocumentsTable, "data.data", []),
  );
  const fetchDocumentsTable = useStoreActions(
    (actions) => actions.GeographyDocumentsTable.fetch,
  );
  const allocationsCycles = useStoreState(
    (state) =>
      get(state.GeographyAllocationsCycles, "data.data", []).map((c: any) => ({
        name: c.value,
        value: c.value,
      })) as {
        name: string;
        value: string;
      }[],
  );
  const fundingRequestsCycles = useStoreState(
    (state) =>
      filter(
        get(state.GeographyFundingRequestsCycles, "data.data", []).map(
          (c: any) => ({
            name: c.value,
            value: c.value,
          }),
        ),
        (c: any) => c.value,
      ) as {
        name: string;
        value: string;
      }[],
  );
  const allocationsCyclesAll = useStoreState(
    (state) =>
      get(state.AllocationsCycles, "data.data", []).map((c: any) => ({
        name: c.value,
        value: c.value,
      })) as {
        name: string;
        value: string;
      }[],
  );
  const fundingRequestsCyclesAll = useStoreState(
    (state) =>
      filter(
        get(state.FundingRequestsCycles, "data.data", []).map((c: any) => ({
          name: c.value,
          value: c.value,
        })),
        (c: any) => c.value,
      ) as {
        name: string;
        value: string;
      }[],
  );
  const dataEligibilityTableYears = useStoreState((state) =>
    get(state.AccessToFundingEligibilityTable, "data.years", []),
  );

  const handleChartCycleChange = (
    cycle: { name: string; value: string },
    index: number,
  ) => {
    switch (index) {
      case 1:
        setChart1Cycles([cycle]);
        break;
      case 2:
        setChart2Cycles([cycle]);
        break;
      default:
        break;
    }
  };

  const loadFundingRequestsTable = () => {
    if (paramsId && chart2Cycles.length > 0) {
      let filterString = "";
      filterString += `&periods=${chart2Cycles[0].value.split("-")[0]}`;
      if (tableSearch) {
        filterString += `${filterString.length > 0 ? "&" : ""}q=${tableSearch}`;
      }
      fetchFundingRequestsTable({
        filterString,
        routeParams: {
          code: routeParamsId,
        },
      });
    }
  };

  const onSearchChange = (search: string) => {
    setTableSearch(search);
    loadFundingRequestsTable();
  };

  const onSearchChange2 = (search: string) => {
    setTableSearch2(search);
    fetchDocumentsTable({
      filterString: `types=Application&geographies=${paramsId}${
        search.length > 0 ? `&q=${search}` : ""
      }`,
    });
  };

  useUpdateEffect(() => {
    if (paramsId && chart1Cycles.length > 0) {
      let filterString = "";
      filterString = `periods=${chart1Cycles[0].value}`;
      fetchAllocationsRadialChart({
        filterString,
        routeParams: { code: routeParamsId },
      });
    }
  }, [chart1Cycles]);

  useUpdateEffect(() => {
    loadFundingRequestsTable();
  }, [chart2Cycles]);

  React.useEffect(() => {
    if (allocationsCycles.length > 0 && chart1Cycles.length === 0) {
      setChart1Cycles((prev) => {
        if (prev.length === 0) {
          return [allocationsCycles[allocationsCycles.length - 1]];
        }
        return prev;
      });
    }
  }, [allocationsCycles]);

  React.useEffect(() => {
    if (fundingRequestsCycles.length > 0 && chart2Cycles.length === 0) {
      setChart2Cycles((prev) => {
        if (prev.length === 0) {
          return [fundingRequestsCycles[fundingRequestsCycles.length - 1]];
        }
        return prev;
      });
    }
  }, [fundingRequestsCycles]);

  const totalAllocationAmount = React.useMemo(() => {
    const value = sumBy(dataAllocationsRadialChart, "value");
    const range = getRange([{ value }], ["value"]);
    return `${getFinancialValueWithMetricPrefix(value, range.index, 2)} ${
      range.full
    }`;
  }, [dataAllocationsRadialChart]);

  const raceBarData = React.useMemo(() => {
    return [
      {
        name: getCMSDataField(
          cmsData,
          "pagesLocationAccessToFunding.fundingRequestsStatsSignedTitle",
          "Signed",
        ),
        value: dataFundingRequestStats.signed,
        color: "#0A2840",
        percentage: parseFloat(
          (
            (dataFundingRequestStats.signed /
              dataFundingRequestStats.submitted) *
            100
          ).toFixed(2),
        ),
      },
      {
        name: getCMSDataField(
          cmsData,
          "pagesLocationAccessToFunding.fundingRequestsStatsSubmittedTitle",
          "Submitted",
        ),
        value: dataFundingRequestStats.submitted,
        color: "#00B5AE",
        percentage: 100,
      },
    ];
  }, [dataFundingRequestStats]);

  const exportAllocationChartData = React.useMemo(() => {
    return {
      headers: ["Component", "Amount"],
      data: dataAllocationsRadialChart.map((item) => [
        `"${item.name}"`,
        item.value,
      ]),
    };
  }, [dataAllocationsRadialChart]);

  const exportEligibilityChartData = React.useMemo(() => {
    const result: (string | number)[][] = [];
    dataEligibilityTable.forEach((geography: any) => {
      get(geography, "_children", []).forEach((component: any) => {
        const diseaseBurdens = get(component, "_children[0]", {});
        const eligibilityStatuses = get(component, "_children[1]", {});
        dataEligibilityTableYears.forEach((year) => {
          const diseaseBurden = get(diseaseBurdens, `["${year}"]`, "");
          const eligibilityStatus = get(eligibilityStatuses, `["${year}"]`, "");
          result.push([
            `"${geography.name}"`,
            `"${component.name}"`,
            year,
            diseaseBurden,
            eligibilityStatus,
          ]);
        });
      });
    });
    return {
      headers: [
        "Geography",
        "Component",
        "Year",
        "Disease Burden",
        "Eligbility Status",
      ],
      data: result,
    };
  }, [dataEligibilityTable]);

  const fullWidthDivider = (
    <React.Fragment>
      <Box height="2px" />
      <Divider
        sx={{
          left: "-50vw",
          width: "200vw",
          position: "relative",
          borderTopColor: "#868E96",
          "@media (max-width: 767px)": {
            display: "none",
          },
        }}
      />
      <Box height="2px" />
    </React.Fragment>
  );

  const showAllocationRadialChart = dataAllocationsRadialChart.length > 0;
  const showFundingRequestsTable =
    dataFundingRequestsTable._children.length > 0 || tableSearch.length > 0;
  const showEligibilityHeatmap = dataEligibilityTable.length > 0;
  const showDocumentsTable =
    dataDocumentsTable.length > 0 || tableSearch2.length > 0;

  return (
    <Box gap="24px" display="flex" flexDirection="column">
      <ChartBlock
        id="allocation"
        exportName="allocation"
        title={`US$${totalAllocationAmount}`}
        selectedCycles={chart1Cycles}
        loading={loadingAllocationsRadialChart}
        handleCycleChange={(value) => handleChartCycleChange(value, 1)}
        subtitle={`${getCMSDataField(
          cmsData,
          "pagesLocationAccessToFunding.allocationSubtitle",
          "Funds Allocated",
        )} ${get(chart1Cycles, "[0].value", "").replace(" - ", "-")}`}
        empty={!showAllocationRadialChart}
        cycles={allocationsCyclesAll.map((c) => ({
          ...c,
          disabled: findIndex(allocationsCycles, { value: c.value }) === -1,
        }))}
        text={getCMSDataField(
          cmsData,
          "pagesLocationAccessToFunding.allocationText",
          "The Global Fund is distinct from other organizations in that it gives countries (or groups of countries) an allocation and asks countries to describe how they will use those funds rather than asking for applications and then determining an amount per-country based on the merits of the various proposals received.<br/><br/>This provides greater predictability for countries and helps ensure that the programs being funded are not just the ones with the most capacity to write good applications.",
        )}
        data={exportAllocationChartData}
        latestUpdate={latestUpdateDateChart1}
        infoType="global"
      >
        <Box marginTop="-100px" marginBottom="-100px">
          <RadialChart
            tooltipLabel={getCMSDataField(
              cmsData,
              "pagesLocationAccessToFunding.allocationTooltipLabel",
              "Allocation",
            )}
            data={dataAllocationsRadialChart}
            itemLabelFormatterType="name"
          />
        </Box>
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="h4" fontWeight="900">
              US${totalAllocationAmount}
            </Typography>
            <Typography variant="subtitle2">
              {getCMSDataField(
                cmsData,
                "pagesLocationAccessToFunding.allocationRadialChartSubtitle",
                "Total Allocation",
              )}{" "}
              {get(chart1Cycles, "[0].value", "")}
            </Typography>
          </Box>
        </Box>
      </ChartBlock>
      {showAllocationRadialChart && fullWidthDivider}
      <ChartBlock
        noSplitText
        noBottomToolbar
        id="funding-requests"
        exportName="funding-requests"
        selectedCycles={chart2Cycles}
        loading={loadingFundingRequestsTable}
        title={`${dataFundingRequestsTable._children.length} ${getCMSDataField(
          cmsData,
          "pagesLocationAccessToFunding.fundingRequestsTitle",
          "Funding Requests",
        )}`}
        subtitle={`${getCMSDataField(
          cmsData,
          "pagesLocationAccessToFunding.fundingRequestsSubtitle",
          "Submitted for",
        )} ${get(chart2Cycles, "[0].value", "").replace(" - ", "-")}`}
        empty={!showFundingRequestsTable}
        handleCycleChange={(value) => handleChartCycleChange(value, 2)}
        cycles={fundingRequestsCyclesAll.map((c) => ({
          ...c,
          disabled: findIndex(fundingRequestsCycles, { value: c.value }) === -1,
        }))}
        text={getCMSDataField(
          cmsData,
          "pagesLocationAccessToFunding.fundingRequestsText",
          `The Funding Request explains how the applicant would use Global Fund allocated funds, if approved. Funding Requests are reviewed by the Global Fund’s Technical Review Panel (TRP). Once approved by the TRP, the Funding Request is turned into one or more grants through the grant-making negotiation. The Grant Approvals Committee (GAC) reviews the final version of each grant and recommends implementation-ready grants to the Global Fund Board for approval. Funding Requests are submitted for internal Global Fund review, but the final grant is the legally-binding agreement.<br/><br/>The tracker below indicates the Funding Requests anticipated for the selected Allocation Period. If information is not available for a component for which the country received an allocation, it likely indicates that the country has not yet registered for a TRP window. Once funding requests have a TRP outcome of "Grant Making", they are made available for download in the Documents section of this page, which also included Funding Requests from previous Allocation Periods, Concept Notes, Proposals, and requests for funding from the COVID19 Response Mechanism.`,
        )}
        latestUpdate={latestUpdateDateChart2}
        data={dataFundingRequestsTable._children}
        infoType="global"
      >
        <TableContainer
          dataTree
          withCycles
          search={tableSearch}
          dataTreeStartExpanded
          id="funding-requests-table"
          onSearchChange={onSearchChange}
          columns={TABLE_VARIATION_2_COLUMNS}
          data={dataFundingRequestsTable._children}
        />
        <Box height="64px" />
        <RaceBarChart noValuesFormat data={raceBarData} />
      </ChartBlock>
      {showFundingRequestsTable && fullWidthDivider}
      <ChartBlock
        noSplitText
        id="eligibility"
        exportName="eligibility"
        title={getCMSDataField(
          cmsData,
          "pagesLocationAccessToFunding.eligibilityTitle",
          "Eligibility",
        )}
        subtitle=""
        empty={!showEligibilityHeatmap}
        text={getCMSDataField(
          cmsData,
          "pagesLocationAccessToFunding.eligibilityText",
          "Eligibility for funding from the Global Fund is determined by country income classification and disease burden for HIV, tuberculosis and malaria. Below are the components which are eligible for an allocation for the selected allocation period, according to the Global Fund Eligibility Policy.<br/><br/>Eligibility for the 2023-2025 Allocation Period was determined in 2022 and documented in the 2023 Eligibility List. Eligibility does not guarantee a funding allocation. Learn more about Eligibility <a target='_blank' href='https://www.theglobalfund.org/en/applying-for-funding/understand-and-prepare/eligibility/'>here</a> or <a>see the full history of eligibility for this country</a>.",
        )}
        latestUpdate={latestUpdateDateChart3}
        data={exportEligibilityChartData}
        infoType="global"
      >
        <Box
          height="32px"
          sx={{
            "@media (max-width: 767px)": {
              display: "none",
            },
          }}
        />
        <Box
          gap="20px"
          width="100%"
          display="flex"
          marginBottom="20px"
          flexDirection="row"
          justifyContent="flex-end"
          sx={{
            "> div": {
              display: "flex",
              flexDirection: "column",
              "> div": {
                gap: "10px",
                display: "flex",
                flexDirection: "row",
                "> div": {
                  gap: "5px",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  "#rectangle": {
                    width: "11px",
                    height: "11px",
                    borderRadius: "2px",
                  },
                },
              },
            },
            "@media (max-width: 767px)": {
              flexDirection: "column",
              "> div": {
                "> div": {
                  flexWrap: "wrap",
                },
              },
            },
          }}
        >
          <Box>
            <Typography fontSize="12px" fontWeight="700">
              {getCMSDataField(
                cmsData,
                "componentsChartsEligibility.diseaseBurdenTitle",
                "Disease Burden",
              )}
            </Typography>
            <Box>
              <Box>
                <Box
                  id="rectangle"
                  bgcolor={appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[0]}
                />
                <Typography fontSize="12px">
                  {getCMSDataField(
                    cmsData,
                    "componentsChartsEligibility.diseaseBurdenExtreme",
                    "Extreme",
                  )}
                </Typography>
              </Box>
              <Box>
                <Box
                  id="rectangle"
                  bgcolor={appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[1]}
                />
                <Typography fontSize="12px">
                  {getCMSDataField(
                    cmsData,
                    "componentsChartsEligibility.diseaseBurdenSevere",
                    "Severe",
                  )}
                </Typography>
              </Box>
              <Box>
                <Box
                  id="rectangle"
                  bgcolor={appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[2]}
                />
                <Typography fontSize="12px">
                  {getCMSDataField(
                    cmsData,
                    "componentsChartsEligibility.diseaseBurdenHigh",
                    "High",
                  )}
                </Typography>
              </Box>
              <Box>
                <Box
                  id="rectangle"
                  bgcolor={appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[3]}
                />
                <Typography fontSize="12px">
                  {getCMSDataField(
                    cmsData,
                    "componentsChartsEligibility.diseaseBurdenModerate",
                    "Moderate",
                  )}
                </Typography>
              </Box>
              <Box>
                <Box
                  id="rectangle"
                  bgcolor={appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[4]}
                />
                <Typography fontSize="12px">
                  {getCMSDataField(
                    cmsData,
                    "componentsChartsEligibility.diseaseBurdenNotHigh",
                    "Not High",
                  )}
                </Typography>
              </Box>
              <Box>
                <Box
                  id="rectangle"
                  bgcolor={appColors.ELIGIBILITY.DISEASE_BURDEN_COLORS[5]}
                />
                <Typography fontSize="12px">
                  {getCMSDataField(
                    cmsData,
                    "componentsChartsEligibility.diseaseBurdenLow",
                    "Low",
                  )}
                </Typography>
              </Box>
              <Box>
                <Box id="rectangle" bgcolor="#FFFFFF" border="1px solid #ccc" />
                <Typography fontSize="12px">
                  {getCMSDataField(
                    cmsData,
                    "componentsChartsEligibility.diseaseBurdenNA",
                    "NA",
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography fontSize="12px" fontWeight="700">
              {getCMSDataField(
                cmsData,
                "componentsChartsEligibility.statusTitle",
                "Eligibility Status",
              )}
            </Typography>
            <Box>
              <Box>
                <Box id="rectangle" bgcolor="#013E77" />
                <Typography fontSize="12px">
                  {getCMSDataField(
                    cmsData,
                    "componentsChartsEligibility.statusEligible",
                    "Eligible",
                  )}
                </Typography>
              </Box>
              <Box>
                <Box id="rectangle" bgcolor="#00B5AE" />
                <Typography fontSize="12px">
                  {getCMSDataField(
                    cmsData,
                    "componentsChartsEligibility.statusTransitionFunding",
                    "Transition Funding",
                  )}
                </Typography>
              </Box>
              <Box>
                <Box id="rectangle" bgcolor="#D9D9D9" />
                <Typography fontSize="12px">
                  {getCMSDataField(
                    cmsData,
                    "componentsChartsEligibility.statusNotEligible",
                    "Not Eligible",
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Table
          dataTree
          disableHover
          dataTreeStartExpanded
          id="eligibility-table"
          data={dataEligibilityTable}
          columns={ELIGIBILITY_TABLE_COLUMNS}
        />
      </ChartBlock>
      {showEligibilityHeatmap && fullWidthDivider}
      <ChartBlock
        id="documents"
        noBottomToolbar
        exportName="documents"
        title={getCMSDataField(
          cmsData,
          "pagesLocationAccessToFunding.documentsTitle",
          "Documents",
        )}
        subtitle=""
        empty={!showDocumentsTable}
        data={dataDocumentsTable}
        infoType="global"
      >
        <Box
          height="64px"
          sx={{
            "@media (max-width: 767px)": {
              display: "none",
            },
          }}
        />
        <TableContainer
          dataTree
          id="documents-table"
          dataTreeStartExpanded
          search={tableSearch2}
          data={dataDocumentsTable}
          onSearchChange={onSearchChange2}
          columns={TABLE_VARIATION_6_COLUMNS}
        />
      </ChartBlock>
    </Box>
  );
};
