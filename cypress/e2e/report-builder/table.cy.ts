import {
  openEditor,
  savedItem,
  tableItem,
  waitForRequest,
  waitForSave,
} from "../../support/report-builder";

const DATASET = "gf_allocations";
const COLUMNS = [
  { id: "GeographyName1", name: "GeographyName1", type: "string" },
  { id: "Component", name: "Component", type: "string" },
  {
    id: "AllocationAmountReferenceRate",
    name: "AllocationAmountReferenceRate",
    type: "number",
  },
];
const AMOUNT = "AllocationAmountReferenceRate";

type Row = Record<string, string | number>;

/**
 * The total the table's last row shows: new tables list their first 10 rows
 * and add up the rest as "Other".
 */
const otherTotal = (rows: Row[]) =>
  rows
    .slice(10)
    .reduce((sum, row) => sum + Number(row[AMOUNT]), 0)
    .toLocaleString("en-US");

describe("Report builder: tables", () => {
  let reportId: string;

  beforeEach(() => {
    cy.login();
    // Its query string has the page, so match the path alone.
    cy.intercept({ method: "POST", pathname: "/report/filter-dataset" }).as(
      "rows",
    );
    cy.fixture(`data-backend/parsed-data-files/${DATASET}.json`)
      .its("dataset")
      .as("allRows");
  });

  afterEach(() => {
    cy.deleteReport(reportId);
  });

  const table = () => cy.get('[data-cy="rb-table"]');
  const tableRows = () => table().find("tbody tr");
  const previewColumn = (name: string) =>
    cy.get(`[data-cy="rb-preview-column"][data-id="${name}"]`);
  // A header's sort and filter buttons only show while it's hovered.
  const openColumnMenu = (name: string, menu: "sort" | "filter") =>
    previewColumn(name)
      .find(`[data-cy="rb-${menu}-column"]`)
      .click({ force: true });

  // Fields that have been dragged into the table's columns. While a field is
  // dragged, dnd-kit leaves a copy of it in place.
  const pickedColumns =
    '[data-cy="rb-selected-field"]:not([data-dnd-placeholder])';

  /** Presses a key on the page; dnd-kit ignores cy.trigger's key events. */
  const press = (code: string, shiftKey = false) =>
    cy.document().then((doc) => {
      const win = doc.defaultView as Window & typeof globalThis;
      const target = doc.activeElement ?? doc.body;
      const key = code === "Space" ? " " : code;
      target.dispatchEvent(
        new win.KeyboardEvent("keydown", {
          code,
          key,
          shiftKey,
          bubbles: true,
          cancelable: true,
        }),
      );
    });

  // dnd-kit measures and checks what's under the dragged field once a frame.
  const nextFrame = () =>
    cy
      .window()
      .then(
        (win) =>
          new Cypress.Promise((resolve) =>
            win.requestAnimationFrame(() => win.requestAnimationFrame(resolve)),
          ),
      );

  /**
   * Adds a field to the table's columns with the keyboard: pick it up, move
   * it down until it's over the columns, and drop it. (Synthetic pointer
   * events can't drag it: dnd-kit captures the pointer, which only works for
   * real ones.)
   */
  const addColumn = (id: string) => {
    const field = `[data-cy="rb-available-field"][data-id="${id}"]`;
    const column = `${pickedColumns}[data-id="${id}"]`;
    const moveDown = (attempts: number): void => {
      press("ArrowDown", true);
      nextFrame();
      cy.get("body").then(($body) => {
        if ($body.find(column).length) return;
        if (attempts <= 1) {
          throw new Error(`Couldn't drag ${id} into the table's columns`);
        }
        moveDown(attempts - 1);
      });
    };
    cy.get(field).focus();
    press("Space");
    cy.get(field).should("have.attr", "data-dragging", "true");
    nextFrame();
    moveDown(20);
    press("Space");
    cy.get("[data-dnd-placeholder]").should("not.exist");
    cy.get(column).should("have.attr", "data-dragging", "false");
  };

  it("builds a table from the columns picked for it", () => {
    openEditor("tables").then((id) => {
      reportId = id;
    });
    cy.get('[data-cy="rb-add-component"]').click();
    cy.get('[data-cy="rb-add-table"]').click();
    cy.focused().type("{esc}");
    table().click();

    cy.get('[data-cy="rb-select-dataset"]').click();
    cy.get(`[data-cy="rb-dataset-card"][data-id="${DATASET}"]`).click();
    cy.get('[data-cy="rb-dataset-next"]').click();

    // Tables start without columns, so drag them in. Where a field lands
    // among the others depends on where it's dropped, so take the order the
    // dialog shows.
    COLUMNS.forEach(({ id }) => addColumn(id));
    cy.get(pickedColumns)
      .should("have.length", COLUMNS.length)
      .then(($fields) =>
        Cypress._.sortBy(COLUMNS, (column) =>
          Cypress._.findIndex(
            $fields,
            (field) => field.dataset.id === column.id,
          ),
        ),
      )
      .as("columns");
    cy.get('[data-cy="rb-preview-table"]').click();
    COLUMNS.forEach(({ name }) => previewColumn(name).should("exist"));
    cy.get('[data-cy="rb-use-dataset"]').click();

    waitForRequest("@rows", (body) => body.datasetId === DATASET);
    cy.get<typeof COLUMNS>("@columns").then((columns) => {
      // After the row number column.
      table()
        .find("thead th")
        .should(($headers) => {
          expect(
            Cypress._.map($headers.slice(1), (th) => th.textContent?.trim()),
          ).to.deep.eq(Cypress._.map(columns, "name"));
        });
    });
    tableRows().should("have.length", 11);
    tableRows()
      .first()
      .should("contain.text", "Nicaragua")
      .and("contain.text", "HIV/AIDS")
      .and("contain.text", "8,429,981");
    cy.get<Row[]>("@allRows").then((rows) => {
      tableRows()
        .last()
        .should("contain.text", "Other")
        .and("contain.text", otherTotal(rows));
    });

    cy.get<typeof COLUMNS>("@columns").then((columns) => {
      waitForSave(
        "@save",
        (body) => Cypress._.isEqual(body.items?.[0]?.data?.columns, columns),
        15,
      );
      savedItem(reportId).then((item) => {
        expect(item.type).to.eq("table");
        expect(item.data.dataset).to.eq(DATASET);
        expect(item.data.columns).to.deep.eq(columns);
      });
    });
  });

  it("filters and sorts a table, and shows it on the preview page", () => {
    const filters = { Component: ["Malaria"] };
    const sorting = [{ column: AMOUNT, order: "desc" }];

    openEditor("tables", [
      tableItem({ dataset: DATASET, columns: COLUMNS }),
    ]).then((id) => {
      reportId = id;
    });
    tableRows().first().should("contain.text", "Nicaragua");

    table().click();
    cy.get('[data-cy="rb-table-filters"]').click();
    openColumnMenu("Component", "filter");
    cy.get('[data-cy="rb-column-filter-option"][data-value="Malaria"]')
      .find("input")
      .check();
    cy.get('[data-cy="rb-apply-column-filter"]').click();
    openColumnMenu(AMOUNT, "sort");
    cy.get('[data-cy="rb-sort-order"][data-value="desc"]').click();
    cy.get('[data-cy="rb-apply-sort"]').click();
    cy.get('[data-cy="rb-use-dataset"]').click();

    const showsLargestMalariaGrants = () => {
      tableRows()
        .first()
        .should("contain.text", "Nigeria")
        .and("contain.text", "417,893,727");
      tableRows().should("not.contain.text", "HIV/AIDS");
      cy.get<Row[]>("@allRows").then((rows) => {
        const malaria = Cypress._.orderBy(
          rows.filter((row) => row.Component === "Malaria"),
          AMOUNT,
          "desc",
        );
        tableRows().last().should("contain.text", otherTotal(malaria));
      });
    };

    waitForRequest(
      "@rows",
      (body) =>
        Cypress._.isEqual(body.filters, filters) &&
        Cypress._.isEqual(body.sorting, sorting),
    );
    showsLargestMalariaGrants();

    waitForSave(
      "@save",
      (body) =>
        Cypress._.isEqual(body.items?.[0]?.data?.filters, filters) &&
        Cypress._.isEqual(body.items?.[0]?.data?.sorting, sorting),
      15,
    );
    cy.then(() => savedItem(reportId)).then((item) => {
      expect(item.data.filters).to.deep.eq(filters);
      expect(item.data.sorting).to.deep.eq(sorting);
    });

    cy.then(() => cy.visit(`/report-builder/reports/${reportId}`));
    showsLargestMalariaGrants();
  });
});
