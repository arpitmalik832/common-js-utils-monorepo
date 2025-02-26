/**
 * Test cases for the development redux store.
 * @file This file is saved as `redux/store/dev.test.js`.
 */
import { thunk } from 'redux-thunk';
import { logger } from 'redux-logger';
import { slices } from '@arpitmalik832/common-js-utils-flow-pkg';
import { sampleQuery } from '../../queries/sampleQuery';

let mockConfigureStore;

jest.mock('@reduxjs/toolkit', () => ({
  configureStore: jest.fn(config => {
    mockConfigureStore = config;
    return { type: 'mockStore' };
  }),
  createSlice: jest.fn(config => ({
    name: config.name,
    reducer: jest.fn(),
    actions: {},
  })),
}));

jest.mock('redux-thunk', () => ({
  thunk: jest.fn(),
}));

jest.mock('redux-logger', () => ({
  logger: jest.fn(),
}));

jest.mock('@arpitmalik832/common-js-utils-flow-pkg', () => ({
  slices: {
    appSlice: { reducer: jest.fn() },
    apisSlice: { reducer: jest.fn() },
    navigationSlice: { reducer: jest.fn() },
    pageSlice: { reducer: jest.fn() },
  },
}));

jest.mock('../../queries/sampleQuery', () => ({
  sampleQuery: {
    reducer: jest.fn(),
    middleware: jest.fn(),
  },
}));

describe('Redux Store (Development)', () => {
  let mockGetDefault;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDefault = jest.fn(() => ['defaultMiddleware']);
  });

  it('should configure store with correct reducers', async () => {
    await import('../dev');

    expect(mockConfigureStore.reducer).toEqual({
      app: slices.appSlice.reducer,
      apis: slices.apisSlice.reducer,
      navigation: slices.navigationSlice.reducer,
      page: slices.pageSlice.reducer,
      sampleQuery: sampleQuery.reducer,
    });
  });

  it('should configure middleware correctly', async () => {
    await import('../dev');

    const result = mockConfigureStore.middleware(mockGetDefault);

    expect(result).toEqual([
      'defaultMiddleware',
      sampleQuery.middleware,
      thunk,
      logger,
    ]);
  });
});
