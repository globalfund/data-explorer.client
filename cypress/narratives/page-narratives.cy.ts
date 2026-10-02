/// <reference types="cypress" />

const apiUrl = "http://api.test";
const pageUrl = `${apiUrl}/narratives/pages/resource-mobilization/global?locale=en&scope_key=default`;
const section = (name: string) =>
  cy.contains('[data-cy="narrative-section"]', name);
const stubPage = () => {
  cy.intercept("GET", "http://cms.test/**", { body: { data: [] } });
  cy.intercept("GET", `${apiUrl}/**`, (request) => {
    const url = new URL(request.url);
    if (url.pathname === "/filter-options/donors") {
      request.alias = "donorOptions";
      request.reply({
        data: {
          id: "donor",
          name: "Donors",
          options: [
            {
              name: "Government",
              value: "Government",
              options: [{ name: "Test donor", value: "Test donor" }],
            },
          ],
        },
      });
      return;
    }
    if (url.pathname === "/filter-options/replenishment-periods") {
      request.alias = "periodOptions";
      request.reply({
        data: {
          id: "replenishmentPeriod",
          name: "Replenishment Period",
          options: [{ name: "2023-2025", value: "2023-2025" }],
        },
      });
      return;
    }
    if (url.pathname === "/pledges-contributions/stats") {
      request.alias = "pageStats";
      request.reply({
        data: {
          totalPledges: 101867174077.09,
          totalContributions: 85024050415.6,
          donorTypesCount: [{ name: "Government", value: 70 }],
        },
      });
      return;
    }
    if (url.pathname === "/pledges-contributions/expandable-bar") {
      request.alias = "pageChart";
      request.reply({
        data: [
          {
            name: "Government",
            value: 100,
            value1: 80,
            items: [{ name: "Test donor", value: 100, value1: 80 }],
          },
        ],
      });
      return;
    }
    if (url.pathname === "/pledges-contributions/table") {
      request.alias = "pageTable";
      request.reply({
        data: [
          {
            id: "government",
            name: "Government",
            pledge: 100,
            contribution: 80,
            _children: [
              {
                id: "donor",
                name: "Test donor",
                pledge: 100,
                contribution: 80,
              },
            ],
          },
        ],
      });
      return;
    }
    if (url.pathname === "/location/KEN/info") {
      request.reply({
        data: [
          {
            name: "Kenya",
            region: "Test region",
            description: "Existing country content",
            isDonor: false,
            currentPrincipalRecipients: [],
            formerPrincipalRecipients: [],
          },
        ],
      });
      return;
    }
    request.reply({ count: 0, data: [], stats: [] });
  });
};
const stubNarrative = () =>
  cy
    .intercept("GET", pageUrl, {
      fixture: "narratives/resource-mobilization-page.json",
    })
    .as("pageNarrative");
const waitPageData = () =>
  cy.wait([
    "@donorOptions",
    "@periodOptions",
    "@pageStats",
    "@pageChart",
    "@pageTable",
  ]);
const settleScroll = () =>
  cy
    .window()
    .then(
      (win) =>
        new Cypress.Promise<void>((resolve) =>
          win.requestAnimationFrame(() =>
            win.requestAnimationFrame(() => resolve()),
          ),
        ),
    );
const pageFilter = () => {
  cy.get('[data-cy="datasets-filter-btn"]').scrollIntoView({
    offset: { top: -150, left: 0 },
  });
  settleScroll();
  cy.get('[data-cy="datasets-filter-btn"]').click({ scrollBehavior: false });
};
const chartFilter = () => {
  cy.get("#pledges-contributions")
    .contains("button", "Filters")
    .scrollIntoView({ offset: { top: -150, left: 0 } });
  settleScroll();
  cy.get("#pledges-contributions")
    .contains("button", "Filters")
    .click({ scrollBehavior: false });
};
const chooseFilter = (name: string) =>
  cy
    .get('[data-cy="filter-panel"]')
    .find(`input[type="checkbox"][name="${name}"]`)
    .check({ scrollBehavior: false });
const applyFilter = (name: string) => {
  chooseFilter(name);
  cy.get('[data-cy="filter-panel"]')
    .contains("button", "Apply")
    .click({ scrollBehavior: false });
};
const resetFilter = () => {
  cy.get('[data-cy="filter-panel"]')
    .contains("button", "Reset")
    .click({ scrollBehavior: false });
  cy.get('[data-cy="filter-panel"]')
    .contains("button", "Apply")
    .click({ scrollBehavior: false });
};
const selectView = (name: string) => {
  cy.get("#pledges-contributions")
    .find('[data-cy="category-dropdown-button"]')
    .scrollIntoView({ offset: { top: -150, left: 0 } });
  settleScroll();
  cy.get("#pledges-contributions")
    .find('[data-cy="category-dropdown-button"]')
    .click({ scrollBehavior: false });
  cy.contains('[role="menuitem"]', name).click({ scrollBehavior: false });
};

