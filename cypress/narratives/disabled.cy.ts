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
