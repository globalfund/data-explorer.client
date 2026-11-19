export interface NotFoundPageProps {
  code?: string;
  variant: "default" | "location" | "grant";
}

export const EXPLORE_MORE_BUTTONS = [
  {
    label: "Homepage",
    description: "Summarised overview of Global Fund data, visualised",
    link: "/",
  },
  {
    label: "Geography",
    description: "Explore results and funding for every country and region",
    link: "/geography",
  },
  {
    label: "Grants",
    description: "Every grant, its status, budget and performance",
    link: "/grants",
  },
  {
    label: "Resource Mobilization",
    description:
      "Government, private sector, non-government and other donor pledges and contributions",
    link: "/resource-mobilization",
  },
  {
    label: "Access to Funding",
    description: "Eligibility, Allocation, and Funding Requests datasets",
    link: "/access-to-funding",
  },
  {
    label: "Financial Insights",
    description:
      "See the disbursements, budgets and expenditures datasets and relating insights",
    link: "/financial-insights",
  },
  {
    label: "Annual Results",
    description: "Indicator results reported as part of annual Results Report",
    link: "/annual-results",
  },
];

export const ADDITIONAL_LINKS = [
  {
    label: "Global Fund Website",
    description: "Main Global Fund website",
    link: "https://www.theglobalfund.org/en",
  },
  {
    label: "Data Service",
    description: "Download the underlying data, or use the API",
    link: "https://data-service.theglobalfund.org",
  },
];
