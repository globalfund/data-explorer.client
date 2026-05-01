import React from "react";
import Box from "@mui/material/Box";
import { Header } from "app/components/header";
import { Footer } from "app/components/footer";
import Container from "@mui/material/Container";
import { Outlet, useLocation } from "react-router-dom";
import { useUrlFilters } from "app/hooks/useUrlFilters";
import { useRouteListener } from "app/hooks/useRouteListener";
import { useScrollToAnchor } from "app/hooks/useScrollToAnchor";
import { ReportBuilderPageHeader } from "app/pages/report-builder/builder/components/header";
import { useStoreState } from "app/state/store/hooks";

export const Page: React.FC = () => {
  useUrlFilters();
  useRouteListener();
  useScrollToAnchor();

  const location = useLocation();
  const isPanelOpen = useStoreState((s) => s.AiExplorerChats.isPanelOpen);

  const inReportBuilder = React.useMemo(() => {
    return location.pathname.startsWith("/report-builder/");
  }, [location.pathname]);

  const inAiExplorer = React.useMemo(() => {
    return location.pathname.startsWith("/ai-explorer");
  }, [location.pathname]);

  if (inAiExplorer && isPanelOpen) {
    return (
      <React.Fragment>
        <Header />
        <Box id="main" sx={{ width: "100%", minHeight: "calc(100vh - 58px)" }}>
          <Outlet />
        </Box>
        <Footer />
      </React.Fragment>
    );
  }

  if (inReportBuilder) {
    const previewMode =
      location.pathname.includes("/reports/") &&
      !location.pathname.includes("edit");
    return (
      <React.Fragment>
        {previewMode ? <Header /> : <ReportBuilderPageHeader />}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            paddingTop: "50px",
            paddingBottom: "50px",
            bgcolor: "#495057",
            minHeight: "calc(100vh - 60px)",
          }}
        >
          <Box id="main" sx={{ width: "100%", minHeight: "100%" }}>
            <Outlet />
          </Box>
        </Box>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Header />
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          minHeight: "calc(100vh - 58px - 256px - 150px)",
          "@media (max-width: 1200px)": {
            padding: "0 16px",
          },
        }}
      >
        <Box id="main">
          <Outlet />
        </Box>
      </Container>
      <Footer />
    </React.Fragment>
  );
};
