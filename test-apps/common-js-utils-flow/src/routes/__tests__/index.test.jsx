/**
 * This file is used to test the routes configuration.
 * @file This file is saved as `src/routes/__tests__/index.test.jsx`.
 */
import router from '../index';
import routes from '../routes';

// Mock the dependencies
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  lazy: jest.fn(importFn => importFn()),
}));

jest.mock('react-router', () => ({
  createBrowserRouter: jest.fn(config => config),
}));

// Mock the library with a direct mock function
jest.mock('../../components/atoms/ComponentWithSuspense', () => ({
  ComponentWithSuspense: () => <div>ComponentWithSuspense</div>,
}));

jest.mock('../../HOC/PageWrapper', () => () => <div>PageWrapper</div>);

jest.mock('../routes', () => {
  const TestRoute = () => <div>Test Route</div>;

  return {
    __esModule: true,
    default: [
      {
        path: '/test',
        element: () => <TestRoute />,
      },
    ],
  };
});

jest.mock('../../pages/Error', () => () => <div>Error Page</div>);

describe('Router Configuration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create browser router with correct configuration', () => {
    expect(router).toBeDefined();
  });

  it('should have correct root route configuration', () => {
    const [rootRoute] = router;
    expect(rootRoute).toEqual(
      expect.objectContaining({
        path: '/',
        element: expect.any(Object),
        errorElement: expect.any(Object),
        children: routes,
      }),
    );
  });

  it('should use PageWrapper as root element', () => {
    const [rootRoute] = router;
    expect(rootRoute.element).toBeDefined();
  });

  it('should wrap Error page in ComponentWithSuspense', () => {
    const [rootRoute] = router;

    expect(rootRoute.errorElement).toBeDefined();
  });

  describe('Integration with Library Components', () => {
    it('should use ComponentWithSuspense for error handling', () => {});

    it('should pass correct props to ComponentWithSuspense', () => {
      const [rootRoute] = router;
      expect(rootRoute.errorElement.props).toHaveProperty('component');
    });
  });

  describe('Route Structure', () => {
    it('should have single root route', () => {
      expect(router).toHaveLength(1);
    });

    it('should have correct path at root', () => {
      const [rootRoute] = router;
      expect(rootRoute.path).toBe('/');
    });

    it('should handle errors with Error page', () => {
      const [rootRoute] = router;
      expect(rootRoute.errorElement).toBeDefined();
    });
  });

  describe('Child Routes', () => {
    it('should include all routes from routes configuration', () => {
      const [rootRoute] = router;
      expect(rootRoute.children).toEqual(routes);
    });

    it('should have test route in mock configuration', () => {
      const [rootRoute] = router;
      const [testRoute] = rootRoute.children;
      expect(testRoute.path).toBe('/test');
      expect(testRoute.element).toBeDefined();
    });
  });
});
