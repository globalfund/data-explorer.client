// Shared with the Cypress login helper, which has to write tokens under the
// exact scope the Auth0 SDK looks them up with.
export const AUTH0_SCOPE = "openid profile email offline_access";

// Only end-to-end test builds set VITE_AUTH0_CACHE_LOCATION=localstorage, so
// Cypress can sign in by writing tokens to localStorage instead of going
// through Auth0's login page. Everything else keeps the in-memory cache.
export const getAuth0CacheLocation = (
  value: string | undefined,
): "localstorage" | "memory" =>
  value === "localstorage" ? "localstorage" : "memory";
