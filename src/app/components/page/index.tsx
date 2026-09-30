import React from "react";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import { Header } from "app/components/header";
import { Footer } from "app/components/footer";
import Container from "@mui/material/Container";
import { useUrlFilters } from "app/hooks/useUrlFilters";
import { useRouteListener } from "app/hooks/useRouteListener";
import { useScrollToAnchor } from "app/hooks/useScrollToAnchor";

export const Page: React.FC = () => {
  useUrlFilters();
  const currentPath = useRouteListener();
  useScrollToAnchor();
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
      {currentPath === "/opex" && (
        <>
          <Divider sx={{ width: "100vw" }} />
          <Container
            maxWidth="lg"
            disableGutters
            sx={{
              "@media (max-width: 1200px)": {
                padding: "0 16px",
              },
            }}
          >
            <Typography
              fontSize="14px"
              fontWeight="400"
              color="#373D43"
              padding="20px 0"
            >
              Operating expenditure, 2017-2026 · The Global Fund Data Explorer ·
              demonstration built with forecast 2026 data
            </Typography>
          </Container>
        </>
      )}
      <Footer />
    </React.Fragment>
  );
};
