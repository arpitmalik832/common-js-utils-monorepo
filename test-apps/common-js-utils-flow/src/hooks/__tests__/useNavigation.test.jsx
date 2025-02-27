/**
 * Unit tests for useNavigation hook.
 * @file The file is saved as `useNavigation.test.jsx`.
 */
import { renderHook, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { slices } from '@arpitmalik832/common-js-utils-flow-pkg';

import useNavigation from '../useNavigation';

jest.mock('react-router', () => ({
  __esModule: true,
  useNavigate: () => {
    const rand = Math.random();
    if (rand < 0.3) {
      return jest.fn(() => Promise.resolve());
    }
    if (rand < 0.6) {
      return jest.fn(() => Promise.reject(new Error('an error')));
    }
    return jest.fn();
  },
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@arpitmalik832/common-js-utils-flow-pkg', () => ({
  ...jest.requireActual('@arpitmalik832/common-js-utils-flow-pkg'),
  log: jest.fn(),
  errorLog: jest.fn(),
  beforeUnload: {
    subscribe: e => e({}),
    unSubscribe: jest.fn(),
  },
  slices: {
    navigationSliceActions: {
      clear: jest.fn(),
      pop: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    },
  },
}));

describe('useNavigation unit tests', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    reactRedux.useDispatch.mockReturnValue(mockDispatch);
    reactRedux.useSelector.mockImplementation(selector =>
      selector({
        navigation: [],
      }),
    );
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('snapshot test', () => {
    const { result } = renderHook(() => useNavigation());

    expect(result.current).toMatchSnapshot();
  });

  it('testing push function', () => {
    const { result } = renderHook(() => useNavigation());

    result.current.push();
    expect(slices.navigationSliceActions.push).toHaveBeenCalledTimes(1);
  });

  it('testing pop function', () => {
    reactRedux.useSelector.mockImplementation(selector =>
      selector({
        navigation: [() => jest.fn()],
      }),
    );
    const { result } = renderHook(() => useNavigation());

    result.current.pop();
    expect(slices.navigationSliceActions.pop).toHaveBeenCalledTimes(1);
  });

  it('testing pop function', () => {
    const { result } = renderHook(() => useNavigation());

    result.current.pop();
    expect(slices.navigationSliceActions.pop).toHaveBeenCalledTimes(0);
  });

  it('testing pop function', () => {
    const { result } = renderHook(() => useNavigation());

    result.current.pop();
    expect(slices.navigationSliceActions.pop).toHaveBeenCalledTimes(0);
  });

  it('testing pop function', () => {
    const { result } = renderHook(() => useNavigation());

    result.current.pop();
    expect(slices.navigationSliceActions.pop).toHaveBeenCalledTimes(0);
  });

  it('testing pop function', () => {
    const { result } = renderHook(() => useNavigation());

    result.current.pop();
    expect(slices.navigationSliceActions.pop).toHaveBeenCalledTimes(0);
  });

  it('testing pop function', () => {
    const { result } = renderHook(() => useNavigation());

    result.current.pop();
    expect(slices.navigationSliceActions.pop).toHaveBeenCalledTimes(0);
  });

  it('testing clear function', () => {
    const { result } = renderHook(() => useNavigation());

    result.current.clear();
    expect(slices.navigationSliceActions.clear).toHaveBeenCalledTimes(0);
  });

  it('testing clear function', () => {
    reactRedux.useSelector.mockImplementation(selector =>
      selector({
        navigation: [() => jest.fn()],
      }),
    );
    const { result } = renderHook(() => useNavigation());

    result.current.clear();
    expect(slices.navigationSliceActions.clear).toHaveBeenCalledTimes(1);
  });

  describe('replace function', () => {
    it('should dispatch replace action with callback', () => {
      const { result } = renderHook(() => useNavigation());
      const mockCallback = jest.fn();

      result.current.replace(mockCallback);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(slices.navigationSliceActions.replace).toHaveBeenCalledWith(
        mockCallback,
      );
    });

    it('should work with empty stack', () => {
      reactRedux.useSelector.mockImplementation(selector =>
        selector({
          navigation: [],
        }),
      );
      const { result } = renderHook(() => useNavigation());
      const mockCallback = jest.fn();

      result.current.replace(mockCallback);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(slices.navigationSliceActions.replace).toHaveBeenCalledWith(
        mockCallback,
      );
    });

    it('should work with non-empty stack', () => {
      reactRedux.useSelector.mockImplementation(selector =>
        selector({
          navigation: [jest.fn()],
        }),
      );
      const { result } = renderHook(() => useNavigation());
      const mockCallback = jest.fn();

      result.current.replace(mockCallback);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(slices.navigationSliceActions.replace).toHaveBeenCalledWith(
        mockCallback,
      );
    });
  });
});
