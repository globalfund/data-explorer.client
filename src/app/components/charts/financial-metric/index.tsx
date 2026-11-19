import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DonutChart } from "app/components/charts/donut";
import { useAnimateInView } from "app/components/animate-in-view";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  FinancialMetricProps,
  FinancialMetricExpandableItemProps,
} from "app/components/charts/financial-metric/data";

export const FinancialMetric: React.FC<FinancialMetricProps> = (
  props: FinancialMetricProps,
) => {
  return (
    <Box
      gap="10px"
      width="100%"
      display="flex"
      flexDirection="column"
      data-cy="financial-metric"
    >
      <Typography variant="h5">{props.title}</Typography>
      <Box
        gap="13px"
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
      >
        {props.legends.map((legend) => (
          <Box
            gap="5px"
            key={legend.name}
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <Box width={12} height={12} bgcolor={legend.color} />
            <Typography fontSize="12px">{legend.name}</Typography>
          </Box>
        ))}
      </Box>
      <Grid container spacing={4} marginTop="-22px">
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={3}
          display="flex"
          justifyContent="center"
        >
          <Box top="100px" height="fit-content" position="sticky">
            <DonutChart {...props.donutChart} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={9}>
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            borderTop="1px solid #CFD4DA"
          >
            {props.items.map((item) => (
              <ExpandableItem key={item.name} {...item} />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const ExpandableItem: React.FC<FinancialMetricExpandableItemProps> = (
  props: FinancialMetricExpandableItemProps,
) => {
  const [expanded, setExpanded] = React.useState(false);
  const { inView } = useAnimateInView();

  const bgcolor = React.useMemo(() => {
    if (props.level === 0) {
      return "transparent";
    }
    if (props.level === 1) {
      return "#F1F3F5";
    }
    if (props.level === 2) {
      return "#DFE3E5";
    }
  }, [props.level]);

  const startIcon = React.useMemo(() => {
    if (props.items.length === 0) {
      return null;
    }
    if (expanded) {
      return <KeyboardArrowUpIcon fontSize="small" htmlColor="#000" />;
    }
    return <KeyboardArrowDownIcon fontSize="small" htmlColor="#000" />;
  }, [expanded, props.items]);

  return (
    <React.Fragment>
      <Box
        gap="10px"
        width="100%"
        height="38px"
        display="flex"
        padding="0 10px"
        bgcolor={bgcolor}
        flexDirection="row"
        alignItems="center"
        borderBottom="1px solid #CFD4DA"
        sx={{
          "@media (max-width: 767px)": {
            height: "auto",
            paddingTop: "10px",
            flexDirection: "column",
          },
        }}
        data-cy="financial-metric-expandable-item"
      >
        <Box gap="10px" display="flex" flexDirection="row">
          <Typography fontSize="12px" minWidth="50px">
            {props.value.toFixed(1).replace(".0", "")}%
          </Typography>
          <Box
            width="220px"
            height="12px"
            display="flex"
            bgcolor="#CFD4DA"
            justifyContent="flex-start"
          >
            <Box
              height="100%"
              bgcolor={props.color}
              sx={{
                width: inView ? `${props.value}%` : 0,
                transition: "width 1.2s cubic-bezier(0.33, 1, 0.68, 1) 0.2s",
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
              }}
            />
          </Box>
        </Box>
        <Button
          fullWidth
          disableRipple
          startIcon={startIcon}
          sx={{
            fontSize: "12px",
            fontWeight: "400",
            textTransform: "none",
            justifyContent: "flex-start",
            paddingLeft: `${
              (props.level + 1 + (props.items.length === 0 ? 1 : 0)) * 20
            }px`,
            "&:hover": {
              background: "transparent",
            },
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {props.name}
        </Button>
      </Box>
      {expanded && props.items.length > 0 && (
        <React.Fragment>
          {props.items.map((item) => (
            <ExpandableItem key={item.name} {...item} />
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
