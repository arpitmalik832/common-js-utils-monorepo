/**
 * This test file demonstrates how to use Cypress commands to interact with the location.
 * @file The file is saved as `cypress/e2e/2-advanced-examples/location.cy.js`.
 */
/// <reference types="cypress" />

context('Location', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/location');
  });

  it('cy.hash() - get the current URL hash', () => {
    // https://on.cypress.io/hash
    cy.hash().should('be.empty');
  });

  it('cy.location() - get window.location', () => {
    // https://on.cypress.io/location
    cy.location().then(location => {
      cy.wrap(location.hash).should('be.empty');
      cy.wrap(location.href).should(
        'eq',
        'https://example.cypress.io/commands/location',
      );
      cy.wrap(location.host).should('eq', 'example.cypress.io');
      cy.wrap(location.hostname).should('eq', 'example.cypress.io');
      cy.wrap(location.origin).should('eq', 'https://example.cypress.io');
      cy.wrap(location.pathname).should('eq', '/commands/location');
      cy.wrap(location.port).should('eq', '');
      cy.wrap(location.protocol).should('eq', 'https:');
      cy.wrap(location.search).should('be.empty');
    });
  });

  it('cy.url() - get the current URL', () => {
    // https://on.cypress.io/url
    cy.url().should('eq', 'https://example.cypress.io/commands/location');
  });
});
