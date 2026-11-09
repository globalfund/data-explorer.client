import { getAuth0CacheLocation } from "./auth0Config";

test("only the explicit test setting stores Auth0 tokens in localStorage", () => {
  expect(getAuth0CacheLocation("localstorage")).toBe("localstorage");
  expect(getAuth0CacheLocation(undefined)).toBe("memory");
  expect(getAuth0CacheLocation("")).toBe("memory");
  expect(getAuth0CacheLocation("LOCALSTORAGE")).toBe("memory");
});
