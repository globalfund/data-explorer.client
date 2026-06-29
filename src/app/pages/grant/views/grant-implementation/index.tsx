import React from "react";
import get from "lodash/get";
import sumBy from "lodash/sumBy";
import filter from "lodash/filter";
import Box from "@mui/material/Box";
import orderBy from "lodash/orderBy";
import { appColors } from "app/theme";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import { CYCLES } from "app/pages/home/data";
import { useCMSData } from "app/hooks/useCMSData";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Dropdown } from "app/components/dropdown";
import { useTitle, useUpdateEffect } from "react-use";
import { ChartBlock } from "app/components/chart-block";
import { Heatmap } from "app/components/charts/heatmap";
import { RadialChart } from "app/components/charts/radial";
import { SankeyChart } from "app/components/charts/sankey";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { RaceBarChart } from "app/components/charts/race-bar";
import { SankeyChartData } from "app/components/charts/sankey/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { defaultComponentsGroupingOptions } from "app/pages/datasets/grant-implementation/data";
import {
  HeatmapDataItem,
  getPercentageColor,
} from "app/components/charts/heatmap/data";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";

export const GrantImplementation: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDateChart1 = useGetDatasetLatestUpdate({
    dataset: "disbursements",
  });
  const latestUpdateDateChart2 = useGetDatasetLatestUpdate({
    dataset: "budgets",
  });
  const latestUpdateDateChart3 = useGetDatasetLatestUpdate({
    dataset: "expenditures",
  });
  const params = useParams<{ id: string; ip: string; tab: string }>();

  useTitle(`The Data Explorer - ${params.id} Financial Insights`);

  const componentsGroupingOptions = React.useMemo(
    () =>
      getCMSDataField(
        cmsData,
        "pagesDatasetsGrantImplementation.componentsGroupingDropdownOptions",
        defaultComponentsGroupingOptions,
      ),
    [cmsData],
  );

  const expendituresGroupingOptions = React.useMemo(
    () =>
      getCMSDataField(
        cmsData,
        "pagesGrantGrantImplementation.expendituresDropdownOptions",
        [
          { label: "Investment Landscape", value: "Investment Landscape" },
          {
            label: "Modules & Interventions",
            value: "Modules & Interventions",
          },
        ],
      ),
    [cmsData],
  );

  const [chart2Dropdown, setChart2Dropdown] = React.useState(
    expendituresGroupingOptions[0].value,
  );
  const [chart2Dropdown2, setChart2Dropdown2] = React.useState(
    componentsGroupingOptions[0].value,
  );
  const [chart2Unit, setChart2Unit] = React.useState<"amount" | "percentage">(
    "percentage",
  );

  const dataFinancialValues = useStoreState((state) =>
    get(state.GrantOverview, "data.data[0]", {
      disbursement: 0,
      commitment: 0,
      signed: 0,
    }),
  );
  const dataProgrameDates = useStoreState((state) => ({
    boardApprovedDate: get(
      state.GrantOverview,
      "data.data[0].boardApprovedDate",
    ),
    programStartDate: get(state.GrantOverview, "data.data[0].dates[0]"),
    programEndDate: get(state.GrantOverview, "data.data[0].dates[1]"),
  }));
  const dataBudgetSankeyChart = useStoreState(
    (state) =>
      get(state.GrantBudgetSankeyChart, "data.data[0]", {
        nodes: [],
        links: [],
      }) as SankeyChartData,
  );
  const dataExpendituresHeatmap = useStoreState(
    (state) =>
      get(state.GrantExpendituresHeatmap, "data.data", []) as HeatmapDataItem[],
  );
  const dataHasExpenditures = useStoreState(
    (state) =>
      get(
        state.GrantHasExpenditures,
        "data.data.hasExpenditures",
        false,
      ) as boolean,
  );

  const fetchExpendituresHeatmap = useStoreActions(
    (actions) => actions.GrantExpendituresHeatmap.fetch,
  );

  const chart2UnitButtons = React.useMemo(
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
          onClick={() => setChart2Unit("percentage")}
          sx={{
            color:
              chart2Unit === "percentage"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_TEXT_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_TEXT_COLOR,
            background:
              chart2Unit === "percentage"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BACKGROUND_COLOR,
            borderColor:
              chart2Unit === "percentage"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BORDER_COLOR,
          }}
        >
          %
        </IconButton>
        <IconButton
          onClick={() => setChart2Unit("amount")}
          sx={{
            color:
              chart2Unit === "amount"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_TEXT_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_TEXT_COLOR,
            background:
              chart2Unit === "amount"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BACKGROUND_COLOR,
            borderColor:
              chart2Unit === "amount"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BORDER_COLOR,
          }}
        >
          $
        </IconButton>
      </Box>
    ),
    [chart2Unit],
  );

  const radialChartData = React.useMemo(
    () => [
      {
        name: "Disbursed",
        value: dataFinancialValues.disbursement,
        itemStyle: {
          color: appColors.RADIAL_CHART.ITEM_COLORS[0],
        },
      },
      {
        name: "Committed",
        value: dataFinancialValues.commitment,
        itemStyle: {
          color: appColors.RADIAL_CHART.ITEM_COLORS[1],
        },
      },
    ],
    [dataFinancialValues],
  );

  const signedFormatted = React.useMemo(() => {
    const range = getRange([dataFinancialValues], ["signed"]);
    return `${getFinancialValueWithMetricPrefix(
      dataFinancialValues.signed,
      range.index,
      2,
    )} ${range.abbr}`;
  }, [dataFinancialValues]);

  const raceBarChartData = React.useMemo(() => {
    const disbursementPercentage =
      (dataFinancialValues.disbursement / dataFinancialValues.commitment) * 100;
    const commitmentPercentage =
      (dataFinancialValues.commitment / dataFinancialValues.signed) * 100;
    return [
      {
        name: "Disbursed",
        value: dataFinancialValues.disbursement,
        color: "#0A2840",
        percentage: disbursementPercentage,
        sizePercentage: (disbursementPercentage * commitmentPercentage) / 100,
      },
      {
        name: "Committed",
        value: dataFinancialValues.commitment,
        color: "#013E77",
        percentage: commitmentPercentage,
      },
      {
        name: "Signed",
        value: dataFinancialValues.signed,
        color: "#00B5AE",
        percentage: 100,
      },
    ];
  }, [
    dataFinancialValues.disbursement,
    dataFinancialValues.commitment,
    dataFinancialValues.signed,
  ]);

  const disbursementsTotal = React.useMemo(() => {
    const range = getRange(
      [{ value: dataFinancialValues.disbursement }],
      ["value"],
    );
    return `US$${getFinancialValueWithMetricPrefix(
      dataFinancialValues.disbursement,
      range.index,
      2,
    )} ${range.full}`;
  }, [dataFinancialValues.disbursement]);

  const expendituresTotal = React.useMemo(() => {
    const total = sumBy(
      filter(
        dataExpendituresHeatmap,
        (item) => !item.parentRow && !item.parentColumn,
      ),
      "value",
    );
    const range = getRange([{ value: total }], ["value"]);
    return `US$${getFinancialValueWithMetricPrefix(total, range.index, 2)} ${
      range.full
    }`;
  }, [dataExpendituresHeatmap]);

  const totalBudget = React.useMemo(() => {
    let total = 0;
    filter(dataBudgetSankeyChart.links, { source: "Total budget" }).forEach(
      (item) => {
        total += item.value;
      },
    );
    const range = getRange([{ value: total }], ["value"]);
    return `US$${getFinancialValueWithMetricPrefix(total, range.index, 2)} ${
      range.full
    }`;
  }, [dataBudgetSankeyChart]);

  const expendituresComponentGroupingDropdown = React.useMemo(() => {
    return (
      <Dropdown
        dropdownSelected={chart2Dropdown2}
        dropdownItems={componentsGroupingOptions}
        handleDropdownChange={setChart2Dropdown2}
      />
    );
  }, [chart2Dropdown2]);

  const exportChartData = React.useMemo(() => {
    return {
      headers: ["Type", "Amount"],
      data: [
        ["Disbursed", dataFinancialValues.disbursement],
        ["Committed", dataFinancialValues.commitment],
        ["Signed", dataFinancialValues.signed],
      ],
    };
  }, [dataFinancialValues]);

  const exportBudgetSankeyChartData = React.useMemo(() => {
    return {
      headers: ["Source", "Target", "Value"],
      data: dataBudgetSankeyChart.links.map((link: any) => [
        link.source,
        link.target,
        link.value,
      ]),
    };
  }, [dataBudgetSankeyChart]);

  const exportExpenditureHeatmapChartData = React.useMemo(() => {
    let sortedData: HeatmapDataItem[] = [];
    orderBy(dataExpendituresHeatmap, "row", "asc").forEach((item) => {
      if (!item.parentRow && !item.parentColumn) {
        sortedData.push(item);
        const children = dataExpendituresHeatmap.filter(
          (child) =>
            child.parentRow === item.row || child.parentColumn === item.column,
        );
        sortedData = sortedData.concat(children);
      }
    });
    return {
      headers: [
        "Modules & Interventions",
        "Components",
        "Amount",
        "Percentage",
      ],
      data: sortedData.map((item) => [
        `"${item.row}"`,
        `"${item.column}"`,
        item.value,
        item.percentage,
      ]),
    };
  }, [dataExpendituresHeatmap]);

  useUpdateEffect(() => {
    fetchExpendituresHeatmap({
      routeParams: {
        row:
          chart2Dropdown === expendituresGroupingOptions[0].value
            ? "module,intervention"
            : "investmentLandscape1,investmentLandscape2,costCategory",
        column: "component",
        componentField:
          chart2Dropdown2 === componentsGroupingOptions[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: "Standard View",
      },
      filterString: `grantIP=${params.id}P0${params.ip}`,
    });
  }, [
    chart2Dropdown,
    chart2Dropdown2,
    params.id,
    params.ip,
    fetchExpendituresHeatmap,
  ]);

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

  const showRadialChart = radialChartData.length > 0;
  const showBudgetSankeyChart =
    dataBudgetSankeyChart.nodes.length > 0 &&
    dataBudgetSankeyChart.links.length > 0;
  const showExpendituresHeatmap = dataHasExpenditures;

  return (
    <Box gap="24px" display="flex" flexDirection="column">
      <Grid
        container
        spacing={2}
        sx={{
          "> div": {
            position: "relative",
            "&:not(:last-of-type):after": {
              right: 0,
              bottom: 0,
              top: "21px",
              width: "1px",
              content: '""',
              height: "38px",
              position: "absolute",
              backgroundColor: "#000",
            },
            "> div > *": {
              maxWidth: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            },
          },
          "@media (max-width: 767px)": {
            "> div": {
              "> div": {
                gap: 0,
              },
              ":after": {
                display: "none",
              },
            },
          },
        }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <Box
            gap="10px"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="body2" fontWeight="700">
              {getCMSDataField(
                cmsData,
                "pagesGrantGrantImplementation.dateStat1",
                "Board Approved Date",
              )}
            </Typography>
            <Typography variant="overline">
              {dataProgrameDates.boardApprovedDate}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box
            gap="10px"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="body2" fontWeight="700">
              {getCMSDataField(
                cmsData,
                "pagesGrantGrantImplementation.dateStat2",
                "Program Start Date",
              )}
            </Typography>
            <Typography
              gap="4px"
              display="flex"
              variant="overline"
              alignItems="center"
            >
              {dataProgrameDates.programStartDate}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box
            gap="10px"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="body2" fontWeight="700">
              {getCMSDataField(
                cmsData,
                "pagesGrantGrantImplementation.dateStat3",
                "Program End Date",
              )}
            </Typography>
            <Typography variant="overline">
              {dataProgrameDates.programEndDate}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {fullWidthDivider}
      <ChartBlock
        id="radial-chart"
        exportName="grant-investments"
        title={disbursementsTotal}
        subtitle={getCMSDataField(
          cmsData,
          "pagesGrantGrantImplementation.disbursementsSubtitle",
          "Disbursements",
        )}
        data={exportChartData}
        empty={!showRadialChart}
        latestUpdate={latestUpdateDateChart1}
        infoType="financials"
      >
        <RadialChart
          tooltipLabel={getCMSDataField(
            cmsData,
            "pagesGrantGrantImplementation.disbursementsTooltipLabel",
            "Amount",
          )}
          data={radialChartData}
          itemLabelFormatterType="name-value-percent"
        />
        <Box
          top="55%"
          display="flex"
          alignItems="center"
          position="absolute"
          flexDirection="column"
          justifyContent="center"
          right="calc(50% - 33px)"
        >
          <Box
            width="17px"
            height="17px"
            borderRadius="50%"
            bgcolor={appColors.RADIAL_CHART.ITEM_COLORS[2]}
          />
          <Typography variant="body2" fontWeight="700">
            {getCMSDataField(
              cmsData,
              "pagesGrantGrantImplementation.disbursementsRadialChartLabel",
              "Signed",
            )}
          </Typography>
          <Typography variant="body2">{signedFormatted}</Typography>
        </Box>
        <RaceBarChart data={raceBarChartData} />
      </ChartBlock>
      {showRadialChart && fullWidthDivider}
      <ChartBlock
        id="budget"
        title={totalBudget}
        exportName="grant-budgets"
        subtitle={getCMSDataField(
          cmsData,
          "pagesGrantGrantImplementation.budgetsSubtitle",
          "Grant Budgets",
        )}
        empty={!showBudgetSankeyChart}
        data={exportBudgetSankeyChartData}
        latestUpdate={latestUpdateDateChart2}
        infoType="budgets"
      >
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
        <SankeyChart data={dataBudgetSankeyChart} />
      </ChartBlock>
      {showBudgetSankeyChart && showExpendituresHeatmap && fullWidthDivider}
      <ChartBlock
        cycles={CYCLES}
        id="expenditures"
        exportName="grant-expenditures"
        subtitle={getCMSDataField(
          cmsData,
          "pagesGrantGrantImplementation.expendituresSubtitle",
          "Expenditures",
        )}
        title={expendituresTotal}
        empty={!showExpendituresHeatmap}
        dropdownWidth={200}
        dropdownSelected={chart2Dropdown}
        dropdownItems={expendituresGroupingOptions}
        handleDropdownChange={setChart2Dropdown}
        data={exportExpenditureHeatmapChartData}
        unitButtons={chart2UnitButtons}
        latestUpdate={latestUpdateDateChart3}
        infoType="expenditures"
        extraDropdown={expendituresComponentGroupingDropdown}
      >
        <Heatmap
          hoveredLegend={null}
          columnCategory="cycle"
          valueType={chart2Unit}
          rowHeader="Components"
          rowCategory="component"
          data={dataExpendituresHeatmap}
          getItemColor={getPercentageColor}
          contentProp={chart2Unit === "percentage" ? "percentage" : "value"}
          columnHeader={
            chart2Dropdown === expendituresGroupingOptions[0].value
              ? "Modules & Interventions"
              : "Investment Landscapes & Cost Categories"
          }
        />
      </ChartBlock>
    </Box>
  );
};
