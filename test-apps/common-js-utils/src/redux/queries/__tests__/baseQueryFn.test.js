/**
 * Unit tests for baseQueryFn file.
 * @file This file is saved as `baseQueryFn.test.jsx`.
 */
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import useApiRequest from '../../../hooks/useApiRequest';
import baseQueryFn from '../baseQueryFn';

// Mock the useApiRequest hook
jest.mock('../../../hooks/useApiRequest', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock logsUtils
jest.mock('@arpitmalik832/common-js-utils-pkg', () => ({
  errorLog: jest.fn(),
}));

describe('baseQueryFn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it('should handle successful API calls', async () => {
    const mockResponse = { data: 'test data' };
    const mockMakeGetCall = jest.fn().mockResolvedValue(mockResponse);
    useApiRequest.mockReturnValue({ makeGetCall: mockMakeGetCall });

    const query = baseQueryFn();
    await expect(
      query({
        axiosInstance: {},
        url: 'test/url',
      }),
    ).resolves.toEqual({ data: mockResponse });

    expect(mockMakeGetCall).toHaveBeenCalledWith({
      url: 'test/url',
      axiosInstance: {},
    });
  });

  it('should handle API call errors', async () => {
    const apiError = { message: 'API Error' };
    const mockMakeGetCall = jest.fn().mockRejectedValue(apiError);
    useApiRequest.mockReturnValue({ makeGetCall: mockMakeGetCall });

    const query = baseQueryFn();
    await expect(
      query({
        axiosInstance: {},
        url: 'test/url',
      }),
    ).resolves.toEqual({ error: apiError });
  });

  it('should handle hook initialization errors', async () => {
    const initError = new Error('Hook initialization error');
    useApiRequest.mockImplementation(() => {
      throw initError;
    });

    const query = baseQueryFn();
    await expect(
      query({
        axiosInstance: {},
        url: 'test/url',
      }),
    ).rejects.toThrow('Hook initialization error');
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network Error');
    networkError.code = 'ERR_NETWORK';
    const mockMakeGetCall = jest.fn().mockRejectedValue(networkError);
    useApiRequest.mockReturnValue({ makeGetCall: mockMakeGetCall });

    const query = baseQueryFn();
    await expect(
      query({
        axiosInstance: {},
        url: 'test/url',
      }),
    ).resolves.toEqual({ error: networkError });
  });

  it('should handle missing parameters', async () => {
    const mockMakeGetCall = jest
      .fn()
      .mockRejectedValue(new Error('Invalid parameters'));
    useApiRequest.mockReturnValue({ makeGetCall: mockMakeGetCall });

    const query = baseQueryFn();
    await expect(
      query({
        axiosInstance: {},
        url: undefined,
      }),
    ).resolves.toHaveProperty('error');
  });

  it('should handle malformed response', async () => {
    const mockMakeGetCall = jest.fn().mockResolvedValue(undefined);
    useApiRequest.mockReturnValue({ makeGetCall: mockMakeGetCall });

    const query = baseQueryFn();
    await expect(
      query({
        axiosInstance: {},
        url: 'test/url',
      }),
    ).resolves.toHaveProperty('data');
  });

  it('should handle axios instance errors', async () => {
    const axiosError = new Error('Axios instance error');
    const mockMakeGetCall = jest.fn().mockRejectedValue(axiosError);
    useApiRequest.mockReturnValue({ makeGetCall: mockMakeGetCall });

    const query = baseQueryFn();
    await expect(
      query({
        axiosInstance: null,
        url: 'test/url',
      }),
    ).resolves.toEqual({ error: axiosError });
  });

  // Test for promise rejection
  it('should handle promise rejection', async () => {
    const rejectionError = new Error('Promise rejected');
    const mockMakeGetCall = jest.fn().mockRejectedValue(rejectionError);
    useApiRequest.mockReturnValue({ makeGetCall: mockMakeGetCall });

    const query = baseQueryFn();
    const result = await query({
      axiosInstance: {},
      url: 'test/url',
    }).catch(error => ({ error }));

    expect(result).toEqual({ error: rejectionError });
  });

  // Test for undefined response
  it('should handle undefined response', async () => {
    const mockMakeGetCall = jest.fn().mockResolvedValue(undefined);
    useApiRequest.mockReturnValue({ makeGetCall: mockMakeGetCall });

    const query = baseQueryFn();
    const result = await query({
      axiosInstance: {},
      url: 'test/url',
    });

    expect(result).toEqual({ data: undefined });
  });
});
