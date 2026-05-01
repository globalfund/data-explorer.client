# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The Global Fund Data Explorer — a React/TypeScript frontend that visualizes investment and results data for the fight against AIDS, tuberculosis, and malaria. It connects to a [data middleware API](https://github.com/globalfund/data-explorer-server/) and a Strapi CMS.

## Environment setup

Create a `.env` file in the project root:

```
VITE_API=<data middleware api url>          # e.g. http://localhost:4200
VITE_CMS_API=<strapi cms api url>
VITE_CMS_TOKEN=<strapi cms api token>
VITE_BASE_URL=<app base url>               # e.g. http://localhost:3000 (used by Cypress)
VITE_MAPBOX_TOKEN=<mapbox token>
```

## Commands

```bash
yarn install          # install dependencies
yarn start            # dev server on http://localhost:3000
yarn build            # production build → build/
yarn lint             # ESLint (TypeScript + React + a11y + prettier)
yarn storybook        # component explorer on port 6006
yarn e2e-ui           # open Cypress Test Runner (GUI)
yarn e2e              # run Cypress tests headless
yarn generate-sitemap # generate sitemap.xml
```

There is no unit test runner configured — `yarn test` will exit with an error. Testing is done exclusively via Cypress E2E.

## Architecture

### Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Easy Peasy** (Redux-based) for global state
- **TanStack Query** for server state (report-builder queries)
- **MUI v6** for UI components
- **ECharts** for all data visualizations
- **React Router v6** for routing
- **Axios** for HTTP calls (wrapped in the `APIModel` pattern)
- **Tiptap** for rich text editing (in report builder)
- **Styled Components** alongside MUI

### Path alias

`app/` maps to `src/app/` — use this alias throughout, never relative `../../` paths.

### State management (`src/app/state/`)

All API data lives in an Easy Peasy store (`src/app/state/store/`). The pattern:

1. Each data slice is defined in `src/app/state/api/action-reducers/<domain>/<name>.ts` using the `APIModel` factory:
   ```ts
   export const HomeResultsStats: ApiCallModel = {
     ...APIModel(`${import.meta.env.VITE_API}/results/stats`),
   };
   ```
2. `APIModel` provides `loading`, `success`, `data`, `errorData`, and thunks `fetch` / `post` / `clear` / `setData`.
3. All slices are assembled in `src/app/state/store/index.ts` and typed via `StoreModel` in `src/app/state/api/interfaces/`.
4. Components access state via `useStoreState` / `useStoreActions` from `app/state/store/hooks`.

Sync/filter state (applied filters, search term) lives in `src/app/state/api/action-reducers/sync/`.

Filters are serialized into URL query params by `useUrlFilters` hook and synced back to the store on mount.

### Routing (`src/app/router/`)

Routes are declared as plain config objects in `src/app/router/paths.ts` (`ROUTE_CONFIGS`) and converted to React Router `RouteObject[]` in `src/app/router/data.tsx` using lazy imports. Main routes:

| Path | Page |
|------|------|
| `/` | Home |
| `/geography` | Geography |
| `/grants` / `/grant/:id/:ip/:tab` | Grants & Grant detail |
| `/location/:id/:tab` | Location detail |
| `/resource-mobilization` | Dataset page |
| `/access-to-funding` | Dataset page |
| `/financial-insights` | Dataset page |
| `/annual-results` | Dataset page |
| `/report-builder` | Report builder list |
| `/report-builder/reports/:id/edit` | Report builder editor |
| `/report-builder/reports/:id` | Report preview |

### Component patterns (`src/app/components/`)

- **`ChartBlock`** — the standard wrapper for every visualization: handles loading state, title/subtitle, export buttons, cycle selectors, and dropdown chart-type switchers. Almost every chart is rendered inside a `ChartBlock`.
- **`charts/<type>/`** — individual ECharts-based chart components (bar, line, heatmap, sankey, treemap, radial, etc.). Each exposes a typed props interface and an `index.tsx`.
- **`filters/`** — global filter panel that dispatches to `AppliedFiltersState`.
- **`page/`** — layout wrapper providing consistent page chrome.

### Pages (`src/app/pages/`)

Each page fetches its own data by calling `useStoreActions` to dispatch `.fetch()` in a `useEffect`, and reads `useStoreState` for loading/data. Dataset pages (`datasets/`) follow an identical structure: stats header, tabs with charts, each chart in a `ChartBlock`.

### Report Builder (`src/app/pages/report-builder/`)

The most complex feature. Three sub-pages:
- `main/` — list of saved reports
- `builder/` — drag-and-drop canvas to compose a report from chart blocks
- `preview/` — read-only rendered report

Report state is managed by a dedicated set of Easy Peasy slices under `src/app/state/api/action-reducers/report-builder/` and also uses TanStack Query hooks in `src/app/hooks/queries/report-builder.ts`.

### CMS integration

Content (labels, tooltips, chart descriptions) is loaded from Strapi CMS at startup via `useCMSData` hook and stored under `CMSData` in the Easy Peasy store. Components read CMS fields through `getCMSDataField(cmsData, 'fieldName')` utility.

## Linting & formatting

ESLint is configured with TypeScript, React, react-hooks, import, jsx-a11y, and prettier plugins (`eslint.config.js`). Prettier runs as a pre-commit hook via Husky. Run `yarn lint` before committing.

## Cypress E2E tests (`cypress/e2e/`)

Tests require both the app (`yarn start`) and the API to be running. Set `VITE_BASE_URL` in `.env`. Run a single spec:

```bash
npx cypress run --spec "cypress/e2e/your-spec.cy.ts"
```
