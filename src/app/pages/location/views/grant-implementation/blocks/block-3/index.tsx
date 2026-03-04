import React from "react";
import get from "lodash/get";
import sumBy from "lodash/sumBy";
import filter from "lodash/filter";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import findIndex from "lodash/findIndex";
import { useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { useCMSData } from "app/hooks/useCMSData";
import { ChartBlock } from "app/components/chart-block";
import { Heatmap } from "app/components/charts/heatmap";
import { CYCLES, CycleProps } from "app/pages/home/data";
import useUpdateEffect from "react-use/lib/useUpdateEffect";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import {
  HeatmapDataItem,
  getPercentageColor,
} from "app/components/charts/heatmap/data";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";
import orderBy from "lodash/orderBy";

export const LocationGrantImplementationBlock3 = () => {
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "expenditures",
  });
  const params = useParams<{ id: string; tab: string }>();
  const paramsId = params.id?.replace("|", "%2F");

  const [chart3Cycles, setChart3Cycles] = React.useState<CycleProps[]>([]);
  const [chart2Unit, setChart2Unit] = React.useState<"amount" | "percentage">(
    "percentage",
  );

  const dataExpendituresHeatmap = useStoreState(
    (state) =>
      get(
        state.GeographyExpendituresHeatmap,
        "data.data",
        [],
      ) as HeatmapDataItem[],
  );
  const fetchExpendituresHeatmap = useStoreActions(
    (actions) => actions.GeographyExpendituresHeatmap.fetch,
  );
  const loadingExpendituresHeatmap = useStoreState(
    (state) => state.GeographyExpendituresHeatmap.loading,
  );
  const expendituresCycles = useStoreState(
    (state) =>
      get(state.GeographyExpendituresCycles, "data.data", []) as {
        name: string;
        value: string;
      }[],
  );
  const expendituresCyclesAll = useStoreState(
    (state) =>
      get(state.ExpendituresCycles, "data.data", []) as {
        name: string;
        value: string;
      }[],
  );

  const handleChartCycleChange = (cycle: CycleProps) => {
    let cycles: CycleProps[] = chart3Cycles;
    const setCycle = setChart3Cycles;
    const multi = false;

    const cycleIndex = cycles.findIndex((c) => c.value === cycle.value);
    if (cycleIndex > -1) {
      cycles.splice(cycleIndex, 1);
    } else {
      cycles.push(cycle);
    }
    if (cycle.value === CYCLES[0].value) {
      cycles = [];
    }
    if (!multi) {
      cycles = [cycle];
    }
    setCycle([...cycles]);
  };

  useUpdateEffect(() => {
    let filterString = `geographies=${paramsId}`;
    if (chart3Cycles.length > 0) {
      // filterString += `&periods=${chart3Cycles.map((c) => c.value).join(",")}`;
      filterString += `&cycleNames=${chart3Cycles
        .map((c) => c.value)
        .join(",")}`;
    }
    fetchExpendituresHeatmap({
      filterString,
      routeParams: {
        row: "principalRecipientType,principalRecipientSubType,principalRecipient",
        column: "component",
        componentField: "activityAreaGroup",
      },
    });
  }, [chart3Cycles]);

  React.useEffect(() => {
    if (expendituresCycles.length > 0) {
      setChart3Cycles([expendituresCycles[expendituresCycles.length - 1]]);
    }
  }, [expendituresCycles]);

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

  const exportChartData = React.useMemo(() => {
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
      headers: ["Principal Recipient", "Component", "Amount", "Percentage"],
      data: sortedData.map((item) => [
        `"${item.row}"`,
        `"${item.column}"`,
        item.value,
        item.percentage,
      ]),
    };
  }, [dataExpendituresHeatmap]);

  const showExpendituresHeatmap = dataExpendituresHeatmap.length > 0;

  return (
    <ChartBlock
      id="expenditures"
      exportName="expenditures"
      subtitle={getCMSDataField(
        cmsData,
        "pagesLocationGrantImplementation.expendituresSubtitle",
        "Expenditures",
      )}
      title={expendituresTotal}
      selectedCycles={chart3Cycles}
      loading={loadingExpendituresHeatmap}
      empty={!showExpendituresHeatmap && chart3Cycles.length === 0}
      handleCycleChange={(value) => handleChartCycleChange(value)}
      cycles={expendituresCyclesAll.map((c) => ({
        name: c.value,
        value: c.value,
        disabled: findIndex(expendituresCycles, { value: c.value }) === -1,
      }))}
      unitButtons={chart2UnitButtons}
      latestUpdate={latestUpdateDate}
      data={exportChartData}
      infoType="expenditures"
    >
      <Heatmap
        valueType={chart2Unit}
        data={dataExpendituresHeatmap}
        contentProp={chart2Unit === "percentage" ? "percentage" : "value"}
        hoveredLegend={null}
        columnCategory="cycle"
        rowCategory="component"
        getItemColor={getPercentageColor}
        bgColor={appColors.HEATMAP.CHART_BG_COLOR}
        columnHeader="Principal Recipients"
        rowHeader="Components"
      />
    </ChartBlock>
  );
};
