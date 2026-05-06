import { DatasetGroup } from "app/pages/ai-explorer/types";

export const GLOBAL_FUND_DATASET_GROUPS: DatasetGroup[] = [
  {
    id: "financial",
    label: "Financial Datasets",
    datasets: [
      {
        id: "grant-agreements",
        name: "Grant Agreements",
        description:
          "One row per signed grant. Fields include grant number, country/multicountry, disease component (HIV/TB/Malaria/RSSH), principal recipient name and type (government, NGO, multilateral), grant status (active/closed), signed amount (USD), total committed and disbursed amounts, program start and end dates, board approval date, funding mechanism, and allocation cycle.",
      },
      {
        id: "grant-implementation-periods",
        name: "Grant Agreement Implementation Periods",
        description:
          'One row per implementation period (typically 3 years) within a grant. Fields include grant number, implementation period number, start and end dates, budget amount, disbursed amount, expenditure amount, principal recipient, and allocation cycle name (e.g., "2023-2025").',
      },
      {
        id: "grant-disbursements",
        name: "Grant Agreement Disbursements",
        description:
          "Individual cash transfers from the Global Fund to principal recipients. Fields include grant number, disbursement date, disbursement amount (USD and original currency), implementation period, and cumulative disbursement total.",
      },
      {
        id: "grant-commitments",
        name: "Grant Agreement Commitments",
        description:
          "Commitment records per grant. Fields include grant number, commitment amount, commitment date, and linked implementation period.",
      },
      {
        id: "grant-budgets",
        name: "Grant Budgets",
        description:
          'Budgets at intervention-level granularity. Fields include grant number, implementation period, module name (e.g., "Treatment, care & support"), intervention name (e.g., "Antiretroviral treatment"), cost category (e.g., human resources, health products, travel), budget amount, and year.',
      },
      {
        id: "grant-expenditures",
        name: "Grant Expenditures",
        description:
          "Actual spend at intervention level, paired with budgets for absorption analysis. Fields mirror grant budgets: grant number, implementation period, module, intervention, cost category, expenditure amount, and reporting period.",
      },
      {
        id: "financial-metrics",
        name: "Financial Metrics",
        description:
          "Pre-calculated ratios at the implementation-period level: budget utilization, in-country absorption (expenditure / disbursement), and disbursement utilization (disbursement / budget). Fields include grant number, implementation period, signed amount, total budget, total disbursed, total expenditure, and the three utilization ratios.",
      },
      {
        id: "pledges-contributions",
        name: "Pledges and Contributions",
        description:
          "Donor-level resource-mobilization data. Fields include donor name, donor type (government, private sector, foundation), replenishment period (1st through 8th), pledge amount, contribution amount, currency, and fulfillment status.",
      },
      {
        id: "allocations",
        name: "Allocations",
        description:
          "Country-level funding allocations by disease component and allocation cycle. Fields include country, component, allocation period, allocation amount (USD), and utilization information.",
      },
    ],
  },
  {
    id: "results",
    label: "Results and Programmatic Datasets",
    datasets: [
      {
        id: "reported-results",
        name: "Reported Results / Performance Frameworks",
        description:
          'Indicator-level targets and actuals per grant and implementation period. Fields include grant number, country, component, indicator code and name (e.g., "Number of people on ART," "TB treatment success rate," "LLINs distributed"), indicator category (impact/outcome/coverage/output), baseline value, target value, result value, achievement rate, reporting period, and disaggregation dimensions (age, gender).',
      },
      {
        id: "progress-updates",
        name: "Grant Agreement Progress Updates",
        description:
          "Periodic performance ratings. Fields include grant number, progress update period, performance rating (A1, A2, B1, B2, C scale), and implementation period.",
      },
    ],
  },
  {
    id: "eligibility",
    label: "Eligibility and Governance Datasets",
    datasets: [
      {
        id: "eligibility",
        name: "Eligibility",
        description:
          "Country eligibility by disease component and allocation cycle. Fields include country name, ISO code, component, World Bank income level, disease burden classification, eligibility status, and allocation cycle.",
      },
      {
        id: "covid-response",
        name: "COVID-19 Response Funding",
        description:
          "Funding approved through the C19RM and grant flexibilities. Fields include country, funding mechanism, approved amount (USD), component, and approval date. Available as a downloadable report.",
      },
    ],
  },
  {
    id: "pqr",
    label: "PQR Supply Chain and Procurement",
    datasets: [
      {
        id: "pqr-price-reference",
        name: "PQR Price Reference Report",
        description:
          "Aggregated reference prices for key health products, useful as benchmarks. Includes product, dosage, pack size, median price, interquartile range, and number of transactions. Note: PQR Data is not yet integrated, but interesting for future integrations.",
      },
      {
        id: "pqr-transaction-summary",
        name: "PQR Transaction Summary",
        description:
          "Transaction-level procurement records for health products purchased with Global Fund resources across countries. Fields include product category (ARVs, antimalarials, anti-TB drugs, LLINs, diagnostics, condoms), product name, dosage/strength, supplier/manufacturer name and country, unit price (USD), quantity, total cost, shipping/freight costs, purchase order date, delivery date, country and grant information, procurement mechanism (PPM vs. non-PPM), and verification status. Note: PQR Data is not yet integrated, but interesting for future integrations.",
      },
    ],
  },
];

export const AVAILABLE_DATASETS = [
  "Reported Results",
  "Pledges & Contributions",
  "Country Eligibility",
  "Grant Implementation Periods",
  "Grant Commitments",
  "Grant Disbursements",
  "Grant Budgets",
  "Grant Expenditures",
  "Grant Targets and Results",
];
