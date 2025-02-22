/**
 * Unit tests for SWRegistration service.
 * @file This file is saved as `SWRegistration.test.js`.
 */
import '@testing-library/jest-dom';

import SWRegistration from '../SWRegistration';
import { isLocalhost } from '../../utils/commonUtils';
import fetchMock from '../../__tests__/__mocks__/fetchMock';
import { ENVS } from '../../enums/app';

jest.mock('../../utils/commonUtils', () => ({
  __esModule: true,
  log: jest.fn(),
  errorLog: jest.fn(),
  isLocalhost: jest.fn(),
}));

jest.mock('../../utils/eventListeners/load', () => ({
  __esModule: true,
  default: {
    subscribe: e => e(),
    unSubscribe: jest.fn(),
  },
}));

describe('SWRegistration unit tests', () => {
  const originalNodeEnv = process.env.APP_ENV;

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env.APP_ENV = originalNodeEnv;
  });

  it('SWRegistration functions test', () => {
    process.env.APP_ENV = ENVS.PROD;
    SWRegistration.register();
    SWRegistration.unregister();
  });

  it('SWRegistration functions test', () => {
    process.env.APP_ENV = ENVS.PROD;
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.resolve('xyz')),
        ready: Promise.resolve({
          unregister: jest.fn(),
        }),
      },
      configurable: true,
    });

    SWRegistration.register();
    SWRegistration.unregister();
  });

  it('SWRegistration functions test', () => {
    process.env.APP_ENV = ENVS.PROD;
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.resolve('xyz')),
        ready: Promise.resolve({
          unregister: () => Promise.reject(new Error('test')),
        }),
      },
      configurable: true,
    });

    SWRegistration.register();
    SWRegistration.unregister();
  });

  // it('SWRegistration functions test with rejecting ready state', () => {
  //   process.env.APP_ENV = ENVS.PROD;
  //   Object.defineProperty(global.navigator, 'serviceWorker', {
  //     value: {
  //       register: jest.fn(() => Promise.resolve('xyz')),
  //       ready: Promise.reject(new Error('test')),
  //     },
  //     configurable: true,
  //   });

  //   SWRegistration.register();
  //   SWRegistration.unregister();
  // });

  it('SWRegistration functions test in case of localhost', () => {
    process.env.APP_ENV = ENVS.PROD;
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '',
        search: '',
        hash: '',
        protocol: 'http:',
        host: 'localhost:3000',
        port: '3000',
        reload: jest.fn(),
        assign: jest.fn(),
        replace: jest.fn(),
      },
      configurable: true,
    });
    window.fetch = fetchMock({
      headers: {
        get: () => 'text/javascript',
      },
    });
    isLocalhost.mockImplementation(() => true);
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.reject(new Error('xyz'))),
        ready: Promise.resolve('test'),
      },
      configurable: true,
    });

    SWRegistration.register();
  });

  it('SWRegistration functions test in case of localhost when fetch is throwing error', () => {
    process.env.APP_ENV = ENVS.PROD;
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '',
        search: '',
        hash: '',
        protocol: 'http:',
        host: 'localhost:3000',
        port: '3000',
        reload: jest.fn(),
        assign: jest.fn(),
        replace: jest.fn(),
      },
      configurable: true,
    });
    window.fetch = fetchMock(
      {
        headers: {
          get: () => 'text/javascript',
        },
      },
      true,
    );
    isLocalhost.mockImplementation(() => true);
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.reject(new Error('xyz'))),
        ready: Promise.resolve('test'),
      },
      configurable: true,
    });

    SWRegistration.register();
  });

  it('SWRegistration functions test in case of localhost when fetch is throwing error', () => {
    process.env.APP_ENV = ENVS.PROD;
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '',
        search: '',
        hash: '',
        protocol: 'http:',
        host: 'localhost:3000',
        port: '3000',
        reload: jest.fn(),
        assign: jest.fn(),
        replace: jest.fn(),
      },
      configurable: true,
    });
    window.fetch = fetchMock(
      {
        headers: {
          get: () => 'text/javascript',
        },
      },
      true,
    );
    isLocalhost.mockImplementation(() => true);
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.reject(new Error('xyz'))),
        ready: Promise.reject(new Error('test')),
      },
      configurable: true,
    });

    SWRegistration.register();
  });

  it('SWRegistration functions test in case of localhost when service worker is not loaded', () => {
    process.env.APP_ENV = ENVS.PROD;
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '',
        search: '',
        hash: '',
        protocol: 'http:',
        host: 'localhost:3000',
        port: '3000',
        reload: jest.fn(),
        assign: jest.fn(),
        replace: jest.fn(),
      },
      configurable: true,
    });
    window.fetch = fetchMock({
      headers: {
        get: () => '',
      },
    });
    isLocalhost.mockImplementation(() => true);
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.reject(new Error('xyz'))),
        ready: Promise.resolve({
          unregister: () => Promise.resolve(true),
        }),
      },
      configurable: true,
    });

    SWRegistration.register();
  });

  it('SWRegistration functions test in case of localhost when service worker is not loaded', () => {
    process.env.APP_ENV = ENVS.PROD;
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '',
        search: '',
        hash: '',
        protocol: 'http:',
        host: 'localhost:3000',
        port: '3000',
        reload: jest.fn(),
        assign: jest.fn(),
        replace: jest.fn(),
      },
      configurable: true,
    });
    window.fetch = fetchMock({
      headers: {
        get: () => 'text/json',
      },
    });
    isLocalhost.mockImplementation(() => true);
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.reject(new Error('xyz'))),
        ready: Promise.resolve({
          unregister: () => Promise.resolve(true),
        }),
      },
      configurable: true,
    });

    SWRegistration.register();
  });

  it('SWRegistration functions test in case of localhost with different origin', () => {
    process.env.APP_ENV = ENVS.PROD;
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '',
        search: '',
        hash: '',
        protocol: 'http:',
        host: 'localhost:3000',
        port: '3000',
        reload: jest.fn(),
        assign: jest.fn(),
        replace: jest.fn(),
      },
      configurable: true,
    });
    window.fetch = fetchMock({
      headers: {
        get: () => null,
      },
    });
    isLocalhost.mockImplementation(() => true);
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.reject(new Error('xyz'))),
        ready: Promise.resolve({
          unregister: () => Promise.resolve(true),
        }),
      },
      configurable: true,
    });

    SWRegistration.register();
  });

  it('SWRegistration functions test in case of localhost with different origin', () => {
    process.env.APP_ENV = ENVS.PROD;
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '',
        search: '',
        hash: '',
        protocol: 'http:',
        host: 'localhost:3000',
        port: '3000',
        reload: jest.fn(),
        assign: jest.fn(),
        replace: jest.fn(),
      },
      configurable: true,
    });
    window.fetch = fetchMock({
      headers: {
        get: () => 'text/javascript',
      },
    });
    isLocalhost.mockImplementation(() => true);
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.reject(new Error('xyz'))),
        ready: Promise.resolve({
          unregister: () => Promise.resolve(true),
        }),
      },
      configurable: true,
    });

    SWRegistration.register();
  });

  it('SWRegistration functions test in case of localhost with different origin', () => {
    process.env.APP_ENV = ENVS.PROD;
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '',
        search: '',
        hash: '',
        protocol: 'http:',
        host: 'localhost:3000',
        port: '3000',
        reload: jest.fn(),
        assign: jest.fn(),
        replace: jest.fn(),
      },
      configurable: true,
    });
    window.fetch = fetchMock({
      headers: {
        get: () => 'text/javascript',
      },
    });
    isLocalhost.mockImplementation(() => true);
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.reject(new Error('xyz'))),
        ready: Promise.resolve({
          unregister: () => Promise.reject(new Error('true')),
        }),
      },
      configurable: true,
    });

    SWRegistration.register();
  });

  it('SWRegistration functions test in case of different public url', () => {
    process.env.APP_ENV = ENVS.PROD;
    process.env.PUBLIC_URL = 'https://www.temp.com';

    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '',
        search: '',
        hash: '',
        protocol: 'http:',
        host: 'localhost:3000',
        port: '3000',
        reload: jest.fn(),
        assign: jest.fn(),
        replace: jest.fn(),
      },
      configurable: true,
    });
    window.fetch = fetchMock({
      headers: {
        get: () => 'text/javascript',
      },
    });
    isLocalhost.mockImplementation(() => true);
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.reject(new Error('xyz'))),
        ready: Promise.resolve('test'),
      },
      configurable: true,
    });

    SWRegistration.register();
  });
});
