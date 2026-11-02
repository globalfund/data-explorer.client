import type { Interception } from "cypress/types/net-stubbing";
import { E2E_PREFIX } from "./commands";

/** A name that marks the report as test data and won't clash across runs. */
export const uniqueName = (label: string) =>
  `${E2E_PREFIX} ${label} ${Date.now()}`;

/** A report's card on the dashboard (cards view, the default). */
export const reportCard = (id: string) =>
  cy.get(`[data-cy="rb-report-card"][data-id="${id}"]`);

/**
 * Waits for an autosave request whose body matches, skipping earlier saves
 * (say, of a half-typed name). Intercept the PATCH as `alias` first.
 */
export const waitForSave = (
  alias: `@${string}`,
  matches: (body: Record<string, unknown>) => boolean,
  attempts = 5,
): Cypress.Chainable<Interception> =>
  cy.wait(alias).then((interception) => {
    if (matches(interception.request.body)) return cy.wrap(interception);
    if (attempts <= 1) {
      throw new Error(`No ${alias} request had the expected content.`);
    }
    return waitForSave(alias, matches, attempts - 1);
  });
