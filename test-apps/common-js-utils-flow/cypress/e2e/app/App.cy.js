/**
 * App e2e tests.
 * @file The file is saved as `App.cy.js`.
 */
describe('app', () => {
  beforeEach(() => {
    cy.visit('https://react-js-webpack-swc.netlify.app/');
  });

  it('display header along with the button', () => {
    cy.get('[data-cy=button]').should('have.text', 'Button');
  });
});
