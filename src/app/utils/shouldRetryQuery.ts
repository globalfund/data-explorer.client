import { isAxiosError } from "axios";

// 4xx responses (no access, deleted, bad input) won't change on retry, so fail
// fast and let the page show the error. Everything else keeps the default 3.
export const shouldRetryQuery = (failureCount: number, error: unknown) => {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  if (status && status >= 400 && status < 500) return false;
  return failureCount < 3;
};
