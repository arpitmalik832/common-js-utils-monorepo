/**
 * This file contains examples of using Cypress utilities.
 * @file The file is saved as `cypress/e2e/2-advanced-examples/utilities.cy.js`.
 */
/// <reference types="cypress" />

context('Utilities', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/utilities');
  });

  it('Cypress._ - call a lodash method', () => {
    // https://on.cypress.io/_
    cy.request('https://jsonplaceholder.cypress.io/users').then(response => {
      const ids = Cypress._.chain(response.body).map('id').take(3).value();

      cy.wrap(ids).should('deep.equal', [1, 2, 3]);
    });
  });

  it('Cypress.$ - call a jQuery method', () => {
    // https://on.cypress.io/$
    const $li = Cypress.$('.utility-jquery li:first');

    cy.wrap($li).should('not.have.class', 'active');
    cy.wrap($li).click();
    cy.wrap($li).should('have.class', 'active');
  });

  it('Cypress.Blob - blob utilities and base64 string conversion', () => {
    // https://on.cypress.io/blob
    cy.get('.utility-blob').then($div =>
      // https://github.com/nolanlawson/blob-util#imgSrcToDataURL
      // get the dataUrl string for the javascript-logo
      Cypress.Blob.imgSrcToDataURL(
        'https://example.cypress.io/assets/img/javascript-logo.png',
        undefined,
        'anonymous',
      ).then(dataUrl => {
        // create an <img> element and set its src to the dataUrl
        const img = Cypress.$('<img />', { src: dataUrl });

        // need to explicitly return cy here since we are initially returning
        // the Cypress.Blob.imgSrcToDataURL promise to our test
        // append the image
        $div.append(img);

        cy.get('.utility-blob img').click();
        cy.get('.utility-blob img').should('have.attr', 'src', dataUrl);
      }),
    );
  });

  it('Cypress.minimatch - test out glob patterns against strings', () => {
    // https://on.cypress.io/minimatch
    let matching = Cypress.minimatch('/users/1/comments', '/users/*/comments', {
      matchBase: true,
    });

    cy.wrap(matching).should('be.true', 'matching wildcard');

    matching = Cypress.minimatch('/users/1/comments/2', '/users/*/comments', {
      matchBase: true,
    });

    cy.wrap(matching).should('be.false', 'comments');

    // ** matches against all downstream path segments
    matching = Cypress.minimatch('/foo/bar/baz/123/quux?a=b&c=2', '/foo/**', {
      matchBase: true,
    });

    cy.wrap(matching).should('be.true', 'comments');

    // whereas * matches only the next path segment

    matching = Cypress.minimatch('/foo/bar/baz/123/quux?a=b&c=2', '/foo/*', {
      matchBase: false,
    });

    cy.wrap(matching).should('be.false', 'comments');
  });

  it('Cypress.Promise - instantiate a bluebird promise', () => {
    // https://on.cypress.io/promise
    let waited = false;

    /**
     * Waits for one second and then resolves with the string 'foo'.
     * @returns {Cypress.Promise<string>} A promise that resolves with the string 'foo' after one second.
     * @example
     * waitOneSecond().then(str => {
     *   console.log(str); // 'foo'
     * });
     */
    function waitOneSecond() {
      // return a promise that resolves after 1 second
      return new Cypress.Promise(resolve => {
        setTimeout(() => {
          // set waited to true
          waited = true;

          // resolve with 'foo' string
          resolve('foo');
        }, 1000);
      });
    }

    cy.then(() =>
      // return a promise to cy.then() that
      // is awaited until it resolves
      waitOneSecond().then(str => {
        cy.wrap(str).should('deep.equal', 'foo');
        cy.wrap(waited).should('be.true');
      }),
    );
  });
});
