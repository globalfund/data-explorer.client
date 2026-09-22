/// <reference types="cypress" />

type CountryOptions = {
  isDonor?: boolean;
  hasResults?: boolean;
  hasResultDocuments?: boolean;
};

const apiUrl = "http://api.test";
const cmsUrl = "http://cms.test";
const realMozambiqueBundle = "tests/fixtures/country-bundle-moz.json";
const countryNames: Record<string, string> = {
  KEN: "Kenya",
  MOZ: "Mozambique",
  NRU: "Nauru",
  TLS: "Timor-Leste",
  USA: "United States",
};

const countryCodeFromUrl = (url: URL) =>
  url.pathname.match(/\/location\/([A-Z]{3})\/info/)?.[1] ||
  url.pathname.match(/\/results\/table\/([A-Z]{3})\//)?.[1] ||
  url.searchParams.get("geographies") ||
  "MOZ";

const stubCountryPage = (countries: Record<string, CountryOptions> = {}) => {
  cy.intercept("GET", `${cmsUrl}/**`, {
    statusCode: 200,
    body: { data: [] },
  }).as("cms");

  cy.intercept("GET", `${apiUrl}/**`, (request) => {
    const url = new URL(request.url);
    const code = countryCodeFromUrl(url);
    const options = countries[code] || {};

    if (/\/location\/[A-Z]{3}\/info$/.test(url.pathname)) {
      request.reply({
        count: 1,
        data: [
          {
            name: countryNames[code] || code,
            region: "Test region",
            description: "Existing country content",
            isDonor: options.isDonor ?? false,
            FPMName: "Test Portfolio Manager",
            FPMEmail: "portfolio@example.org",
            currentPrincipalRecipients: [],
            formerPrincipalRecipients: [],
          },
        ],
      });
      return;
    }
    if (url.pathname.includes("/location/coordinating-mechanism/")) {
      request.reply({ count: 0, data: [] });
      return;
    }
    if (url.pathname.includes("/results/table/")) {
      request.reply({
        count: options.hasResults ? 1 : 0,
        data: options.hasResults
          ? [{ id: "result-1", indicator: "Existing annual result" }]
          : [],
      });
      return;
    }
    if (url.pathname === "/documents") {
      const resultDocuments = url.searchParams.get("types") === "Profile";
      request.reply({
        count: resultDocuments && options.hasResultDocuments ? 1 : 0,
        data:
          resultDocuments && options.hasResultDocuments
            ? [{ id: "document-1", title: "Existing results document" }]
            : [],
      });
      return;
    }
    if (
      url.pathname === "/allocations/cycles" ||
      url.pathname === "/funding-requests/cycles"
    ) {
      request.reply({
        count: 2,
        data: [
          { name: "2023 - 2025", value: "2023 - 2025" },
          { name: "2026 - 2028", value: "2026 - 2028" },
        ],
      });
      return;
    }
    if (url.pathname.endsWith("/cycles")) {
      request.reply({
        count: 2,
        data: [
          { name: "Grant Cycle 6", value: "Grant Cycle 6" },
          { name: "Grant Cycle 7", value: "Grant Cycle 7" },
        ],
      });
      return;
    }
    if (url.pathname.match(/^\/allocations\/radial\/[A-Z]{3}$/)) {
      request.reply({
        count: 1,
        data: [{ name: "HIV", value: 446058953 }],
      });
      return;
    }
    if (url.pathname.includes("/disbursements/line-chart/")) {
      request.reply({
        count: 1,
        data: [{ name: "HIV", data: [100] }],
        xAxisKeys: ["2024"],
      });
      return;
    }
    request.reply({ count: 0, data: [], stats: [] });
  }).as("dataApi");
};

const stubNarrativeFixture = (country: string, fixture: string) => {
  cy.intercept("GET", `${apiUrl}/location/${country}/narratives?locale=en`, {
    fixture,
  }).as(`narrative${country}`);
};

const stubRealMozambiqueBundle = () => {
  cy.readFile(realMozambiqueBundle).then((bundle) => {
    cy.intercept(
      "GET",
      `${apiUrl}/location/MOZ/narratives?locale=en`,
      bundle,
    ).as("narrativeMOZ");
  });
};

const visitCountry = (country: string, tab: string) => {
  cy.visit(`/location/${country}/${tab}`);
};

describe("country narratives with the rollout flag enabled", () => {
  beforeEach(() => {
    stubCountryPage({
      MOZ: { hasResults: true },
      USA: { isDonor: true },
      TLS: { hasResultDocuments: true },
    });
  });

  it("loads an actual generated contract and preserves existing Overview content", () => {
    stubRealMozambiqueBundle();
    visitCountry("MOZ", "overview");
    cy.wait("@narrativeMOZ");
    cy.contains("h1", "Mozambique").should("be.visible");
    cy.contains("Fund Portfolio Manager").should("be.visible");
    cy.contains('[data-cy="narrative-section"]', "Country overview")
      .should("be.visible")
      .and("contain", "Available topics: Allocations")
      .and("contain", "default view");
  });

  it("renders mapped narratives across every applicable country tab", () => {
    stubRealMozambiqueBundle();
    const placements = [
      ["overview", "Country overview"],
      ["access-to-funding", "Allocations"],
      ["access-to-funding", "Funding requests"],
      ["access-to-funding", "Eligibility"],
      ["financial-insights", "Disbursements"],
      ["financial-insights", "Budgets"],
      ["financial-insights", "Expenditure"],
      ["financial-insights", "Grants"],
      ["results", "Annual results"],
    ] as const;
    for (const [tab, title] of placements) {
      visitCountry("MOZ", tab);
      cy.wait("@narrativeMOZ");
      cy.contains('[data-cy="narrative-section"]', title).should("be.visible");
    }
    visitCountry("MOZ", "access-to-funding");
    cy.wait("@narrativeMOZ");
    cy.get('[data-cy="narrative-unavailable"]')
      .should("contain", "not enough supporting evidence")
      .and("be.visible");

    stubNarrativeFixture("USA", "narratives/donor.json");
    visitCountry("USA", "resource-mobilization");
    cy.wait("@narrativeUSA");
    cy.contains('[data-cy="narrative-section"]', "Pledges and contributions")
      .should("be.visible")
      .and("contain", "saved default view");

    stubNarrativeFixture("KEN", "narratives/recipient.json");
    visitCountry("KEN", "access-to-funding");
    cy.wait("@narrativeKEN");
    cy.contains('[data-cy="narrative-section"]', "Application context").should(
      "be.visible",
    );

    stubNarrativeFixture("TLS", "narratives/document-only-results.json");
    visitCountry("TLS", "results");
    cy.wait("@narrativeTLS");
    cy.contains('[data-cy="narrative-section"]', "Results context").should(
      "be.visible",
    );
  });

  it("shows loading, missing-content, service-error, and invalid-contract states without blocking the page", () => {
    cy.intercept(
      "GET",
      `${apiUrl}/location/MOZ/narratives?locale=en`,
      (request) => {
        request.on("response", (response) => response.setDelay(800));
        request.reply({ statusCode: 404, body: {} });
      },
    ).as("missingNarrative");
    visitCountry("MOZ", "overview");
    cy.get('[data-cy="narrative-loading"]').should("be.visible");
    cy.wait("@missingNarrative");
    cy.get('[data-cy="narrative-not_found"]')
      .should("contain", "No saved narrative")
      .and("be.visible");
    cy.contains("Fund Portfolio Manager").should("be.visible");

    cy.intercept("GET", `${apiUrl}/location/KEN/narratives?locale=en`, {
      statusCode: 503,
      body: { error: "private upstream detail" },
    }).as("failedNarrative");
    visitCountry("KEN", "overview");
    cy.wait("@failedNarrative");
    cy.get('[data-cy="narrative-error"]')
      .should("contain", "temporarily unavailable")
      .and("not.contain", "private upstream detail");
    cy.contains("Fund Portfolio Manager").should("be.visible");

    cy.readFile(realMozambiqueBundle).then((bundle) => {
      bundle.sources[0].source_url = "javascript:alert(1)";
      cy.intercept(
        "GET",
        `${apiUrl}/location/MOZ/narratives?locale=en`,
        bundle,
      ).as("unsafeNarrative");
    });
    visitCountry("MOZ", "overview");
    cy.wait("@unsafeNarrative");
    cy.get('[data-cy="narrative-error"]')
      .should("contain", "temporarily unavailable")
      .and("be.visible");
    cy.get('a[href^="javascript:"]').should("not.exist");
  });

  it("ignores a stale response after in-app country navigation", () => {
    cy.readFile(realMozambiqueBundle).then((bundle) => {
      cy.intercept(
        "GET",
        `${apiUrl}/location/MOZ/narratives?locale=en`,
        (request) => {
          request.on("response", (response) => response.setDelay(1200));
          request.reply(bundle);
        },
      ).as("slowMozambiqueNarrative");
    });
    stubNarrativeFixture("KEN", "narratives/recipient.json");
    visitCountry("MOZ", "overview");
    cy.get('[data-cy="narrative-loading"]').should("be.visible");
    cy.window().then((win) => {
      win.history.pushState({}, "", "/location/KEN/access-to-funding");
      win.dispatchEvent(new PopStateEvent("popstate"));
    });
    cy.wait("@narrativeKEN");
    cy.url().should("include", "/location/KEN/access-to-funding");
    cy.get('[data-cy="narrative-unavailable"]')
      .should("contain", "not enough supporting evidence")
      .and("be.visible");
    cy.wait("@slowMozambiqueNarrative");
    cy.get("body").should("not.contain", "In MOZ, allocation");
  });

  it("renders claim text as text and exposes safe citations to the keyboard", () => {
    cy.readFile(realMozambiqueBundle).then((bundle) => {
      bundle.overview.claims[0].text =
        '<img src=x onerror="document.body.dataset.unsafe=1"> Saved claim';
      cy.intercept(
        "GET",
        `${apiUrl}/location/MOZ/narratives?locale=en`,
        bundle,
      ).as("safeNarrative");
    });
    visitCountry("MOZ", "overview");
    cy.wait("@safeNarrative");
    cy.contains(
      '<img src=x onerror="document.body.dataset.unsafe=1"> Saved claim',
    )
      .should("be.visible")
      .and("have.prop", "tagName", "SPAN");
    cy.get("body").should("not.have.attr", "data-unsafe");
    cy.get('[aria-label^="Source 1:"]')
      .should("have.attr", "href")
      .and("match", /^https:\/\//);
    cy.get('[aria-label^="Source 1:"]')
      .focus()
      .should("have.focus")
      .and("have.attr", "rel", "noreferrer");
  });

  it("preserves country tab rules for recipients, donors, sparse countries, and document-only Results", () => {
    stubRealMozambiqueBundle();
    visitCountry("MOZ", "overview");
    cy.wait("@narrativeMOZ");
    cy.contains('[data-cy="page-tab-button"]', "Resource Mobilization").should(
      "not.exist",
    );
    cy.contains('[data-cy="page-tab-button"]', "Results").should("exist");

    stubNarrativeFixture("USA", "narratives/donor.json");
    visitCountry("USA", "overview");
    cy.wait("@narrativeUSA");
    cy.contains('[data-cy="page-tab-button"]', "Resource Mobilization").should(
      "exist",
    );
    cy.contains('[data-cy="page-tab-button"]', "Results").should("not.exist");

    stubNarrativeFixture("NRU", "narratives/sparse.json");
    visitCountry("NRU", "overview");
    cy.wait("@narrativeNRU");
    cy.contains('[data-cy="page-tab-button"]', "Resource Mobilization").should(
      "not.exist",
    );
    cy.contains('[data-cy="page-tab-button"]', "Results").should("not.exist");
    cy.get('[data-cy="narrative-section"]').should("not.exist");

    stubNarrativeFixture("TLS", "narratives/document-only-results.json");
    visitCountry("TLS", "overview");
    cy.wait("@narrativeTLS");
    cy.contains('[data-cy="page-tab-button"]', "Results").should("exist");
  });

  it("renders the Overview narrative at a mobile viewport", () => {
    cy.viewport("iphone-x");
    stubRealMozambiqueBundle();
    visitCountry("MOZ", "overview");
    cy.wait("@narrativeMOZ");
    cy.contains('[data-cy="narrative-section"]', "Country overview").should(
      "be.visible",
    );
    cy.get('[aria-label^="Source 1:"]').should("be.visible");
    cy.screenshot("narrative-overview-mobile");
  });

  it("keeps funding and financial filters functional and labels narratives as default-view content", () => {
    stubRealMozambiqueBundle();
    cy.intercept("GET", `${apiUrl}/allocations/radial/MOZ*`, (request) => {
      if (request.query.periods === "2023 - 2025") {
        request.alias = "filteredAllocation";
      }
      request.reply({
        count: 1,
        data: [{ name: "HIV", value: 446058953 }],
      });
    });
    cy.intercept("GET", `${apiUrl}/disbursements/line-chart/**`, (request) => {
      if (request.query.cycleNames === "Grant Cycle 6") {
        request.alias = "filteredDisbursement";
      }
      request.reply({
        count: 1,
        data: [{ name: "HIV", data: [100] }],
        xAxisKeys: ["2024"],
      });
    });

    visitCountry("MOZ", "access-to-funding");
    cy.wait("@narrativeMOZ");
    cy.get("#allocation")
      .contains('[data-cy="chart-cycle-button"]', "2023-2025")
      .should("be.enabled")
      .click();
    cy.wait("@filteredAllocation")
      .its("request.query.periods")
      .should("equal", "2023 - 2025");
    cy.contains('[data-cy="narrative-section"]', "Allocations")
      .should("contain", "default view")
      .and("be.visible");

    visitCountry("MOZ", "financial-insights");
    cy.wait("@narrativeMOZ");
    cy.contains('[data-cy="narrative-section"]', "Disbursements")
      .should("contain", "default view")
      .and("be.visible");
    cy.contains('[data-cy="chart-cycle-button"]', "Grant Cycle 6")
      .should("be.enabled")
      .click();
    cy.wait("@filteredDisbursement")
      .its("request.query.cycleNames")
      .should("equal", "Grant Cycle 6");
    cy.contains('[data-cy="narrative-section"]', "Disbursements")
      .should("contain", "default view")
      .and("be.visible");
  });
});
