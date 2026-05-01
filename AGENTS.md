# AGENTS.md

Quick reference for agents. See [CLAUDE.md](./CLAUDE.md) for full details.

## Critical commands

```bash
yarn start          # dev server on http://localhost:3000
yarn lint           # ESLint + Prettier (runs as pre-commit hook via Husky)
yarn e2e            # run Cypress tests headless
yarn e2e-ui         # open Cypress Test Runner (GUI)
yarn build          # production build → build/
yarn storybook      # component explorer on port 6006
```

**Do not run `yarn test`** — it exits with an error. All testing is via Cypress E2E.

## Verified requirements

- **Node.js**: `>=22.0.0` (from `package.json` engines field)
- **Environment**: Create `.env` with `VITE_API`, `VITE_CMS_API`, `VITE_CMS_TOKEN`, `VITE_BASE_URL`, `VITE_MAPBOX_TOKEN`

## Key conventions

- Use `app/` alias for `src/app/` — never relative paths
- TypeScript is strict (`tsconfig.json` has `strict: true`)
- No separate typecheck command — `yarn lint` covers TypeScript via ESLint
- Prettier is hooked via Husky pre-commit, not a standalone script

## Testing notes

- Cypress E2E tests require both the app (`yarn start`) and the API running
- Run single spec: `npx cypress run --spec "cypress/e2e/your-spec.cy.ts"`

## State management

- Easy Peasy for global state; TanStack Query for report-builder queries
- API slices in `src/app/state/api/action-reducers/<domain>/`
- Access via `useStoreState` / `useStoreActions` hooks
