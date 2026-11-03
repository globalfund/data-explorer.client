# End-to-end tests

Run `yarn e2e` headless or `yarn e2e-ui` interactively. Report builder specs
live in `cypress/e2e/report-builder/`; `yarn e2e:rb` runs only those.

## How logged-in specs sign in

`cy.login()` doesn't use Auth0's login page. A Cypress task signs the test user
in with Auth0's password grant from Node (so passwords never reach the browser),
then writes the tokens to localStorage in the format the Auth0 SDK reads
(`cypress/support/auth0-cache.ts`). The app only reads tokens from localStorage
when built with `VITE_AUTH0_CACHE_LOCATION=localstorage`. Normal builds keep
the in-memory cache and ignore those entries.

The session is cached across specs, and the task logs in at most once per
user per run, because Auth0 rate-limits its token endpoint.

## One-time Auth0 setup

Use a development or test tenant, never production. The API server must trust
the same tenant and audience.

1. **Allow the password grant.** On the application the app uses
   (`VITE_AUTH0_CLIENT_ID`), go to Advanced Settings → Grant Types and enable
   **Password**.
2. **Choose the database connection.** Under Tenant Settings → API
   Authorization Settings, set **Default Directory** to the database
   connection the test users are in (e.g. `Username-Password-Authentication`).
   Or leave it empty and set `E2E_AUTH0_REALM` to the connection name.
3. **Create two test users** in that connection: the main user, plus a second
   one for "someone else's report" specs. Make sure neither is challenged by
   MFA or bot detection.
4. If the application requires a client secret for the token endpoint, set
   `E2E_AUTH0_CLIENT_SECRET`.

## Environment

Read from the client's `.env` (git-ignored) or the shell. In CI they come from
the repository's `CI_` secrets (see [CI](#ci)).

| Variable                                                           | Purpose                                                                       |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `VITE_BASE_URL`, `VITE_API`                                        | Client and API URLs, e.g. `http://localhost:3000` and `http://localhost:4200` |
| `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE` | Same values as the app; the login task requests tokens with them              |
| `TEST_USER_1_EMAIL`, `TEST_USER_1_PASSWORD`                        | Main test user                                                                |
| `TEST_USER_2_EMAIL`, `TEST_USER_2_PASSWORD`                        | Second test user; only needed by `cy.login("other")`                          |
| `E2E_AUTH0_REALM`                                                  | Optional: database connection, if the tenant has no Default Directory         |
| `E2E_AUTH0_CLIENT_SECRET`                                          | Optional: only if the application requires one                                |

## Running the stack locally

1. **MongoDB and Redis** on their default ports.
2. **`data-explorer.backend`** on port 5000 (`uv run flask run`, or
   `docker compose up -d`). It serves dataset samples and pages to the API
   server, and its `parsed-data-files/` are what charts, tables and KPIs read.
   Those files aren't in git; generate them with `GET /update-tgf-datasets`
   (takes a few minutes). Its `GF_BACKEND_API_KEY` must match the API
   server's.
3. **`data-explorer-server`**: `yarn start` (port 4200) with
   `BACKEND_API_BASE_URL=http://localhost:5000`, `FRONTEND_URL` set to the
   client URL, and the same Auth0 domain and audience. Run `yarn worker` too
   for report thumbnails.
4. **The client**, in test mode: `VITE_AUTH0_CACHE_LOCATION=localstorage yarn start`.

## CI

`.github/workflows/e2e-report-builder.yml` runs `yarn e2e:rb` on every pull
request, and on demand from the Actions tab. It starts MongoDB and Redis, checks
out and starts `data-explorer.server`, and builds the client in test mode. The
data backend isn't started, because these specs don't use it. When a run fails,
the screenshots and the server and client logs are uploaded with it.

It tests against the `data-explorer.server` branch with the same name as the
pull request's branch, otherwise its base branch's, otherwise `feat/rb`. A manual
run can name another one.

Add these as repository secrets under Settings → Secrets and variables →
Actions, or with `gh secret set <name> --repo globalfund/data-explorer.client`.
Only the workflows use them, so their names start with `CI_`. The Auth0 values
are secrets too, because the repository is public and variable values show up
in the run logs.

| Name                                                                                                 | Value                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `CI_AUTH0_DOMAIN`, `CI_AUTH0_CLIENT_ID`, `CI_AUTH0_AUDIENCE`                                         | The `VITE_AUTH0_*` values from `.env`; the API server gets the same domain and audience                                                        |
| `CI_AUTH0_REALM`                                                                                     | Optional: the `E2E_AUTH0_REALM` value, as above                                                                                                |
| `CI_TEST_USER_1_EMAIL`, `CI_TEST_USER_1_PASSWORD`, `CI_TEST_USER_2_EMAIL`, `CI_TEST_USER_2_PASSWORD` | The test users (`TEST_USER_*` above)                                                                                                           |
| `CI_RB_CORE_TOKEN`                                                                                   | A token that can read `rb-core.charts` (see [Access to rb-core.charts](../README.md#access-to-rb-corecharts)). The Jest workflow needs it too. |

Pull requests from forks are skipped, since they don't get secrets.

## Writing specs

- Start logged-in specs with `cy.login()` (or `cy.login("other")`).
- Seed and clean up through the API rather than the UI:
  - `cy.createReport({ name, items })` yields the new id; `cy.deleteReport(id)`
    removes it.
  - `cy.api({ method, path, body })` covers everything else. Add
    `failOnStatusCode: false` to assert on an error status.
- Prefix anything you create with `E2E_PREFIX` from `cypress/support/commands`
  (`uniqueName()` in `cypress/support/report-builder` does this), and delete it
  in `afterEach`, so a failed run's leftovers are easy to find.
- Select report builder controls by their `data-cy` attribute (`rb-…`), and a
  report's dashboard card with `reportCard(id)`. Labels come from the CMS and
  can change.
- To check an autosave, intercept the report's PATCH and use `waitForSave()`,
  which skips earlier saves of half-typed edits.
