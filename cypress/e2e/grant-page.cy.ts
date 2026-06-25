/// <reference types="cypress" />

// @ts-ignore
const interceptRequests = () => {
  cy.intercept(/ALB-C-MOH/).as("grantData");
};
// @ts-ignore
const waitData = (requestCount: number) => {
  for (let i = 0; i < requestCount; i++) {
    cy.wait("@grantData");
  }
};

describe("Testing The Grant Detail page", () => {
  const apiUrl = Cypress.expose("api_url");

  beforeEach(() => {
    cy.intercept(`${apiUrl}/grants/1/9**`).as("grants");
    interceptRequests();
    cy.visit("/");
    cy.contains("[data-cy=header-menu-button]", "Grants").click();
    cy.wait("@grants");
    cy.get('[data-cy="grants-search-btn"]').click();
    cy.get("[data-cy=grants-search-input]").type("Albania");
    cy.wait("@grants");
    cy.contains("Albania").should("be.visible");

    cy.contains('[data-cy="grant-card"]', "ALB-C-MOH").first().click();

    cy.url().should("include", "/grant/ALB-C-MOH");
  });

  it("should display the grant detail page", () => {
    waitData(7);
    cy.get("h1").should("have.text", "ALB-C-MOH");
    cy.contains("Overview").should("be.visible");
    cy.contains(
      "Scaling up and Ensuring Sustainability of the National Response to HIV",
    ).should("be.visible");
  });

  it("can switch implementation period", () => {
    waitData(7);
    cy.contains(
      '[data-cy="category-dropdown-button"]',
      "Implementation Period 2017-2019",
    ).click();

    cy.contains(
      "[data-cy=category-dropdown-item]",
      "Implementation Period 2014-2016",
    ).click();

    waitData(5);
    cy.contains(
      '[data-cy="category-dropdown-button"]',
      "Implementation Period 2014-2016",
    ).should("be.visible");
  });

  it("Should display the Overview tab", () => {
    waitData(7);
    cy.contains('[data-cy="page-tab-button"]', "Overview").click();
    cy.url().should("include", "/overview");
    cy.contains("Fund Portfolio Manager").should("be.visible");
    cy.contains("Grant Status").should("be.visible");
    cy.contains("Country").should("be.visible");
    cy.contains("Component").should("be.visible");
    cy.contains("Principal Recipient").should("be.visible");
    cy.contains(
      "To ensure that Albania remains a low prevalence country for TB and HIV",
    ).should("be.visible");
    cy.contains("Objectives").should("be.visible");
  });

  it("Should display the Financial Insights tab", () => {
    waitData(7);
    cy.contains('[data-cy="page-tab-button"]', "Financial Insights").click();
    cy.url().should("include", "/financial-insights");

    cy.contains('[data-cy="chart-block"]', "Disbursements").within(() => {
      cy.get('[data-cy="radial-chart"]').should("be.visible");
      cy.get('[data-cy="race-bar-chart"]').should("be.visible");
    });
    cy.contains('[data-cy="chart-block"]', "Grant Budgets").within(() => {
      cy.get('[data-cy="sankey-chart"]').should("be.visible");
    });
  });

  it("Should display the Target & Results tab", () => {
    waitData(7);
    cy.contains('[data-cy="page-tab-button"]', "Target & Results").click();
    cy.url().should("include", "/targets-results");

    cy.contains('[data-cy="chart-block"]', "Indicators").within(() => {
      cy.contains("Targets & Results").should("be.visible");

      cy.contains('[data-cy="table-tab-button"]', "Outcome Indicators").click();
      waitData(1);
      cy.get('[data-cy="table"]').should("be.visible");
    });
  });
});
