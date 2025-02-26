/**
 * This file is used to test the index file.
 * @file This file is saved as `src/__tests__/index.test.js`.
 */
// Mock modules
const mockErrorLog = jest.fn();
const mockRegister = jest.fn();
const mockReportWebVitals = jest.fn();
const mockMount = jest.fn();

// Mock the library
jest.mock('@arpitmalik832/common-js-utils-flow-pkg', () => ({
  errorLog: mockErrorLog,
  SWRegistration: {
    register: mockRegister,
  },
  reportWebVitals: mockReportWebVitals,
  APP_ENUMS: {
    ENVS: {
      PROD: 'production',
      DEV: 'development',
      STG: 'staging',
      BETA: 'beta',
    },
  },
}));

// Mock bootstrap
jest.mock('../bootstrap', () => ({
  mount: mockMount,
}));

describe('Application Entry Point', () => {
  let appElement;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Reset modules
    jest.resetModules();

    // Setup DOM
    appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);
  });

  afterEach(() => {
    // Cleanup DOM
    document.body.innerHTML = '';
    // Reset environment
    delete process.env.APP_ENV;
  });

  // eslint-disable-next-line no-promise-executor-return
  const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

  describe('App Initialization', () => {
    it('should mount app when element exists', async () => {
      // Import and initialize
      await import('../index');

      // Allow promises to resolve
      await flushPromises();

      // Verify mount was called with correct element
      expect(mockMount).toHaveBeenCalledWith(appElement);
    });

    it('should log error when app element is missing', async () => {
      // Remove app element
      document.body.innerHTML = '';

      // Import and initialize
      await import('../index');

      // Allow promises to resolve
      await flushPromises();

      // Verify error was logged
      expect(mockErrorLog).toHaveBeenCalledWith('App element not found');
    });
  });

  describe('Service Worker', () => {
    it('should register service worker', async () => {
      // Import and initialize
      await import('../index');

      // Allow promises to resolve
      await flushPromises();

      // Verify service worker registration
      expect(mockRegister).toHaveBeenCalled();
    });
  });

  describe('Web Vitals', () => {
    it('should not report web vitals in production', async () => {
      // Set production environment
      process.env.APP_ENV = 'production';

      // Import and initialize
      await import('../index');

      // Allow promises to resolve
      await flushPromises();

      // Verify web vitals was not called
      expect(mockReportWebVitals).not.toHaveBeenCalled();
    });

    it('should report web vitals in development', async () => {
      // Set development environment
      process.env.APP_ENV = 'development';

      // Import and initialize
      await import('../index');

      // Allow promises to resolve
      await flushPromises();

      // Verify web vitals was called
      expect(mockReportWebVitals).toHaveBeenCalled();
    });

    it('should handle web vitals error', async () => {
      // Set development environment
      process.env.APP_ENV = 'development';

      // Setup error case
      mockReportWebVitals.mockImplementation(() => {
        throw new Error('Web vitals error');
      });

      // Import and initialize
      await import('../index');

      // Allow promises to resolve
      await flushPromises();

      // Verify error was logged
      expect(mockErrorLog).toHaveBeenCalledWith(
        'Facing issue while using reportWebVitals from external library',
        expect.any(Error),
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle bootstrap import error', async () => {
      // Mock bootstrap to throw error
      jest.resetModules();
      jest.mock('../bootstrap', () => {
        throw new Error('Bootstrap import failed');
      });

      // Import and initialize
      await import('../index');

      // Allow promises to resolve
      await flushPromises();

      // Verify error was logged
      expect(mockErrorLog).toHaveBeenCalledWith(
        'Facing err while importing bootstrap file: ',
        expect.any(Error),
      );
    });

    it('should handle multiple errors gracefully', async () => {
      // Set development environment
      process.env.APP_ENV = 'development';

      try {
        // Setup multiple error cases
        mockRegister.mockImplementation(() => {
          throw new Error('SW registration failed');
        });

        mockReportWebVitals.mockImplementation(() => {
          throw new Error('Web vitals error');
        });

        // Import and initialize
        await import('../index');

        // Allow promises to resolve
        await flushPromises();

        // Verify all errors were handled
        expect(mockErrorLog).toHaveBeenCalledWith(
          'Facing issue while using reportWebVitals from external library',
          expect.any(Error),
        );
      } catch (e) {
        // Verify all errors were handled
        expect(e).toEqual(new Error('SW registration failed'));
      }
    });
  });
});
