import React from "react";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import SearchIcon from "app/assets/vectors/Search_grants.svg?react";
import {
  ToolbarComponentProps,
  GroupedByComponentTableProps,
} from "app/components/results-grouped-table/data";
import {
  getRange,
  getFinancialValueWithMetricPrefix,
} from "app/utils/getFinancialValueWithMetricPrefix";
import Button from "@mui/material/Button";

const rangeSuffixes = ["Bn", "M", "K", ""];

const formatIndicatorValue = (value: number): string => {
  const range = getRange([{ value }], ["value"]);
  return `${getFinancialValueWithMetricPrefix(value, range.index, 1)}${
    rangeSuffixes[range.index]
  }`;
};

export const GroupedByComponentTable: React.FC<GroupedByComponentTableProps> = (
  props: GroupedByComponentTableProps,
) => {
  const handleChange =
    (name: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      props.setExpanded((prev) =>
        isExpanded ? [...prev, name] : prev.filter((item) => item !== name),
      );
    };

  return (
    <Box width="100%">
      {props.data.map((component, index) => (
        <Accordion
          key={component.name}
          disableGutters
          expanded={props.expanded.includes(component.name)}
          onChange={handleChange(component.name)}
          sx={{
            boxShadow: "none",
            borderTop: index === 0 ? "1px solid #CFD4DA" : "none",
            "&::before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            data-cy="grouped-by-component-summary"
            sx={{
              padding: "18px 20px",
              minHeight: "72px",
              "&.Mui-expanded": { minHeight: "72px" },
              "> .MuiAccordionSummary-content": {
                margin: 0,
                alignItems: "center",
                justifyContent: "space-between",
              },
              "& .MuiAccordionSummary-expandIconWrapper": {
                marginLeft: "24px",
              },
              "& .MuiAccordionSummary-expandIconWrapper svg": {
                fontSize: "16px",
              },
            }}
          >
            <Box display="flex" alignItems="center" gap="16px">
              <Box
                width="14px"
                height="14px"
                borderRadius="7px"
                flexShrink={0}
                bgcolor={
                  appColors.CHART_COLORS[index % appColors.CHART_COLORS.length]
                }
              />
              <Box display="flex" alignItems="center" gap="4px">
                <Typography fontSize="20px" fontWeight={700} color="#000000">
                  {component.name}
                </Typography>
                <Typography fontSize="16px" fontWeight={400} color="#70777E">
                  · {component.indicators.length} indicators
                </Typography>
              </Box>
            </Box>
            {!props.expanded.includes(component.name) && (
              <Box display="flex" flexDirection="column" alignItems="flex-end">
                <Typography
                  fontSize="15px"
                  fontWeight={600}
                  lineHeight="19.5px"
                  color="#1B2B4B"
                >
                  {component.numOfCountries}
                </Typography>
                <Typography
                  fontSize="12px"
                  fontWeight={400}
                  lineHeight="15.6px"
                  color="#70777E"
                >
                  Countries reporting
                </Typography>
              </Box>
            )}
          </AccordionSummary>
          <AccordionDetails sx={{ padding: "0 24px 24px" }}>
            <Box display="flex" flexDirection="column" width="100%">
              <Box
                display="flex"
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Box
                  flex={1}
                  padding="14.97px 10px 16.41px"
                  borderBottom="1px solid #CFD4DA"
                >
                  <Typography fontSize="14px" fontWeight={700} color="#70777E">
                    Indicator
                  </Typography>
                </Box>
                <Box
                  width="110px"
                  padding="14.97px 10px 16.41px"
                  borderBottom="1px solid #CFD4DA"
                  textAlign="right"
                >
                  <Typography fontSize="14px" fontWeight={700} color="#70777E">
                    {props.yearSelected ?? "2024"}
                  </Typography>
                </Box>
                <Box
                  width="160px"
                  padding="14.97px 10px 16.41px"
                  borderBottom="1px solid #CFD4DA"
                  textAlign="right"
                >
                  <Typography fontSize="14px" fontWeight={700} color="#70777E">
                    Countries reporting
                  </Typography>
                </Box>
              </Box>
              {component.indicators.map((indicator, indicatorIndex) => {
                const isLastRow =
                  indicatorIndex === component.indicators.length - 1;
                const borderBottom = isLastRow ? "none" : "1px solid #CFD4DA";
                return (
                  <Box
                    key={indicator.name}
                    display="flex"
                    alignItems="stretch"
                    justifyContent="space-between"
                  >
                    <Box
                      flex={1}
                      padding="14.97px 10px 16.41px"
                      borderBottom={borderBottom}
                    >
                      <Typography
                        fontSize="14px"
                        fontWeight={400}
                        color="#1B2B4B"
                      >
                        {indicator.name}
                      </Typography>
                    </Box>
                    <Box
                      width="110px"
                      padding="14.97px 10px 16.41px"
                      borderBottom={borderBottom}
                      textAlign="right"
                    >
                      <Typography
                        fontSize="14px"
                        fontWeight={700}
                        color="#373D43"
                      >
                        {formatIndicatorValue(indicator.value)}
                      </Typography>
                    </Box>
                    <Box
                      width="160px"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      padding="6.97px 10px 8.41px"
                      borderBottom={borderBottom}
                      textAlign="right"
                    >
                      <Typography
                        fontSize="14px"
                        fontWeight={400}
                        color="#373D43"
                      >
                        {indicator.numOfCountries}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export const ToolbarComponent: React.FC<ToolbarComponentProps> = (props) => {
  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setSearchValue(event.target.value);
  };

  return (
    <Box
      sx={{
        gap: "10px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          gap: "6px",
          width: "299px",
          height: "100%",
          display: "flex",
          padding: "5px 10px",
          borderRadius: "5px",
          alignItems: "center",
          border: "1px solid #98a1aa",
          input: {
            padding: 0,
            width: "100%",
            height: "100%",
            borderStyle: "none",
          },
        }}
      >
        <SearchIcon />
        <input
          type="text"
          onChange={onSearchChange}
          placeholder="Search indicators"
        />
      </Box>
      <Button variant="outlined" onClick={props.onExpandAll}>
        {props.buttonLabel}
      </Button>
      <Typography color="#70777e" fontSize="12px">
        {props.label}
      </Typography>
    </Box>
  );
};
