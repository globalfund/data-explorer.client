# The Data Explorer

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/globalfund/data-explorer-client/blob/main/LICENSE.MD) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=globalfund_data-explorer-client&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=globalfund_data-explorer-client) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=globalfund_data-explorer-client&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=globalfund_data-explorer-client) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=globalfund_data-explorer-client&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=globalfund_data-explorer-client)

## What is the Data Explorer?

This tool allows the exploration of data on investments and results in the fight against AIDS, tuberculosis and malaria around the world.

The Global Fund invests in smart, effective health programs to end AIDS, tuberculosis and malaria as epidemics. The Data Explorer visualizes where our investments come from, where they are and what they achieve by providing pledge and contribution data, grant financial data, and results data at global, regional and country levels.

We regularly improve and enhance the Data Explorer, and those updates are noted on the <a href= "https://www.theglobalfund.org/en/updates/" target="_blank">Data Explorer Updates</a> page on the Global Fund website. The data behind the Data Explorer and our API are available through the <a href="https://data-service.theglobalfund.org/" target="_blank">Global Fund Data Service </a>.

It makes use of [Data API Middleware](https://github.com/globalfund/data-explorer-server/) in order to retrieve all data needed for the visualisations/tables/filters and detail pages.

## About the project

- Website: <a href="https://data.theglobalfund.org" target="_blank">data.theglobalfund.org</a>
- Authors: <a href="https://www.zimmerman.team/" target="_blank">Zimmerman</a>
- Github Repo:
  - Frontend: <a href="https://github.com/globalfund/data-explorer-client" target="_blank">https://github.com/globalfund/data-explorer-client</a>
  - Backend: <a href="https://github.com/globalfund/data-explorer-server" target="_blank">https://github.com/globalfund/data-explorer-server</a>

## Installation

In order to be able to successfully run or build the app you need to create an environment file `.env` in the project root directory and fill it with the following:

```
REACT_APP_API=<data middleware api url>
REACT_APP_CMS_API=<strapi cms api url>
REACT_APP_CMS_TOKEN=<strapi cms api token>
```

`REACT_APP_API`: is the url where the data middleware API runs on. If running [Data API Middleware](https://github.com/globalfund/data-explorer-server/) locally then you can use `http://localhost:4200`.

`REACT_APP_MAPBOX_TOKEN`: to get a mapbox token you will need to register on their [website](https://www.mapbox.com).The token will be used to identify you and start serving up map tiles. The service is free until a certain level of traffic is exceeded.

`REACT_APP_CMS_API`: is the url where the [Strapi CMS API](https://github.com/zimmerman-team/CMS/) runs on. The project/de branch.

`REACT_APP_CMS_TOKEN`: is the API token retrieved from the Strapi CMS interface.

### Saved country narratives

Narratives are disabled unless `VITE_ENABLE_NARRATIVES=true` is set at build time. When enabled, the client reads saved bundles through the configured middleware base URL in `VITE_API`, using `/location/{ISO3}/narratives?locale=en`. Narrative-service credentials remain server-side and must not be placed in browser environment variables or returned in bundles.

Run `yarn tsx scripts/test-narratives.ts` for runtime contract checks and `yarn build` for the production build. `tests/fixtures/country-bundle-moz.json` was serialized by the Python Narrative Engine using synthetic source data and an offline provider. Cypress country fixtures test presentation and do not represent reviewed live-model prose.

With Node 22, start the fixture-based browser environment in one terminal:

```sh
BROWSER=none VITE_ENABLE_NARRATIVES=true VITE_API=http://api.test VITE_CMS_API=http://cms.test yarn start --host 127.0.0.1 --port 4173 --strictPort
```

In another terminal:

```sh
VITE_BASE_URL=http://127.0.0.1:4173 yarn cypress run --config-file cypress.narratives.config.ts --browser electron
```

For the disabled suite, start a separate Vite instance and run its dedicated configuration:

```sh
BROWSER=none VITE_ENABLE_NARRATIVES=false VITE_API=http://api.test VITE_CMS_API=http://cms.test yarn start --host 127.0.0.1 --port 4175 --strictPort
# In another terminal:
VITE_BASE_URL=http://127.0.0.1:4175 yarn cypress run --config-file cypress.narratives-off.config.ts --browser electron
```

The narrative specs live in `cypress/narratives/`, outside default `cypress/e2e/` discovery. The existing `yarn e2e` command and its tests remain unchanged. Each dedicated configuration selects exactly one narrative suite. These specs intercept data and CMS requests, so neither a real CMS nor an API key is needed.

---

In the project directory, you can run:

### `yarn install`

Installs all necessary dependencies.

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Tests - Cypress

Cypress is used for end-to-end testing to ensure that the application functions as expected in the browser. To run the Cypress tests, follow these steps:

In addition to the env variables above the following is also needed for cypress tests to run successfully:

```
REACT_APP_BASE_URL
```

`REACT_APP_BASE_URL`: This is the url your application runs on locally it's usually `http://localhost:3000`

### Install Cypress dependencies

If you haven't already installed Cypress, ensure all dependencies are installed by running:

#### `yarn install`

### Start the Application

Ensure your application is running before starting the Cypress tests. You can do this by running:

#### `yarn start`

### Open Cypress Test Runner

Open the Cypress Test Runner by running:

#### `yarn cypress open`

### Run Cypress Tests in Headless Mode

Alternatively, you can run all Cypress tests in headless mode (without the GUI) directly from the command line using:

#### `yarn cypress run`

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## How should I contribute?

- As we use semantic-release for automated git releases your commits must comply with the following commit types:

```
feat: A new feature
fix: A bug fix
docs: Documentation only changes
style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
refactor: A code change that neither fixes a bug nor adds a feature
perf: A code change that improves performance
test: Adding missing or correcting existing tests
chore: Changes to the build process or auxiliary tools and libraries such as documentation generation
```

- Always try to reference issues in commit messages or pull requests ("related to #614", "closes #619" and etc.).
- Avoid huge code commits where the difference can not even be rendered by browser based web apps (Github for example). Smaller commits make it much easier to understand why and how the changes were made, why (if) it results in certain bugs and etc.
- If there's a reason to commit code that is commented out (there usually should be none), always leave a "FIXME" or "TODO" comment so it's clear for other developers why this was done.
- Automatic code quality / testing checks (continuous integration tools) are implemented to check all these things automatically when pushing / merging new branches. Quality is the key!
