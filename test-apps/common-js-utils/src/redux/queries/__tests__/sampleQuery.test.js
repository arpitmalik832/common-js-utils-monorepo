/**
 * This file is used to test the sample query.
 * @file This file is saved as `src/redux/queries/__tests__/sampleQuery.test.js`.
 */
/* eslint-disable global-require */
import { createApi } from '@reduxjs/toolkit/query/react';

// Only mock the external dependencies
jest.mock('@reduxjs/toolkit/query/react', () => ({
  createApi: jest.fn(() => ({
    reducerPath: 'sampleQuery',
    tagTypes: ['Jokes'],
    middleware: jest.fn(),
    reducer: jest.fn(),
    util: {},
  })),
}));

jest.mock('@arpitmalik832/common-js-utils', () => ({
  queries: {
    baseQueryFn: jest.fn(() => ({
      baseQuery: 'mockedBaseQuery',
    })),
  },
}));

describe('sampleQuery Tests', () => {
  let endpointsBuilder;

  // Create a complete mock builder with both query and mutation methods
  const createMockBuilder = () => ({
    query: jest.fn(config => ({
      query: config.query,
      providesTags: config.providesTags,
    })),
    mutation: jest.fn(config => ({
      query: config.query,
      invalidatesTags: config.invalidatesTags,
    })),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Import the actual sampleQuery implementation to trigger createApi call
    jest.isolateModules(() => {
      require('../sampleQuery');
    });
    // Get the endpoints builder after createApi has been called
    endpointsBuilder = createApi.mock.calls[0][0].endpoints;
  });

  describe('endpoints', () => {
    const mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
    };

    describe('fetchData', () => {
      it('should have correct query configuration', () => {
        const mockBuilder = createMockBuilder();
        const endpoints = endpointsBuilder(mockBuilder);

        const result = endpoints.fetchData.query(mockAxiosInstance);

        expect(result).toEqual({
          axiosInstance: mockAxiosInstance,
          url: '/jokes',
        });
      });

      it('should provide correct tags', () => {
        const mockBuilder = createMockBuilder();
        const endpoints = endpointsBuilder(mockBuilder);

        expect(endpoints.fetchData.providesTags).toEqual([
          { type: 'Jokes', id: 'LIST' },
        ]);
      });
    });

    describe('updateData', () => {
      it('should have correct mutation configuration', () => {
        const mockBuilder = createMockBuilder();
        const endpoints = endpointsBuilder(mockBuilder);

        const result = endpoints.updateData.query(mockAxiosInstance);

        expect(result).toEqual({
          axiosInstance: mockAxiosInstance,
          url: '/jokes/update',
        });
      });

      it('should invalidate correct tags', () => {
        const mockBuilder = createMockBuilder();
        const endpoints = endpointsBuilder(mockBuilder);

        expect(endpoints.updateData.invalidatesTags).toEqual([
          { type: 'Jokes', id: 'LIST' },
        ]);
      });
    });
  });

  describe('API configuration', () => {
    it('should use correct base query function', () => {
      expect(createApi).toHaveBeenCalledWith({
        reducerPath: 'sampleQuery',
        baseQuery: expect.any(Function),
        tagTypes: ['Jokes'],
        endpoints: expect.any(Function),
      });
    });

    it('should have correct endpoint configuration', () => {
      expect(typeof endpointsBuilder).toBe('function');
    });
  });

  describe('RTK Query integration', () => {
    it('should have required RTK Query properties', () => {
      // Import the actual sampleQuery for this test
      const { sampleQuery } = require('../sampleQuery');
      expect(sampleQuery.middleware).toBeDefined();
      expect(sampleQuery.reducer).toBeDefined();
      expect(sampleQuery.util).toBeDefined();
    });
  });
});
