/// <reference types="cypress" />

const api = "http://api.test";
const narrativeUrl = `${api}/narratives/pages/access-to-funding/global?locale=en&scope_key=default`;
const cycles = ["2017-2019", "2020-2022", "2023-2025", "2026-2028"];
const topics = [
  "eligibility",
  "allocation",
  "allocation_cycles",
  "funding_requests",
];
const panel = (topic: string) =>
  cy.get(`[data-narrative-id="access_to_funding.${topic}"]`);
const shown = (...names: string[]) =>
  names.forEach((name) => panel(name).should("exist"));
const hidden = (...names: string[]) =>
  names.forEach((name) => panel(name).should("not.exist"));
const stub = (
  years: number[] = [2026, 2025],
  allocationCycles = cycles,
  seriesCycles = cycles,
  delay = 0,
) => {
  cy.intercept("GET", "http://cms.test/**", { body: { data: [] } });
  cy.intercept("GET", `${api}/**`, (req) => {
    const url = new URL(req.url);
    const replies: Record<string, unknown> = {
      "/eligibility/years": { data: years },
      "/allocations/cycles": {
        data: allocationCycles.map((value) => ({ value })),
      },
      "/filter-options/geography/Standard View": {
        data: {
          id: "geography",
          name: "Locations",
          options: [{ name: "Test country", value: "TST" }],
        },
      },
      "/filter-options/components/grouped": {
        data: {
          id: "component",
          name: "Components",
          options: [{ name: "HIV", value: "HIV" }],
        },
      },
      "/latest-update": {
        data: [
          { name: "eligibility", date: "2026-02-06" },
          { name: "allocations", date: "2026-06-09" },
          { name: "funding_requests", date: "2025-04-15" },
        ],
      },
      "/eligibility/table": {
        years: ["2026", "2025"],
        data: [
          {
            name: "Test country",
            _children: [
              {
                name: "HIV",
                _children: [
                  { name: "Disease Burden", 2026: "High", 2025: "High" },
                  { name: "Eligibility", 2026: "Eligible", 2025: "Eligible" },
                ],
              },
            ],
          },
        ],
      },
      "/allocations/sunburst": {
        data: [
          {
            name: "Test region",
            value: 100,
            children: [
              { name: "Test country", value: 60 },
              { name: "Other country", value: 40 },
            ],
          },
        ],
      },
      "/allocations/treemap": {
        data: [{ name: "HIV", value: 100, itemStyle: { color: "#013E77" } }],
      },
      "/allocations/table": {
        data: [
          {
            name: "Test country",
            "2026-2028": 100,
            "2023-2025": 90,
            _children: [{ name: "HIV", "2026-2028": 100, "2023-2025": 90 }],
          },
        ],
      },
      "/allocations/cumulative-by-cycles": {
        keys: seriesCycles,
        data: [
          { name: "Total Allocation", values: seriesCycles.map(() => 100) },
          { name: "HIV", values: seriesCycles.map(() => 100) },
        ],
      },
      "/funding-requests": {
        data: [
          {
            components: "Test country",
            _children: [
              {
                components: "HIV",
                submissionDate: "17 Feb 2025",
                approach: "Tailored",
                trpWindow: "Window 7",
                trpOutcome: "Grant Making",
                _children: [{ grant: "TEST" }],
              },
            ],
          },
        ],
      },
    };
    const body = url.pathname.startsWith("/eligibility/stats/")
      ? { data: [{ name: "HIV", value: 1 }] }
      : (replies[decodeURIComponent(url.pathname)] ?? {
          count: 0,
          data: [],
          stats: [],
        });
    req.reply({
      body,
      delay: [
        "/eligibility/years",
        "/allocations/cycles",
        "/allocations/cumulative-by-cycles",
      ].includes(url.pathname)
        ? delay
        : 0,
    });
  });
  cy.intercept("GET", narrativeUrl, {
    fixture: "narratives/access-to-funding-page.json",
  }).as("saved");
};
const visit = (path = "/access-to-funding") => {
  cy.visit(path);
  cy.wait("@saved");
};
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
const dropdownButton = (scope: string | null, current: string) =>
  (scope ? cy.get(scope) : cy.get("body")).contains(
    '[data-cy="category-dropdown-button"]',
    new RegExp(`^${current}$`),
  );
