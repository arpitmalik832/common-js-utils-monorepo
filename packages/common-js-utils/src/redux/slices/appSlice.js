/**
 * Contains the app slice.
 * @file This file is saved as `appSlice.js`.
 */
import { createSlice } from '@reduxjs/toolkit';

import { THEME } from '../../enums/app';
import { SLICE_NAMES } from '../../enums/redux';

const appSlice = createSlice({
  name: SLICE_NAMES.APP,
  initialState: {
    theme: THEME.LIGHT,
  },
  reducers: {
    updateStore: (state, action) => {
      if (action?.payload?.key && action?.payload?.value != null) {
        return {
          ...state,
          [action.payload.key]: action.payload.value,
        };
      }
      return state;
    },
    setDarkTheme: state => ({
      ...state,
      theme: THEME.DARK,
    }),
    setLightTheme: state => ({
      ...state,
      theme: THEME.LIGHT,
    }),
  },
});

export { appSlice };
const { updateStore, setDarkTheme, setLightTheme } = appSlice.actions;
export const appSliceActions = {
  updateStore,
  setDarkTheme,
  setLightTheme,
};
