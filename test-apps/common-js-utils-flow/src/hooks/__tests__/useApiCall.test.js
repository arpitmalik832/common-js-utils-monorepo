/**
 * File for unit tests cases for useApiCall.
 * @file This file is saved as `useApiCall.test.js`.
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useApiCall } from '../useApiCall';

describe('useApiCall', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  const defaultProps = {
    axiosInstance: mockAxiosInstance,
    requestType: 'get',
    url: '/test',
    body: { data: 'test' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Basic API Calls', () => {
    it('should make successful GET call', async () => {
      const mockResponse = { data: { data: 'success' } };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useApiCall(defaultProps));

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        defaultProps.url,
        expect.objectContaining({ signal: expect.any(Object) }),
      );
      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(mockResponse?.data);
          expect(result.current.isLoading).toBe(false);
          expect(result.current.isError).toBe(false);
        },
        {
          timeout: 1000,
        },
      );
    });

    it('should make successful POST call', async () => {
      const mockResponse = { data: { data: 'posted' } };
      mockAxiosInstance.post.mockImplementation(() =>
        Promise.resolve({ data: {} }),
      );
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          requestType: 'post',
          body: { name: 'test' },
        }),
      );

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        defaultProps.url,
        { name: 'test' },
        expect.objectContaining({ signal: expect.any(Object) }),
      );
      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(mockResponse?.data);
          expect(result.current.isLoading).toBe(false);
          expect(result.current.isError).toBe(false);
        },
        {
          timeout: 1000,
        },
      );
    });

    it('should make successful PUT call', async () => {
      const mockResponse = { data: { data: 'updated' } };
      mockAxiosInstance.put.mockImplementation(() =>
        Promise.resolve({ data: {} }),
      );
      mockAxiosInstance.put.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          requestType: 'put',
          body: { id: 1, name: 'updated' },
        }),
      );

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        defaultProps.url,
        { id: 1, name: 'updated' },
        expect.objectContaining({ signal: expect.any(Object) }),
      );
      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(mockResponse?.data);
          expect(result.current.isLoading).toBe(false);
          expect(result.current.isError).toBe(false);
        },
        {
          timeout: 1000,
        },
      );
    });

    it('should make successful DELETE call', async () => {
      const mockResponse = { data: { data: 'deleted' } };
      mockAxiosInstance.delete.mockImplementation(() =>
        Promise.resolve({ data: {} }),
      );
      mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          requestType: 'delete',
        }),
      );

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        defaultProps.url,
        expect.objectContaining({ signal: expect.any(Object) }),
      );
      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(mockResponse?.data);
          expect(result.current.isLoading).toBe(false);
          expect(result.current.isError).toBe(false);
        },
        {
          timeout: 1000,
        },
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle errors for POST request', async () => {
      const mockError = new Error('POST Error');
      mockAxiosInstance.post.mockImplementation(() =>
        Promise.reject(mockError),
      );

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          requestType: 'post',
        }),
      );

      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
          expect(result.current.error).toBe(mockError);
          expect(result.current.data).toBe(null);
          expect(result.current.isLoading).toBe(false);
        },
        {
          timeout: 1000,
        },
      );
    });

    it('should handle errors for PUT request', async () => {
      const mockError = new Error('PUT Error');
      mockAxiosInstance.put.mockImplementation(() => Promise.reject(mockError));

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          requestType: 'put',
        }),
      );

      expect(mockAxiosInstance.put).toHaveBeenCalledTimes(1);
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
          expect(result.current.error).toBe(mockError);
          expect(result.current.isLoading).toBe(false);
          expect(result.current.data).toBe(null);
        },
        {
          timeout: 1000,
        },
      );
    });
    it('should handle errors for DELETE request', async () => {
      const mockError = new Error('DELETE Error');
      mockAxiosInstance.delete.mockImplementation(() =>
        Promise.reject(mockError),
      );

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          requestType: 'delete',
        }),
      );

      expect(mockAxiosInstance.delete).toHaveBeenCalledTimes(1);
      await waitFor(
        () => {
          expect(result.current.data).toBe(null);
          expect(result.current.isError).toBe(true);
          expect(result.current.error).toBe(mockError);
          expect(result.current.isLoading).toBe(false);
        },
        {
          timeout: 1000,
        },
      );
    });
  });

  describe('Polling Functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should poll specified number of times', async () => {
      const responses = [
        { data: { data: 'first' } },
        { data: { data: 'second' } },
        { data: { data: 'third' } },
      ];
      responses.forEach(response => {
        mockAxiosInstance.get.mockResolvedValueOnce(response);
      });

      const { result } = renderHook(
        ({ isEnabled }) =>
          useApiCall({
            ...defaultProps,
            pollingCount: 3,
            pollingDelay: 50,
            isEnabled,
          }),
        { initialProps: { isEnabled: true } },
      );

      const checkPollingResponses = async (
        pollingData,
        currentIndex,
        hookResult,
      ) => {
        if (currentIndex >= pollingData.length) return;

        act(() => {
          jest.advanceTimersByTime(50);
        });

        await waitFor(
          () => {
            expect(hookResult.current.data).toStrictEqual(
              pollingData[currentIndex]?.data,
            );
          },
          { timeout: 1000 },
        );

        await checkPollingResponses(pollingData, currentIndex + 1, hookResult);
      };

      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(responses[0]?.data);
        },
        { timeout: 1000 },
      );

      await checkPollingResponses(responses, 1, result);

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 1000 },
      );
    });

    it('should stop polling on isEnabled=false', async () => {
      const mockResponse = { data: { data: 'response' } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const { result, rerender } = renderHook(
        ({ isEnabled }) =>
          useApiCall({
            ...defaultProps,
            pollingCount: Infinity,
            pollingDelay: 500,
            isEnabled,
          }),
        { initialProps: { isEnabled: true } },
      );

      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(mockResponse?.data);
        },
        { timeout: 500 },
      );

      act(() => {
        rerender({ isEnabled: false });
      });

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 1000 },
      );
    });
  });

  describe('Enable/Disable Functionality', () => {
    it('should not make API call when disabled', () => {
      renderHook(() =>
        useApiCall({
          ...defaultProps,
          isEnabled: false,
        }),
      );

      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });

    it('should cleanup polling on disable', async () => {
      const mockResponse = { data: { data: 'response' } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const { result, rerender } = renderHook(
        ({ isEnabled }) =>
          useApiCall({
            ...defaultProps,
            pollingCount: 30,
            isEnabled,
          }),
        { initialProps: { isEnabled: true } },
      );

      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(mockResponse?.data);
        },
        { timeout: 1000 },
      );

      act(() => {
        rerender({ isEnabled: false });
      });

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 1000 },
      );
    });
  });

  describe('Polling with Different Request Types', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should poll with POST requests', async () => {
      const responses = [
        { data: { data: 'first post' } },
        { data: { data: 'second post' } },
      ];

      responses.forEach(response => {
        mockAxiosInstance.post.mockResolvedValueOnce(response);
      });

      const { result, rerender } = renderHook(
        ({ isEnabled }) =>
          useApiCall({
            ...defaultProps,
            requestType: 'post',
            body: { name: 'test' },
            pollingCount: 2,
            pollingDelay: 500,
            isEnabled,
          }),
        { initialProps: { isEnabled: true } },
      );

      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(responses[0]?.data);
        },
        { timeout: 500 },
      );

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        defaultProps.url,
        { name: 'test' },
        expect.objectContaining({ signal: expect.any(Object) }),
      );

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(responses[1]?.data);
        },
        { timeout: 500 },
      );

      act(() => {
        rerender({ isEnabled: false });
      });

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 1000 },
      );
    });

    it('should poll with PUT requests', async () => {
      const responses = [
        { data: { data: 'first update' } },
        { data: { data: 'second update' } },
      ];

      responses.forEach(response => {
        mockAxiosInstance.put.mockResolvedValueOnce(response);
      });

      const { result, rerender } = renderHook(
        ({ isEnabled }) =>
          useApiCall({
            ...defaultProps,
            requestType: 'put',
            body: { id: 1, status: 'active' },
            pollingCount: 2,
            pollingDelay: 500,
            isEnabled,
          }),
        { initialProps: { isEnabled: true } },
      );

      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(responses[0]?.data);
        },
        { timeout: 500 },
      );

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        defaultProps.url,
        { id: 1, status: 'active' },
        expect.objectContaining({ signal: expect.any(Object) }),
      );

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(responses[1]?.data);
        },
        { timeout: 500 },
      );

      act(() => {
        rerender({ isEnabled: false });
      });
    });

    it('should poll with DELETE requests', async () => {
      const responses = [
        { data: { data: 'first delete' } },
        { data: { data: 'second delete' } },
      ];

      responses.forEach(response => {
        mockAxiosInstance.delete.mockResolvedValueOnce(response);
      });

      const { result, rerender } = renderHook(
        ({ isEnabled }) =>
          useApiCall({
            ...defaultProps,
            requestType: 'delete',
            pollingCount: 2,
            pollingDelay: 500,
            isEnabled,
          }),
        { initialProps: { isEnabled: true } },
      );

      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(responses[0]?.data);
        },
        { timeout: 1000 },
      );

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        defaultProps.url,
        expect.objectContaining({ signal: expect.any(Object) }),
      );

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(responses[1]?.data);
        },
        { timeout: 1000 },
      );

      act(() => {
        rerender({ isEnabled: false });
      });
    });

    it('should handle errors during polling with POST', async () => {
      const mockError = new Error('POST Error');
      mockAxiosInstance.post.mockRejectedValue(mockError);

      const { result, rerender } = renderHook(
        ({ isEnabled }) =>
          useApiCall({
            ...defaultProps,
            requestType: 'post',
            pollingCount: 2,
            pollingDelay: 500,
            isEnabled,
          }),
        { initialProps: { isEnabled: true } },
      );

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
          expect(result.current.error).toBe(mockError);
        },
        { timeout: 500 },
      );

      act(() => {
        rerender({ isEnabled: false });
      });
    });
  });

  describe('Retry Logic', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should retry specified number of times before failing', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.get
        .mockImplementationOnce(() => Promise.reject(mockError))
        .mockImplementationOnce(() => Promise.reject(mockError))
        .mockImplementationOnce(() => Promise.reject(mockError));

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          retryCount: 2,
        }),
      );

      // Initial attempt + 2 retries = 3 total attempts
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
          expect(result.current.error).toBe(mockError);
        },
        { timeout: 1000 },
      );

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBe(null);
    });

    it('should succeed on retry attempt', async () => {
      const mockError = new Error('API Error');
      const mockSuccess = { data: { message: 'Success on retry' } };

      mockAxiosInstance.get
        .mockImplementationOnce(() => Promise.reject(mockError))
        .mockImplementationOnce(() => Promise.reject(mockError))
        .mockImplementationOnce(() => Promise.resolve(mockSuccess));

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          retryCount: 2,
        }),
      );

      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(mockSuccess.data);
        },
        { timeout: 1000 },
      );

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should not retry when retryCount is 0', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.get.mockImplementation(() => Promise.reject(mockError));

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          retryCount: 0,
        }),
      );

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
          expect(result.current.error).toBe(mockError);
        },
        { timeout: 1000 },
      );

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle retry with different request types', async () => {
      const mockError = new Error('API Error');
      const mockSuccess = { data: { message: 'Success on retry' } };

      mockAxiosInstance.post
        .mockImplementationOnce(() => Promise.reject(mockError))
        .mockImplementationOnce(() => Promise.resolve(mockSuccess));

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          requestType: 'post',
          retryCount: 1,
          body: { test: 'data' },
        }),
      );

      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(mockSuccess.data);
        },
        { timeout: 1000 },
      );

      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        defaultProps.url,
        { test: 'data' },
        expect.objectContaining({ signal: expect.any(Object) }),
      );
    });
  });

  describe('Combined Polling and Retry', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should handle both polling and retry logic', async () => {
      const mockError = new Error('API Error');
      const mockSuccess1 = { data: { data: 'success after retry' } };
      const mockSuccess2 = { data: { data: 'second poll success' } };

      // First poll: fails twice then succeeds
      mockAxiosInstance.get
        .mockImplementationOnce(() => Promise.reject(mockError))
        .mockImplementationOnce(() => Promise.reject(mockError))
        .mockImplementationOnce(() => Promise.resolve(mockSuccess1))
        // Second poll: fails once then succeeds
        .mockImplementationOnce(() => Promise.reject(mockError))
        .mockImplementationOnce(() => Promise.resolve(mockSuccess2));

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          pollingCount: 2,
          pollingDelay: 100,
          retryCount: 2,
        }),
      );

      // Wait for first successful call after retries
      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(mockSuccess1.data);
        },
        { timeout: 1000 },
      );

      // First poll should have tried 3 times (initial + 2 retries)
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);

      // Advance timer to trigger second poll
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Wait for second poll success after retry
      await waitFor(
        () => {
          expect(result.current.data).toStrictEqual(mockSuccess2.data);
        },
        { timeout: 1000 },
      );

      // Total calls should be 5 (3 from first poll + 2 from second poll)
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(5);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should stop both polling and retry when disabled', async () => {
      const mockError = new Error('API Error');

      mockAxiosInstance.get.mockImplementation(() => Promise.reject(mockError));

      const { result, rerender } = renderHook(
        ({ isEnabled }) =>
          useApiCall({
            ...defaultProps,
            pollingCount: 3,
            pollingDelay: 100,
            retryCount: 2,
            isEnabled,
          }),
        { initialProps: { isEnabled: true } },
      );

      // Wait for some retries to happen
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(true);
        },
        { timeout: 1000 },
      );

      // Disable the component
      act(() => {
        rerender({ isEnabled: false });
      });

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 1000 },
      );

      const initialCallCount = mockAxiosInstance.get.mock.calls.length;

      // Advance timer to ensure no more calls are made
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(initialCallCount);
    });

    it('should handle max retries for each polling attempt', async () => {
      const mockError = new Error('API Error');

      mockAxiosInstance.get.mockImplementation(() => Promise.reject(mockError));

      const { result } = renderHook(() =>
        useApiCall({
          ...defaultProps,
          pollingCount: 2,
          pollingDelay: 100,
          retryCount: 2,
        }),
      );

      // Wait for first polling cycle to complete its retries
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
          expect(result.current.error).toBe(mockError);
        },
        { timeout: 1000 },
      );

      // Should have tried 3 times (initial + 2 retries)
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);

      // Advance timer to trigger second polling cycle
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Wait for second polling cycle to complete its retries
      await waitFor(
        () => {
          expect(mockAxiosInstance.get).toHaveBeenCalledTimes(6); // 3 + 3
        },
        { timeout: 1000 },
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
    });
  });
});
