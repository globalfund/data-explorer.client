/// <reference types="cypress" />

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

describe("Testing The Location page", () => {
  describe("Testing The Datasets/Annual Results Page", () => {
    beforeEach(() => {
      interceptAllRequests();

      cy.visit("/");
      waitData(22);
      cy.contains("[data-cy=header-menu-button]", "Datasets").click();
      cy.contains("[data-cy=header-menu-button]", "Annual Results").click();
      waitData(4);
    });

    it("displays the header", () => {
      cy.get("h1").should("have.text", "Annual Results");
      cy.contains(
        "Indicator results reported as part of annual Results Report.",
      ).should("be.visible");
      cy.contains("People on antiretroviral therapy for HIV in 2022").should(
        "be.visible",
      );
      cy.contains("People with TB treated in 2022").should("be.visible");
      cy.contains(
        "Insecticide-treated mosquito nets distributed in 2022",
      ).should("be.visible");
    });

    it("Can filter page data", { scrollBehavior: false }, () => {
      cy.get('[data-cy="datasets-filter-btn"]').click();
      cy.get('[data-cy="filter-panel"]').should("be.visible");

      cy.contains('[data-cy="filter-list-accordion"]', "Geography").within(
        () => {
          cy.get('[data-cy="filter-list-accordion-summary"]').click();
          cy.get('[data-cy="filter-panel-search-input"]')
            .first()
            .type("Europe");
          cy.contains(
            '[data-cy="filter-list-content-accordion-summary"]',
            "Europe",
          ).within(() => {
            cy.get('[data-cy="filter-list-content-checkbox"]').click();
            waitData(4);
          });
        },
      );

      cy.get('[data-cy="filter-panel"]').within(() => {
        cy.contains('[data-cy="applied-filter"]', "Europe").should(
          "be.visible",
        );
      });
    });

    it("Can switch the data view", { scrollBehavior: false }, () => {
      cy.get('[data-cy="toolbar-right-content"]').within(() => {
        cy.contains('[data-cy="category-dropdown-button"]', "2022").click();
      });

      cy.get('[data-cy="category-dropdown-menu"]')
        .filter((_index, parent) => {
          return Cypress.$(parent).css("visibility") !== "hidden";
        })
        .within(() => {
          cy.contains('[data-cy="category-dropdown-item"]', "2021").click();
        });

      waitData(4);

      cy.contains('[data-cy="category-dropdown-button"]', "2021").should(
        "be.visible",
      );

      cy.contains("People on antiretroviral therapy for HIV in 2021").should(
        "be.visible",
      );
    });

    it(
      "Shows the Annual Results block and can switch chart type",
      { scrollBehavior: "nearest" },
      () => {
        cy.contains('[data-cy="dataset-chart-block"]', "Annual Results")
          .first()
          .within(() => {
            cy.get('[data-cy="polyline-tree"]').should("be.visible");

            cy.contains(
              '[data-cy="category-dropdown-button"]',
              "Polyline Tree",
            ).click();
          });

        cy.get('[data-cy="category-dropdown-menu"]')
          .filter((_index, parent) => {
            return Cypress.$(parent).css("visibility") !== "hidden";
          })
          .within(() => {
            cy.contains(
              '[data-cy="category-dropdown-item"]',
              "Table View",
            ).click();
          });

        cy.contains("[data-cy=dataset-chart-block]", "Annual Results").within(
          () => {
            cy.get('[data-cy="table"]').should("be.visible");
          },
        );
      },
    );

    it("Shows the Documents block ", { scrollBehavior: "nearest" }, () => {
      cy.get('[data-cy="documents-block"]').within(() => {
        cy.contains("Documents").should("be.visible");
        cy.get('[data-cy="table"]').should("be.visible");
      });
    });
  });
});
