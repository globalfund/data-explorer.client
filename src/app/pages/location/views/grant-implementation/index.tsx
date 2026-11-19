import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import { useStoreState } from "app/state/store/hooks";
import { AnimateInView } from "app/components/animate-in-view";
import { LineChartProps } from "app/components/charts/line/data";
import { SankeyChartData } from "app/components/charts/sankey/data";
import { HeatmapDataItem } from "app/components/charts/heatmap/data";
import { LocationGrantImplementationBlock1 } from "app/pages/location/views/grant-implementation/blocks/block-1";
import { LocationGrantImplementationBlock2 } from "app/pages/location/views/grant-implementation/blocks/block-2";
import { LocationGrantImplementationBlock3 } from "app/pages/location/views/grant-implementation/blocks/block-3";
import { LocationGrantImplementationBlock4 } from "app/pages/location/views/grant-implementation/blocks/block-4";

export const GrantImplementation = () => {
  const params = useParams<{ id: string; tab: string }>();

  const locationName = useStoreState((state) =>
    get(state.GeographyOverview, "data.data[0].name", params.id),
  );
  useTitle(`The Data Explorer - ${locationName}`);

  const dataDisbursementsLineChart = useStoreState(
    (state) =>
      get(state.GeographyDisbursementsLineChart, "data", {
        data: [],
        xAxisKeys: [],
      }) as LineChartProps,
  );
  const dataBudgetSankeyChart = useStoreState((state) => ({
    nodes: get(
      state.GeographyBudgetSankeyChart,
      "data.data.nodes",
      [],
    ) as SankeyChartData["nodes"],
    links: get(
      state.GeographyBudgetSankeyChart,
      "data.data.links",
      [],
    ) as SankeyChartData["links"],
  }));
  const dataExpendituresHeatmap = useStoreState(
    (state) =>
      get(
        state.GeographyExpendituresHeatmap,
        "data.data",
        [],
      ) as HeatmapDataItem[],
  );

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

  const showDisbursementsLineChart = dataDisbursementsLineChart.data.length > 0;
  const showBudgetSankeyChart = dataBudgetSankeyChart.links.length > 0;
  const showExpendituresHeatmap = dataExpendituresHeatmap.length > 0;

  return (
    <Box gap="24px" display="flex" flexDirection="column">
      <AnimateInView>
        <LocationGrantImplementationBlock1 />
      </AnimateInView>
      {showDisbursementsLineChart && fullWidthDivider}
      <AnimateInView>
        <LocationGrantImplementationBlock2 />
      </AnimateInView>
      {showBudgetSankeyChart && fullWidthDivider}
      <AnimateInView>
        <LocationGrantImplementationBlock3 />
      </AnimateInView>
      {showExpendituresHeatmap && fullWidthDivider}
      <AnimateInView>
        <LocationGrantImplementationBlock4 />
      </AnimateInView>
    </Box>
  );
};
