/// <reference types="cypress" />

// filters
// cardview - tableview

describe("Testing The Grants page", () => {
  const apiUrl = Cypress.expose("api_url");

  beforeEach(() => {
    cy.intercept(`${apiUrl}/grants/1/9**`).as("grants");
    cy.visit("/");
    cy.contains("[data-cy=header-menu-button]", "Grants").click();
  });

  it("should display the grants page", () => {
    cy.wait("@grants");

    cy.get("h1").should("have.text", "Grants");
    cy.contains("Afghanistan").should("be.visible");
  });

  it("can search for a country", () => {
    cy.wait("@grants");
    cy.get('[data-cy="grants-search-btn"]').click();
    cy.get("[data-cy=grants-search-input]").type("Kenya");
    cy.wait("@grants");
    cy.contains("Kenya").should("be.visible");

    cy.contains('[data-cy="grant-card"]', "Kenya").first().click();

    cy.url().should("include", "/grant/KE");
  });

  it("Can switch to table view", () => {
    cy.wait("@grants");
    cy.get('[data-cy="category-dropdown-button"]').click();

    cy.contains("[data-cy=category-dropdown-item]", "Table View").click();

    cy.get('[data-cy="table"]').should("be.visible");

    cy.get('[data-cy="grants-search-btn"]').click();
    cy.get("[data-cy=grants-search-input]").type("Kenya");
    cy.wait("@grants");

    cy.get('[data-cy="table"]').within(() => {
      cy.get("a").first().click();
    });
    cy.url().should("include", "/grant/KE");
  });

  it("Can filter page data", { scrollBehavior: false }, () => {
    cy.wait("@grants");
    cy.get('[data-cy="grants-filter-btn"]').click();
    cy.get('[data-cy="filter-panel"]').should("be.visible");

    cy.contains('[data-cy="filter-list-accordion"]', "Geography").within(() => {
      cy.get('[data-cy="filter-list-accordion-summary"]').click();
      cy.get('[data-cy="filter-panel-search-input"]').first().type("Kenya");
      cy.contains(
        '[data-cy="filter-list-content-accordion-summary"]',
        "Africa",
      ).within(() => {
        cy.get('[data-cy="filter-list-content-checkbox"]').click();
        cy.wait("@grants");
      });
    });

    cy.get('[data-cy="filter-panel"]').within(() => {
      cy.contains('[data-cy="applied-filter"]', "Africa").should("be.visible");
    });
  });
});
