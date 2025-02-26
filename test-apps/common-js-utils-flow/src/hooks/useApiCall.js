// @flow
import { useState, useEffect, useCallback, useRef } from 'react';

import useApiRequest from './useApiRequest';

/**
 * Custom hook for making API calls with support for polling and retrying.
 * @param {object} root0 - The parameters for the API call.
 * @param {AxiosInstance} root0.axiosInstance - The Axios instance to use for the API call.
 * @param {string} root0.requestType - The type of request to make ('get', 'post', 'put', 'delete').
 * @param {string} root0.url - The URL to make the API call to.
 * @param {object} root0.body - The body of the request.
 * @param {boolean} root0.isEnabled - Whether the API call is enabled.
 * @param {number} root0.retryCount - The number of times to retry the API call.
 * @param {number} root0.pollingDelay - The delay between polling attempts.
 * @param {number} root0.pollingCount - The number of polling attempts.
 * @returns {object} An object containing the API call data and status.
 * @example
 * const { isLoading, data, isError, error } = useApiCall({
 *   axiosInstance,
 *   requestType: 'get',
 *   url: '/api/data',
 *   body: {},
 *   isEnabled: true,
 *   retryCount: 3,
 *   pollingDelay: 1000,
 *   pollingCount: 5,
 * });
 */
function useApiCall({
  axiosInstance,
  requestType,
  url,
  body,
  isEnabled = true,
  retryCount = 0,
  pollingDelay = 500,
  pollingCount = 0,
}) {
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Use refs to maintain values between renders and within callbacks
  const retriesRef = useRef(0);
  const attemptsRef = useRef(0);
  const timeoutIdRef = useRef(null);

  const { makeGetCall, makePostCall, makePutCall, makeDeleteCall } =
    useApiRequest();

  const getRequestFunction = useCallback(() => {
    switch (requestType) {
      case 'post':
        return makePostCall;
      case 'put':
        return makePutCall;
      case 'delete':
        return makeDeleteCall;
      case 'get':
      default:
        return makeGetCall;
    }
  }, [requestType]);

  const apiCall = useCallback(async () => {
    setLoading(true);
    const promise = getRequestFunction();

    try {
      const res = await promise({
        url,
        axiosInstance,
        body,
      });
      setData(res);
      setIsError(false);
      setError(null);
    } catch (err) {
      if (!retryCount || retriesRef.current >= retryCount) {
        setIsError(true);
        setError(err);
      } else {
        retriesRef.current += 1;
        await apiCall();
      }
    } finally {
      // Set loading to false if this is the last polling attempt
      if (!pollingCount) {
        setLoading(false);
      }
    }
  }, [url, axiosInstance, body, retryCount, pollingCount, isLoading]);

  const poll = useCallback(async () => {
    await apiCall();
    attemptsRef.current += 1;
    // Only set up next poll if we haven't reached the polling count
    if (attemptsRef.current < pollingCount) {
      retriesRef.current = 0; // Reset retries after success
      timeoutIdRef.current = setTimeout(poll, pollingDelay);
    } else {
      setLoading(false); // Set loading to false on last poll
    }
  }, [pollingCount, pollingDelay]);

  // Effect to handle polling
  useEffect(() => {
    if (!isEnabled) {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      setLoading(false);
      return;
    }

    // Reset counters when enabled changes
    retriesRef.current = 0;
    attemptsRef.current = 0;

    if (pollingCount) {
      poll();
    } else {
      apiCall();
    }
  }, [isEnabled, pollingCount]);

  useEffect(
    () => () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    },
    [],
  );

  return { isLoading, data, isError, error };
}

export { useApiCall };
