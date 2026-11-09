import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ReportBuilderLoadError } from "./index";

const renderError = (error: unknown, itemType: "report" | "asset" = "report") =>
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ReportBuilderLoadError error={error} itemType={itemType} />
    </MemoryRouter>,
  );

const axiosError = (status: number) => ({
  isAxiosError: true,
  response: { status },
});

test.each([
  [403, "report", "You don't have access to this report."],
  [404, "asset", "This asset doesn't exist or has been deleted."],
  [500, "report", "Something went wrong while loading this report."],
] as const)("status %i on a %s shows its message", (status, type, message) => {
  renderError(axiosError(status), type);
  expect(screen.getByRole("alert")).toHaveTextContent(message);
});

test("non-HTTP errors fall back to the generic message", () => {
  renderError(new Error("Network Error"));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Something went wrong while loading this report.",
  );
  expect(
    screen.getByRole("link", { name: "Back to Report Builder" }),
  ).toHaveAttribute("href", "/report-builder");
});
