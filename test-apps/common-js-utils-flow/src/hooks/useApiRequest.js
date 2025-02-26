// @flow
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import { handleRequest } from '@arpitmalik832/common-js-utils-flow';

export type RequestConfig = {
  url: string,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
};

export type RequestConfigWithBody<T> = {
  url: string,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
  body?: T,
};

type UseApiRequest = {
  makeGetCall: <D>(params: RequestConfig) => Promise<D>,
  makePostCall: <T, D>(params: RequestConfigWithBody<T>) => Promise<D>,
  makePutCall: <T, D>(params: RequestConfigWithBody<T>) => Promise<D>,
  makeDeleteCall: <D>(params: RequestConfig) => Promise<D>,
  cancelRequest: (key: string) => void,
  cancelAllRequests: () => void,
};

type AbortControllers = Record<string, AbortController>;

function useApiRequest(): UseApiRequest {
  let abortControllers: AbortControllers = {};

  function createAbortController(key: string) {
    if (!abortControllers[key]) {
      abortControllers[key] = new AbortController();
    }

    return abortControllers[key];
  }

  function makeGetCall<D>(params: RequestConfig): Promise<D> {
    const { url, axiosInstance, config } = params;
    const abortController = createAbortController(`GET ${url}`);
    const { signal } = abortController;

    return handleRequest<D>(
      axiosInstance.get(url, {
        ...config,
        signal,
      }),
    );
  }

  function makePostCall<T, D>(params: RequestConfigWithBody<T>): Promise<D> {
    const { url, body, axiosInstance, config } = params;
    const abortController = createAbortController(`POST ${url}`);
    const { signal } = abortController;

    return handleRequest<D>(
      axiosInstance.post(url, body, {
        ...config,
        signal,
      }),
    );
  }

  function makePutCall<T, D>(params: RequestConfigWithBody<T>): Promise<D> {
    const { url, body, axiosInstance, config } = params;
    const abortController = createAbortController(`PUT ${url}`);
    const { signal } = abortController;

    return handleRequest<D>(
      axiosInstance.put(url, body, {
        ...config,
        signal,
      }),
    );
  }

  function makeDeleteCall<D>(params: RequestConfig): Promise<D> {
    const { url, axiosInstance, config } = params;
    const abortController = createAbortController(`DELETE ${url}`);
    const { signal } = abortController;

    return handleRequest<D>(
      axiosInstance.delete(url, {
        ...config,
        signal,
      }),
    );
  }

  function cancelRequest(key: string) {
    if (abortControllers[key]) {
      abortControllers[key].abort();
      delete abortControllers[key];
    }
  }

  function cancelAllRequests() {
    Object.keys(abortControllers).forEach(key => {
      abortControllers[key].abort();
    });
    abortControllers = {};
  }

  return {
    makeGetCall,
    makePostCall,
    makePutCall,
    makeDeleteCall,
    cancelRequest,
    cancelAllRequests,
  };
}

export default useApiRequest;
