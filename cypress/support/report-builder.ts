import type { Interception } from "cypress/types/net-stubbing";
import { E2E_PREFIX } from "./commands";

/** A name that marks the report as test data and won't clash across runs. */
export const uniqueName = (label: string) =>
  `${E2E_PREFIX} ${label} ${Date.now()}`;

// The visual options the editor saves for a new bar chart.
const BAR_CHART_OPTIONS = {
  showChartName: true,
  chartTitle: "Bar Chart",
  chartTitleOptions: {
    fontFamily: "IBM Plex Sans",
    fontWeight: "600",
    fontSize: "16",
    textColor: "#161616",
    backgroundColor: "#FFFFFF",
    position: "top",
    align: "left",
  },
  chartOrientation: "vertical",
  showLegend: true,
  legendPosition: "bottom",
  legendTextOptions: {
    fontFamily: "IBM Plex Sans",
    fontWeight: "600",
    fontSize: "12",
    textColor: "#6F6F6F",
    backgroundColor: "#FFFFFF",
  },
  paddingLeft: "10px",
  paddingTop: "10px",
  paddingRight: "10px",
  paddingBottom: "10px",
  width: "100%",
  height: "500px",
  colorPalette: "default",
  customBarWidth: true,
  barWidth: 30,
  strokeWidth: "0px",
  strokeColor: "#000000",
  cornerRadius: "0px",
  background: "#FFFFFF",
  logarithmicYAxis: false,
  realTimeSort: false,
  showTooltip: true,
  monetaryValueTooltip: false,
  customYAxisName: false,
  yAxisName: "",
  customXAxisName: false,
  xAxisName: "",
  groupStyle: "grouped",
};

/**
 * A configured bar chart for seeding with cy.createReport. Its data comes
 * from the Global Fund dataset given, which CI serves from cypress/fixtures.
 */
export const barChartItem = (chart: {
  dataset: string;
  mapping: Record<string, unknown>;
  appliedFilters?: Record<string, string[]>;
}) => ({
  // Report items get ObjectId-like ids from the editor.
  id: Cypress._.times(24, () => Cypress._.random(15).toString(16)).join(""),
  type: "chart",
  initialized: true,
  data: { chartType: "bar", appliedFilters: {}, ...chart },
  options: BAR_CHART_OPTIONS,
});

/** A report's card on the dashboard (cards view, the default). */
export const reportCard = (id: string) =>
  cy.get(`[data-cy="rb-report-card"][data-id="${id}"]`);

/**
 * Waits for an intercepted request whose body matches, skipping earlier ones
 * (say, saves of a half-typed name). Intercept it as `alias` first.
 */
export const waitForRequest = (
  alias: `@${string}`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matches: (body: any) => boolean,
  attempts = 5,
): Cypress.Chainable<Interception> =>
  cy.wait(alias).then((interception) => {
    if (matches(interception.request.body)) return cy.wrap(interception);
    if (attempts <= 1) {
      throw new Error(`No ${alias} request had the expected content.`);
    }
    return waitForRequest(alias, matches, attempts - 1);
  });

/** waitForRequest for the report's autosave PATCH. */
export const waitForSave = waitForRequest;
