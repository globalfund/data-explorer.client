import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { DatasetSelectModal } from "./index";

const whoResult = {
  name: "Number of incident tuberculosis cases - Data file: Number of incident tuberculosis cases",
  title: "Number of incident tuberculosis cases",
  file: "",
  summary: "WHO Global Health Observatory indicator TB_e_inc_num.",
  description: "",
  url: "https://ghoapi.azureedge.net/api/TB_e_inc_num",
  source: "WHO",
  category: "Health",
  datePublished: "",
};
const uploaded = {
  id: "65f0c0ffee",
  name: "Clinic visits",
  description: "Uploaded from Clinic visits.csv",
  source: "Upload",
  fileName: "Clinic visits.csv",
  createdDate: "2026-11-10T10:00:00.000Z",
};

const mockQueries = {
  userDatasets: [] as object[],
  search: {
    params: null as { source: string | null; search: string } | null,
    data: undefined as { pages: { data: object[] }[] } | undefined,
    isLoading: false,
    isError: false,
    error: null as unknown,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: jest.fn(),
  },
  connect: {
    mutate: jest.fn(),
    reset: jest.fn(),
    isPending: false,
    isError: false,
    error: null as unknown,
  },
  upload: { mutate: jest.fn(), isPending: false },
};
jest.mock("app/hooks/queries/report-builder", () => ({
  useGFSampleDataset: () => ({ data: undefined, isFetching: false }),
  useUserDatasets: () => ({
    data: { data: mockQueries.userDatasets },
    isLoading: false,
  }),
  useExternalSourceCounts: () => ({
    data: { data: { WHO: 3058, Kaggle: 70 } },
  }),
  useExternalSourceSearch: (params: {
    source: string | null;
    search: string;
  }) => {
    mockQueries.search.params = params;
    return mockQueries.search;
  },
  useConnectExternalDataset: () => mockQueries.connect,
  useUploadDataset: () => mockQueries.upload,
}));
jest.mock("app/state/store/hooks", () => ({
  useStoreState: (selector: (state: object) => unknown) =>
    selector({
      RBReportItemsControllerState: { item: null },
      datasetsLatestUpdate: { data: { data: [] } },
    }),
}));
jest.mock("app/pages/report-builder/hooks/useGetReportItemState", () => ({
  __esModule: true,
  default: () => ({ selectedItem: undefined }),
}));
jest.mock("./view", () => ({ __esModule: true, default: () => null }));
jest.mock("./preview", () => ({ __esModule: true, default: () => null }));

const setup = () => render(<DatasetSelectModal open onClose={jest.fn()} />);

const sourceButton = (id: string) =>
  document.querySelector(`[data-cy="rb-dataset-source-${id}"]`) as HTMLElement;
const uploadInput = () =>
  document.querySelector(
    '[data-cy="rb-dataset-upload-input"]',
  ) as HTMLInputElement;
const selectFile = (name: string) =>
  fireEvent.change(uploadInput(), {
    target: { files: [new File(["a,b\n1,2\n"], name)] },
  });

beforeEach(() => {
  mockQueries.userDatasets = [];
  Object.assign(mockQueries.search, {
    params: null,
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    hasNextPage: false,
  });
  Object.assign(mockQueries.connect, {
    isPending: false,
    isError: false,
    error: null,
  });
  mockQueries.upload.isPending = false;
});

test("lists the Global Fund datasets, and the counts of every source", () => {
  setup();
  expect(sourceButton("global-fund")).toHaveTextContent("Global Fund (7)");
  expect(sourceButton("who")).toHaveTextContent("WHO (3,058)");
  expect(sourceButton("kaggle")).toHaveTextContent("Kaggle (70)");
  expect(sourceButton("my-datasets")).toHaveTextContent("My Datasets (0)");
  expect(screen.getByText("Reported Results")).toBeInTheDocument();
  // External sources are only searched once they are opened.
  expect(mockQueries.search.params?.source).toBeNull();
});

