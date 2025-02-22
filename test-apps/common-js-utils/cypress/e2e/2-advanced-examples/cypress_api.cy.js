/**
 * This file contains examples of Cypress APIs in action.
 * @file The file is saved as `cypress/e2e/2-advanced-examples/cypress_api.cy.js`.
 */
/* eslint-disable no-console */
/// <reference types="cypress" />

context('Cypress APIs', () => {
  context('Cypress.Commands', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/cypress-api');
    });

    // https://on.cypress.io/custom-commands

    it('.add() - create a custom command', () => {
      Cypress.Commands.add(
        'console',
        {
          prevSubject: true,
        },
        (subject, method) => {
          // the previous subject is automatically received
          // and the commands arguments are shifted

          // log the subject to the console
          console[method || 'log']('The subject is', subject);

          // whatever we return becomes the new subject
          // we don't want to change the subject so
          // we return whatever was passed in
          return subject;
        },
      );

      cy.get('button')
        .console('info')
        .then(() => {
          // subject is still $button
        });
    });
  });

  context('Cypress.Cookies', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/cypress-api');
    });

    // https://on.cypress.io/cookies
    it('.debug() - enable or disable debugging', () => {
      Cypress.Cookies.debug(true);

      // Cypress will now log in the console when
      // cookies are set or cleared
      cy.setCookie('fakeCookie', '123ABC');
      cy.clearCookie('fakeCookie');
      cy.setCookie('fakeCookie', '123ABC');
      cy.clearCookie('fakeCookie');
      cy.setCookie('fakeCookie', '123ABC');
    });
  });

  context('Cypress.arch', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/cypress-api');
    });

    it('Get CPU architecture name of underlying OS', () => {
      // https://on.cypress.io/arch
      cy.wrap(Cypress.arch).should('exist');
    });
  });

  context('Cypress.config()', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/cypress-api');
    });

    it('Get and set configuration options', () => {
      // https://on.cypress.io/config
      const myConfig = Cypress.config();

      cy.wrap(myConfig).should(
        'have.property',
        'animationDistanceThreshold',
        5,
      );
      cy.wrap(myConfig).should('have.property', 'baseUrl', null);
      cy.wrap(myConfig).should('have.property', 'defaultCommandTimeout', 4000);
      cy.wrap(myConfig).should('have.property', 'requestTimeout', 5000);
      cy.wrap(myConfig).should('have.property', 'responseTimeout', 30000);
      cy.wrap(myConfig).should('have.property', 'viewportHeight', 660);
      cy.wrap(myConfig).should('have.property', 'viewportWidth', 1000);
      cy.wrap(myConfig).should('have.property', 'pageLoadTimeout', 60000);
      cy.wrap(myConfig).should('have.property', 'waitForAnimations', true);

      cy.wrap(Cypress.config('pageLoadTimeout')).should('eq', 60000);

      // this will change the config for the rest of your tests!
      Cypress.config('pageLoadTimeout', 20000);

      cy.wrap(Cypress.config('pageLoadTimeout')).should('eq', 20000);

      Cypress.config('pageLoadTimeout', 60000);
    });
  });

  context('Cypress.dom', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/cypress-api');
    });

    // https://on.cypress.io/dom
    it('.isHidden() - determine if a DOM element is hidden', () => {
      const hiddenP = Cypress.$('.dom-p p.hidden').get(0);
      const visibleP = Cypress.$('.dom-p p.visible').get(0);

      // our first paragraph has css class 'hidden'
      cy.wrap(Cypress.dom.isHidden(hiddenP)).should('be.true');
      cy.wrap(Cypress.dom.isHidden(visibleP)).should('be.false');
    });
  });

  context('Cypress.env()', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/cypress-api');
    });

    // We can set environment variables for highly dynamic values

    // https://on.cypress.io/environment-variables
    it('Get environment variables', () => {
      // https://on.cypress.io/env
      // set multiple environment variables
      Cypress.env({
        host: 'veronica.dev.local',
        api_server: 'http://localhost:8888/v1/',
      });

      // get environment variable
      cy.wrap(Cypress.env('host')).should('eq', 'veronica.dev.local');

      // set environment variable
      Cypress.env('api_server', 'http://localhost:8888/v2/');
      cy.wrap(Cypress.env('api_server')).should(
        'eq',
        'http://localhost:8888/v2/',
      );

      // get all environment variable
      cy.wrap(Cypress.env()).should(
        'have.property',
        'host',
        'veronica.dev.local',
      );
      cy.wrap(Cypress.env()).should(
        'have.property',
        'api_server',
        'http://localhost:8888/v2/',
      );
    });
  });

  context('Cypress.log', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/cypress-api');
    });

    it('Control what is printed to the Command Log', () => {
      // https://on.cypress.io/cypress-log
    });
  });

  context('Cypress.platform', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/cypress-api');
    });

    it('Get underlying OS name', () => {
      // https://on.cypress.io/platform
      cy.wrap(Cypress.platform).should('be.exist');
    });
  });

  context('Cypress.version', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/cypress-api');
    });

    it('Get current version of Cypress being run', () => {
      // https://on.cypress.io/version
      cy.wrap(Cypress.version).should('be.exist');
    });
  });

  context('Cypress.spec', () => {
    beforeEach(() => {
      cy.visit('https://example.cypress.io/cypress-api');
    });

    it('Get current spec information', () => {
      // https://on.cypress.io/spec
      // wrap the object so we can inspect it easily by clicking in the command log
      cy.wrap(Cypress.spec).should('include.keys', [
        'name',
        'relative',
        'absolute',
      ]);
    });
  });
});