describe("saved page narratives", () => {
  beforeEach(stubPage);
  it("loads once and renders both placements with periods and expanded calculation Source links", () => {
    stubNarrative();
    cy.visit("/resource-mobilization");
    cy.wait("@pageNarrative").then(({ request }) => {
      expect(request.headers.authorization).to.equal(undefined);
      expect(request.headers.cookie).to.equal(undefined);
    });
    waitPageData();
    section("Funding summary")
      .should("be.visible")
      .and("contain", "Data periods:");
    section("Donor composition")
      .should("be.visible")
      .and("contain", "default global view");
    cy.get('[data-cy="narrative-section"]').should("have.length", 2);
    cy.contains("Total Pledged").should("be.visible");
    cy.contains("Pledges & Contributions").should("be.visible");
    cy.get('[data-cy="narrative-section"]')
      .first()
      .then(($section) => {
        expect(
          $section[0].compareDocumentPosition(
            Cypress.$("#pledges-contributions")[0],
          ) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).to.be.greaterThan(0);
      });
    cy.get('[data-cy="narrative-section"]')
      .last()
      .then(($section) => {
        expect(
          $section[0].compareDocumentPosition(
            Cypress.$("#pledges-contributions")[0],
          ) & Node.DOCUMENT_POSITION_PRECEDING,
        ).to.be.greaterThan(0);
      });
    cy.get('[data-cy="narrative-claim"]')
      .first()
      .find("a")
      .should("have.length.at.least", 2);
    cy.get("@pageNarrative.all").should("have.length", 1);
    selectView("Table View");
    section("Funding summary").should("be.visible");
    section("Donor composition").should("be.visible");
    cy.get("@pageNarrative.all").should("have.length", 1);
    selectView("Bar Chart");
    section("Donor composition").should("be.visible");
    cy.get("@pageNarrative.all").should("have.length", 1);
  });
  it("hides both sections only for effective applied page filters and restores without refetch", () => {
    stubNarrative();
    cy.visit("/resource-mobilization");
    cy.wait("@pageNarrative");
    waitPageData();
    pageFilter();
    chooseFilter("Government");
    section("Funding summary").should("exist");
    cy.get('[data-cy="filter-panel"]')
      .contains("button", "Cancel")
      .click({ scrollBehavior: false });
    section("Funding summary").should("be.visible");
    pageFilter();
    applyFilter("Government");
    cy.get('[data-cy="narrative-section"]').should("not.exist");
    pageFilter();
    resetFilter();
    section("Funding summary").should("be.visible");
    section("Donor composition").should("be.visible");
    cy.get("@pageNarrative.all").should("have.length", 1);
  });
  it("hides only donor composition for chart filters independently of page filters", () => {
    stubNarrative();
    cy.visit("/resource-mobilization");
    cy.wait("@pageNarrative");
    waitPageData();
    chartFilter();
    applyFilter("Government");
    section("Funding summary").should("be.visible");
    cy.contains('[data-cy="narrative-section"]', "Donor composition").should(
      "not.exist",
    );
    chartFilter();
    resetFilter();
    section("Donor composition").should("be.visible");
    cy.get("@pageNarrative.all").should("have.length", 1);
  });
  it("hides only donor composition for nonempty table search, including whitespace", () => {
    stubNarrative();
    cy.visit("/resource-mobilization");
    cy.wait("@pageNarrative");
    waitPageData();
    selectView("Table View");
    cy.get('[aria-label="Search button"]').click({ scrollBehavior: false });
    cy.get('[aria-label="Search input"]').type("Test");
    section("Funding summary").should("be.visible");
    cy.contains('[data-cy="narrative-section"]', "Donor composition").should(
      "not.exist",
    );
    cy.get('[aria-label="Search input"]').clear();
    section("Donor composition").should("be.visible");
    cy.get('[aria-label="Search button"]').click({ scrollBehavior: false });
    cy.get('[aria-label="Search input"]').type(" ");
    cy.contains('[data-cy="narrative-section"]', "Donor composition").should(
      "not.exist",
    );
    cy.get('[aria-label="Search input"]').clear();
    section("Donor composition").should("be.visible");
    cy.get("@pageNarrative.all").should("have.length", 1);
  });
  it("handles missing, service failure and mismatched v2 identity without blocking the page", () => {
    for (const statusCode of [404, 503]) {
      cy.intercept("GET", pageUrl, {
        statusCode,
        body: { detail: "private detail" },
      }).as("failedPage");
      cy.visit("/resource-mobilization");
      cy.wait("@failedPage");
      cy.get(
        `[data-cy="narrative-${statusCode === 404 ? "not_found" : "error"}"]`,
      )
        .should("have.length", 2)
        .and("not.contain", "private detail");
      cy.contains("Total Pledged").should("be.visible");
    }
    cy.fixture("narratives/resource-mobilization-page.json").then((bundle) => {
      bundle.page.scope_key = "filtered";
      cy.intercept("GET", pageUrl, bundle).as("invalidPage");
    });
    cy.visit("/resource-mobilization");
    cy.wait("@invalidPage");
    cy.get('[data-cy="narrative-error"]').should("have.length", 2);
    cy.get('[data-cy="narrative-section"]').should("not.exist");
  });
  it("does not display a late global page response after in-app country navigation", () => {
    cy.intercept("GET", pageUrl, {
      delay: 1200,
      fixture: "narratives/resource-mobilization-page.json",
    }).as("slowPage");
    cy.intercept("GET", `${apiUrl}/location/KEN/narratives?locale=en`, {
      fixture: "narratives/recipient.json",
    }).as("country");
    cy.visit("/resource-mobilization");
    cy.get('[data-cy="narrative-loading"]').should("have.length", 2);
    cy.window().then((win) => {
      win.history.pushState({}, "", "/location/KEN/access-to-funding");
      win.dispatchEvent(new PopStateEvent("popstate"));
    });
    cy.wait("@country");
    cy.wait("@slowPage");
    cy.contains("h1", "Kenya").should("be.visible");
    cy.contains('[data-cy="narrative-section"]', "Funding summary").should(
      "not.exist",
    );
  });
  it("renders both placements and keyboard accessible citations on mobile", () => {
    cy.viewport("iphone-x");
    stubNarrative();
    cy.visit("/resource-mobilization");
    cy.wait("@pageNarrative");
    waitPageData();
    section("Funding summary")
      .scrollIntoView({ offset: { top: -100, left: 0 } })
      .should("be.visible");
    cy.screenshot("resource-mobilization-funding-summary-mobile", {
      capture: "viewport",
    });
    section("Donor composition")
      .scrollIntoView({ offset: { top: -100, left: 0 } })
      .should("be.visible");
    cy.screenshot("resource-mobilization-donor-composition-mobile", {
      capture: "viewport",
    });
    cy.get('[aria-label^="Source 1:"]').first().focus().should("have.focus");
  });
});

