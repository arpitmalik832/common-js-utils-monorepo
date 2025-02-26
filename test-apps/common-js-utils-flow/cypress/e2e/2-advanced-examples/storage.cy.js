/**
 * This test file demonstrates how to use Cypress commands to interact with storage.
 * @file The file is saved as `cypress/e2e/2-advanced-examples/storage.cy.js`.
 */
/// <reference types="cypress" />

context('Local Storage / Session Storage', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/storage');
  });
  // Although localStorage is automatically cleared
  // in between tests to maintain a clean state
  // sometimes we need to clear localStorage manually

  it('cy.clearLocalStorage() - clear all data in localStorage for the current origin', () => {
    // https://on.cypress.io/clearlocalstorage
    cy.get('.ls-btn').click();
    cy.get('.ls-btn').then(() => {
      cy.wrap(localStorage.getItem('prop1')).should('eq', 'red');
      cy.wrap(localStorage.getItem('prop2')).should('eq', 'blue');
      cy.wrap(localStorage.getItem('prop3')).should('eq', 'magenta');
    });

    cy.clearLocalStorage();
    cy.getAllLocalStorage().then(() => {
      cy.wrap(localStorage.getItem('prop1')).should('be.null');
      cy.wrap(localStorage.getItem('prop2')).should('be.null');
      cy.wrap(localStorage.getItem('prop3')).should('be.null');
    });

    cy.get('.ls-btn').click();
    cy.get('.ls-btn').then(() => {
      cy.wrap(localStorage.getItem('prop1')).should('eq', 'red');
      cy.wrap(localStorage.getItem('prop2')).should('eq', 'blue');
      cy.wrap(localStorage.getItem('prop3')).should('eq', 'magenta');
    });

    // Clear key matching string in localStorage
    cy.clearLocalStorage('prop1');
    cy.getAllLocalStorage().then(() => {
      cy.wrap(localStorage.getItem('prop1')).should('be.null');
      cy.wrap(localStorage.getItem('prop2')).should('eq', 'blue');
      cy.wrap(localStorage.getItem('prop3')).should('eq', 'magenta');
    });

    cy.get('.ls-btn').click();
    cy.get('.ls-btn').then(() => {
      cy.wrap(localStorage.getItem('prop1')).should('eq', 'red');
      cy.wrap(localStorage.getItem('prop2')).should('eq', 'blue');
      cy.wrap(localStorage.getItem('prop3')).should('eq', 'magenta');
    });

    // Clear keys matching regex in localStorage
    cy.clearLocalStorage(/prop1|2/);
    cy.getAllLocalStorage().then(() => {
      cy.wrap(localStorage.getItem('prop1')).should('be.null');
      cy.wrap(localStorage.getItem('prop2')).should('be.null');
      cy.wrap(localStorage.getItem('prop3')).should('eq', 'magenta');
    });
  });

  it('cy.getAllLocalStorage() - get all data in localStorage for all origins', () => {
    // https://on.cypress.io/getalllocalstorage
    cy.get('.ls-btn').click();

    // getAllLocalStorage() yields a map of origins to localStorage values
    cy.getAllLocalStorage().then(storageMap => {
      cy.wrap(storageMap).should('deep.equal', {
        'https://example.cypress.io': {
          prop1: 'red',
          prop2: 'blue',
          prop3: 'magenta',
        },
      });
    });
  });

  it('cy.clearAllLocalStorage() - clear all data in localStorage for all origins', () => {
    // https://on.cypress.io/clearalllocalstorage
    cy.get('.ls-btn').click();

    // clearAllLocalStorage() yields null
    cy.clearAllLocalStorage();
    cy.getAllLocalStorage().then(() => {
      cy.wrap(localStorage.getItem('prop1')).should('be.null');
      cy.wrap(localStorage.getItem('prop2')).should('be.null');
      cy.wrap(localStorage.getItem('prop3')).should('be.null');
    });
  });

  it('cy.getAllSessionStorage() - get all data in sessionStorage for all origins', () => {
    // https://on.cypress.io/getallsessionstorage
    cy.get('.ls-btn').click();

    // getAllSessionStorage() yields a map of origins to sessionStorage values
    cy.getAllSessionStorage().then(storageMap => {
      cy.wrap(storageMap).should('deep.equal', {
        'https://example.cypress.io': {
          prop4: 'cyan',
          prop5: 'yellow',
          prop6: 'black',
        },
      });
    });
  });

  it('cy.clearAllSessionStorage() - clear all data in sessionStorage for all origins', () => {
    // https://on.cypress.io/clearallsessionstorage
    cy.get('.ls-btn').click();

    // clearAllSessionStorage() yields null
    cy.clearAllSessionStorage();
    cy.getAllSessionStorage().then(() => {
      cy.wrap(sessionStorage.getItem('prop4')).should('be.null');
      cy.wrap(sessionStorage.getItem('prop5')).should('be.null');
      cy.wrap(sessionStorage.getItem('prop6')).should('be.null');
    });
  });
});
