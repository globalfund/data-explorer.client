import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import TBIcon from "app/assets/vectors/TB.svg?react";
import HIVIcon from "app/assets/vectors/HIV.svg?react";
import CircularProgress from "@mui/material/CircularProgress";
import MalariaIcon from "app/assets/vectors/Malaria.svg?react";
import { applyResultValueFormula } from "app/utils/applyResultValueFormula";
import {
  statsOrder,
  StatCompProps,
  HomeResultsStatsProps,
} from "app/pages/home/components/results-stats/data";

const StatComp: React.FC<StatCompProps> = (props: StatCompProps) => {
  const value = applyResultValueFormula(props.value, 3);

  const icon = React.useMemo(() => {
    if (props.icon) return props.icon;
    if (props.label.includes("HIV")) return <HIVIcon />;
    if (props.label.includes("TB")) return <TBIcon />;
    if (props.label.includes("mosquito nets")) return <MalariaIcon />;
    return <React.Fragment />;
  }, [props.icon, props.label]);

  return (
    <Box
      gap="10px"
      display="flex"
      padding="0 10px"
      flexDirection="row"
      alignItems={props.hideGeographies ? "center" : "flex-start"}
      sx={{
        b: {
          fontWeight: 900,
        },
        "@media (max-width: 767px)": {
          justifyContent: "flex-start",
        },
      }}
    >
      {icon}
      <Box>
        {!props.loading ? (
          <Typography
            variant="h3"
            sx={{
              fontSize: "36px",
              fontWeight: "700",
              "@media (max-width: 1200px)": {
                fontSize: "32px",
              },
            }}
          >
            {value.number} {value.text}
          </Typography>
        ) : (
          <Skeleton
            variant="text"
            sx={{
              width: "300px",
              lineHeight: 1.2,
              fontSize: "36px",
              "@media (max-width: 1200px)": {
                fontSize: "32px",
              },
            }}
          />
        )}
        <Typography
          component="div"
          fontSize="16px"
          variant="overline"
          marginBottom="2px"
          lineHeight="normal"
        >
          {props.label}
          {props.hideGeographies ? ` in ${props.yearSelected}` : ""}
        </Typography>
        {!props.hideGeographies && (
          <React.Fragment>
            {!props.loading ? (
              <Typography fontSize="14px" color="#373D43">
                Reported by {props.geographies} countr
                {props.geographies === 1 ? "y" : "ies"} in {props.yearSelected}
              </Typography>
            ) : (
              <Skeleton
                variant="text"
                sx={{ width: "250px", fontSize: "14px" }}
              />
            )}
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};

export const HomeResultsStats: React.FC<HomeResultsStatsProps> = (
  props: HomeResultsStatsProps,
) => {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="row"
      justifyContent="center"
      sx={{
        "> div": {
          width: "calc(100% / 3)",
          ":not(:last-child)": {
            borderRight: "1px solid #CFD4DA",
          },
        },
        "@media (max-width: 920px)": {
          justifyContent: "space-around",
          "> div": {
            width: "fit-content",
          },
        },
        "@media (max-width: 767px)": {
          gap: "88px",
          flexDirection: "column",
          "> div": {
            width: "100%",
            borderRightStyle: "none !important",
          },
        },
      }}
      data-cy="home-results-stats"
    >
      {props.loading && props.stats.length === 0 && (
        <Box
          height="75px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "100% !important",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {props.stats.length > 0 &&
        statsOrder.map((o) => {
          const stat = props.stats.find((s) => s.label.includes(o));
          return stat ? (
            <StatComp
              key={stat.label}
              {...stat}
              loading={props.loading}
              yearSelected={props.yearSelected}
              hideGeographies={props.hideGeographies}
            />
          ) : null;
        })}
    </Box>
  );
};
