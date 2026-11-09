import { E2E_PREFIX } from "../../support/commands";

// Smoke test for the logged-in setup itself: if this fails, check
// cypress/README.md before looking at the other report builder specs.
describe("Report builder: signed in", () => {
  const createdReports: string[] = [];

  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    createdReports.splice(0).forEach((id) => cy.deleteReport(id));
  });

  it("opens the dashboard as the test user", () => {
    cy.visit("/report-builder");
    cy.contains("All Reports").should("be.visible");
    cy.location("pathname").should("eq", "/report-builder");
  });

  it("opens a report it owns in the editor", () => {
    const name = `${E2E_PREFIX} login smoke ${Date.now()}`;
    cy.createReport({ name }).then((id) => {
      createdReports.push(id);
      cy.visit(`/report-builder/reports/${id}/edit`);
      cy.get(`input[value="${name}"]`).should("be.visible");
      cy.location("pathname").should(
        "eq",
        `/report-builder/reports/${id}/edit`,
      );
    });
  });
});
