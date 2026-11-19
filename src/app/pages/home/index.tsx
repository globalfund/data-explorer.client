import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import { useTitle } from "react-use";
import Divider from "@mui/material/Divider";
import { Search } from "app/components/search";
import { HomeHero } from "app/pages/home/components/hero";
import { AnimateInView } from "app/components/animate-in-view";
import { HomeBlock1 } from "app/pages/home/blocks/block-1";
import { HomeBlock2 } from "app/pages/home/blocks/block-2";
import { HomeBlock3 } from "app/pages/home/blocks/block-3";
import { HomeBlock4 } from "app/pages/home/blocks/block-4";
import { HomeBlock5 } from "app/pages/home/blocks/block-5";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { HomeResultsStats } from "app/pages/home/components/results-stats";
import { StatCompProps } from "app/pages/home/components/results-stats/data";

export const Home: React.FC = () => {
  useTitle("The Data Explorer - Home");

  const dataResultsStats = useStoreState(
    (state) => get(state.HomeResultsStats, "data.stats", []) as StatCompProps[],
  );
  const loadingResultsStats = useStoreState((state) =>
    Boolean(state.HomeResultsStats.loading),
  );
  const fetchResultsStats = useStoreActions(
    (actions) => actions.HomeResultsStats.fetch,
  );
  const annualResultsCycles = useStoreState(
    (state) =>
      get(state.AnnualResultsCycles, "data.data", []) as {
        name: number;
        value: number;
      }[],
  );

  React.useEffect(() => {
    if (annualResultsCycles.length > 0) {
      fetchResultsStats({
        filterString: `cycle=${annualResultsCycles[0].value}`,
      });
    }
  }, [annualResultsCycles]);

  const fullWidthDivider = (
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
  );

  return (
    <Box padding="50px 0">
      <HomeHero />
      {fullWidthDivider}
      <Box
        height="50px"
        sx={{
          "@media (max-width: 767px)": {
            display: "none",
          },
        }}
      />
      <AnimateInView>
        <HomeResultsStats
          hideGeographies
          stats={dataResultsStats}
          loading={loadingResultsStats}
          yearSelected={annualResultsCycles[0]?.value?.toString() ?? ""}
        />
      </AnimateInView>
      <Box height="64px" />
      <Box display="flex" flexDirection="row" justifyContent="center">
        <Box
          width="800px"
          sx={{
            "@media (max-width: 920px)": {
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            },
          }}
        >
          <Search withCatMenu />
        </Box>
      </Box>
      <Box height="64px" />
      <AnimateInView>
        <HomeBlock1 />
      </AnimateInView>
      <Box height="50px" />
      {fullWidthDivider}
      <Box height="50px" />
      <AnimateInView>
        <HomeBlock2 />
      </AnimateInView>
      <Box height="50px" />
      {fullWidthDivider}
      <Box height="50px" />
      <AnimateInView>
        <HomeBlock3 />
      </AnimateInView>
      <Box height="50px" />
      {fullWidthDivider}
      <Box height="50px" />
      <AnimateInView>
        <HomeBlock4 />
      </AnimateInView>
      <Box height="50px" />
      {fullWidthDivider}
      <Box height="50px" />
      <AnimateInView>
        <HomeBlock5 />
      </AnimateInView>
    </Box>
  );
};
