import React from "react";
import { render, screen } from "@testing-library/react";
import { ReportItemErrorBoundary } from "./error-boundary";

const Broken: React.FC<{ fail: boolean }> = ({ fail }) => {
  if (fail) throw new Error("bad item data");
  return <div>chart content</div>;
};

const renderItem = (item: { fail: boolean }, viewMode = false) => (
  <>
    <ReportItemErrorBoundary
      itemId="chart-1"
      itemType="chart"
      resetKey={item}
      viewMode={viewMode}
    >
      <Broken fail={item.fail} />
    </ReportItemErrorBoundary>
    <div>next item</div>
  </>
);

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

test("a crashing item shows a message and leaves the rest of the report", () => {
  render(renderItem({ fail: true }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "This chart couldn't be displayed. Try changing its settings, or delete it.",
  );
  expect(screen.getByText("next item")).toBeInTheDocument();
});

test("view mode leaves out the editing advice", () => {
  render(renderItem({ fail: true }, true));
  expect(screen.getByRole("alert")).toHaveTextContent(
    /^This chart couldn't be displayed\.$/,
  );
});

test("the item renders again once it changes", () => {
  const { rerender } = render(renderItem({ fail: true }));
  expect(screen.getByRole("alert")).toBeInTheDocument();
  rerender(renderItem({ fail: false }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByText("chart content")).toBeInTheDocument();
});