describe("shared provider identity", () => {
  it("reuses a provider request for both implicit and same explicit identity hooks", () => {
    stubNarrative();
    cy.visit("/cypress/narratives/provider-harness.html");
    cy.wait("@pageNarrative");
    cy.get('[data-cy="explicit-page"]').should(
      "have.attr",
      "data-status",
      "success",
    );
    cy.get('[data-cy="implicit-page"]').should(
      "have.attr",
      "data-status",
      "success",
    );
    cy.get("@pageNarrative.all").should("have.length", 1);
  });
  it("changes scope identity and suppresses a late previous-scope response", () => {
    cy.intercept("GET", pageUrl, {
      delay: 1000,
      fixture: "narratives/resource-mobilization-page.json",
    }).as("defaultPage");
    cy.fixture("narratives/resource-mobilization-page.json").then((bundle) => {
      bundle.page.scope_key = "filtered";
      for (const item of [...bundle.sources, ...bundle.calculations])
        item.scope.scope_key = "filtered";
      bundle.sections[0].claims[0].text = "FILTERED SCOPE CLAIM";
      cy.intercept(
        "GET",
        `${apiUrl}/narratives/pages/resource-mobilization/global?locale=en&scope_key=filtered`,
        bundle,
      ).as("filteredPage");
    });
    cy.visit("/cypress/narratives/provider-harness.html");
    cy.get('[data-cy="explicit-page"]').should(
      "have.attr",
      "data-status",
      "loading",
    );
    cy.contains("button", "Change scope").click({ scrollBehavior: false });
    cy.wait("@filteredPage");
    cy.get('[data-cy="explicit-page"]').should(
      "contain",
      "FILTERED SCOPE CLAIM",
    );
    cy.wait("@defaultPage");
    cy.get('[data-cy="implicit-page"]').should(
      "contain",
      "FILTERED SCOPE CLAIM",
    );
    cy.get("@defaultPage.all").should("have.length", 1);
    cy.get("@filteredPage.all").should("have.length", 1);
  });
  it("changes page ID and suppresses previous-page text and errors", () => {
    cy.intercept("GET", pageUrl, { delay: 1000, statusCode: 503, body: {} }).as(
      "previousPage",
    );
    cy.fixture("narratives/resource-mobilization-page.json").then((bundle) => {
      bundle.page.page_id = "other";
      for (const item of [...bundle.sources, ...bundle.calculations])
        item.scope.page_id = "other";
      bundle.sections[0].claims[0].text = "OTHER PAGE CLAIM";
      cy.intercept(
        "GET",
        `${apiUrl}/narratives/pages/resource-mobilization/other?locale=en&scope_key=default`,
        bundle,
      ).as("otherPage");
    });
    cy.visit("/cypress/narratives/provider-harness.html");
    cy.get('[data-cy="explicit-page"]').should(
      "have.attr",
      "data-status",
      "loading",
    );
    cy.contains("button", "Change page").click({ scrollBehavior: false });
    cy.wait("@otherPage");
    cy.wait("@previousPage");
    cy.get('[data-cy="explicit-page"]')
      .should("contain", "OTHER PAGE CLAIM")
      .and("have.attr", "data-status", "success");
    cy.get("@otherPage.all").should("have.length", 1);
  });
  it("retains legacy country wrappers without a duplicate explicit-identity request", () => {
    cy.intercept("GET", `${apiUrl}/location/MOZ/narratives?locale=en`, {
      fixture: "narratives/recipient.json",
    }).as("countryProvider");
    cy.readFile("tests/fixtures/country-bundle-moz.json").then((bundle) =>
      cy
        .intercept("GET", `${apiUrl}/location/MOZ/narratives?locale=en`, bundle)
        .as("countryProvider"),
    );
    cy.visit("/cypress/narratives/provider-harness.html?country");
    cy.wait("@countryProvider");
    cy.get('[data-cy="explicit-country"]')
      .should("have.attr", "data-status", "success")
      .and("contain", "MOZ");
    cy.get('[data-cy="implicit-country"]').should(
      "have.attr",
      "data-status",
      "success",
    );
    cy.get("@countryProvider.all").should("have.length", 1);
  });
});

