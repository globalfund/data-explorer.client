import React from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    _paq: any[];
  }
}

export const useRouteListener = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (window.location.hostname === "data.theglobalfund.org" && window._paq) {
      window._paq.push(["setCustomUrl", location.pathname]);
      window._paq.push(["trackPageView"]);
    }
  }, [location.pathname]);

  return location.pathname;
};
