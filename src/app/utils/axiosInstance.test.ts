import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axiosInstance, { setAccessTokenGetter } from "./axiosInstance";

const sentHeaders: (string | undefined)[] = [];

// Answers each request from `statuses` in turn and records its auth header.
const adapterFor =
  (statuses: number[]) =>
  async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    sentHeaders.push(config.headers.Authorization as string | undefined);
    const status = statuses.shift() ?? 200;
    const response = {
      data: {},
      status,
      statusText: "",
      headers: {},
      config,
    } as AxiosResponse;
    if (status >= 400) {
      throw new AxiosError("failed", undefined, config, undefined, response);
    }
    return response;
  };

const get = (statuses: number[]) =>
  axiosInstance.get("/report/1", {
    adapter: adapterFor(statuses),
    headers: { Authorization: "Bearer stale" },
  });

beforeEach(() => {
  sentHeaders.length = 0;
});
afterEach(() => {
  setAccessTokenGetter(null);
});

test("signed-out requests keep the token they were given", async () => {
  await get([200]);
  expect(sentHeaders).toEqual(["Bearer stale"]);
});

test("signed-in requests use a current token and store it", async () => {
  setAccessTokenGetter(async () => "fresh");
  await get([200]);
  expect(sentHeaders).toEqual(["Bearer fresh"]);
  expect(localStorage.getItem("accessToken")).toBe("fresh");
});

test("a 401 is retried once with a token fetched past the cache", async () => {
  const getter = jest
    .fn()
    .mockResolvedValueOnce("cached")
    .mockResolvedValueOnce("reissued")
    .mockResolvedValue("reissued");
  setAccessTokenGetter(getter);
  await get([401, 200]);
  expect(getter).toHaveBeenNthCalledWith(2, { cacheMode: "off" });
  expect(sentHeaders).toEqual(["Bearer cached", "Bearer reissued"]);
});

test("a second 401 is returned to the caller", async () => {
  setAccessTokenGetter(async () => "fresh");
  await expect(get([401, 401])).rejects.toMatchObject({
    response: { status: 401 },
  });
  expect(sentHeaders).toHaveLength(2);
});

test("an Auth0 failure falls back to the given token", async () => {
  setAccessTokenGetter(async () => {
    throw new Error("login_required");
  });
  await get([200]);
  expect(sentHeaders).toEqual(["Bearer stale"]);
});
