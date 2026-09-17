import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { xAxisKeys } from "app/pages/datasets/opex/charts/line/data";
import { OpexPageChartBlock } from "app/pages/datasets/opex/blocks/common";
import { SmallLineChart } from "app/pages/datasets/opex/charts/small-line";
import {
  VIEWS,
  simpleFormatter,
  keyCostsOverTimeData,
} from "app/pages/datasets/opex/blocks/block-6/data";

export const OpexPageBlock6: React.FC = () => {
  const [selectedView, setSelectedView] = React.useState(VIEWS[0]);

  return (
    <OpexPageChartBlock
      data={null}
      views={VIEWS}
      empty={false}
      loading={false}
      infoType="opex"
      id="key-costs"
      title="Key costs over time, 2017-2026"
      viewSelected={selectedView}
      subtitle=""
      exportName="key-costs"
      onViewChange={setSelectedView}
      text="Sparkline shows the path 2017-2026; 2026 is budget. Figure shown is the 2026 budget."
    >
      <Grid
        container
        sx={{ borderTop: 1, borderLeft: 1, borderColor: "divider" }}
      >
        {keyCostsOverTimeData.map((item) => (
          <Grid
            item
            key={item.name}
            xs={12}
            sm={12}
            md={6}
            lg={4}
            sx={{
              p: "16px",
              borderRight: 1,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                justifyContent: "space-between",
              }}
            >
              <Typography fontSize="16px" fontWeight="700" color="#373D43">
                {item.name}
              </Typography>
              <Typography fontSize="14px" color="#70777E">
                {get(xAxisKeys, "[0]", "")} →{" "}
                {get(xAxisKeys, `[${xAxisKeys.length - 1}]`, "")}
              </Typography>
            </Box>
            <Box
              sx={{
                gap: "10px",
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Typography fontSize="20px" fontWeight="700">
                {selectedView === VIEWS[0]
                  ? simpleFormatter(item.endYearBudget)
                  : item.endYearBudgetPercentage.toFixed(2).replace(".00", "") +
                    "%"}
              </Typography>
              <Typography
                fontSize="12px"
                fontWeight="700"
                color={item.growthPercentage >= 0 ? "#013E77" : "#108E09"}
              >
                {selectedView === VIEWS[0] ? (
                  <>
                    {item.growthPercentage >= 0 ? "+" : ""}
                    {item.growthPercentage.toFixed(2).replace(".00", "")}%
                  </>
                ) : (
                  <>
                    {item.endYearBudgetPercentage -
                      item.startYearBudgetPercentage >=
                    0
                      ? "+"
                      : ""}
                    {(
                      item.endYearBudgetPercentage -
                      item.startYearBudgetPercentage
                    )
                      .toFixed(2)
                      .replace(".00", "") + "pp"}
                  </>
                )}
              </Typography>
            </Box>
            <Box>
              <SmallLineChart
                data={[
                  {
                    name: item.name,
                    data:
                      selectedView === VIEWS[0]
                        ? item.values
                        : item.actualPercentageValues,
                    areaStyle: {
                      opacity: 0.1,
                      color: item.growthPercentage >= 0 ? "#013E77" : "#108E09",
                    },
                    itemStyle: {
                      color: item.growthPercentage >= 0 ? "#013E77" : "#108E09",
                    },
                  },
                ]}
                xAxisKeys={xAxisKeys}
                height="70px"
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </OpexPageChartBlock>
  );
};
