/**
 * Unit tests for useTheme hook.
 * @file The file is saved as `useAPP.THEME.test.jsx`.
 */
import { cleanup, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import {
  APP_ENUMS,
  slices,
  preferredColorScheme,
} from '@arpitmalik832/common-js-utils-pkg';

import useTheme from '../useTheme';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('@arpitmalik832/common-js-utils-pkg', () => ({
  ...jest.requireActual('@arpitmalik832/common-js-utils-pkg'),
  slices: {
    appSliceActions: {
      setDarkTheme: jest.fn(),
      setLightTheme: jest.fn(),
    },
  },
  preferredColorScheme: {
    subscribe: jest.fn(),
    unSubscribe: jest.fn(),
  },
}));

describe('useAppMount unit tests', () => {
  const mockDispatch = jest.fn();
  let mockMediaQueryList;

  beforeEach(() => {
    reactRedux.useDispatch.mockReturnValue(mockDispatch);
    reactRedux.useSelector.mockImplementation(selector =>
      selector({
        app: {
          theme: APP_ENUMS.THEME.LIGHT,
        },
      }),
    );

    // Create mock MediaQueryList
    mockMediaQueryList = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    window.matchMedia = jest.fn().mockReturnValue(mockMediaQueryList);
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('snapshot test', () => {
    const component = renderHook(() => useTheme());

    expect(preferredColorScheme.subscribe).toHaveBeenCalled();
    expect(component).toMatchSnapshot();
  });

  it('should initialize with light theme', () => {
    renderHook(() => useTheme());
    expect(preferredColorScheme.subscribe).toHaveBeenCalled();
  });

  it('should handle change to dark theme', () => {
    renderHook(() => useTheme());

    const [callback] = preferredColorScheme.subscribe.mock.calls[0];

    callback({ matches: true });

    expect(mockDispatch).toHaveBeenCalledWith(
      slices.appSliceActions.setDarkTheme(),
    );
  });

  it('should handle change to light theme', () => {
    // Setup initial dark theme
    reactRedux.useSelector.mockImplementation(selector =>
      selector({
        app: {
          theme: APP_ENUMS.THEME.DARK,
        },
      }),
    );
    renderHook(() => useTheme());

    const [callback] = preferredColorScheme.subscribe.mock.calls[0];

    callback({ matches: false });

    expect(mockDispatch).toHaveBeenCalledWith(
      slices.appSliceActions.setDarkTheme(),
    );
  });

  it('should not dispatch if theme matches preference for light', () => {
    // Setup initial dark theme
    reactRedux.useSelector.mockImplementation(selector =>
      selector({
        app: {
          theme: APP_ENUMS.THEME.DARK,
        },
      }),
    );

    // Render hook
    renderHook(() => useTheme());

    // Get the callback function passed to subscribe
    const [callback] = preferredColorScheme.subscribe.mock.calls[0];

    // Simulate dark theme preference (matches current theme)
    callback({ matches: true });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should unsubscribe on unmount', () => {
    const { unmount } = renderHook(() => useTheme());

    unmount();

    expect(preferredColorScheme.unSubscribe).toHaveBeenCalled();
  });

  it('should handle system theme change event', () => {
    renderHook(() => useTheme());

    // Get the callback function passed to subscribe
    const [callback] = preferredColorScheme.subscribe.mock.calls[0];

    // Simulate system theme change event
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'matches', { value: true });
    callback(changeEvent);

    expect(mockDispatch).toHaveBeenCalledWith(
      slices.appSliceActions.setDarkTheme(),
    );
  });

  it('should handle multiple theme changes', () => {
    renderHook(() => useTheme());
    const [callback] = preferredColorScheme.subscribe.mock.calls[0];

    // Simulate multiple theme changes
    callback({ matches: true }); // to dark
    expect(mockDispatch).toHaveBeenCalledWith(
      slices.appSliceActions.setDarkTheme(),
    );

    callback({ matches: false }); // to light
    expect(mockDispatch).toHaveBeenCalledWith(
      slices.appSliceActions.setLightTheme(),
    );

    callback({ matches: true }); // back to dark
    expect(mockDispatch).toHaveBeenCalledWith(
      slices.appSliceActions.setDarkTheme(),
    );
  });

  it('should handle MediaQueryList change event', () => {
    // Create a mock MediaQueryList with change event support
    mockMediaQueryList = {
      matches: false,
      addEventListener: jest.fn((event, handler) => {
        handler({ matches: true }); // Simulate immediate change
      }),
      removeEventListener: jest.fn(),
    };

    window.matchMedia = jest.fn().mockReturnValue(mockMediaQueryList);

    renderHook(() => useTheme());

    // Get the callback function passed to subscribe
    const [callback] = preferredColorScheme.subscribe.mock.calls[0];

    // Simulate MediaQueryList change event
    callback({ matches: true });

    expect(mockDispatch).toHaveBeenCalledWith(
      slices.appSliceActions.setDarkTheme(),
    );
  });
});
