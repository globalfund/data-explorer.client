import {
  openEditor,
  savedItem,
  waitForRequest,
  waitForSave,
} from "../../support/report-builder";

const DATASET = "gf_allocations";
const AMOUNT = "AllocationAmountReferenceRate";

type Row = Record<string, string | number>;

/** A column's total, the way the server formats a big number in billions. */
const totalInBillions = (rows: Row[]) =>
  `${(rows.reduce((sum, row) => sum + Number(row[AMOUNT]), 0) / 1e9).toFixed(2)}b`;

describe("Report builder: KPI boxes", () => {
  let reportId: string;

  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    cy.deleteReport(reportId);
  });

  const kpi = () => cy.get('[data-cy="rb-kpi"]');
  const bigNumber = () => cy.get('[data-cy="rb-kpi-value"]');
  const typeLabel = (label: string, text: string) =>
    cy.get(`[data-cy="rb-kpi-${label}"] input`).clear().type(text);

  const addKpiBox = () => {
    openEditor("kpi boxes").then((id) => {
      reportId = id;
    });
    cy.get('[data-cy="rb-add-component"]').click();
    cy.get('[data-cy="rb-add-kpi_box"]').click();
    cy.focused().type("{esc}");
    kpi().click();
  };

  it("shows the numbers typed into it, in the editor and the preview", () => {
    addKpiBox();
    // New KPI boxes take their numbers as typed.
    typeLabel("topLabel", "Allocated");
    typeLabel("bigNumberText", "US$36 billion");
    typeLabel("bottomLabel", "Since 2017");

    const showsTheNumbers = () => {
      bigNumber().should("have.text", "US$36 billion");
      kpi()
        .should("contain.text", "Allocated")
        .and("contain.text", "Since 2017");
    };
    showsTheNumbers();

    waitForSave(
      "@save",
      (body) => body.items?.[0]?.data?.bottomLabel?.value === "Since 2017",
      30,
    );
    cy.then(() => savedItem(reportId)).then((item) => {
      expect(item.type).to.eq("kpi_box");
      expect(item.data.source).to.eq("manual");
      expect(item.data.topLabel.value).to.eq("Allocated");
      expect(item.data.bigNumberText.value).to.eq("US$36 billion");
    });

    cy.then(() => cy.visit(`/report-builder/reports/${reportId}`));
    showsTheNumbers();
  });

  it("totals a dataset's column, filtered, in the editor and the preview", () => {
    const filters = { Component: ["Malaria"] };
    cy.intercept("POST", "**/report/render-chart-data").as("render");
    cy.fixture(`data-backend/parsed-data-files/${DATASET}.json`)
      .its("dataset")
      .as("allRows");

    addKpiBox();
    cy.get('[data-cy="rb-kpi-source"] input[value="dataset"]')
      .closest("label")
      .click();

    cy.intercept("GET", `**/gf-sample-dataset/${DATASET}`).as("sample");
    cy.get('[data-cy="rb-select-dataset"]').click();
    cy.get(`[data-cy="rb-dataset-card"][data-id="${DATASET}"]`).click();
    // Like charts, KPI boxes skip choosing columns once the sample has loaded.
    cy.wait("@sample");
    cy.get('[data-cy="rb-dataset-next"]').click();
    cy.get('[data-cy="rb-use-dataset"]').click();

    cy.get('[data-cy="rb-kpi-field"] input').click();
    cy.contains('[role="option"]', AMOUNT).click();

    // Summed, the aggregation new KPI boxes start with.
    waitForRequest(
      "@render",
      (body) =>
        body.chartType === "bigNumber" &&
        Cypress._.isEqual(body.mapping.metric.value, [AMOUNT]) &&
        Cypress._.isEqual(body.mapping.metric.config.aggregation, ["sum"]),
    )
      .its("response.body.mappedData.metric")
      .then((metric) => {
        cy.get<Row[]>("@allRows").then((rows) => {
          expect(metric).to.eq(totalInBillions(rows));
        });
        bigNumber().should("have.text", String(metric));
      });

    cy.get('[data-cy="rb-kpi-filters"]').click();
    cy.get('[data-cy="rb-preview-column"][data-id="Component"]')
      .find('[data-cy="rb-filter-column"]')
      // A header's buttons only show while it's hovered.
      .click({ force: true });
    cy.get('[data-cy="rb-column-filter-option"][data-value="Malaria"]')
      .find("input")
      .check();
    cy.get('[data-cy="rb-apply-column-filter"]').click();
    cy.get('[data-cy="rb-use-dataset"]').click();

    waitForRequest("@render", (body) =>
      Cypress._.isEqual(body.appliedFilters, filters),
    )
      .its("response.body.mappedData.metric")
      .then((metric) => {
        cy.get<Row[]>("@allRows").then((rows) => {
          expect(metric).to.eq(
            totalInBillions(rows.filter((row) => row.Component === "Malaria")),
          );
        });
        bigNumber().should("have.text", String(metric));

        waitForSave(
          "@save",
          (body) =>
            Cypress._.isEqual(body.items?.[0]?.data?.appliedFilters, filters) &&
            body.items[0].data.bigNumberText?.value === metric,
          15,
        );
        savedItem(reportId).then((item) => {
          expect(item.data).to.include({
            source: "dataset",
            dataset: DATASET,
            datasetColumn: AMOUNT,
            aggregation: "sum",
          });
          expect(item.data.appliedFilters).to.deep.eq(filters);
        });

        cy.visit(`/report-builder/reports/${reportId}`);
        bigNumber().should("have.text", String(metric));
      });
  });
});
