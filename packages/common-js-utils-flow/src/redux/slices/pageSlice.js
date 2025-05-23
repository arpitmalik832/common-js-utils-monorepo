// @flow
import { createSlice } from '@reduxjs/toolkit';
import type {
  Slice,
  SliceCaseReducers,
  SliceSelectors,
} from '@reduxjs/toolkit';
import { log } from '../../utils/logsUtils';
import { SLICE_NAMES } from '../../enums/redux';

type PageRedux = VoidFunctionWithParams<mixed>[];

const pageSlice: Slice<
  PageRedux,
  SliceCaseReducers<PageRedux>,
  string,
  string,
  SliceSelectors<PageRedux>,
> = createSlice({
  name: SLICE_NAMES.PAGE,
  initialState: [],
  reducers: {
    push: (state, action) => {
      if (!action.payload || typeof action.payload !== 'string') {
        return state;
      }
      state.push(action.payload);
      return state;
    },
    pop: state => {
      const top = state.pop();
      log('Popped page:', top);
      return state;
    },
    replace: (state, action) => {
      if (!action.payload || typeof action.payload !== 'string') {
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
