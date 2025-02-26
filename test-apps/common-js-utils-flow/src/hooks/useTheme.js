// @flow
import { useCallback, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  APP_ENUMS,
  slices,
  preferredColorScheme,
} from '@arpitmalik832/common-js-utils-flow';

function useTheme() {
  const { theme } = useSelector(state => state.app);
  const dispatch = useDispatch();

  const updateStore = useCallback((isDark: boolean) => {
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
