/**
 * Contains the page slice.
 * @file This file is saved as `pageSlice.js`.
 */
import { createSlice } from '@reduxjs/toolkit';
import { errorLog } from '../../utils/logsUtils';
import { SLICE_NAMES } from '../../enums/redux';

const pageSlice = createSlice({
  name: SLICE_NAMES.PAGE,
  initialState: [],
  reducers: {
    push: (state, action) => {
      if (!action.payload || typeof action.payload !== 'function') {
        return state;
      }
      state.push(action.payload);
      return state;
    },
    pop: state => {
      const top = state.pop();
      if (top && typeof top === 'function') {
        try {
          top();
        } catch (error) {
          errorLog('Error executing callback:', error);
        }
      }
      return state;
    },
    replace: (state, action) => {
      if (!action.payload || typeof action.payload !== 'function') {
        return state;
      }
      const newState = [...state];
      if (newState.length > 0) {
        newState[newState.length - 1] = action.payload;
      } else {
        newState.push(action.payload);
      }
      return newState;
    },
    clear: () => [],
  },
});

export { pageSlice };
const { push, pop, replace, clear } = pageSlice.actions;
export const pageSliceActions = {
  push,
  pop,
  replace,
  clear,
};
