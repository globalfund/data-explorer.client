import React from "react";
import Box from "@mui/material/Box";
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
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="center"
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
        <Typography
          component="div"
          fontSize="14px"
          variant="overline"
          lineHeight="normal"
        >
          {props.label}
        </Typography>
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
          return stat ? <StatComp key={stat.label} {...stat} /> : null;
        })}
    </Box>
  );
};
