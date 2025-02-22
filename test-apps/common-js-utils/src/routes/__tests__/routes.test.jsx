/**
 * This file is used to test the routes configuration.
 * @file This file is saved as 'src/routes/__tests__/routes.test.jsx'.
 */
import React from 'react';
import HtmlContent from '../../components/atoms/HtmlContent';
import routes from '../routes';
import { ROUTES, SEO } from '../../enums/routes';

// Mock React's lazy
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  lazy: jest.fn(importFn => importFn()),
}));

// Mock the dynamic imports
jest.mock('../../pages/Home', () => () => <div>Home Page</div>);
jest.mock('../../pages/Abc', () => () => <div>Abc Page</div>);
jest.mock('../../pages/NotFound', () => () => <div>NotFound Page</div>);
jest.mock('../../pages/Error', () => () => <div>Error Page</div>);

jest.mock('../../components/atoms/HtmlContent', () =>
  jest.fn(({ title, description }) => (
    <div
      data-testid="html-content"
      data-title={title}
      data-description={description}
    />
  )),
);

jest.mock('../../components/atoms/ComponentWithSuspense', () => ({
  ComponentWithSuspense: jest.fn(({ component }) => component),
}));

describe('Routes Configuration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export routes array', () => {
    expect(Array.isArray(routes)).toBe(true);
    expect(routes).toHaveLength(3);
  });

  describe('Home Route', () => {
    it('should have correct index route configuration', () => {
      const homeRoute = routes.find(route => route.index === true);
      expect(homeRoute).toBeDefined();
      expect(homeRoute.element).toBeDefined();
    });

    it('should have correct SEO configuration for home', () => {
      const homeRoute = routes.find(route => route.index === true);
      const htmlContent = homeRoute.element.props.children[0];
      expect(htmlContent.props.title).toBe(SEO.HOME.TITLE);
      expect(htmlContent.props.description).toBe(SEO.HOME.DESC);
    });
  });

  describe('Abc Route', () => {
    it('should have correct path configuration', () => {
      const abcRoute = routes.find(route => route.path === ROUTES.ABC);
      expect(abcRoute).toBeDefined();
      expect(abcRoute.element).toBeDefined();
    });

    it('should have correct SEO configuration for abc', () => {
      const abcRoute = routes.find(route => route.path === ROUTES.ABC);
      const htmlContent = abcRoute.element.props.children[0];
      expect(htmlContent.props.title).toBe(SEO.ABC.TITLE);
      expect(htmlContent.props.description).toBe(SEO.ABC.DESC);
    });
  });

  describe('NotFound Route', () => {
    it('should have correct path configuration', () => {
      const notFoundRoute = routes.find(
        route => route.path === ROUTES.NOT_FOUND,
      );
      expect(notFoundRoute).toBeDefined();
      expect(notFoundRoute.element).toBeDefined();
    });

    it('should have correct SEO configuration for not found', () => {
      const notFoundRoute = routes.find(
        route => route.path === ROUTES.NOT_FOUND,
      );
      const htmlContent = notFoundRoute.element.props.children[0];
      expect(htmlContent.props.title).toBe(SEO.NOT_FOUND.TITLE);
      expect(htmlContent.props.description).toBe(SEO.NOT_FOUND.DESC);
    });
  });

  describe('Lazy Loading', () => {
    it('should properly resolve lazy loaded components', async () => {
      const [homeRoute, abcRoute, notFoundRoute] = routes;

      // Verify Home component
      const homeComponent = homeRoute.element.props.children[1].props.component;
      expect(homeComponent).toBeDefined();

      // Verify Abc component
      const abcComponent = abcRoute.element.props.children[1].props.component;
      expect(abcComponent).toBeDefined();

      // Verify NotFound component
      const notFoundComponent =
        notFoundRoute.element.props.children[1].props.component;
      expect(notFoundComponent).toBeDefined();
    });
  });

  describe('Route Components', () => {
    it('should use HtmlContent for SEO in all routes', () => {
      const htmlContentCount = routes.reduce(
        (count, route) =>
          count +
          (route.element.props.children[0].type === HtmlContent ? 1 : 0),
        0,
      );
      expect(htmlContentCount).toBe(3);
    });
  });
});