test("searches an external source, and connects the selected dataset", () => {
  mockQueries.search.data = { pages: [{ data: [whoResult] }] };
  setup();
  fireEvent.click(sourceButton("who"));

  expect(mockQueries.search.params?.source).toBe("WHO");
  expect(screen.queryByText("Reported Results")).not.toBeInTheDocument();
  const connect = screen.getByRole("button", { name: "Connect Dataset" });
  expect(connect).toBeDisabled();

  fireEvent.click(screen.getByText(whoResult.title));
  expect(connect).toBeEnabled();
  fireEvent.click(connect);
  expect(mockQueries.connect.mutate.mock.calls[0][0]).toEqual(whoResult);

  // Once connected, the dataset is shown selected under My Datasets.
  mockQueries.userDatasets = [
    { ...uploaded, id: "connected", name: whoResult.title, source: "WHO" },
  ];
  act(() =>
    mockQueries.connect.mutate.mock.calls[0][1].onSuccess({
      data: { id: "connected" },
    }),
  );
  expect(sourceButton("my-datasets")).toHaveAttribute("aria-pressed", "true");
  expect(
    document.querySelector('[data-cy="rb-dataset-card"][data-id="connected"]'),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "View, Filter and Sort" }),
  ).toBeEnabled();
});

test("debounces the search term sent to an external source", () => {
  jest.useFakeTimers();
  try {
    setup();
    fireEvent.click(sourceButton("kaggle"));
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: " malaria " },
    });
    expect(mockQueries.search.params).toMatchObject({
      source: "Kaggle",
      search: "",
    });
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(mockQueries.search.params?.search).toBe("malaria");
  } finally {
    jest.useRealTimers();
  }
});

test("explains loading, empty, failed and partial search results", () => {
  mockQueries.search.isLoading = true;
  const { rerender } = setup();
  fireEvent.click(sourceButton("kaggle"));
  expect(screen.getByText("Searching datasets...")).toBeInTheDocument();

  const update = (state: object) => {
    Object.assign(mockQueries.search, { isLoading: false }, state);
    rerender(<DatasetSelectModal open onClose={jest.fn()} />);
  };
  update({ data: { pages: [{ data: [] }] } });
  expect(screen.getByText(/No datasets found/)).toBeInTheDocument();

  update({
    isError: true,
    error: { response: { data: { error: { message: "Not indexed yet" } } } },
  });
  expect(screen.getByRole("alert")).toHaveTextContent("Not indexed yet");

  update({
    isError: false,
    data: { pages: [{ data: [whoResult] }] },
    hasNextPage: true,
  });
  fireEvent.click(screen.getByRole("button", { name: "Load more" }));
  expect(mockQueries.search.fetchNextPage).toHaveBeenCalled();
});

test("shows why a dataset could not be connected", () => {
  mockQueries.search.data = { pages: [{ data: [whoResult] }] };
  Object.assign(mockQueries.connect, {
    isError: true,
    error: {
      response: { data: { error: { message: "Unable to download." } } },
    },
  });
  setup();
  fireEvent.click(sourceButton("who"));
  expect(screen.getByRole("alert")).toHaveTextContent("Unable to download.");
});

test("uploads a file, and shows it selected under My Datasets", () => {
  setup();
  selectFile("Clinic visits.csv");

  const [file, callbacks] = mockQueries.upload.mutate.mock.calls[0];
  expect(file.name).toBe("Clinic visits.csv");

  mockQueries.userDatasets = [uploaded];
  act(() => callbacks.onSuccess({ data: { id: uploaded.id } }));
  expect(sourceButton("my-datasets")).toHaveTextContent("My Datasets (1)");
  expect(sourceButton("my-datasets")).toHaveAttribute("aria-pressed", "true");
  // Listed as a card, and described in the preview next to it.
  expect(screen.getAllByText("Clinic visits")).toHaveLength(2);
  expect(screen.getByText("Clinic visits.csv")).toBeInTheDocument();
});

test("refuses unsupported files, and reports failed uploads", () => {
  setup();
  selectFile("notes.pdf");
  expect(mockQueries.upload.mutate).not.toHaveBeenCalled();
  expect(screen.getByRole("alert")).toHaveTextContent("Unsupported file type");

  selectFile("broken.csv");
  act(() =>
    mockQueries.upload.mutate.mock.calls[0][1].onError({
      response: { data: { error: { message: "No rows of data found." } } },
    }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("No rows of data found.");
});
