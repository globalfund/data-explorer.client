import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  GridItem,
  gridItems,
  simpleFormatter,
} from "app/pages/datasets/opex/blocks/block-1/data";

const ItemBox = ({ item }: { item: GridItem }) => (
  <Box>
    <Typography fontWeight="700" fontSize={item.titleFontSize}>
      {item.title}
    </Typography>
    <Typography fontSize={16}>{item.subtitle}</Typography>
    <Typography fontSize={14} color="#373D43">
      {item.text}
    </Typography>
    {item.percentageValue && (
      <Box
        sx={{
          gap: "16px",
          width: "100%",
          display: "flex",
          marginTop: "8px",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            flex: 1,
            height: "8px",
            borderRadius: "4px",
            bgcolor: "#DFE3E5",
          }}
        >
          <Box
            sx={{
              height: "8px",
              borderRadius: "4px",
              bgcolor: "#0A2840",
              width: `${item.percentageValue}%`,
            }}
          />
        </Box>
        <Typography fontSize={12} color="#70777E">
          {item.percentageValue.toFixed(1)}% used
        </Typography>
      </Box>
    )}
  </Box>
);

const ContainerBox = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      "> div": {
        flex: "1 1 25%",
        minWidth: "200px",
        padding: "0 10px",
        borderRight: "1px solid #CFD4DA",
      },
      "> div:nth-of-type(4n)": {
        borderRight: "none",
      },
    }}
  >
    {children}
  </Box>
);

export const OpexPageBlock1: React.FC = () => {
  const years = useStoreState((state) => state.OpexYears.data);
  const yearsLoading = useStoreState((state) => state.OpexYears.loading);
  const startYear = get(years, "startYear", 0);
  const endYear = get(years, "endYear", 0);
  const dataStats = useStoreState((state) => state.OpexStats.data);
  const fetchStats = useStoreActions((actions) => actions.OpexStats.fetch);
  const statsLoading = useStoreState((state) => state.OpexStats.loading);

  const items = React.useMemo(() => {
    const result = [...gridItems];
    result[0].title = `${simpleFormatter(get(dataStats, "budget", 0))}`;
    result[0].subtitle = `${endYear} full-year budget`;
    result[0].text = `Forecast ${simpleFormatter(get(dataStats, "forecast", 0))}`;

    result[1].title = `${simpleFormatter(get(dataStats, "totalActual", 0))}`;
    result[1].subtitle = `Total actuals to 30 June ${endYear}`;
    result[1].text = `${((get(dataStats, "totalActual", 0) / get(dataStats, "budget", 0)) * 100).toFixed(1)}% of full-year budget`;

    result[2].title = `${simpleFormatter(get(dataStats, "workforceActual", 0))}`;
    result[2].subtitle = `Workforce actuals to 30 June ${endYear}`;
    result[2].text = `${get(dataStats, "workforcePercentage", 0).toFixed(1)}% of ${simpleFormatter(get(dataStats, "workforceBudget", 0))} budget`;

    result[3].title = `${simpleFormatter(get(dataStats, "nonWorkforceActual", 0))}`;
    result[3].subtitle = `Non-workforce actuals to 30 June ${endYear}`;
    result[3].text = `${get(dataStats, "nonWorkforcePercentage", 0).toFixed(1)}% of ${simpleFormatter(get(dataStats, "nonWorkforceBudget", 0))} budget`;

    result[4].title = `${get(dataStats, "growthPercentage", 0).toFixed(1)}%`;
    result[4].subtitle = `${simpleFormatter(get(dataStats, "growthStartYearValue", 0))} → ${simpleFormatter(get(dataStats, "forecast", 0))}`;
    result[4].text = `${get(dataStats, "growthPercentage", 0) > 0 ? "Growth" : "Decline"} ${startYear} → ${endYear}`;

    result[5].title = `${simpleFormatter(get(dataStats, "cumulativeTotalValue", 0))}`;
    result[5].subtitle = `of ${simpleFormatter(get(dataStats, "cumulativeTotalBudget", 0))} budget absorbed`;
    result[5].text = `Cumulative total, ${startYear}-${endYear}`;
    result[5].percentageValue = get(
      dataStats,
      "cumulativeTotalBudgetAbsorptionPercentage",
      0,
    );

    result[6].title = `${simpleFormatter(get(dataStats, "cumulativeTotalValueWorkforceAbsorption", 0))}`;
    result[6].subtitle = `of ${simpleFormatter(get(dataStats, "cumulativeTotalBudgetWorkforceAbsorption", 0))} budget absorbed`;
    result[6].text = `Cumulative workforce, ${startYear}-${endYear}`;
    result[6].percentageValue = get(
      dataStats,
      "cumulativeTotalBudgetWorkforceAbsorptionPercentage",
      0,
    );

    result[7].title = `${simpleFormatter(get(dataStats, "cumulativeTotalValueNonWorkforceAbsorption", 0))}`;
    result[7].subtitle = `of ${simpleFormatter(get(dataStats, "cumulativeTotalBudgetNonWorkforceAbsorption", 0))} budget absorbed`;
    result[7].text = `Cumulative non-workforce, ${startYear}-${endYear}`;
    result[7].percentageValue = get(
      dataStats,
      "cumulativeTotalBudgetNonWorkforceAbsorptionPercentage",
      0,
    );
    return result;
  }, [dataStats, startYear, endYear]);

  React.useEffect(() => {
    fetchStats({});
  }, []);

  return (
    <React.Fragment>
      <ContainerBox>
        {yearsLoading || statsLoading ? (
          <Skeleton variant="rectangular" width="100%" height={100} />
        ) : (
          <React.Fragment>
            {items.slice(0, 4).map((item) => (
              <ItemBox key={item.id} item={item} />
            ))}
          </React.Fragment>
        )}
      </ContainerBox>
      <Divider sx={{ margin: "24px 0" }} />
      <ContainerBox>
        {yearsLoading || statsLoading ? (
          <Skeleton variant="rectangular" width="100%" height={100} />
        ) : (
          <React.Fragment>
            {items.slice(4).map((item) => (
              <ItemBox key={item.id} item={item} />
            ))}
          </React.Fragment>
        )}
      </ContainerBox>
    </React.Fragment>
  );
};
