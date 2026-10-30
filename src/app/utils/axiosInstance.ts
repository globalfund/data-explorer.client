import axios, { InternalAxiosRequestConfig } from "axios";

type AccessTokenGetter = (options?: {
  cacheMode?: "on" | "off";
}) => Promise<string>;

// Set from inside the Auth0 provider (see useValidateAuthToken) while the user
// is signed in. Auth0 returns its cached token and refreshes it when expired.
let getAccessToken: AccessTokenGetter | null = null;

export const setAccessTokenGetter = (getter: AccessTokenGetter | null) => {
  getAccessToken = getter;
};

const fetchAccessToken = async (cacheMode: "on" | "off" = "on") => {
  if (!getAccessToken) return null;
  try {
    const token = await getAccessToken({ cacheMode });
    localStorage.setItem("accessToken", token);
    return token;
  } catch {
    // Not signed in any more, or Auth0 is unreachable: send the request with
    // whatever token it already has and let the API answer.
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API,
  timeout: 120000,
});

// Callers still pass the token from localStorage, which is only refreshed on
// page load and goes stale once it expires, so replace it with a current one.
axiosInstance.interceptors.request.use(async (config) => {
  const token = await fetchAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & {
  retriedWithFreshToken?: boolean;
};

// A 401 can still happen if the token was revoked or expired in flight: retry
// once with a token fetched from Auth0 rather than its cache.
axiosInstance.interceptors.response.use(undefined, async (error) => {
  const config = error?.config as RetriableConfig | undefined;
  if (
    error?.response?.status === 401 &&
    config &&
    !config.retriedWithFreshToken &&
    getAccessToken
  ) {
    config.retriedWithFreshToken = true;
    const token = await fetchAccessToken("off");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return axiosInstance(config);
    }
  }
  return Promise.reject(error);
});

export default axiosInstance;
