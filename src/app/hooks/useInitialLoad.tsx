import React from "react";
import { useStoreActions } from "app/state/store/hooks";

export const useInitialLoad = () => {
  const fetchAllocationsCycles = useStoreActions(
    (actions) => actions.AllocationsCycles.fetch,
  );
  const fetchAnnualResultsCycles = useStoreActions(
    (actions) => actions.AnnualResultsCycles.fetch,
  );
  const fetchDisbursementsCycles = useStoreActions(
    (actions) => actions.DisbursementsCycles.fetch,
  );
  const fetchExpendituresCycles = useStoreActions(
    (actions) => actions.ExpendituresCycles.fetch,
  );
  const fetchEligibilityCycles = useStoreActions(
    (actions) => actions.EligibilityCycles.fetch,
  );
  const fetchPledgesContributionsCycles = useStoreActions(
    (actions) => actions.PledgesContributionsCycles.fetch,
  );
  const fetchFundingRequestsCycles = useStoreActions(
    (actions) => actions.FundingRequestsCycles.fetch,
  );
  const fetchBudgetsCycles = useStoreActions(
    (actions) => actions.BudgetsCycles.fetch,
  );
  const fetchFinancialMetricsCycles = useStoreActions(
    (actions) => actions.FinancialMetricsCycles.fetch,
  );
  const fetchOpexYears = useStoreActions((actions) => actions.OpexYears.fetch);
  const fetchDonorFilterOptions = useStoreActions(
    (actions) => actions.DonorFilterOptions.fetch,
  );
  const fetchReplenishmentPeriodFilterOptions = useStoreActions(
    (actions) => actions.ReplenishmentPeriodFilterOptions.fetch,
  );
  const fetchLocationFilterOptions = useStoreActions(
    (actions) => actions.LocationFilterOptions.fetch,
  );
  const fetchComponentFilterOptions = useStoreActions(
    (actions) => actions.ComponentFilterOptions.fetch,
  );
  const fetchPartnerTypeFilterOptions = useStoreActions(
    (actions) => actions.PartnerTypeFilterOptions.fetch,
  );
  const fetchStatusFilterOptions = useStoreActions(
    (actions) => actions.StatusFilterOptions.fetch,
  );
  const datasetsLatestUpdate = useStoreActions(
    (actions) => actions.datasetsLatestUpdate.fetch,
  );

  React.useEffect(() => {
    fetchAllocationsCycles({});
    fetchAnnualResultsCycles({});
    fetchDisbursementsCycles({});
    fetchExpendituresCycles({});
    fetchEligibilityCycles({});
    fetchPledgesContributionsCycles({});
    fetchFundingRequestsCycles({});
    fetchBudgetsCycles({});
    fetchFinancialMetricsCycles({});
    fetchOpexYears({});
    fetchDonorFilterOptions({});
    fetchReplenishmentPeriodFilterOptions({});
    fetchLocationFilterOptions({
      routeParams: {
        type: "Standard View",
      },
    });
    fetchComponentFilterOptions({
      routeParams: {
        type: "grouped",
      },
    });
    fetchPartnerTypeFilterOptions({});
    fetchStatusFilterOptions({});
    datasetsLatestUpdate({});
  }, []);

  return null;
};
