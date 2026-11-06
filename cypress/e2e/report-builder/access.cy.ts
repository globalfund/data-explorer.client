import { reportCard, uniqueName } from "../../support/report-builder";

// The main test user owns a private report; the second user tries to reach it.
describe("Report builder: someone else's report", () => {
  let reportId: string;
  let reportName: string;

  beforeEach(() => {
    reportName = uniqueName("private");
    cy.createReport({ name: reportName }, "owner").then((id) => {
      reportId = id;
    });
    cy.login("other");
  });

  afterEach(() => {
    cy.deleteReport(reportId, "owner");
  });

  const noAccessMessage = "You don't have access to this report.";

  it("isn't listed on the other user's dashboard", () => {
    cy.visit("/report-builder");
    cy.get('[data-cy="rb-search"]').type(reportName, { delay: 0 });
    cy.contains("All Reports").should("be.visible");
    reportCard(reportId).should("not.exist");
    cy.contains(reportName).should("not.exist");
  });

  it("shows only a no-access message instead of the preview", () => {
    cy.visit(`/report-builder/reports/${reportId}`);
    cy.get('[role="alert"]').should("contain.text", noAccessMessage);
    cy.contains(reportName).should("not.exist");
    cy.get('[data-cy="rb-report-name"]').should("not.exist");
    cy.contains("button", "Back to Edit").should("not.exist");
    cy.contains("button", "Share").should("not.exist");
  });

  it("shows only a no-access message instead of the editor", () => {
    cy.visit(`/report-builder/reports/${reportId}/edit`);
    cy.get('[role="alert"]').should("contain.text", noAccessMessage);
    // No name to edit, no actions and no side panels.
    cy.get('[data-cy="rb-report-name"]').should("not.exist");
    cy.get('[data-cy="rb-add-component"]').should("not.exist");
    cy.get('[data-cy="rb-preview"]').should("not.exist");
    cy.contains("Layers").should("not.exist");
  });

  it("can't change, delete or duplicate it through the API", () => {
    const asOther = (method: string, path: string, body?: object) =>
      cy
        .api({ method, path, body, failOnStatusCode: false }, "other")
        .its("status");

    asOther("PATCH", `/report/${reportId}`, { name: "Taken over" }).should(
      "eq",
      403,
    );
    asOther("DELETE", `/report/${reportId}`).should("eq", 403);
    asOther("GET", `/report/duplicate/${reportId}`).should("eq", 403);

    cy.api<{ name: string }>({ method: "GET", path: `/report/${reportId}` })
      .its("body.name")
      .should("eq", reportName);
  });
});
