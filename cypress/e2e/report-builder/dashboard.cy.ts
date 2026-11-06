import { E2E_PREFIX } from "../../support/commands";
import { reportCard, uniqueName } from "../../support/report-builder";

describe("Report builder: dashboard", () => {
  const createdReports: string[] = [];

  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    createdReports.splice(0).forEach((id) => cy.deleteReport(id));
  });

  const seedReport = (name: string) =>
    cy.createReport({ name }).then((id) => {
      createdReports.push(id);
      return id;
    });

  const search = (text: string) =>
    cy.get('[data-cy="rb-search"]').clear().type(text, { delay: 0 });

  it("creates a report from the New Report dialog and opens it in the editor", () => {
    const name = uniqueName("created from dialog");
    cy.intercept("POST", "**/report").as("createReport");
    cy.visit("/report-builder");

    cy.get('[data-cy="rb-new-report"]').click();
    cy.get('[data-cy="rb-create-report"]').should("be.disabled");
    cy.get('[data-cy="rb-new-report-name"]').type(name);
    cy.get('[data-cy="rb-new-report-description"]').type(
      "Made by the dashboard spec",
    );
    cy.get('[data-cy="rb-create-report"]').click();

    cy.wait("@createReport").then(({ response }) => {
      const id: string = response?.body.id;
      createdReports.push(id);
      cy.location("pathname").should(
        "eq",
        `/report-builder/reports/${id}/edit`,
      );
    });
    cy.get('[data-cy="rb-report-name"]').should("have.value", name);
  });

  it("finds reports by name, including names with brackets and quotes", () => {
    const tag = `search ${Date.now()}`;
    // The [e2e] prefix and the quotes used to break the search request.
    seedReport(`${E2E_PREFIX} ${tag} "alpha"`).as("alpha");
    seedReport(`${E2E_PREFIX} ${tag} beta`).as("beta");
    cy.visit("/report-builder");

    search(tag);
    cy.get('[data-cy="rb-report-card"]').should("have.length", 2);

    search(`${E2E_PREFIX} ${tag} "alpha"`);
    cy.get('[data-cy="rb-report-card"]').should("have.length", 1);
    cy.get<string>("@alpha").then((id) => reportCard(id).should("exist"));

    search(`${tag} gamma`);
    cy.get('[data-cy="rb-report-card"]').should("not.exist");
  });

  it("deletes a report from its card menu", () => {
    const name = uniqueName("to delete");
    seedReport(name).then((id) => {
      cy.intercept("DELETE", `**/report/${id}`).as("deleteReport");
      cy.visit("/report-builder");
      search(name);

      reportCard(id).find('[data-cy="rb-item-menu-button"]').click();
      cy.get("#rb-item-menu").contains('[role="menuitem"]', "Delete").click();
      cy.get('[data-cy="rb-confirm-delete"]').click();

      cy.wait("@deleteReport").its("response.statusCode").should("eq", 204);
      reportCard(id).should("not.exist");
      cy.api({ method: "GET", path: `/report/${id}`, failOnStatusCode: false })
        .its("status")
        .should("eq", 404);
    });
  });

  it("duplicates a report from its card menu", () => {
    const name = uniqueName("to duplicate");
    seedReport(name).then((id) => {
      cy.intercept("GET", `**/report/duplicate/${id}`).as("duplicate");
      cy.visit("/report-builder");
      search(name);

      reportCard(id).find('[data-cy="rb-item-menu-button"]').click();
      cy.get("#rb-item-menu")
        .contains('[role="menuitem"]', "Duplicate")
        .click();

      cy.wait("@duplicate").then(({ response }) => {
        const copy = response?.body;
        createdReports.push(copy.id);
        expect(copy.name).to.eq(`${name} (Copy)`);
        reportCard(copy.id).should("contain.text", `${name} (Copy)`);
      });
      reportCard(id).should("exist");
    });
  });
});
