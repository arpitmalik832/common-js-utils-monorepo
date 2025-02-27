/**
 * This file contains examples of using Cypress commands that are used to connect to the DOM elements.
 * @file The file is saved as `cypress/e2e/2-advanced-examples/connectors.cy.js`.
 */
/* eslint-disable no-console */
/// <reference types="cypress" />

context('Connectors', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/connectors');
  });

  it('.each() - iterate over an array of elements', () => {
    // https://on.cypress.io/each
    cy.get('.connectors-each-ul>li').each(($el, index, $list) => {
      console.log($el, index, $list);
    });
  });

  it('.its() - get properties on the current subject', () => {
    // https://on.cypress.io/its
    cy.get('.connectors-its-ul>li')
      // calls the 'length' property yielding that value
      .its('length')
      .should('be.gt', 2);
  });

  it('.invoke() - invoke a function on the current subject', () => {
    // our div is hidden in our script.js
    // $('.connectors-div').hide()
    cy.get('.connectors-div').should('be.hidden');

    // https://on.cypress.io/invoke
    // call the jquery method 'show' on the 'div.container'
    cy.get('.connectors-div').invoke('show');

    cy.get('.connectors-div').should('be.visible');
  });

  it('.spread() - spread an array as individual args to callback function', () => {
    // https://on.cypress.io/spread
    const arr = ['foo', 'bar', 'baz'];

    cy.wrap(arr).spread((foo, bar, baz) => {
      cy.wrap(foo).should('eq', 'foo');
      cy.wrap(bar).should('eq', 'bar');
      cy.wrap(baz).should('eq', 'baz');
    });
  });

  describe('.then()', () => {
    it('invokes a callback function with the current subject', () => {
      // https://on.cypress.io/then
      cy.get('.connectors-list > li').then($lis => {
        cy.wrap($lis).should('have.length', 3);
        cy.wrap($lis.eq(0)).should('contain', 'Walk the dog');
        cy.wrap($lis.eq(1)).should('contain', 'Feed the cat');
        cy.wrap($lis.eq(2)).should('contain', 'Write JavaScript');
      });
    });

    it('yields the returned value to the next command', () => {
      cy.wrap(1)
        .then(num => {
          cy.wrap(num).should('eq', 1);

          return cy.wrap(2);
        })
        .then(num => {
          cy.wrap(num).should('eq', 2);
        });
    });

    it('yields the original subject without return', () => {
      cy.wrap(1)
        .then(num => {
          cy.wrap(num).should('eq', 1);
          // note that nothing is returned from this callback
        })
        .then(num => {
          // this callback receives the original unchanged value 1
          cy.wrap(num).should('eq', 1);
        });
    });

    it('yields the value yielded by the last Cypress command inside', () => {
      cy.wrap(1)
        .then(num => {
          cy.wrap(num).should('eq', 1);
          // note how we run a Cypress command
          // the result yielded by this Cypress command
          // will be passed to the second ".then"
          cy.wrap(2);
        })
        .then(num => {
          // this callback receives the value yielded by "cy.wrap(2)"
          cy.wrap(num).should('eq', 2);
        });
    });
  });
});
