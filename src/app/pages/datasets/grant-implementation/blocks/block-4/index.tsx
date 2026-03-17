import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { Dropdown } from "app/components/dropdown";
import { getCMSDataField } from "app/utils/getCMSDataField";
import CircularProgress from "@mui/material/CircularProgress";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useGetDatasetLatestUpdate } from "app/hooks/useGetDatasetLatestUpdate";
import { defaultComponentsGroupingOptions } from "app/pages/datasets/grant-implementation/data";

interface GrantImplementationPageBlock4Props {
  filterString: string;
  geographyGrouping: string;
  componentsGrouping: string;
}

export const GrantImplementationPageBlock4: React.FC<
  GrantImplementationPageBlock4Props
> = (props: GrantImplementationPageBlock4Props) => {
  const cmsData = useCMSData({ returnData: true });
  const latestUpdateDate = useGetDatasetLatestUpdate({
    dataset: "budgets",
  });

  const componentsGroupingOptions = React.useMemo(
    () =>
      getCMSDataField(
        cmsData,
        "pagesDatasetsGrantImplementation.componentsGroupingDropdownOptions",
        defaultComponentsGroupingOptions,
      ),
    [cmsData],
  );

  const dataBudgetBreakdown = useStoreState(
    (state) =>
      get(state.FinancialInsightsBudgetBreakdown, "data.data", []) as {
        name: string;
        value: number;
        color: string;
      }[],
  );
  const fetchBudgetBreakdown = useStoreActions(
    (actions) => actions.FinancialInsightsBudgetBreakdown.fetch,
  );
  const loadingBudgetBreakdown = useStoreState(
    (state) => state.FinancialInsightsBudgetBreakdown.loading,
  );
  const cycles = useStoreState((state) =>
    get(state.BudgetsCycles, "data.data", [])
      .map((cycle: any) => ({
        label: cycle.value,
        value: cycle.value,
      }))
      .reverse(),
  );

  const [budgetBreakdownDropdownSelected, setBudgetBreakdownDropdownSelected] =
    React.useState(cycles.length > 0 ? cycles[0].value : null);

  const handleBudgetBreakdownSelectionChange = (value: string) => {
    setBudgetBreakdownDropdownSelected(value);
  };

  React.useEffect(() => {
    if (budgetBreakdownDropdownSelected) {
      fetchBudgetBreakdown({
        filterString: props.filterString,
        routeParams: {
          year: budgetBreakdownDropdownSelected,
          // year: budgetBreakdownDropdownSelected.replace(/ /g, ""),
          componentField:
            props.componentsGrouping === componentsGroupingOptions[0].value
              ? "activityAreaGroup"
              : "activityArea",
          geographyGrouping: props.geographyGrouping,
        },
      });
    }
  }, [
    budgetBreakdownDropdownSelected,
    props.filterString,
    props.componentsGrouping,
    props.geographyGrouping,
  ]);

  React.useEffect(() => {
    if (cycles.length > 0 && !budgetBreakdownDropdownSelected) {
      setBudgetBreakdownDropdownSelected(cycles[cycles.length - 1].value);
    }
  }, [cycles]);

  return (
    <Box
      gap="20px"
      width="100%"
      display="flex"
      padding="50px 0"
      position="relative"
      flexDirection="column"
      data-cy="budgets-block-2"
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h3">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.budgetBreakdownTitle",
              "Budget Breakdown",
            )}
          </Typography>
          <Typography fontSize="14px">
            {getCMSDataField(
              cmsData,
              "pagesDatasetsGrantImplementation.budgetBreakdownSubtitle",
              "By grant component",
            )}
          </Typography>
        </Box>
        <Box>
          <Dropdown
            dropdownItems={cycles}
            dropdownSelected={budgetBreakdownDropdownSelected}
            handleDropdownChange={handleBudgetBreakdownSelectionChange}
          />
        </Box>
      </Box>
      <Box
        width="100%"
        height="45px"
        display="flex"
        marginTop="40px"
        flexDirection="row"
      >
        {dataBudgetBreakdown.map((i, ix) => (
          <Box
            key={i.name}
            display="flex"
            bgcolor={i.color}
            position="relative"
            alignItems="center"
            width={`${i.value}%`}
            flexDirection="column"
          >
            <Box
              top="-35px"
              fontSize="12px"
              fontWeight="400"
              position="absolute"
              sx={{
                "@media (max-width: 767px)": {
                  top: ix % 2 === 0 ? "-35px" : "auto",
                  bottom: ix % 2 === 1 ? "-35px" : "auto",
                },
              }}
            >
              {i.name} ({i.value.toFixed(2).replace(".00", "")}%)
            </Box>
            <Divider
              orientation="vertical"
              sx={{
                marginTop: "-5px",
                borderColor: i.color,
                "@media (max-width: 767px)": {
                  display: "none",
                },
              }}
            />
          </Box>
        ))}
      </Box>
      <Box>
        <Typography variant="overline">
          {getCMSDataField(
            cmsData,
            "pagesDatasetsGrantImplementation.latestUpdateText",
            "Latest Update",
          )}
          : <b>{latestUpdateDate}</b>
        </Typography>
      </Box>
      {loadingBudgetBreakdown && (
        <Box
          width="100%"
          height="100%"
          display="flex"
          position="absolute"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(255, 255, 255, 0.8)"
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};
