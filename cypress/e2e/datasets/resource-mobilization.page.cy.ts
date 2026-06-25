/// <reference types="cypress" />

// @ts-ignore
const interceptRequests = () => {
  const apiUrl = Cypress.expose("api_url");
  cy.intercept(`${apiUrl}/**`).as("apiData");
};
// @ts-ignore
const waitData = (requestCount: number) => {
  for (let i = 0; i < requestCount; i++) {
    cy.wait("@apiData");
  }
};

describe("Testing The Datasets/Resource Mobilization Page", () => {
  beforeEach(() => {
    interceptRequests();

    cy.visit("/");
    waitData(22);
    cy.contains("[data-cy=header-menu-button]", "Datasets").click();
    cy.contains(
      "[data-cy=header-menu-button]",
      "Resource Mobilization",
    ).click();
    waitData(3);
  });

  it("displays the header", () => {
    cy.get("h1").should("have.text", "Resource Mobilization");
    cy.contains(
      "Government, private sector, non-government and other donor pledges and contributions",
    ).should("be.visible");
    cy.contains("Total Pledged").should("be.visible");
    cy.contains("Total Contributed").should("be.visible");
    cy.contains("Number of Donors Mobilized").should("be.visible");
    cy.contains("Grouped by their Donor types");
  });

  it("Can filter page data", { scrollBehavior: false }, () => {
    cy.get('[data-cy="datasets-filter-btn"]').click();
    cy.get('[data-cy="filter-panel"]').should("be.visible");

    cy.contains('[data-cy="filter-list-accordion"]', "Donor").within(() => {
      cy.get('[data-cy="filter-list-accordion-summary"]').click();
      cy.get('[data-cy="filter-panel-search-input"]').first().type("Public");
      cy.contains(
        '[data-cy="filter-list-content-accordion-summary"]',
        "Public Sector",
      ).within(() => {
        cy.get('[data-cy="filter-list-content-checkbox"]').click();
        waitData(3);
      });
    });

    cy.get('[data-cy="filter-panel"]').within(() => {
      cy.contains('[data-cy="applied-filter"]', "Public Sector").should(
        "be.visible",
      );
    });
  });

  it("Shows pledge and contribution block and can switch chart type", () => {
    cy.contains(
      '[data-cy="dataset-chart-block"]',
      "Pledges & Contributions",
    ).should("be.visible");
    cy.contains(
      "Government, private sector, non-government and other donor pledges and contributions.",
    );

    cy.contains(
      "[data-cy=dataset-chart-block]",
      "Pledges & Contributions",
    ).within(() => {
      cy.get('[data-cy="expandable-horizontal-bar-chart"]').should(
        "be.visible",
      );

      cy.contains('[data-cy="category-dropdown-button"]', "Bar Chart").click();
    });

    cy.get('[data-cy="category-dropdown-menu"]')
      .filter((_index, parent) => {
        return Cypress.$(parent).css("visibility") !== "hidden";
      })
      .within(() => {
        cy.contains('[data-cy="category-dropdown-item"]', "Table View").click();
      });

    cy.contains(
      "[data-cy=dataset-chart-block]",
      "Pledges & Contributions",
    ).within(() => {
      cy.get('[data-cy="table"]').should("be.visible");
    });
  });
});