describe("generic saved section presentation", () => {
  it("shows calculation units alongside the cited reporting periods", () => {
    stubNarrative();
    cy.visit("/cypress/narratives/provider-harness.html");
    cy.wait("@pageNarrative");
    cy.get('[data-cy="explicit-page"]')
      .should("contain", "Data periods:")
      .and("contain", "Units: USD reference rate, percent");
  });
  it("renders presentation headings as contiguous semantic groups and claim text safely", () => {
    cy.fixture("narratives/resource-mobilization-page.json").then((bundle) => {
      bundle.presentation.sections[0].allowed_headings = ["Funding context"];
      const claim = {
        ...bundle.sections[0].claims[0],
        heading: "Funding context",
      };
      bundle.sections[0].claims = [
        {
          ...claim,
          text: '<img src=x onerror="document.body.dataset.unsafe=1"> Saved claim',
        },
        claim,
        { ...claim, heading: null },
        claim,
      ];
      cy.intercept("GET", pageUrl, bundle).as("headedPage");
    });
    cy.visit("/cypress/narratives/provider-harness.html");
    cy.wait("@headedPage");
    cy.get('[data-cy="explicit-page"]').within(() => {
      cy.get('[data-cy="narrative-heading"]')
        .should("have.length", 2)
        .each(($heading) => expect($heading.prop("tagName")).to.equal("H3"));
      cy.contains(
        '<img src=x onerror="document.body.dataset.unsafe=1"> Saved claim',
      ).should("have.prop", "tagName", "P");
    });
    cy.get("body").should("not.have.attr", "data-unsafe");
    cy.get('[data-cy="narrative-section"] img').should("not.exist");
  });
  it("renders a configured optional summary without an Overview identity", () => {
    cy.fixture("narratives/resource-mobilization-page.json").then((bundle) => {
      bundle.presentation.summary = {
        id: "page.summary",
        title: "Saved synthesis",
        allowed_headings: ["Funding context"],
      };
      bundle.summary = {
        id: "page.summary",
        title: "Saved synthesis",
        status: "ready",
        claims: [
          { ...bundle.sections[0].claims[0], heading: "Funding context" },
        ],
        contributing_section_ids: [bundle.sections[0].id],
      };
      cy.intercept("GET", pageUrl, bundle).as("summaryPage");
    });
    cy.visit("/cypress/narratives/provider-harness.html?summary");
    cy.wait("@summaryPage");
    cy.get('[data-cy="explicit-page"]')
      .should("contain", "Saved synthesis")
      .and("contain", "Available topics: Funding summary");
    cy.get('[data-cy="explicit-page"] [data-cy="narrative-heading"]').should(
      "have.text",
      "Funding context",
    );
  });
});