const dropdown = (scope: string | null, current: string, next: string) => {
  dropdownButton(scope, current).scrollIntoView({
    offset: { top: -150, left: 0 },
  });
  settleScroll();
  dropdownButton(scope, current).click({ scrollBehavior: false });
  cy.get('[role="menuitem"]')
    .filter(":visible")
    .contains(new RegExp(`^${next}$`))
    .click({ scrollBehavior: false });
};
const filterButton = (block?: string) =>
  block
    ? cy.get(`#${block}`).contains("button", "Filters")
    : cy.get('[data-cy="datasets-filter-btn"]');
const openFilter = (block?: string) => {
  filterButton(block).scrollIntoView({ offset: { top: -150, left: 0 } });
  settleScroll();
  filterButton(block).click({ scrollBehavior: false });
};
const choose = (name = "HIV") => {
  cy.get('[data-cy="filter-panel"]')
    .contains('[role="tab"]', name === "HIV" ? "Components" : "Locations")
    .click({ scrollBehavior: false });
  cy.get('[data-cy="filter-panel"]')
    .find(`input[name="${name}"]`)
    .check({ scrollBehavior: false });
};
const apply = () =>
  cy
    .get('[data-cy="filter-panel"]')
    .contains("button", "Apply")
    .click({ scrollBehavior: false });
const reset = (block?: string) => {
  openFilter(block);
  cy.get('[data-cy="filter-panel"]')
    .contains("button", "Reset")
    .click({ scrollBehavior: false });
  apply();
};
const search = (block: string, value: string) => {
  cy.get(`#${block}`)
    .find('[aria-label="Search button"]')
    .scrollIntoView({ offset: { top: -150, left: 0 } });
  settleScroll();
  cy.get(`#${block}`)
    .find('[aria-label="Search button"]')
    .click({ scrollBehavior: false });
  cy.get(`#${block}`)
    .find('[aria-label="Search input"]')
    .type(value, { scrollBehavior: false });
};

