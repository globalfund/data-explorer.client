import React from "react";
import get from "lodash/get";
import sumBy from "lodash/sumBy";
import filter from "lodash/filter";
import Box from "@mui/material/Box";
import orderBy from "lodash/orderBy";
import { appColors } from "app/theme";
import IconButton from "@mui/material/IconButton";
import { useCMSData } from "app/hooks/useCMSData";
import { ChartBlock } from "app/components/chart-block";
import { Heatmap } from "app/components/charts/heatmap";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import {
  CYCLES,
  CycleProps,
  CHART_5_DROPDOWN_ITEMS,
} from "app/pages/home/data";
import {
  HeatmapDataItem,
  getPercentageColor,
} from "app/components/charts/heatmap/data";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";

export const HomeBlock5: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "expenditures",
  });

  const [chart5Cycles, setChart5Cycles] = React.useState<CycleProps[]>([]);

  const [chart5Dropdown, setChart5Dropdown] = React.useState(
    CHART_5_DROPDOWN_ITEMS[1].value,
  );

  const [chart5Unit, setChart5Unit] = React.useState<"amount" | "percentage">(
    "percentage",
  );

  const dataExpendituresHeatmap = useStoreState(
    (state) =>
      get(state.HomeExpendituresHeatmap, "data.data", []) as HeatmapDataItem[],
  );
  const loadingExpendituresHeatmap = useStoreState((state) =>
    Boolean(state.HomeExpendituresHeatmap.loading),
  );
  const fetchExpendituresHeatmap = useStoreActions(
    (actions) => actions.HomeExpendituresHeatmap.fetch,
  );
  const expendituresCycles = useStoreState(
    (state) =>
      get(state.ExpendituresCycles, "data.data", []) as {
        name: string;
        value: string;
      }[],
  );

  const handleChartCycleChange = (cycle: CycleProps) => {
    let cycles = chart5Cycles;
    const setCycle = setChart5Cycles;
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

  const chart5UnitButtons = React.useMemo(
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
          onClick={() => setChart5Unit("percentage")}
          sx={{
            color:
              chart5Unit === "percentage"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_TEXT_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_TEXT_COLOR,
            background:
              chart5Unit === "percentage"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BACKGROUND_COLOR,
            borderColor:
              chart5Unit === "percentage"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BORDER_COLOR,
          }}
        >
          %
        </IconButton>
        <IconButton
          onClick={() => setChart5Unit("amount")}
          sx={{
            color:
              chart5Unit === "amount"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_TEXT_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_TEXT_COLOR,
            background:
              chart5Unit === "amount"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BACKGROUND_COLOR,
            borderColor:
              chart5Unit === "amount"
                ? appColors.CHART_BLOCK_CYCLES.BUTTON_ACTIVE_BACKGROUND_COLOR
                : appColors.CHART_BLOCK_CYCLES.BUTTON_BORDER_COLOR,
          }}
        >
          $
        </IconButton>
      </Box>
    ),
    [chart5Unit],
  );

  const reloadExpendituresHeatmap = (
    cycles: {
      name: string;
      value: string;
    }[],
    componentField: string,
  ) => {
    let filterString = "";
    if (cycles.length > 0) {
      // const yearFrom: string[] = [];
      // const yearTo: string[] = [];
      // cycles.forEach((cycle) => {
      //   const years = cycle.value.split(" - ");
      //   yearFrom.push(years[0]);
      //   yearTo.push(years[1]);
      // });
      // if (yearFrom.length > 0) {
      //   filterString = `years=${yearFrom.join(",")}`;
      // }
      // if (yearTo.length > 0) {
      //   filterString += `${
      //     filterString.length > 0 ? "&" : ""
      //   }yearsTo=${yearTo.join(",")}`;
      // }
      filterString = `${filterString.length > 0 ? "&" : ""}cycleNames=${cycles
        .map((c) => c.value)
        .join(",")}`;
    }
    fetchExpendituresHeatmap({
      filterString,
      routeParams: {
        row: "principalRecipientType,principalRecipientSubType",
        column: "component",
        componentField:
          componentField === CHART_5_DROPDOWN_ITEMS[0].value
            ? "activityAreaGroup"
            : "activityArea",
        geographyGrouping: "Standard View",
      },
    });
  };

  React.useEffect(() => {
    if (chart5Cycles.length > 0) {
      reloadExpendituresHeatmap(chart5Cycles, chart5Dropdown);
    }
  }, [chart5Cycles, chart5Dropdown]);

  React.useEffect(() => {
    if (expendituresCycles.length > 0) {
      setChart5Cycles([expendituresCycles[expendituresCycles.length - 1]]);
    }
  }, [expendituresCycles]);

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

  return (
    <ChartBlock
      id="expenditures"
      exportName="expenditures"
      subtitle={getCMSDataField(
        cmsData,
        "pagesHome.expendituresSubtitle",
        "Expenditures",
      )}
      title={expendituresTotal}
      selectedCycles={chart5Cycles}
      unitButtons={chart5UnitButtons}
      latestUpdate={latestUpdateDate}
      // dropdownSelected={chart5Dropdown}
      loading={loadingExpendituresHeatmap}
      dropdownItems={CHART_5_DROPDOWN_ITEMS}
      handleDropdownChange={setChart5Dropdown}
      empty={dataExpendituresHeatmap.length === 0}
      handleCycleChange={(value) => handleChartCycleChange(value)}
      cycles={expendituresCycles.map((c) => ({
        name: c.value,
        value: c.value,
      }))}
      data={exportChartData}
      infoType="expenditures"
    >
      <Heatmap
        expandAll
        data={dataExpendituresHeatmap}
        hoveredLegend={null}
        valueType={chart5Unit}
        columnCategory="component"
        rowCategory="principalRecipient"
        getItemColor={getPercentageColor}
        contentProp={chart5Unit === "percentage" ? "percentage" : "value"}
        columnHeader="Principal Recipients"
        rowHeader="Components"
      />
    </ChartBlock>
  );
};
