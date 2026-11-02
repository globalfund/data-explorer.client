/// <reference types="cypress" />
import type { E2ESession, E2EUser } from "../tasks/auth0";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Signs in as a test user without Auth0's login page. The app must be
       * built with VITE_AUTH0_CACHE_LOCATION=localstorage.
       */
      login(user?: E2EUser): Chainable<void>;
      /**
       * Calls the API directly as a test user, e.g. to seed or clean up.
       * Pass failOnStatusCode: false to assert on an error response.
       */
      api<T = unknown>(
        request: ApiRequest,
        user?: E2EUser,
      ): Chainable<Cypress.Response<T>>;
      /** Creates a report owned by the test user and yields its id. */
      createReport(
        report?: { name?: string; items?: unknown[] },
        user?: E2EUser,
      ): Chainable<string>;
      /** Deletes a report; one that's already gone is fine. */
      deleteReport(id: string, user?: E2EUser): Chainable<void>;
    }
  }
}

interface ApiRequest {
  method: string;
  path: string;
  body?: Cypress.RequestBody;
  failOnStatusCode?: boolean;
}

// Every report a spec creates starts with this, so a failed run's leftovers
// are easy to find and remove.
export const E2E_PREFIX = "[e2e]";

const getSession = (user: E2EUser) =>
  cy.task<E2ESession>("auth0:session", user, { log: false });

Cypress.Commands.add("login", (user: E2EUser = "owner") => {
  cy.session(
    ["auth0", user],
    () => {
      getSession(user).then((session) => {
        cy.visit("/report-builder", {
          onBeforeLoad(win) {
            Object.entries(session.entries).forEach(([key, value]) => {
              win.localStorage.setItem(key, JSON.stringify(value));
            });
            win.localStorage.setItem("accessToken", session.accessToken);
          },
        });
      });
      // A failed login sends the app to Auth0's page instead.
      cy.location("pathname").should("eq", "/report-builder");
    },
    {
      cacheAcrossSpecs: true,
      validate() {
        getSession(user).then((session) => {
          cy.request({
            url: `${Cypress.expose("api_url")}/auth/validate-token`,
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
        });
      },
    },
  );
});

Cypress.Commands.add("api", (request: ApiRequest, user: E2EUser = "owner") =>
  getSession(user).then((session) =>
    cy.request({
      method: request.method,
      url: `${Cypress.expose("api_url")}${request.path}`,
      body: request.body,
      failOnStatusCode: request.failOnStatusCode ?? true,
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }),
  ),
);

Cypress.Commands.add(
  "createReport",
  (
    report: { name?: string; items?: unknown[] } = {},
    user: E2EUser = "owner",
  ) =>
    cy
      .api<{ id: string }>(
        {
          method: "POST",
          path: "/report",
          body: {
            name: report.name ?? `${E2E_PREFIX} ${Date.now()}`,
            description: "Created by an end-to-end test",
            items: report.items ?? [],
            // Same defaults as the "New report" dialog on a 1440px screen.
            settings: {
              width: "1392",
              height: "660",
              padding: ["50", "50", "50", "50"],
              stroke: "0",
              strokeColor: "#000000",
              backgroundColor: "#ffffff",
              borderRadius: "0",
            },
          },
        },
        user,
      )
      .its("body.id"),
);

Cypress.Commands.add("deleteReport", (id: string, user: E2EUser = "owner") => {
  cy.api(
    { method: "DELETE", path: `/report/${id}`, failOnStatusCode: false },
    user,
  )
    .its("status")
    .should("be.oneOf", [204, 404]);
});
