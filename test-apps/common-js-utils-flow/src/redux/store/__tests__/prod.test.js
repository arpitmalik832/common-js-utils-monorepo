/**
 * Test cases for the production redux store.
 * @file This file is saved as `redux/store/prod.test.js`.
 */
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

describe('Redux Store (Production)', () => {
  let mockGetDefault;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDefault = jest.fn(() => ['defaultMiddleware']);
  });

  it('should configure store with correct reducers', async () => {
    await import('../prod');

    expect(mockConfigureStore.reducer).toEqual({
      app: slices.appSlice.reducer,
      apis: slices.apisSlice.reducer,
      navigation: slices.navigationSlice.reducer,
      page: slices.pageSlice.reducer,
      sampleQuery: sampleQuery.reducer,
    });
  });

  it('should configure middleware correctly', async () => {
    await import('../prod');

    const result = mockConfigureStore.middleware(mockGetDefault);

    expect(result).toEqual(['defaultMiddleware', sampleQuery.middleware]);
  });
});
