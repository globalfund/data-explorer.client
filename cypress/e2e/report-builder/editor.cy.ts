import { uniqueName, waitForSave } from "../../support/report-builder";

describe("Report builder: editor", () => {
  let reportId: string;
  let reportName: string;

  beforeEach(() => {
    cy.login();
    reportName = uniqueName("editor");
    cy.createReport({ name: reportName }).then((id) => {
      reportId = id;
      cy.intercept("PATCH", `**/report/${id}`).as("save");
    });
  });

  afterEach(() => {
    cy.deleteReport(reportId);
  });

  const savedReport = () =>
    cy
      .api<{ name: string; items: unknown[] }>({
        method: "GET",
        path: `/report/${reportId}`,
      })
      .its("body");

  const openEditor = () => {
    cy.visit(`/report-builder/reports/${reportId}/edit`);
    cy.get('[data-cy="rb-report-name"]').should("have.value", reportName);
  };

  it("autosaves a renamed report", () => {
    const newName = `${reportName} renamed`;
    openEditor();

    cy.get('[data-cy="rb-report-name"]').clear().type(newName);

    waitForSave("@save", (body) => body.name === newName)
      .its("response.statusCode")
      .should("eq", 204);
    cy.get('[data-cy="rb-save-status"]').should("contain.text", "Saved");
    savedReport().its("name").should("eq", newName);
  });

  it("saves an edit made just before opening Preview", () => {
    const newName = `${reportName} then preview`;
    openEditor();

    // Leaving the editor cancels the autosave delay; the edit must still be
    // saved, and Preview must show it.
    cy.get('[data-cy="rb-report-name"]').clear().type(newName);
    cy.get('[data-cy="rb-preview"]').click();

    cy.location("pathname").should("eq", `/report-builder/reports/${reportId}`);
    waitForSave("@save", (body) => body.name === newName);
    cy.get('[data-cy="rb-report-name"]').should("have.value", newName);
    savedReport().its("name").should("eq", newName);
  });

  it("adds a text component, saves it and shows it on the preview page", () => {
    const text = `Written by the editor spec ${Date.now()}`;
    openEditor();

    cy.get('[data-cy="rb-add-component"]').click();
    cy.get('[data-cy="rb-add-text"]').click();
    // The menu stays open after adding, so more components can be added.
    cy.focused().type("{esc}");
    cy.get('[data-cy="rb-add-text"]').should("not.be.visible");
    // The floating report panel covers the start of the placeholder text, so
    // click the middle of the placeholder box instead.
    cy.contains("Click to start writing...").parent().click();
    cy.get(".ProseMirror").should("be.visible").type(text);

    waitForSave("@save", (body) => JSON.stringify(body.items).includes(text));
    savedReport().then((report) => {
      expect(report.items).to.have.length(1);
      expect(report.items[0]).to.have.property("type", "text");
    });

    cy.visit(`/report-builder/reports/${reportId}`);
    cy.contains(text).should("be.visible");
  });
});
