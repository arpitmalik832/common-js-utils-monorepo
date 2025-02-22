/**
 * Unit tests for usePage hook.
 * @file The file is saved as `usePage.test.jsx`.
 */
import { renderHook, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import { slices } from '@arpitmalik832/common-js-utils';

import usePage from '../usePage';

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

jest.mock('@arpitmalik832/common-js-utils', () => ({
  ...jest.requireActual('@arpitmalik832/common-js-utils'),
  log: jest.fn(),
  errorLog: jest.fn(),
  beforeUnload: {
    subscribe: e => e({}),
    unSubscribe: jest.fn(),
  },
  slices: {
    pageSliceActions: {
      clear: jest.fn(),
      pop: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    },
  },
}));

describe('usePage unit tests', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    reactRedux.useDispatch.mockReturnValue(mockDispatch);
    reactRedux.useSelector.mockImplementation(selector =>
      selector({
        page: [],
      }),
    );
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('snapshot test', () => {
    const { result } = renderHook(() => usePage());

    expect(result.current).toMatchSnapshot();
  });

  it('testing push function', () => {
    const { result } = renderHook(() => usePage());

    result.current.push();
    expect(slices.pageSliceActions.push).toHaveBeenCalledTimes(1);
  });

  it('testing pop function', () => {
    reactRedux.useSelector.mockImplementation(selector =>
      selector({
        page: [() => jest.fn()],
      }),
    );
    const { result } = renderHook(() => usePage());

    result.current.pop();
    expect(slices.pageSliceActions.pop).toHaveBeenCalledTimes(1);
  });

  it('testing pop function', () => {
    const { result } = renderHook(() => usePage());

    result.current.pop();
    expect(slices.pageSliceActions.pop).toHaveBeenCalledTimes(0);
  });

  it('testing pop function', () => {
    const { result } = renderHook(() => usePage());

    result.current.pop();
    expect(slices.pageSliceActions.pop).toHaveBeenCalledTimes(0);
  });

  it('testing pop function', () => {
    const { result } = renderHook(() => usePage());

    result.current.pop();
    expect(slices.pageSliceActions.pop).toHaveBeenCalledTimes(0);
  });

  it('testing pop function', () => {
    const { result } = renderHook(() => usePage());

    result.current.pop();
    expect(slices.pageSliceActions.pop).toHaveBeenCalledTimes(0);
  });

  it('testing pop function', () => {
    const { result } = renderHook(() => usePage());

    result.current.pop();
    expect(slices.pageSliceActions.pop).toHaveBeenCalledTimes(0);
  });

  it('testing clear function', () => {
    const { result } = renderHook(() => usePage());

    result.current.clear();
    expect(slices.pageSliceActions.clear).toHaveBeenCalledTimes(0);
  });

  it('testing clear function', () => {
    reactRedux.useSelector.mockImplementation(selector =>
      selector({
        page: [() => jest.fn()],
      }),
    );
    const { result } = renderHook(() => usePage());

    result.current.clear();
    expect(slices.pageSliceActions.clear).toHaveBeenCalledTimes(1);
  });

  describe('replace function', () => {
    it('should dispatch replace action with callback', () => {
      const { result } = renderHook(() => usePage());
      const mockCallback = jest.fn();

      result.current.replace(mockCallback);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(slices.pageSliceActions.replace).toHaveBeenCalledWith(
        mockCallback,
      );
    });

    it('should work with empty stack', () => {
      reactRedux.useSelector.mockImplementation(selector =>
        selector({
          page: [],
        }),
      );
      const { result } = renderHook(() => usePage());
      const mockCallback = jest.fn();

      result.current.replace(mockCallback);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(slices.pageSliceActions.replace).toHaveBeenCalledWith(
        mockCallback,
      );
    });

    it('should work with non-empty stack', () => {
      reactRedux.useSelector.mockImplementation(selector =>
        selector({
          page: [jest.fn()],
        }),
      );
      const { result } = renderHook(() => usePage());
      const mockCallback = jest.fn();

      result.current.replace(mockCallback);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(slices.pageSliceActions.replace).toHaveBeenCalledWith(
        mockCallback,
      );
    });
  });
});
