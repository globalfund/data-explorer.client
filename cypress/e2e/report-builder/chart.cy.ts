import {
  barChartItem,
  uniqueName,
  waitForRequest,
  waitForSave,
} from "../../support/report-builder";

// Allocations is small (795 rows), so CI can serve it from cypress/fixtures.
const DATASET = "gf_allocations";
// Allocation amounts summed per continent.
const MAPPING = {
  bars: { value: ["Continent1"], mappedType: ["string"] },
  size: {
    value: ["AllocationAmountReferenceRate"],
    mappedType: ["number"],
    config: { aggregation: ["sum"] },
  },
};

describe("Report builder: charts", () => {
  let reportId: string;

  beforeEach(() => {
    cy.login();
    cy.intercept("POST", "**/report/render-chart-data").as("render");
  });

  afterEach(() => {
    cy.deleteReport(reportId);
  });

  const openEditor = (items: unknown[] = []) => {
    const name = uniqueName("charts");
    cy.createReport({ name, items }).then((id) => {
      reportId = id;
      cy.intercept("PATCH", `**/report/${id}`).as("save");
      cy.visit(`/report-builder/reports/${id}/edit`);
    });
    // Components added before the report has loaded are lost.
    cy.get('[data-cy="rb-report-name"]').should("have.value", name);
  };

  const chart = () => cy.get('[data-cy="rb-chart"]');

  // reportId is only known once openEditor's commands have run.
  const savedChart = () =>
    cy
      .then(() =>
        cy.api<{ items: { type: string; data: Record<string, unknown> }[] }>({
          method: "GET",
          path: `/report/${reportId}`,
        }),
      )
      .its("body.items.0");

  /** Waits for a successful render request whose body matches. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const waitForRender = (matches: (body: any) => boolean) =>
    waitForRequest("@render", matches)
      .its("response.statusCode")
      .should("eq", 200);

  const pickMapping = (dimension: string, column: string) => {
    cy.get(`[data-cy="rb-mapping-field"][data-id="${dimension}"]`).click();
    // Every field keeps its menu mounted, so pick from the open one.
    cy.get(
      `[data-cy="rb-mapping-option"][data-value="${column}"]:visible`,
    ).click();
  };

  it("builds a bar chart from a dataset, a chart type and a mapping", () => {
    openEditor();
    cy.get('[data-cy="rb-add-component"]').click();
    cy.get('[data-cy="rb-add-chart"]').click();
    cy.focused().type("{esc}");
    chart().click();

    cy.intercept("GET", `**/gf-sample-dataset/${DATASET}`).as("sample");
    cy.get('[data-cy="rb-select-dataset"]').click();
    cy.get(`[data-cy="rb-dataset-card"][data-id="${DATASET}"]`).click();
    // Charts skip choosing columns, but only once the sample has loaded.
    cy.wait("@sample");
    cy.get('[data-cy="rb-dataset-next"]').click();
    cy.get('[data-cy="rb-use-dataset"]').click();

    cy.get('[data-cy="rb-select-chartType"]').click();
    cy.get('[data-cy="rb-chart-type-card"][data-id="bar"]').click();
    cy.get('[data-cy="rb-use-chart-type"]').click();

    // Nothing can be rendered until the mapping is complete, so the chart
    // waits without asking the server or showing an error.
    cy.get('[data-cy="rb-select-chartType"]').should("contain.text", "Bar");
    cy.get('[data-cy="rb-chart-error"]').should("not.exist");
    cy.get("@render.all").should("have.length", 0);

    pickMapping("bars", "Continent1");
    pickMapping("size", "AllocationAmountReferenceRate");

    waitForRender(
      (body) =>
        body.datasetId === DATASET &&
        body.chartType === "bar" &&
        Cypress._.isEqual(body.mapping, MAPPING),
    );
    chart().should("contain.text", "Africa").and("contain.text", "Europe");

    waitForSave(
      "@save",
      (body) => Cypress._.isEqual(body.items?.[0]?.data?.mapping, MAPPING),
      15,
    );
    savedChart().then((item) => {
      expect(item.type).to.eq("chart");
      expect(item.data).to.include({ dataset: DATASET, chartType: "bar" });
      expect(item.data.mapping).to.deep.eq(MAPPING);
    });
  });

  it("filters a chart and shows the filtered chart on the preview page", () => {
    openEditor([barChartItem({ dataset: DATASET, mapping: MAPPING })]);
    chart().should("contain.text", "Europe");

    chart().click();
    cy.get('[data-cy="rb-chart-filters"]').click();
    cy.get('[data-cy="rb-filter-field"][data-id="Component"]').click();
    cy.get('[data-cy="rb-filter-value"][data-value="Malaria"]').click();
    cy.get('[data-cy="rb-apply-filter"]').click();

    waitForRender((body) =>
      Cypress._.isEqual(body.appliedFilters, { Component: ["Malaria"] }),
    );
    // None of the malaria allocations are for Europe.
    chart().should("contain.text", "Africa").and("not.contain.text", "Europe");

    waitForSave(
      "@save",
      (body) =>
        Cypress._.isEqual(body.items?.[0]?.data?.appliedFilters, {
          Component: ["Malaria"],
        }),
      15,
    );
    savedChart()
      .its("data.appliedFilters")
      .should("deep.eq", { Component: ["Malaria"] });

    cy.then(() => cy.visit(`/report-builder/reports/${reportId}`));
    chart().should("contain.text", "Africa").and("not.contain.text", "Europe");
  });
});
