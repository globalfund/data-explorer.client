import React from "react";
import theme from "app/theme";
import { store } from "app/state/store";
import { ThemeProvider } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import CssBaseline from "@mui/material/CssBaseline";
import { PageLoader } from "app/components/page-loader";
import { StoreProvider, useStoreRehydrated } from "easy-peasy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProviderProps {
  children?: any;
}

function Providers(props: ProviderProps) {
  const queryClient = new QueryClient();
  return (
    <HelmetProvider>
      <StoreProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppContainer>{props.children}</AppContainer>
          </ThemeProvider>
        </QueryClientProvider>
      </StoreProvider>
    </HelmetProvider>
  );
}

export default Providers;

function AppContainer(props: ProviderProps) {
  const isRehydrated = useStoreRehydrated();
  if (!isRehydrated) {
    return <PageLoader />;
  }
  return <React.Fragment>{props.children}</React.Fragment>;
}
