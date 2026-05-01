/// <reference types="cypress" />

// Covers:
// - Basic-auth gate (staging env with credentials)
// - Basic-auth gate bypass (non-staging or no credentials set)
// - Intro accordions expand/collapse
// - Feature accordions expand/collapse
// - FAB opens the chat panel
// - Chat panel: sending a message, assistant reply appears
// - Sidebar search filters chats
// - Sidebar collapse/expand
// - Escape key closes the chat panel

describe("AI Explorer page", () => {
  // These tests run against non-staging (gate inactive by default in local dev)
  context("when auth gate is not active", () => {
    beforeEach(() => {
      cy.visit("/ai-explorer");
    });

    it("renders the page heading", () => {
      cy.contains("h4", /AI Explorer/i).should("be.visible");
    });

    it("intro accordion expands to show datasets", () => {
      cy.contains("Available Datasets").click();
      cy.contains("Grants").should("be.visible");
    });

    it("feature accordion expands to show details", () => {
      // First feature — click its title to expand
      cy.get('[data-testid="feature-accordion"]')
        .first()
        .within(() => {
          cy.get(".MuiAccordionSummary-root").click();
          cy.get(".MuiAccordionDetails-root").should("be.visible");
        });
    });

    it("FAB opens the chat panel", () => {
      cy.get('[data-testid="open-chat-fab"]').click();
      cy.get('[data-testid="chat-panel"]').should("be.visible");
    });

    it("Escape key closes the chat panel", () => {
      cy.get('[data-testid="open-chat-fab"]').click();
      cy.get('[data-testid="chat-panel"]').should("be.visible");
      cy.get("body").type("{esc}");
      cy.get('[data-testid="chat-panel"]').should("not.be.visible");
    });

    it("can send a message and see a reply", () => {
      cy.get('[data-testid="open-chat-fab"]').click();

      cy.get('[data-testid="chat-composer-input"]').type("Hello");
      cy.get('[data-testid="chat-composer-send"]').click();

      // User message appears
      cy.contains("Hello").should("be.visible");

      // Assistant reply appears (mock takes up to 1500ms)
      cy.get('[data-testid="chat-message-assistant"]', { timeout: 5000 }).should(
        "be.visible",
      );
    });

    it("sidebar search filters chats", () => {
      // Create first chat and wait for it to be saved
      const dummy_chat_response_time = 300;
      cy.get('[data-testid="open-chat-fab"]').click();
      cy.get('[data-testid="chat-composer-input"]').type("First chat message");
      cy.get('[data-testid="chat-composer-send"]').click();
      cy.wait(dummy_chat_response_time + 100); // wait for chat to proceed

      // Create second chat
      cy.get('[data-testid="new-chat-button"]').click();
      cy.get('[data-testid="chat-composer-input"]').type("Second chat topic");
      cy.get('[data-testid="chat-composer-send"]').click();
      cy.wait(dummy_chat_response_time + 100); // wait for chat to proceed

      // Create third chat
      cy.get('[data-testid="new-chat-button"]').click();
      cy.get('[data-testid="chat-composer-input"]').type("Third chat topic");
      cy.get('[data-testid="chat-composer-send"]').click();
      cy.wait(dummy_chat_response_time + 100); // wait for chat to proceed

      // Search for "First" - wait longer for filter to apply
      cy.get('[data-testid="chat-search-input"]').type("First");
      cy.wait(300); // wait for filters to apply

      cy.contains("First chat message").should("be.visible");
      cy.contains("Second chat topic").should("not.exist");
      // The third chat is still visible, because the filter does not
      // automatically open the found chat,
      // leaving open the current "third chat topic" in the main chat view.
      cy.contains("Third chat topic").should("be.visible");
    });

    it("collapses and expands the chat sidebar", () => {
      cy.get('[data-testid="open-chat-fab"]').click();
      // Sidebar starts expanded - click to collapse
      cy.get('[data-testid="sidebar-toggle"]').click();
      cy.wait(300); // wait for animation
      // Sidebar should be collapsed — search input hidden
      cy.get('[data-testid="chat-search-input"]').should("not.exist");

      // Click to expand
      cy.get('[data-testid="sidebar-toggle"]').click();
      cy.wait(300); // wait for animation
      cy.get('[data-testid="chat-search-input"]').should("be.visible");
    });
  });

  context("when auth gate is active (staging + credentials set)", () => {
    // To run these tests, set VITE_APP_ENV=staging and configure credentials
    // in cypress.config.ts env vars (ai_explorer_user / ai_explorer_pass).
    // Skipped here because CI runs without staging credentials.
    it.skip("shows the auth form", () => {
      cy.visit("/ai-explorer");
      cy.get('[data-testid="basic-auth-form"]').should("be.visible");
    });

    it.skip("grants access with correct credentials", () => {
      cy.visit("/ai-explorer");
      cy.get('[data-testid="basic-auth-username"]').type(
        Cypress.env("ai_explorer_user"),
      );
      cy.get('[data-testid="basic-auth-password"]').type(
        Cypress.env("ai_explorer_pass"),
      );
      cy.get('[data-testid="basic-auth-submit"]').click();
      cy.contains("h1", /AI Explorer/i).should("be.visible");
    });

    it.skip("shows an error with wrong credentials", () => {
      cy.visit("/ai-explorer");
      cy.get('[data-testid="basic-auth-username"]').type("wrong");
      cy.get('[data-testid="basic-auth-password"]').type("wrong");
      cy.get('[data-testid="basic-auth-submit"]').click();
      cy.contains(/invalid/i).should("be.visible");
    });
  });
});
