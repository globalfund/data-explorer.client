/// <reference types="cypress" />

describe("country narratives with the rollout flag disabled", () => {
  it("does not request or render saved narratives and preserves the country page", () => {
    let narrativeRequests = 0;
    cy.intercept("GET", "http://cms.test/**", { body: { data: [] } });
    cy.intercept("GET", "http://api.test/**", (request) => {
      if (request.url.includes("/narratives")) narrativeRequests += 1;
      if (request.url.includes("/location/MOZ/info")) {
        request.reply({
          count: 1,
          data: [
            {
              name: "Mozambique",
              region: "Test region",
              description: "Existing country content",
              isDonor: false,
              FPMName: "Test Portfolio Manager",
              FPMEmail: "portfolio@example.org",
              currentPrincipalRecipients: [],
              formerPrincipalRecipients: [],
            },
          ],
        });
        return;
      }
      request.reply({ count: 0, data: [], stats: [] });
    });
    cy.visit("/location/MOZ/overview");
    cy.contains("h1", "Mozambique").should("be.visible");
    cy.contains("Fund Portfolio Manager").should("be.visible");
    cy.get('[data-cy^="narrative-"]').should("not.exist");
    cy.then(() => expect(narrativeRequests).to.equal(0));
  });
});

describe("page narratives with the rollout flag disabled", () => {
  it("preserves the global page and makes no saved page request", () => {
    let requests = 0;
    cy.intercept("GET", "http://cms.test/**", { body: { data: [] } });
    cy.intercept("GET", "http://api.test/**", (request) => {
      if (request.url.includes("/narratives")) requests += 1;
      if (request.url.includes("/pledges-contributions/stats")) {
        request.reply({
          data: {
            totalPledges: 100,
            totalContributions: 80,
            donorTypesCount: [],
          },
        });
        return;
      }
      request.reply({ count: 0, data: [] });
    });
    cy.visit("/resource-mobilization");
    cy.contains("h1", "Resource Mobilization").should("be.visible");
    cy.contains("Total Pledged").should("be.visible");
    cy.contains("Pledges & Contributions").should("be.visible");
    cy.get('[data-cy^="narrative-"]').should("not.exist");
    cy.then(() => expect(requests).to.equal(0));
  });
  it("suppresses both implicit and explicit page compatibility requests", () => {
    let requests = 0;
    cy.intercept("GET", "http://api.test/**", (request) => {
      requests += 1;
      request.reply({ statusCode: 503 });
    });
    cy.visit("/cypress/narratives/provider-harness.html");
    cy.get('[data-cy="explicit-page"]').should(
      "have.attr",
      "data-status",
      "disabled",
    );
    cy.get('[data-cy="implicit-page"]').should(
      "have.attr",
      "data-status",
      "disabled",
    );
    cy.then(() => expect(requests).to.equal(0));
  });
  for (const [code, name, isDonor] of [
    ["KEN", "Kenya", false],
    ["USA", "United States", true],
    ["NRU", "Nauru", false],
  ] as const) {
    it(`preserves ${name} country behavior with no narrative requests`, () => {
      let requests = 0;
      cy.intercept("GET", "http://cms.test/**", { body: { data: [] } });
      cy.intercept("GET", "http://api.test/**", (request) => {
        if (request.url.includes("/narratives")) requests += 1;
        request.reply(
          request.url.includes(`/location/${code}/info`)
            ? {
                data: [
                  {
                    name,
                    region: "Test region",
                    description: "Existing country content",
                    isDonor,
                    currentPrincipalRecipients: [],
                    formerPrincipalRecipients: [],
                  },
                ],
              }
            : { count: 0, data: [], stats: [] },
        );
      });
      cy.visit(`/location/${code}/overview`);
      cy.contains("h1", name).should("be.visible");
      cy.get('[data-cy^="narrative-"]').should("not.exist");
      cy.contains(
        '[data-cy="page-tab-button"]',
        "Resource Mobilization",
      ).should(isDonor ? "exist" : "not.exist");
      cy.then(() => expect(requests).to.equal(0));
    });
  }
});

describe("Access to Funding with narratives disabled", () => {
  it("preserves all blocks without requesting saved narratives", () => {
    let requests = 0;
    cy.intercept("GET", "http://cms.test/**", { body: { data: [] } });
    cy.intercept("GET", "http://api.test/**", (req) => {
      if (req.url.includes("/narratives")) requests += 1;
      req.reply({ count: 0, data: [], stats: [], keys: [] });
    });
    cy.visit("/access-to-funding");
    cy.contains("h1", "Access to Funding").should("be.visible");
    cy.contains("Eligible Countries by Numbers").should("exist");
    cy.get("#eligibility, #allocation, #funding-requests").should(
      "have.length",
      3,
    );
    cy.get('[data-cy="allocation-block-2"]').should("exist");
    cy.get('[data-cy^="narrative-"]').should("not.exist");
    cy.then(() => expect(requests).to.equal(0));
  });
});
