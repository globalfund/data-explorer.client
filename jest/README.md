# Frontend report regression tests

Run `yarn test` for Jest, `yarn test:watch` during development, or
`yarn test:ci` for the same coverage check used on every pull request.
`yarn test:coverage --runInBand` generates the HTML report at
`coverage/lcov-report/index.html`.

The suite covers component creation and completion, persisted change detection,
real Easy Peasy state transitions and item hooks, autosave debounce and stale
save responses, authenticated report queries and mutations, dataset pagination,
table compatibility and formatting, chart layout parsing and legends, title
editing, and browser/server export behavior including cleanup and failures.

State/hook tests use fresh real stores; query tests use real React Query clients
with only the HTTP boundary mocked. Header tests retain the real debounce, store,
and Material UI while replacing unrelated dialogs and data hooks. Export tests
mock image/PDF rendering because jsdom has no layout or canvas renderer.
These tests do not replace browser checks for drag/drop, chart rendering,
rich-text editing, responsive layout, or pixel-level exported image correctness.

Coverage thresholds apply to the core modules explicitly listed in
`jest.config.cjs`: 90% statements/functions/lines and 85% branches. The header
and query integration tests exercise the selected workflows rather than claiming
complete coverage of these large modules. Expand the explicit coverage scope as
additional workflows receive tests; do not lower thresholds to accept regressions.

Babel transformation is isolated to Jest and supplies a fixed `import.meta.env`
fixture. Tests never read developer `.env` files or contact the production API.
CSS and image modules have small Jest-only stubs. Watchman is disabled so the
suite runs without a system service.
