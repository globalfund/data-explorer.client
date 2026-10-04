import {
  DEFAULT_TABLE_OPTIONS,
  defaultTableColumns,
  getTableOptions,
  normalizeTableColumns,
  getTableRowLimit,
  getTableRowsPerPageSize,
  getTableCellSizing,
  getRowValue,
  formatTableCellValue,
} from "./options";
import {
  getColumnType,
  getDatasetLatestUpdateKey,
  formatCellValue,
  formatNumber,
} from "../dataset-select-modal/utils";

test("default table options are copied and valid customizations survive", () => {
  const options = getTableOptions();
  expect(options).toEqual(DEFAULT_TABLE_OPTIONS);
  options.width = "20px";
  expect(DEFAULT_TABLE_OPTIONS.width).toBe("100%");
  expect(
    getTableOptions({
      rowsPerPage: "25",
      size: "large",
      display: "list",
      rowStripping: "none",
      colorPalette: "blue",
    }),
  ).toMatchObject({
    rowsPerPage: "25",
    size: "large",
    display: "list",
    rowStripping: "none",
    colorPalette: "blue",
  });
});
test("invalid persisted options fall back safely without mutating input", () => {
  const input = {
    rowsPerPage: "999",
    size: "bad",
    display: "bad",
    rowStripping: "bad",
    colorPalette: "bad",
  };
  expect(getTableOptions(input)).toEqual(DEFAULT_TABLE_OPTIONS);
  expect(input.size).toBe("bad");
});
test.each(["regular", "spacious"])("migrates legacy %s table size", (size) =>
  expect(getTableOptions({ size }).size).toBe("large"),
);
test("normalizes partial columns, removes empty entries, and preserves order", () => {
  expect(normalizeTableColumns()).toEqual(defaultTableColumns);
  expect(normalizeTableColumns([])).toEqual(defaultTableColumns);
  expect(
    normalizeTableColumns([
      {},
      { name: "Country" },
      { id: "amount", type: "number" },
      { id: "year", name: "Year" },
    ]),
  ).toEqual([
    { id: "Country", name: "Country", type: undefined },
    { id: "amount", name: "amount", type: "number" },
    { id: "year", name: "Year", type: undefined },
  ]);
});
test.each([
  ["10", 10],
  ["3.9", 3],
  ["0", 1],
  ["-5", 1],
  ["abc", 1],
  ["Infinity", 1],
])("row limit %s resolves to %s", (input, expected) =>
  expect(getTableRowLimit(getTableOptions({ limitToTopValue: input }))).toBe(
    expected,
  ),
);
test.each(["5", "10", "25", "50"])("supports %s rows per page", (rowsPerPage) =>
  expect(getTableRowsPerPageSize(getTableOptions({ rowsPerPage }))).toBe(
    Number(rowsPerPage),
  ),
);
test("uses appropriate cell dimensions", () => {
  expect(getTableCellSizing("large")).toEqual({
    height: "48px",
    padding: "12px",
  });
  expect(getTableCellSizing("compact")).toEqual({
    height: "31px",
    padding: "8px",
  });
});
test("row lookup preserves zero and false and falls back to display name", () => {
  const column = { id: "id", name: "label" };
  expect(getRowValue({ id: 0, label: 5 }, column)).toBe(0);
  expect(getRowValue({ id: false, label: true }, column)).toBe(false);
  expect(getRowValue({ id: null, label: "fallback" }, column)).toBe("fallback");
  expect(getRowValue({}, column)).toBeUndefined();
});
test.each([
  [null, "-"],
  [undefined, "-"],
  ["", "-"],
  [0, "0"],
  [1234.5, "1,234.5"],
  [false, "False"],
  [true, "True"],
  [{ a: 1 }, '{"a":1}'],
  [[1, 2], "[1,2]"],
  ["Country", "Country"],
])("formats table and dataset value %p", (value, expected) => {
  expect(formatTableCellValue(value)).toBe(expected);
  expect(formatCellValue(value)).toBe(expected);
});
test.each(["number", "date", "date-time", "boolean", "geographical", "string"])(
  "supports raw and structured %s metadata",
  (type) => {
    expect(getColumnType(type)).toBe(type);
    expect(getColumnType({ type })).toBe(type);
  },
);
test.each([undefined, {}, "unsupported"])(
  "unknown metadata %p falls back to text",
  (type) => expect(getColumnType(type)).toBe("string"),
);
test.each([
  ["gf_results", "results"],
  ["gf_pledges_contributions", "pledges-contributions"],
  ["gf_eligibility", "eligibility"],
  ["gf_allocations", "allocations"],
  ["gf_grant_implementation", "grants"],
  ["gf_grant_commitments", "commitments"],
  ["gf_grant_disbursements", "disbursements"],
  ["unknown", ""],
])("maps dataset %s to update key %s", (id, key) =>
  expect(getDatasetLatestUpdateKey(id)).toBe(key),
);
test("formats counts including zero and missing values", () => {
  expect(formatNumber(1234)).toBe("1,234");
  expect(formatNumber(0)).toBe("0");
  expect(formatNumber()).toBe("-");
});
