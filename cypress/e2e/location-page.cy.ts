/// <reference types="cypress" />

// @ts-ignore
const interceptRequests = () => {
  cy.intercept(/KEN/).as("locationData");
};
// @ts-ignore
const waitData = (requestCount: number = 22) => {
  for (let i = 0; i < requestCount; i++) {
    cy.wait("@locationData");
  }
};

describe("Testing The Location page", () => {
  const apiUrl = Cypress.expose("api_url");

  beforeEach(() => {
    cy.intercept(`${apiUrl}/geographies`).as("geographies");
    cy.intercept(`${apiUrl}/location/KEN/info`).as("locationInfo");
    interceptRequests();

    cy.visit("/");
    cy.contains("[data-cy=header-menu-button]", "Geography").click();
    cy.wait("@geographies");
    cy.get("[data-cy=geography-search-input]").type("Kenya");
    cy.contains("Kenya").first().scrollIntoView().click();
  });

  it("should display the location page", () => {
    cy.wait("@locationInfo");
    cy.get("h1").should("have.text", "Kenya");
    cy.contains("Overview").should("be.visible");
  });

  it("Should display the Overview tab", () => {
    waitData();
    cy.contains('[data-cy="page-tab-button"]', "Overview").click();
    cy.url().should("include", "/location/KEN/overview");
    cy.contains("Fund Portfolio Manager").should("be.visible");
  });

  it("Should display the Access to Funding tab", () => {
    waitData();
    cy.contains('[data-cy="page-tab-button"]', "Access to Funding").click();
    cy.url().should("include", "/location/KEN/access-to-funding");
    cy.contains('[data-cy="chart-block"]', "Funds Allocated 2023-2025")
      .within(() => {
        cy.get('[data-cy="radial-chart"]').should("be.visible");
      })
      .should("be.visible");
    cy.contains('[data-cy="chart-block"]', "Submitted for 2023-2025").within(
      () => {
        cy.get('[data-cy="table-container"]').should("be.visible");
      },
    );
    cy.contains('[data-cy="chart-block"]', "Eligibility").within(() => {
      cy.get('[data-cy="table"]').should("be.visible");
    });
    cy.contains('[data-cy="chart-block"]', "Documents").within(() => {
      cy.get('[data-cy="table-container"]').should("be.visible");
    });
  });

  it("Should display the Financial Insights tab", () => {
    waitData();
    cy.contains('[data-cy="page-tab-button"]', "Financial Insights").click();
    cy.url().should("include", "/location/KEN/financial-insights");
    cy.contains('[data-cy="chart-block"]', "Disbursements").within(() => {
      cy.get('[data-cy="line-chart"]').should("be.visible");
    });
    cy.contains('[data-cy="chart-block"]', "Grant Budgets").within(() => {
      cy.get('[data-cy="sankey-chart"]').should("be.visible");
    });

    cy.contains('[data-cy="chart-block"]', "Expenditures").within(() => {
      cy.get('[data-cy="heatmap-chart"]').should("be.visible");
    });

    cy.get('[data-cy="location-pie-charts"]').within(() => {
      cy.contains("Components").should("be.visible");
      cy.contains("Principal Recipients").should("be.visible");
      cy.contains("Investments").should("be.visible");
    });
  });

  it("Should display the Results tab", () => {
    waitData();
    cy.contains('[data-cy="page-tab-button"]', "Results").click();
    cy.url().should("include", "/location/KEN/results");

    cy.contains('[data-cy="chart-block"]', "Annual Results").within(() => {
      cy.get('[data-cy="table-container"]').should("be.visible");
    });
    cy.contains('[data-cy="chart-block"]', "Documents").within(() => {
      cy.get('[data-cy="table-container"]').should("be.visible");
    });
  });
});
