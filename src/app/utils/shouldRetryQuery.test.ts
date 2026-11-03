import { shouldRetryQuery } from "./shouldRetryQuery";

const axiosError = (status?: number) => ({
  isAxiosError: true,
  response: status ? { status } : undefined,
});

test.each([400, 401, 403, 404])("does not retry a %i", (status) => {
  expect(shouldRetryQuery(0, axiosError(status))).toBe(false);
});

test("retries server and network errors up to three times", () => {
  for (const error of [
    axiosError(500),
    axiosError(),
    new Error("Network Error"),
  ]) {
    expect(shouldRetryQuery(0, error)).toBe(true);
    expect(shouldRetryQuery(2, error)).toBe(true);
    expect(shouldRetryQuery(3, error)).toBe(false);
  }
});
