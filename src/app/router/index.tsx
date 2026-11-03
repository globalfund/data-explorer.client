import React from "react";
import { ROUTES } from "app/router/data";
import { useInitialLoad } from "app/hooks/useInitialLoad";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
export default function Router() {
  useInitialLoad();
  const setUpRouter = () => {
    const result: RouteObject[] = ROUTES;
    return createBrowserRouter(result);
  };

  const [router] = React.useState(setUpRouter);

  // React Router 7 removed RouterProvider's `fallbackElement` (<PageLoader />).
  // It only rendered while route loaders ran, and these routes have none. If
  // loaders are added, use a route-level `HydrateFallback` instead.
  return <RouterProvider router={router} />;
}
