/// <reference types="cypress" />

// Title and subtitle display
// stats box visibility
// search and category filter
// test pledge and contribution year toggle
// test allocation year toggle

// @ts-ignore
const interceptAllRequests = () => {
  const apiUrl = Cypress.expose("api_url");
  cy.intercept(`${apiUrl}/**`).as("apiData");
};
// @ts-ignore
const waitData = (requestCount: number) => {
  for (let i = 0; i < requestCount; i++) {
    cy.wait("@apiData");
  }
};

describe("Testing HomePage", () => {
  const apiUrl = Cypress.expose("api_url");

  beforeEach(() => {
    interceptAllRequests();
    cy.intercept(`${apiUrl}/results/stats**`).as("stats");

    cy.visit("/");
    waitData(22);
  });

  it("should display title and subtitle", () => {
    cy.get("h1").should("have.text", "Data Explorer");
    cy.get("h5")
      .first()
      .should(
        "have.text",
        "The Global Fund invests US$5 Billion a year to defeat HIV, tuberculosis and malaria and ensure a healthier, safer, equitable future for all.",
      );
  });

  it("should display stats box", () => {
    // cy.wait("@stats");
    cy.get('[data-cy="home-results-stats"]').should("be.visible");
    cy.get('[data-cy="home-results-stats"]').within(() => {
      cy.contains("div", "People on antiretroviral therapy for HIV in").should(
        "be.visible",
      );
    });
  });

  it("can filter by category and search", () => {
    cy.get('[data-cy="category-dropdown-button"]').first().click();
    cy.contains("[data-cy=category-dropdown-item]", "Locations").click();
    cy.get('[data-cy="category-dropdown-button"]')
      .first()
      .should("have.text", "Locations");

    cy.get("[data-cy=search-input]").type("Kenya");
    waitData(1);

    cy.get("[data-cy=search-results-container]").should("be.visible");
    cy.contains("[data-cy=search-result-item-link]", "Kenya").click();
    cy.url().should("include", "/location/KE");
  });

  it("Shows pledge and contribution block and selects year range", () => {
    // cy.wait("@pledgesCycles");
    cy.contains('[data-cy="chart-block"]', "Pledges & Contributions").should(
      "be.visible",
    );

    cy.contains("[data-cy=chart-block]", "Pledges & Contributions").within(
      () => {
        cy.contains("[data-cy=chart-cycle-button]", "2011-2013").click();
        waitData(1);

        cy.get('[data-cy="chart-info-button"]').scrollIntoView().click();
        cy.get('[data-cy="chart-info-dialog"]').should("be.visible");
      },
    );
  });

  it("Shows allocation block and selects year range", () => {
    // cy.wait("@allocations");
    cy.contains('[data-cy="chart-block"]', "Allocation")
      .scrollIntoView()
      .should("be.visible");

    cy.contains(
      "[data-cy=chart-block]",
      "The Global Fund is distinct from other organizations in that it gives countries (or groups of countries) an allocation and asks countries to describe how they will use those funds rather than asking for applications and then determining an amount per-country based on the merits of the various proposals received.",
    ).should("be.visible");

    cy.contains("[data-cy=chart-block]", "Allocation")
      .scrollIntoView()
      .within(() => {
        cy.contains("[data-cy=chart-cycle-button]", "2020-2022").click();
        waitData(1);

        cy.get('[data-cy="chart-info-button"]').scrollIntoView().click();
        cy.get('[data-cy="chart-info-dialog"]').should("be.visible");
      });
  });

  it("Shows Grants and budgets block", () => {
    // cy.wait("@budgets");
    cy.contains('[data-cy="chart-block"]', "Grant Budgets")
      .scrollIntoView()
      .should("be.visible");

    cy.contains("[data-cy=chart-block]", "Grant Budgets").within(() => {
      cy.contains("[data-cy=chart-cycle-button]", "Grant Cycle 6").click();
      waitData(1);
      // cy.get('[data-cy="category-dropdown-button"]').click();
    });

    // cy.contains("[data-cy=category-dropdown-item]", "Un-Grouped Component")
    //   .scrollIntoView()
    //   .click();
    // waitData(1);

    // cy.contains("[data-cy=chart-block]", "Grant Budgets").within(() => {
    //   cy.get('[data-cy="category-dropdown-button"]').should(
    //     "have.text",
    //     "Un-Grouped Component"
    //   );
    //   cy.get('[data-cy="chart-info-button"]').scrollIntoView().click();
    //   cy.get('[data-cy="chart-info-dialog"]').should("be.visible");
    // });
  });

  it("Shows Disbursements block", () => {
    // cy.wait("@disbursements");
    cy.contains('[data-cy="chart-block"]', "Disbursements")
      .scrollIntoView()
      .should("be.visible");

    cy.contains("[data-cy=chart-block]", "Disbursements").within(() => {
      cy.contains("[data-cy=chart-cycle-button]", "Grant Cycle 4").click();
      waitData(1);
      cy.get('[data-cy="category-dropdown-button"]').click();
    });

    cy.get('[data-cy="category-dropdown-menu"]')
      .filter((_index, parent) => {
        return Cypress.$(parent).css("visibility") !== "hidden";
      })
      .within(() => {
        cy.contains(
          '[data-cy="category-dropdown-item"]',
          "Un-Grouped Component",
        ).click();
      });
    waitData(1);

    cy.contains("[data-cy=chart-block]", "Disbursements").within(() => {
      cy.get('[data-cy="category-dropdown-button"]').should(
        "have.text",
        "Un-Grouped Component",
      );
      cy.get('[data-cy="chart-info-button"]').scrollIntoView().click();
      cy.get('[data-cy="chart-info-dialog"]').should("be.visible");
    });
  });

  it("Shows Expenditures block", () => {
    // cy.wait("@expenditures");
    cy.contains('[data-cy="chart-block"]', "Expenditures")
      .scrollIntoView()
      .should("be.visible");

    cy.contains("[data-cy=chart-block]", "Expenditures").within(() => {
      cy.contains("[data-cy=chart-cycle-button]", "Grant Cycle 5").click();
      waitData(1);
      // cy.get('[data-cy="category-dropdown-button"]').scrollIntoView().click();
    });

    // cy.get('[data-cy="category-dropdown-menu"]')
    //   .filter((index, parent) => {
    //     return Cypress.$(parent).css("visibility") !== "hidden";
    //   })
    //   .within(() => {
    //     cy.contains(
    //       '[data-cy="category-dropdown-item"]',
    //       "Un-Grouped Component"
    //     ).click();
    //   });

    // waitData(1);

    // cy.contains("[data-cy=chart-block]", "Expenditures").within(() => {
    //   cy.get('[data-cy="category-dropdown-button"]').should(
    //     "have.text",
    //     "Un-Grouped Component"
    //   );
    //   cy.get('[data-cy="chart-info-button"]').scrollIntoView().click();
    //   cy.get('[data-cy="chart-info-dialog"]').should("be.visible");
    // });
  });
});
