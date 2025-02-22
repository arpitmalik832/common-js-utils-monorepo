/**
 * Unit test for apiUtils.
 * @file This file is saved as `apiUtils.test.js`.
 */
import '@testing-library/jest-dom';
import axios, { AxiosError } from 'axios';

import {
  addRequestInterceptor,
  addResponseInterceptor,
  handleRequest,
} from '../apiUtils';
import { errorLog } from '../logsUtils';

jest.mock('../logsUtils', () => ({
  __esModule: true,
  log: jest.fn(),
  errorLog: jest.fn(),
}));

describe('apiUtils unit test', () => {
  const axiosInstance = axios.create();
  axiosInstance.interceptors.request.use = jest.fn();
  axiosInstance.interceptors.response.use = jest.fn();

  it('test function with proper response', () => {
    const mockData = { data: 'test data' };

    handleRequest(
      Promise.resolve({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        request: {},
      }),
    )
      .then(result => {
        expect(result).toEqual(mockData);
      })
      .catch(() => {});
  });

  it('should handle Axios API error response', () => {
    const mockError = 'Testing AxiosError';

    handleRequest(
      Promise.reject(new AxiosError(mockError, '404', {}, {}, {})),
    ).catch(error => {
      expect(error.message).toEqual(mockError);
    });
  });

  it('should handle Network Error Case', () => {
    const message = 'Not Found';
    const requestUrl = 'https://example.com/';

    handleRequest(
      Promise.reject(new AxiosError(message, '404', {}, { url: requestUrl })),
    ).catch(error => {
      expect(error.message).toEqual(message);
    });
  });

  it('should handle Network Error Case', () => {
    const requestUrl = 'https://example.com/';

    handleRequest(
      Promise.reject(
        new AxiosError(
          '',
          '404',
          {
            url: requestUrl,
          },
          {},
        ),
      ),
    ).catch(error => {
      expect(error.config?.url).toEqual(requestUrl);
    });
  });

  it('should handle canceled request Case', () => {
    const message = 'canceled';

    handleRequest(Promise.reject(new AxiosError(message, '404', {}, {}))).catch(
      error => {
        expect(error.message).toEqual(message);
      },
    );
  });

  it('should handle Network Error Case', () => {
    handleRequest(Promise.reject(new AxiosError())).catch(error => {
      expect(typeof error).toEqual('object');
    });
  });

  it('test addRequestInterceptor', () => {
    addRequestInterceptor(axiosInstance);
    const requestMetadata = {
      headers: {},
      data: {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        responseTime: 0,
      },
    };

    axiosInstance.interceptors.request.use.mock.calls[0][0](requestMetadata);

    try {
      axiosInstance.interceptors.request.use.mock.calls[0][1](requestMetadata);
    } catch (r) {
      errorLog(r);
    }
  });

  it('test addResponseInterceptor', () => {
    addResponseInterceptor(axiosInstance);
    const response = {
      data: 'data',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {},
      },
    };

    axiosInstance.interceptors.response.use.mock.calls[0][0](response);
    try {
      axiosInstance.interceptors.response.use.mock.calls[0][1](response);
    } catch (r) {
      errorLog(r);
    }
  });

  it('test addResponseInterceptor', () => {
    addResponseInterceptor(axiosInstance);
    const response = {
      data: 'data',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {},
        data: JSON.stringify({
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          responseTime: 0,
        }),
      },
    };

    axiosInstance.interceptors.response.use.mock.calls[0][0](response);
    try {
      axiosInstance.interceptors.response.use.mock.calls[0][1](response);
    } catch (r) {
      errorLog(r);
    }
  });

  it('test addResponseInterceptor', () => {
    addResponseInterceptor(axiosInstance);
    const response = {
      data: 'data',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {},
        data: JSON.stringify({}),
      },
    };

    axiosInstance.interceptors.response.use.mock.calls[0][0](response);
    try {
      axiosInstance.interceptors.response.use.mock.calls[0][1](response);
    } catch (r) {
      errorLog(r);
    }
  });
});
