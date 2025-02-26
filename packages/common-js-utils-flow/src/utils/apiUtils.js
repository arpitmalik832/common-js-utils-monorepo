// @flow
import { AxiosInstance, AxiosResponse } from 'axios';
import { log, errorLog } from './logsUtils';

function handleRequest<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
  return request
    .then(
      res => res.data, // Successful response
    )
    .catch(error => {
      if (error.response) {
        // Axios API Error Response
      } else if (error.message || error.config) {
        // Network Error Case
      }

      if (error.message === 'canceled') {
        // Handle cancellation gracefully
      } else if (error.response) {
        // Request was made and server responded with an error status
        // Handle different HTTP error statuses (4xx, 5xx) as needed
      } else if (error.request) {
        // Request was made but no response was received
        // Handle network-related errors
      } else {
        // Something else happened
        // Handle unexpected errors
      }
      throw error; // Rethrow the error for further handling
    });
}

function addRequestInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(
    request => {
      const newRequest = {
        ...request,
        data: {
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          responseTime: 0,
        },
      };
      log('Starting request -> ', newRequest);
      return newRequest;
    },
    error => {
      errorLog('Request returned with error -> ', error);
      throw error;
    },
  );
}

function addResponseInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    response => {
      const metadata = JSON.parse((response.config.data ?? '{}').toString());
      let updatedMetadata;
      if (Object.entries(metadata).length) {
        const startTime = new Date(metadata.startTime);
        const endTime = new Date();
        updatedMetadata = {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          responseTime: endTime.getTime() - startTime.getTime(),
        };
      } else {
        updatedMetadata = { startTime: '', endTime: '', responseTime: 0 };
      }
      const newResponse = {
        ...response,
        config: {
          ...response.config,
          data: updatedMetadata,
        },
      };
      log('Returning response -> ', newResponse);
      return newResponse;
    },
    error => {
      const metadata = JSON.parse((error.config.data ?? '{}').toString());
      let updatedMetadata;
      if (Object.entries(metadata).length) {
        const startTime = new Date(metadata.startTime);
        const endTime = new Date();
        updatedMetadata = {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          responseTime: endTime.getTime() - startTime.getTime(),
        };
      } else {
        updatedMetadata = { startTime: '', endTime: '', responseTime: 0 };
      }
      const newError = {
        ...error,
        config: {
          ...error.config,
          data: updatedMetadata,
        },
      };
      errorLog('Response returned with error -> ', newError);
      throw newError;
    },
  );
}

export { handleRequest, addRequestInterceptor, addResponseInterceptor };
