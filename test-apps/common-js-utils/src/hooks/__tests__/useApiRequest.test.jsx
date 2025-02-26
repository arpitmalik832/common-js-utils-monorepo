/**
 * Unit tests for useApiRequest hook.
 * @file The file is saved as `useApiRequest.test.jsx`.
 */
import { cleanup, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Provider, useSelector } from 'react-redux';

import useApiRequest from '../useApiRequest';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    defaults: {
      baseURL: 'http://test.com',
      headers: {
        common: {},
        get: {},
        post: {},
        put: {},
        delete: {},
      },
    },
  })),
  defaults: {
    headers: {
      common: {},
      get: {},
      post: {},
      put: {},
      delete: {},
    },
  },
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
}));

jest.mock('@arpitmalik832/common-js-utils-pkg', () => ({
  __esModule: true,
  handleRequest: jest.fn(e => e.then(res => res.data).catch(err => err)),
}));

describe('useApiRequest unit tests', () => {
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const axiosInstance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com/',
  });

  const apisSlice = createSlice({
    name: 'apis',
    initialState: [
      {
        host: 'https://jsonplaceholder.typicode.com/',
        headers: {},
        axiosInstance,
      },
    ],
    reducers: {},
  });

  const store = configureStore({
    reducer: {
      apis: apisSlice.reducer,
    },
  });

  it('snapshot test', () => {
    const TempComponent = () => {
      useApiRequest();

      return (
        <button data-testid="temp-component" type="button">
          Mocked
        </button>
      );
    };

    const component = render(
      <Provider store={store}>
        <TempComponent />
      </Provider>,
    );

    expect(component).toMatchSnapshot();
  });

  it('get api call test', () => {
    const TempComponent = () => {
      const apis = useSelector(state => state.apis);
      const { makeGetCall } = useApiRequest();

      return (
        <button
          data-testid="temp-component"
          type="button"
          onClick={() => {
            makeGetCall({
              url: 'todos/1',
              axiosInstance: apis[0].axiosInstance,
            });
          }}
        >
          Mocked
        </button>
      );
    };

    const component = render(
      <Provider store={store}>
        <TempComponent />
      </Provider>,
    );

    fireEvent.click(component.getByTestId('temp-component'));
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    fireEvent.click(component.getByTestId('temp-component'));
    expect(axiosInstance.get).toHaveBeenCalledTimes(2);
  });

  it('cancel get api call test', () => {
    const TempComponent = () => {
      const apis = useSelector(state => state.apis);
      const { makeGetCall, cancelRequest } = useApiRequest();

      return (
        <button
          data-testid="temp-component"
          type="button"
          onClick={() => {
            makeGetCall({
              url: 'todos/1',
              axiosInstance: apis[0].axiosInstance,
            });
            cancelRequest('GET todos/1');
            cancelRequest('GET xyz');
          }}
        >
          Mocked
        </button>
      );
    };

    const component = render(
      <Provider store={store}>
        <TempComponent />
      </Provider>,
    );

    fireEvent.click(component.getByTestId('temp-component'));
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
  });

  it('post api call test', () => {
    const TempComponent = () => {
      const apis = useSelector(state => state.apis);
      const { makePostCall } = useApiRequest();

      return (
        <button
          data-testid="temp-component"
          type="button"
          onClick={() => {
            makePostCall({
              url: 'todos',
              axiosInstance: apis[0].axiosInstance,
            });
          }}
        >
          Mocked
        </button>
      );
    };

    const component = render(
      <Provider store={store}>
        <TempComponent />
      </Provider>,
    );

    fireEvent.click(component.getByTestId('temp-component'));
    expect(axiosInstance.post).toHaveBeenCalledTimes(1);
  });

  it('put api call test', () => {
    const TempComponent = () => {
      const apis = useSelector(state => state.apis);
      const { makePutCall } = useApiRequest();

      return (
        <button
          data-testid="temp-component"
          type="button"
          onClick={() => {
            makePutCall({
              url: 'todos/1',
              axiosInstance: apis[0].axiosInstance,
            });
          }}
        >
          Mocked
        </button>
      );
    };

    const component = render(
      <Provider store={store}>
        <TempComponent />
      </Provider>,
    );

    fireEvent.click(component.getByTestId('temp-component'));
    expect(axiosInstance.put).toHaveBeenCalledTimes(1);
  });

  it('delete api call test', () => {
    const TempComponent = () => {
      const apis = useSelector(state => state.apis);
      const { makeDeleteCall } = useApiRequest();

      return (
        <button
          data-testid="temp-component"
          type="button"
          onClick={() => {
            makeDeleteCall({
              url: 'todos/1',
              axiosInstance: apis[0].axiosInstance,
            });
          }}
        >
          Mocked
        </button>
      );
    };

    const component = render(
      <Provider store={store}>
        <TempComponent />
      </Provider>,
    );

    fireEvent.click(component.getByTestId('temp-component'));
    expect(axiosInstance.delete).toHaveBeenCalledTimes(1);
  });

  it('cancel all api calls test', () => {
    const TempComponent = () => {
      const apis = useSelector(state => state.apis);
      const { makePostCall, makePutCall, makeDeleteCall, cancelAllRequests } =
        useApiRequest();

      return (
        <button
          data-testid="temp-component"
          type="button"
          onClick={() => {
            makePostCall({
              url: 'todos',
              axiosInstance: apis[0].axiosInstance,
            });
            makePutCall({
              url: 'todos/1',
              axiosInstance: apis[0].axiosInstance,
            });
            makeDeleteCall({
              url: 'todos/1',
              axiosInstance: apis[0].axiosInstance,
            });
            cancelAllRequests();
          }}
        >
          Mocked
        </button>
      );
    };

    const component = render(
      <Provider store={store}>
        <TempComponent />
      </Provider>,
    );

    fireEvent.click(component.getByTestId('temp-component'));
    expect(axiosInstance.post).toHaveBeenCalledTimes(1);
    expect(axiosInstance.put).toHaveBeenCalledTimes(1);
    expect(axiosInstance.delete).toHaveBeenCalledTimes(1);
  });
});
