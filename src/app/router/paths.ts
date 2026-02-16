export interface RouteConfig {
  path: string;
  importFrom?: string;
  redirectTo?: string;
  componentName?: string;
  children?: RouteConfig[];
}

// types.ts
export type RouteComponentName =
  | "Home"
  | "Geography"
  | "Grants"
  | "PreGrant"
  | "Grant"
  | "Location"
  | "ResourceMobilizationPage"
  | "AccessToFundingPage"
  | "GrantImplementationPage"
  | "AnnualResultsPage";

export const ROUTE_CONFIGS: RouteConfig[] = [
  { path: "/", componentName: "Home", importFrom: "app/pages/home" },
  {
    path: "/geography",
    componentName: "Geography",
    importFrom: "app/pages/geography",
  },
  { path: "/grants", componentName: "Grants", importFrom: "app/pages/grants" },
  {
    path: "/grant/:id",
    componentName: "PreGrant",
    importFrom: "app/pages/grant",
  },
  {
    path: "/grant/:id/:ip",
    redirectTo: "/grant/:id/:ip/overview",
  },
  {
    path: "/grant/:id/:ip/:tab",
    componentName: "Grant",
    importFrom: "app/pages/grant",
  },
  {
    path: "/location/:id",
    redirectTo: "/location/:id/overview",
  },
  {
    path: "/location/:id/:tab",
    componentName: "Location",
    importFrom: "app/pages/location",
  },
  {
    path: "/resource-mobilization",
    componentName: "ResourceMobilizationPage",
    importFrom: "app/pages/datasets/resource-mobilization",
  },
  {
    path: "/access-to-funding",
    componentName: "AccessToFundingPage",
    importFrom: "app/pages/datasets/access-to-funding",
  },
  {
    path: "/financial-insights",
    componentName: "GrantImplementationPage",
    importFrom: "app/pages/datasets/grant-implementation",
  },
  {
    path: "/annual-results",
    componentName: "AnnualResultsPage",
    importFrom: "app/pages/datasets/annual-results",
  },
  {
    path: "/report-builder",
    componentName: "ReportBuilder",
    importFrom: "app/pages/report-builder/main",
  },
  {
    path: "/report-builder/:id/edit",
    componentName: "ReportBuilderPage",
    importFrom: "app/pages/report-builder/builder",
  },
];
