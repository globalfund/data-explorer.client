import React from "react";
import theme from "app/theme";
import { store } from "app/state/store";
import { ThemeProvider } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import CssBaseline from "@mui/material/CssBaseline";
import { PageLoader } from "app/components/page-loader";
import { shouldRetryQuery } from "app/utils/shouldRetryQuery";
import { StoreProvider, useStoreRehydrated } from "easy-peasy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AppState,
  Auth0Provider,
  Auth0ProviderOptions,
} from "@auth0/auth0-react";

interface ProviderProps {
  children?: any;
}

const Auth0ProviderWithRedirectCallback = (props: Auth0ProviderOptions) => {
  const { children, ...restProps } = props;
  const onRedirectCallback = (appState?: AppState) => {
    window.location.href =
      (appState && appState.returnTo) ?? window.location.pathname;
  };

  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} {...restProps}>
      {children}
    </Auth0Provider>
  );
};

// Created once: a client built during render loses its cache on re-render.
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: shouldRetryQuery } },
});

function Providers(props: ProviderProps) {
  return (
    <HelmetProvider>
      <StoreProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <Auth0ProviderWithRedirectCallback
            domain={import.meta.env.VITE_AUTH0_DOMAIN!}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID!}
            authorizationParams={{
              scope: "openid profile email offline_access",
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              redirect_uri: `${window.location.origin}/callback`,
            }}
          >
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppContainer>{props.children}</AppContainer>
            </ThemeProvider>
          </Auth0ProviderWithRedirectCallback>
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
