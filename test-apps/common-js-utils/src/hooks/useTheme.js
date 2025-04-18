/**
 * This hook manages the theme of the application.
 * @file The file is saved as `useTheme.js`.
 */
import { useCallback, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  APP_ENUMS,
  slices,
  preferredColorScheme,
} from '@arpitmalik832/common-js-utils';

/**
 * Custom hook to manage the application's theme.
 * @example
 *
 * import useTheme from './useTheme';
 *
 * function App() {
 *   useTheme();
 *   // other logic
 * }
 */
function useTheme() {
  const { theme } = useSelector(state => state.app);
  const dispatch = useDispatch();

  const updateStore = useCallback(isDark => {
    if (isDark) {
      if (theme !== APP_ENUMS.THEME.DARK) {
        dispatch(slices.appSliceActions.setDarkTheme());
      }
    } else if (theme !== APP_ENUMS.THEME.LIGHT) {
      dispatch(slices.appSliceActions.setLightTheme());
    }
  }, []);

  useLayoutEffect(() => {
    preferredColorScheme.subscribe(e => {
      updateStore(e.matches);
    });

    return () => {
      preferredColorScheme.unSubscribe();
    };
  }, []);
}

export default useTheme;
