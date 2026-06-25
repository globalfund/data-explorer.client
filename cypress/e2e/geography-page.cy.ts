/// <reference types="cypress" />

describe("Testing The Geography page", () => {
  const apiUrl = Cypress.expose("api_url");

  beforeEach(() => {
    cy.intercept(`${apiUrl}/geographies`).as("geographies");
    cy.visit("/");
    cy.contains("[data-cy=header-menu-button]", "Geography").click();
  });

  it("should display the geography page", () => {
    cy.wait("@geographies");

    cy.get("h1").should("have.text", "Geography");
    cy.contains("Africa").should("be.visible");
  });

  it("can search for a country", () => {
    cy.wait("@geographies");

    cy.get("[data-cy=geography-search-input]").type("Kenya");
    cy.contains("Burundi").should("have.css", "pointer-events", "none");
    cy.contains("Kenya").first().scrollIntoView().should("be.visible");

    cy.contains("Kenya").first().scrollIntoView().click();

    cy.url().should("include", "/location/KEN/overview");
  });
});
