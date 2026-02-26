import { Page } from "app/components/page";
import React from "react";
import { Header } from "app/components/header";
import { Footer } from "app/components/footer";
import { Navigate, RouteObject, useParams } from "react-router-dom";
import { Redirect } from "app/components/redirect";
import { Location } from "app/pages/location";
import { Home } from "app/pages/home";
import { AccessToFundingPage } from "app/pages/datasets/access-to-funding";
import { AnnualResultsPage } from "app/pages/datasets/annual-results";
import { GrantImplementationPage } from "app/pages/datasets/grant-implementation";
import { ResourceMobilizationPage } from "app/pages/datasets/resource-mobilization";
import { Geography } from "app/pages/geography";
import { PreGrant, Grant } from "app/pages/grant";
import { Grants } from "app/pages/grants";
import { ROUTE_CONFIGS } from "app/router/paths";
import { ReportBuilder } from "app/pages/report-builder/main";
import { ReportBuilderPage } from "app/pages/report-builder/builder";
import { ReportBuilderPreviewPage } from "app/pages/report-builder/preview";

const DetailPageRedirect: React.FC<{
  type: "location" | "partner" | "grant";
}> = (props) => {
  const { code } = useParams<{ code: string }>();
  if (!code) return null;
  return <Navigate to={`/${props.type}/${code}`} replace />;
};

const REDIRECT_ROUTES: RouteObject[] = [
  {
    path: "/datasets",
    element: <Redirect to="/" />,
  },
  {
    path: "/grants/:subType",
    element: <Redirect to="/grants" />,
  },
  {
    path: "/results",
    element: <Redirect to="/annual-results" />,
  },
  {
    path: "/documents",
    element: <Redirect to="/" />,
  },
  {
    path: "/viz/:vizType?/:subType?",
    element: <Redirect to="/" />,
  },
  {
    path: "/location/:code/:vizType?/:subType?",
    element: <DetailPageRedirect type="location" />,
  },
  {
    path: "/locations/:code/:vizType?/:subType?",
    element: <DetailPageRedirect type="location" />,
  },
  {
    path: "/partner/:code/:vizType?/:subType?",
    element: <DetailPageRedirect type="partner" />,
  },
  {
    path: "/partners/:code/:vizType?/:subType?",
    element: <DetailPageRedirect type="partner" />,
  },
  {
    path: "/grant/:id/:period?/:vizType?/:subType?",
    element: <DetailPageRedirect type="grant" />,
  },
  {
    path: "/grants/:id/:period?/:vizType?/:subType?",
    element: <DetailPageRedirect type="grant" />,
  },
];

const COMPONENT_MAP: Record<string, React.ComponentType> = {
  Home,
  Geography,
  Grants,
  PreGrant,
  Grant,
  Location,
  ResourceMobilizationPage,
  AccessToFundingPage,
  GrantImplementationPage,
  AnnualResultsPage,
  ReportBuilder,
  ReportBuilderPage,
  ReportBuilderPreviewPage,
};

const NON_REDIRECT_ROUTES = ROUTE_CONFIGS.map((config) => {
  if (config.redirectTo) {
    return {
      path: config.path,
      element: <Redirect to={config.redirectTo} />,
    };
  }

  const Component = COMPONENT_MAP[config.componentName!];
  return {
    path: config.path,
    element: <Component />,
    children: config.children?.map((child) => {
      const ChildComponent = COMPONENT_MAP[child.componentName!];
      return {
        path: child.path,
        element: <ChildComponent />,
      };
    }),
  };
});

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <Page />,
    ErrorBoundary: () => (
      <React.Fragment>
        <Header />
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 58px - 256px - 150px)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            It seems like you have encountered an error.
            <br />
            Please try refreshing the page or{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.theglobalfund.org/en/contact/"
            >
              contact us
            </a>{" "}
            if the issue persists.
          </div>
        </div>
        <Footer />
      </React.Fragment>
    ),
    children: [
      ...NON_REDIRECT_ROUTES,
      ...REDIRECT_ROUTES,
      {
        path: "*",
        element: (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "calc(100vh - 91px - 256px - 150px)",
            }}
          >
            Page not found
          </div>
        ),
      },
    ],
  },
];
