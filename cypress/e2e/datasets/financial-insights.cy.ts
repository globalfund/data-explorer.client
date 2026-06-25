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
  describe("Testing The Datasets/Financial Insights Page", () => {
    beforeEach(() => {
      interceptAllRequests();

      cy.visit("/");
      waitData(22);
      cy.contains("[data-cy=header-menu-button]", "Datasets").click();
      cy.contains("[data-cy=header-menu-button]", "Financial Insights").click();
      waitData(16);
    });

    it("displays the header", () => {
      cy.get("h1").should("have.text", "Financial Insights");
      cy.contains(
        "See the disbursements, budgets and expenditures datasets and relating insights.",
      ).should("be.visible");
      cy.contains("Total Signed Amount").should("be.visible");
      cy.contains("Total Committed Amount").should("be.visible");
      cy.contains("Total Disbursed Amount").should("be.visible");
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
        cy.contains(
          '[data-cy="category-dropdown-button"]',
          "Standard View",
        ).click();
      });

      cy.get('[data-cy="category-dropdown-menu"]')
        .filter((_index, parent) => {
          return Cypress.$(parent).css("visibility") !== "hidden";
        })
        .within(() => {
          cy.contains(
            '[data-cy="category-dropdown-item"]',
            "Portfolio View",
          ).click();
        });

      waitData(14);

      cy.contains(
        '[data-cy="category-dropdown-button"]',
        "Portfolio View",
      ).should("be.visible");
    });

    it(
      "Shows the Disbursements block and can switch chart type",
      { scrollBehavior: "nearest" },
      () => {
        cy.contains('[data-cy="dataset-chart-block"]', "Disbursements")
          .first()
          .within(() => {
            cy.contains(
              "Disbursement transactions for all grants across the porfolio.",
            ).should("be.visible");
            cy.get('[data-cy="bar-chart"]').should("be.visible");

            cy.contains(
              '[data-cy="category-dropdown-button"]',
              "Bar Chart",
            ).click();
          });

        cy.get('[data-cy="category-dropdown-menu"]')
          .filter((_index, parent) => {
            return Cypress.$(parent).css("visibility") !== "hidden";
          })
          .within(() => {
            cy.contains(
              '[data-cy="category-dropdown-item"]',
              "Line Chart",
            ).click();
          });

        cy.contains("[data-cy=dataset-chart-block]", "Disbursements").within(
          () => {
            cy.get('[data-cy="line-chart"]').should("be.visible");
            cy.contains(
              '[data-cy="category-dropdown-button"]',
              "Line Chart",
            ).click();
          },
        );

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

        cy.contains("[data-cy=dataset-chart-block]", "Disbursements").within(
          () => {
            cy.get('[data-cy="table"]').should("be.visible");
          },
        );
      },
    );

    it(
      "Shows the budgets block and can switch chart type",
      { scrollBehavior: "nearest" },
      () => {
        cy.contains('[data-cy="dataset-chart-block"]', "Budgets")
          .first()
          .within(() => {
            cy.get('[data-cy="sankey-chart"]').should("be.visible");

            cy.contains(
              '[data-cy="category-dropdown-button"]',
              "Sankey Chart",
            ).click();
          });

        cy.get('[data-cy="category-dropdown-menu"]')
          .filter((_index, parent) => {
            return Cypress.$(parent).css("visibility") !== "hidden";
          })
          .within(() => {
            cy.contains(
              '[data-cy="category-dropdown-item"]',
              "Treemap",
            ).click();
          });

        cy.contains("[data-cy=dataset-chart-block]", "Budgets").within(() => {
          cy.get('[data-cy="treemap-chart"]').should("be.visible");
          cy.contains(
            '[data-cy="category-dropdown-button"]',
            "Treemap",
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

        cy.contains("[data-cy=dataset-chart-block]", "Budgets").within(() => {
          cy.get('[data-cy="table"]').should("be.visible");
        });

        cy.get('[data-cy="budgets-block-2"]').within(() => {
          cy.contains("Budget Breakdown").should("be.visible");
          cy.contains("By grant component").should("be.visible");
        });
      },
    );

    it(
      "Shows the Financial Metrics block and can switch year range",
      { scrollBehavior: "nearest" },
      () => {
        cy.contains('[data-cy="dataset-chart-block"]', "Financial Metrics")
          .first()
          .within(() => {
            cy.contains(
              '[data-cy="category-dropdown-button"]',
              "Grant Cycle 6",
            ).click();
          });

        cy.get('[data-cy="category-dropdown-menu"]')
          .filter((_index, parent) => {
            return Cypress.$(parent).css("visibility") !== "hidden";
          })
          .within(() => {
            cy.contains(
              '[data-cy="category-dropdown-item"]',
              "Grant Cycle 5",
            ).click();
            waitData(3);
          });

        cy.contains('[data-cy="dataset-chart-block"]', "Financial Metrics")
          .first()
          .within(() => {
            cy.contains(
              '[data-cy="category-dropdown-button"]',
              "Grant Cycle 5",
            ).should("be.visible");
          });

        cy.contains('[data-cy="financial-metric"]', "Budget Utilisation")
          .scrollIntoView()
          .within(() => {
            cy.get('[data-cy="donut-chart"]').should("be.visible");
            cy.get('[data-cy="financial-metric-expandable-item"]').should(
              "be.visible",
            );
          });

        cy.contains('[data-cy="financial-metric"]', "In-Country Absorption")
          .scrollIntoView()
          .within(() => {
            cy.get('[data-cy="donut-chart"]').should("be.visible");
            cy.get('[data-cy="financial-metric-expandable-item"]').should(
              "be.visible",
            );
          });

        cy.contains('[data-cy="financial-metric"]', "Disbursement Utilisation")
          .scrollIntoView()
          .within(() => {
            cy.get('[data-cy="donut-chart"]').should("be.visible");
            cy.get('[data-cy="financial-metric-expandable-item"]').should(
              "be.visible",
            );
          });
      },
    );

    it(
      "Shows the Expenditures block and can switch chart type",
      { scrollBehavior: "nearest" },
      () => {
        cy.contains('[data-cy="dataset-chart-block"]', "Expenditures")
          .first()
          .within(() => {
            cy.contains("reported expenditure.").should("be.visible");
            cy.get('[data-cy="heatmap-chart"]').should("be.visible");

            cy.contains(
              '[data-cy="category-dropdown-button"]',
              "Heatmap",
            ).click();
          });

        cy.get('[data-cy="category-dropdown-menu"]')
          .filter((_index, parent) => {
            return Cypress.$(parent).css("visibility") !== "hidden";
          })
          .within(() => {
            cy.contains(
              '[data-cy="category-dropdown-item"]',
              "Bar Chart",
            ).click();
          });

        cy.contains("[data-cy=dataset-chart-block]", "Expenditures").within(
          () => {
            cy.get('[data-cy="expandable-horizontal-bar-chart"]').should(
              "be.visible",
            );
            cy.contains(
              '[data-cy="category-dropdown-button"]',
              "Bar Chart",
            ).click();
          },
        );

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

        cy.contains("[data-cy=dataset-chart-block]", "Expenditures").within(
          () => {
            cy.get('[data-cy="table"]').should("be.visible");
          },
        );
      },
    );
  });
});
