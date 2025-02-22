/**
 * Unit tests for apisSlice.
 * @file This file is saved as `apisSlice.test.js`.
 */
import { apisSlice, apisSliceActions } from '../apisSlice';

describe('apisSlice reducers', () => {
  let initialState;

  beforeEach(() => {
    initialState = [
      {
        host: 'api1.example.com',
        headers: { 'Content-Type': 'application/json' },
        axiosInstance: {},
      },
      {
        host: 'api2.example.com',
        headers: { Authorization: 'Bearer token' },
        axiosInstance: {},
      },
    ];
  });

  it('should handle initial state', () => {
    expect(apisSlice.reducer(undefined, { type: 'unknown' })).toEqual([]);
  });

  it('should handle addNewApiData', () => {
    const newApi = {
      host: 'api3.example.com',
      headers: { 'x-api-key': '12345' },
      axiosInstance: {},
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.addNewApiData(newApi),
    );
    expect(actual).toHaveLength(3);
    expect(actual).toContainEqual(newApi);
  });

  it('should handle updateApiHostByHost', () => {
    const action = {
      oldValue: 'api1.example.com',
      newValue: 'new-api1.example.com',
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiHostByHost(action),
    );
    expect(actual[0].host).toBe('new-api1.example.com');
  });

  // Error case
  it('should handle updateApiHostByHost with non-existent host', () => {
    const action = {
      oldValue: 'non-existent.com',
      newValue: 'new-host.com',
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiHostByHost(action),
    );
    expect(actual).toEqual(initialState);
  });

  it('should handle updateApiHostByIndex', () => {
    const action = {
      index: 0,
      newValue: 'new-api1.example.com',
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiHostByIndex(action),
    );
    expect(actual[0].host).toBe('new-api1.example.com');
  });

  // Error case
  it('should handle updateApiHostByIndex with invalid index', () => {
    const action = {
      index: 999,
      newValue: 'new-host.com',
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiHostByIndex(action),
    );
    expect(actual).toEqual(initialState);
  });

  it('should handle updateApiHeadersByHost', () => {
    const action = {
      host: 'api1.example.com',
      newHeaders: { 'Content-Type': 'application/xml' },
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiHeadersByHost(action),
    );
    expect(actual[0].headers).toEqual({ 'Content-Type': 'application/xml' });
  });

  // Error case
  it('should handle updateApiHeadersByHost with non-existent host', () => {
    const action = {
      host: 'non-existent.com',
      newHeaders: { test: 'value' },
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiHeadersByHost(action),
    );
    expect(actual).toEqual(initialState);
  });

  it('should handle updateApiHeadersByIndex', () => {
    const action = {
      index: 0,
      newHeaders: { 'Content-Type': 'application/xml' },
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiHeadersByIndex(action),
    );
    expect(actual[0].headers).toEqual({ 'Content-Type': 'application/xml' });
  });

  // Error case
  it('should handle updateApiHeadersByIndex', () => {
    const action = {
      index: 999,
      newHeaders: { 'Content-Type': 'application/xml' },
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiHeadersByIndex(action),
    );
    expect(actual).toEqual(initialState);
  });

  it('should handle addToApiHeadersByHost', () => {
    const action = {
      host: 'api1.example.com',
      newHeader: {
        key: 'x-custom-header',
        value: 'custom-value',
      },
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.addToApiHeadersByHost(action),
    );
    expect(actual[0].headers['Content-Type']).toBe('application/json');
    expect(actual[0].headers['x-custom-header']).toBe('custom-value');
  });

  // Error case
  it('should handle addToApiHeadersByHost with non-existent host', () => {
    const action = {
      host: 'non-existent.com',
      newHeader: {
        key: 'test',
        value: 'value',
      },
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.addToApiHeadersByHost(action),
    );
    expect(actual).toEqual(initialState);
  });

  it('should handle addToApiHeadersByIndex', () => {
    const action = {
      index: 0,
      newHeader: {
        key: 'x-custom-header',
        value: 'custom-value',
      },
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.addToApiHeadersByIndex(action),
    );
    expect(actual[0].headers['x-custom-header']).toBe('custom-value');
  });

  // Error case
  it('should handle addToApiHeadersByIndex', () => {
    const action = {
      index: 999,
      newHeader: {
        key: 'x-custom-header',
        value: 'custom-value',
      },
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.addToApiHeadersByIndex(action),
    );
    expect(actual).toEqual(initialState);
  });

  it('should handle updateApiAxiosInstanceByHost', () => {
    const newAxiosInstance = { baseURL: 'https://new-api.example.com' };
    const action = {
      host: 'api1.example.com',
      axiosInstance: newAxiosInstance,
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiAxiosInstanceByHost(action),
    );
    expect(actual[0].axiosInstance).toEqual(newAxiosInstance);
  });

  // Error case
  it('should handle updateApiAxiosInstanceByHost with non-existent host', () => {
    const action = {
      host: 'non-existent.com',
      axiosInstance: { baseURL: 'https://new-api.example.com' },
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiAxiosInstanceByHost(action),
    );
    expect(actual).toEqual(initialState);
  });

  it('should handle updateApiAxiosInstanceByIndex', () => {
    const newAxiosInstance = { baseURL: 'https://new-api.example.com' };
    const action = {
      index: 0,
      axiosInstance: newAxiosInstance,
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiAxiosInstanceByIndex(action),
    );
    expect(actual[0].axiosInstance).toEqual(newAxiosInstance);
  });

  // Error case
  it('should handle updateApiAxiosInstanceByIndex', () => {
    const action = {
      index: 999,
      axiosInstance: { baseURL: 'https://new-api.example.com' },
    };

    const actual = apisSlice.reducer(
      initialState,
      apisSliceActions.updateApiAxiosInstanceByIndex(action),
    );
    expect(actual).toEqual(initialState);
  });
});
