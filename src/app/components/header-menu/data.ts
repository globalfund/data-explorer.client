import { colors } from "app/theme";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { isStagingEnv } from "app/utils/environment";

export interface HeaderMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface HeaderMenuPage {
  id: string;
  label: string;
  link?: string;
  description?: string;
  subPages?: HeaderMenuPage[];
  style?: React.CSSProperties;
  activeButtonStateStyle?: React.CSSProperties;
}

export const getPages = (cmsData: any): HeaderMenuPage[] => {
  const PAGES: HeaderMenuPage[] = [
    {
      id: "datasets",
      label: getCMSDataField(
        cmsData,
        "componentsHeader.datasetsLabel",
        "Datasets",
      ),
      subPages: [
        {
          id: "resource-mobilization",
          label: getCMSDataField(
            cmsData,
            "componentsHeader.resourceMobilizationLabel",
            "Resource Mobilization",
          ),
          link: "/resource-mobilization",
          description: getCMSDataField(
            cmsData,
            "componentsHeader.resourceMobilizationDescription",
            "Pledges & Contributions Dataset.",
          ),
        },
        {
          id: "access-to-funding",
          label: getCMSDataField(
            cmsData,
            "componentsHeader.accessToFundingLabel",
            "Access to Funding",
          ),
          link: "/access-to-funding",
          description: getCMSDataField(
            cmsData,
            "componentsHeader.accessToFundingDescription",
            "Eligibility, Allocation, and Funding Request Datasets.",
          ),
        },
        {
          id: "financial-insights",
          label: getCMSDataField(
            cmsData,
            "componentsHeader.financialInsightsLabel",
            "Financial Insights",
          ),
          link: "/financial-insights",
          description: getCMSDataField(
            cmsData,
            "componentsHeader.financialInsightsDescription",
            "Disbursement, Financial Metrics, Budgets, and Expenditures Datasets.",
          ),
        },
        {
          id: "annual-results",
          label: getCMSDataField(
            cmsData,
            "componentsHeader.annualResultsLabel",
            "Annual Results",
          ),
          link: "/annual-results",
          description: getCMSDataField(
            cmsData,
            "componentsHeader.annualResultsDescription",
            "Annual Results Dataset and Documents.",
          ),
        },
        // {
        //   id: "documents",
        //   label: "Documents",
        //   link: "/documents",
        // },
      ],
    },
    {
      id: "geography",
      label: getCMSDataField(
        cmsData,
        "componentsHeader.geographyLabel",
        "Geography",
      ),
      link: "/geography",
    },
    {
      id: "grants",
      label: getCMSDataField(cmsData, "componentsHeader.grantsLabel", "Grants"),
      link: "/grants",
    },
    {
      id: "my-reports",
      label: getCMSDataField(
        cmsData,
        "componentsHeader.myReportsLabel",
        "My Reports",
      ),
      link: "/report-builder",
      style: { color: "#3154F4" },
      activeButtonStateStyle: { borderBottom: "4px solid #3154F4" },
    },
  ];

  if (isStagingEnv()) {
    PAGES.push({
      id: "ai-explorer",
      label:
        getCMSDataField(
          cmsData,
          "componentsHeader.aiExplorerLabel",
          "AI Explorer",
        ) || "AI Explorer",
      link: "/ai-explorer",
    });
  }

  return PAGES;
};

export function isNavButtonActive(id: string, path: string): boolean {
  switch (id) {
    case "datasets":
      return (
        (path.includes("/resource-mobilization") ||
          path.includes("/access-to-funding") ||
          path.includes("/financial-insights") ||
          path.includes("/annual-results")) &&
        !path.includes("/location") &&
        !path.includes("/grant")
      );
    case "geography":
      return path.includes("/geography") || path.includes("/location");
    case "grants":
      return path.includes("/grants") || path.includes("/grant");
    case "my-reports":
      return path.includes("/report-builder");
    case "ai-explorer":
      return path.includes("/ai-explorer");
    default:
      return id === path.split("/")[1];
  }
}

export const activeButtonStateStyle = {
  borderBottom: `4px solid ${colors.primary.black}`,
};
