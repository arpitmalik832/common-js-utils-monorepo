/**
 * This file is used to test the store configuration.
 * @file This file is saved as `src/redux/store/__tests__/store.test.js`.
 */
import { APP_ENUMS } from '@arpitmalik832/common-js-utils-flow';
import devStore from '../dev';
import prodStore from '../prod';

// Mock the environment modules
jest.mock('../dev', () => ({
  __esModule: true,
  default: {
    type: 'devStore',
  },
}));

jest.mock('../prod', () => ({
  __esModule: true,
  default: {
    type: 'prodStore',
  },
}));

jest.mock('@arpitmalik832/common-js-utils-flow', () => ({
  APP_ENUMS: {
    ENVS: {
      PROD: 'production',
      DEV: 'development',
      STG: 'staging',
      BETA: 'beta',
    },
  },
}));

describe('Store Configuration Tests', () => {
  // Store the original environment
  const originalEnv = process.env.APP_ENV;

  afterEach(() => {
    // Restore the original environment after each test
    process.env.APP_ENV = originalEnv;
    jest.resetModules();
  });

  it('should export development store when APP_ENV is not production', async () => {
    process.env.APP_ENV = APP_ENUMS.ENVS.DEV;
    const { default: store } = await import('../main');
    expect(store).toEqual(devStore);
    expect(store.type).toBe('devStore');
  });

  it('should export production store when APP_ENV is production', async () => {
    process.env.APP_ENV = APP_ENUMS.ENVS.PROD;
    const { default: store } = await import('../main');
    expect(store).toEqual(prodStore);
    expect(store.type).toBe('prodStore');
  });

  it('should default to development store when APP_ENV is undefined', async () => {
    process.env.APP_ENV = undefined;
    const { default: store } = await import('../main');
    expect(store).toEqual(devStore);
    expect(store.type).toBe('devStore');
  });

  it('should default to development store when APP_ENV is invalid', async () => {
    process.env.APP_ENV = 'invalid';
    const { default: store } = await import('../main');
    expect(store).toEqual(devStore);
    expect(store.type).toBe('devStore');
  });

  describe('Environment Constants', () => {
    it('should have correct environment values', () => {
      expect(APP_ENUMS.ENVS.PROD).toBe('production');
      expect(APP_ENUMS.ENVS.DEV).toBe('development');
    });
  });

  describe('Store Imports', () => {
    it('should successfully import development store', () => {
      expect(devStore).toBeDefined();
      expect(devStore.type).toBe('devStore');
    });

    it('should successfully import production store', () => {
      expect(prodStore).toBeDefined();
      expect(prodStore.type).toBe('prodStore');
    });
  });
});
