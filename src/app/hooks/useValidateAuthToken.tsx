import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setAccessTokenGetter } from "app/utils/axiosInstance";

export const useValidateAuthToken = () => {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // Only while signed in: for anonymous visitors Auth0 would make a network
  // round trip on every API call just to find out there is no session.
  React.useEffect(() => {
    setAccessTokenGetter(isAuthenticated ? getAccessTokenSilently : null);
    return () => setAccessTokenGetter(null);
  }, [isAuthenticated, getAccessTokenSilently]);

  React.useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      localStorage.removeItem("accessToken");
      return;
    }

    const hasRunInThisTab = sessionStorage.getItem(
      "validateAuthTokenOnFirstLoadDone",
    );

    if (hasRunInThisTab) {
      return;
    }

    sessionStorage.setItem("validateAuthTokenOnFirstLoadDone", "true");

    const token = localStorage.getItem("accessToken");

    if (token) {
      fetch(`${import.meta.env.VITE_API}/auth/validate-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            getAccessTokenSilently().then((newToken) => {
              localStorage.setItem("accessToken", newToken);
            });
          }
        })
        .catch(() => {
          getAccessTokenSilently().then((newToken) => {
            localStorage.setItem("accessToken", newToken);
          });
        });
    } else {
      getAccessTokenSilently().then((newToken) => {
        localStorage.setItem("accessToken", newToken);
      });
    }
  }, [isAuthenticated, isLoading]);
};
