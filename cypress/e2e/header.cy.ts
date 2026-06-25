/// <reference types="cypress" />

describe("Testing The header", () => {
  const apiUrl = Cypress.expose("api_url");

  beforeEach(() => {
    cy.intercept(`${apiUrl}/global-search**`).as("globalSearch");
    cy.visit("/");
  });

  it("Can search from the header", () => {
    cy.get('[data-cy="header-search-btn"]').click();

    cy.get('[data-cy="header-search-container"]').within(() => {
      cy.get('[data-cy="search-input"]').type("Kenya");
    });

    cy.wait("@globalSearch");

    cy.get('[data-cy="search-results-container"]').within(() => {
      cy.contains("Kenya").should("be.visible");
    });

    cy.get("[data-cy=search-results-container]").should("be.visible");
    cy.contains("[data-cy=search-result-item-link]", "Kenya").click();
    cy.url().should("include", "/location/KE");
  });
});