describe("Access to Funding saved narratives", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (error) => {
      if (
        error.message.includes(
          "ResizeObserver loop completed with undelivered notifications.",
        )
      )
        return false;
    });
  });
  it("places four sections below their blocks with one shared GET", () => {
    stub();
    visit();
    shown(...topics);
    for (const [topic, anchor] of [
      ["eligibility", "#eligibility"],
      ["allocation", "#allocation"],
      ["allocation_cycles", '[data-cy="allocation-block-2"]'],
      ["funding_requests", "#funding-requests"],
    ]) {
      panel(topic).then(($panel) =>
        cy
          .get(anchor)
          .then(($anchor) =>
            expect(
              $panel[0].compareDocumentPosition($anchor[0]) &
                Node.DOCUMENT_POSITION_PRECEDING,
            ).to.be.greaterThan(0),
          ),
      );
    }
    cy.get("@saved.all").should("have.length", 1);
  });
  it("matches the fixed year and cycle, independently restoring each", () => {
    stub();
    visit();
    shown(...topics);
    dropdown(null, "2026", "2025");
    hidden("eligibility");
    shown("allocation", "allocation_cycles", "funding_requests");
    dropdown(null, "2025", "2026");
    shown("eligibility");
    dropdown("#allocation", "2026-2028", "2023-2025");
    hidden("allocation");
    shown("eligibility", "allocation_cycles", "funding_requests");
    dropdown("#allocation", "2023-2025", "2026-2028");
    shown(...topics);
    cy.get("@saved.all").should("have.length", 1);
  });
  for (const [block, topic] of [
    ["eligibility", "eligibility"],
    ["allocation", "allocation"],
    ["funding-requests", "funding_requests"],
  ]) {
    it(`keeps draft/cancel scope and independently applies/restores ${block} filters`, () => {
      stub();
      visit();
      shown(...topics);
      openFilter(block);
      choose();
      shown(...topics);
      cy.get('[data-cy="filter-panel"]')
        .contains("button", "Cancel")
        .click({ scrollBehavior: false });
      shown(...topics);
      openFilter(block);
      choose();
      apply();
      hidden(topic);
      shown(...topics.filter((name) => name !== topic));
      reset();
      hidden(topic);
      reset(block);
      shown(...topics);
      openFilter(block);
      choose("Test country");
      apply();
      hidden(topic);
      shown(...topics.filter((name) => name !== topic));
      reset(block);
      shown(...topics);
      cy.get("@saved.all").should("have.length", 1);
    });
  }
  for (const [block, topic] of [
    ["eligibility", "eligibility"],
    ["allocation", "allocation"],
    ["funding-requests", "funding_requests"],
  ]) {
    it(`hides and restores ${block} search independently`, () => {
      stub();
      visit();
      shown(...topics);
      if (block === "allocation")
        dropdown("#allocation", "Sunburst Chart", "Table View");
      search(block, "Test");
      hidden(topic);
      shown(...topics.filter((name) => name !== topic));
      if (block === "allocation") {
        dropdown("#allocation", "Table View", "Treemap");
        hidden(topic);
        dropdown("#allocation", "Treemap", "Table View");
      }
      cy.get(`#${block}`)
        .find('[aria-label="Search input"]')
        .clear({ scrollBehavior: false });
      shown(...topics);
      cy.get("@saved.all").should("have.length", 1);
    });
  }
  for (const filter of ["HIV", "Test country"]) {
    it(`hides all panels for page ${filter} filter and restores default`, () => {
      stub();
      visit();
      shown(...topics);
      openFilter();
      choose(filter);
      apply();
      hidden(...topics);
      reset();
      shown(...topics);
      cy.get("@saved.all").should("have.length", 1);
    });
  }
  it("maps URL cycles only to eligibility/funding requests", () => {
    stub();
    visit("/access-to-funding?cycles=2023-2025");
    hidden("eligibility", "funding_requests");
    shown("allocation", "allocation_cycles");
    reset();
    shown(...topics);
    cy.get("@saved.all").should("have.length", 1);
  });
  it("retains representation scope and hides sunburst drill until total restoration", () => {
    stub();
    visit();
    shown(...topics);
    cy.get("#sunburst-chart").scrollIntoView({
      offset: { top: -150, left: 0 },
    });
    settleScroll();
    const drill = () =>
      cy
        .get("#sunburst-chart svg")
        .should(($svg) => {
          const bounds = $svg[0].getBoundingClientRect();
          const point = new DOMPoint(
            bounds.width / 2 + Math.min(bounds.width, bounds.height) * 0.325,
            bounds.height / 2,
          );
          expect(
            Array.from($svg[0].querySelectorAll("path")).some((path) =>
              path.isPointInFill(point),
            ),
          ).to.equal(true);
        })
        .then(($svg) => {
          const bounds = $svg[0].getBoundingClientRect();
          const point = {
            clientX:
              bounds.left +
              bounds.width / 2 +
              Math.min(bounds.width, bounds.height) * 0.325,
            clientY: bounds.top + bounds.height * 0.5,
            offsetX:
              bounds.width / 2 + Math.min(bounds.width, bounds.height) * 0.325,
            offsetY: bounds.height * 0.5,
            eventConstructor: "MouseEvent",
            force: true,
          };
          cy.wrap($svg)
            .trigger("mousemove", point)
            .trigger("mousedown", point)
            .trigger("mouseup", point)
            .trigger("click", point);
        });
    drill();
    hidden("allocation");
    shown("eligibility", "allocation_cycles", "funding_requests");
    cy.get("#allocation")
      .contains(/^Total$/)
      .click({ force: true });
    shown("allocation");
    drill();
    hidden("allocation");
    dropdown("#allocation", "Sunburst Chart", "Treemap");
    shown("allocation");
    dropdown("#allocation", "Treemap", "Table View");
    shown("allocation");
    dropdown("#allocation", "Table View", "Sunburst Chart");
    hidden("allocation");
    cy.get("#allocation")
      .contains(/^Total$/)
      .click({ force: true });
    shown("allocation");
    cy.get("@saved.all").should("have.length", 1);
  });
  it("hides uninitialized selectors/series and fixed-snapshot selector drift", () => {
    stub(
      [2027, 2026],
      [...cycles, "2029-2031"],
      [...cycles, "2029-2031"],
      1200,
    );
    visit();
    hidden("eligibility", "allocation", "allocation_cycles");
    shown("funding_requests");
    cy.contains('[data-cy="category-dropdown-button"]', "2027").should("exist");
    cy.get("#allocation")
      .contains('[data-cy="category-dropdown-button"]', "2029-2031")
      .should("exist");
    hidden("eligibility", "allocation", "allocation_cycles");
    dropdown(null, "2027", "2026");
    dropdown("#allocation", "2029-2031", "2026-2028");
    shown("eligibility", "allocation");
    hidden("allocation_cycles");
  });
  it("renders mobile panels and accessible citations", () => {
    cy.viewport("iphone-x");
    stub();
    visit();
    shown(...topics);
    panel("funding_requests").scrollIntoView().should("be.visible");
    panel("eligibility")
      .find('[aria-label^="Source 1:"]')
      .first()
      .focus()
      .should("have.focus");
  });
});
