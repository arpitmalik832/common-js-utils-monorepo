/**
 * Unit tests for pageSlice.
 * @file This file is saved as `pageSlice.test.js`.
 */
import { pageSlice, pageSliceActions } from '../pageSlice';
import { log } from '../../../utils/logsUtils';

jest.mock('../../../utils/logsUtils', () => ({
  log: jest.fn(),
}));

describe('pageSlice reducers', () => {
  let initialState;

  beforeEach(() => {
    initialState = [];
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(pageSlice.reducer(undefined, { type: 'unknown' })).toEqual([]);
  });

  describe('push', () => {
    it('should add page path to empty stack', () => {
      const pagePath = '/home';
      const actual = pageSlice.reducer(
        initialState,
        pageSliceActions.push(pagePath),
      );
      expect(actual).toHaveLength(1);
      expect(actual[0]).toBe(pagePath);
    });

    it('should add multiple page paths to stack', () => {
      const pagePath1 = '/home';
      const pagePath2 = '/about';
      let state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(pagePath1),
      );
      state = pageSlice.reducer(state, pageSliceActions.push(pagePath2));

      expect(state).toHaveLength(2);
      expect(state[0]).toBe(pagePath1);
      expect(state[1]).toBe(pagePath2);
    });

    it('should preserve existing paths when pushing new one', () => {
      const existingState = ['/home'];
      const newPath = '/about';
      const actual = pageSlice.reducer(
        existingState,
        pageSliceActions.push(newPath),
      );
      expect(actual).toHaveLength(2);
      expect(actual[1]).toBe(newPath);
    });

    it('should not add invalid page paths', () => {
      const invalidPaths = [undefined, null, 123, {}];
      invalidPaths.forEach(invalidPath => {
        const actual = pageSlice.reducer(
          initialState,
          pageSliceActions.push(invalidPath),
        );
        expect(actual).toEqual(initialState);
      });
    });
  });

  describe('pop', () => {
    it('should remove last page path from stack', () => {
      const pagePath = '/home';
      const state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(pagePath),
      );

      const actual = pageSlice.reducer(state, pageSliceActions.pop());

      expect(actual).toHaveLength(0);
      expect(log).toHaveBeenCalledWith('Popped page:', pagePath);
    });

    it('should handle empty stack', () => {
      const actual = pageSlice.reducer(initialState, pageSliceActions.pop());
      expect(actual).toHaveLength(0);
      expect(log).toHaveBeenCalledWith('Popped page:', undefined);
    });

    it('should handle multiple pops', () => {
      const pagePath1 = '/home';
      const pagePath2 = '/about';
      let state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(pagePath1),
      );
      state = pageSlice.reducer(state, pageSliceActions.push(pagePath2));

      // Pop first path
      state = pageSlice.reducer(state, pageSliceActions.pop());
      expect(state).toHaveLength(1);
      expect(log).toHaveBeenCalledWith('Popped page:', pagePath2);

      // Pop second path
      state = pageSlice.reducer(state, pageSliceActions.pop());
      expect(state).toHaveLength(0);
      expect(log).toHaveBeenCalledWith('Popped page:', pagePath1);
    });
  });

  describe('replace', () => {
    it('should replace page path at top of non-empty stack', () => {
      const oldPath = '/home';
      const newPath = '/about';
      let state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(oldPath),
      );

      state = pageSlice.reducer(state, pageSliceActions.replace(newPath));

      expect(state).toHaveLength(1);
      expect(state[0]).toBe(newPath);
    });

    it('should add page path to empty stack', () => {
      const pagePath = '/home';
      const actual = pageSlice.reducer(
        initialState,
        pageSliceActions.replace(pagePath),
      );

      expect(actual).toHaveLength(1);
      expect(actual[0]).toBe(pagePath);
    });

    it('should not replace with invalid page paths', () => {
      const oldPath = '/home';
      const invalidPaths = [undefined, null, 123, {}];
      const state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(oldPath),
      );

      invalidPaths.forEach(invalidPath => {
        const actual = pageSlice.reducer(
          state,
          pageSliceActions.replace(invalidPath),
        );
        expect(actual).toEqual(state);
      });
    });
  });

  describe('clear', () => {
    it('should clear all page paths from stack', () => {
      let state = pageSlice.reducer(
        initialState,
        pageSliceActions.push('/home'),
      );
      state = pageSlice.reducer(state, pageSliceActions.push('/about'));

      const actual = pageSlice.reducer(state, pageSliceActions.clear());
      expect(actual).toHaveLength(0);
    });

    it('should handle clearing empty stack', () => {
      const actual = pageSlice.reducer(initialState, pageSliceActions.clear());
      expect(actual).toHaveLength(0);
    });
  });

  describe('action creators', () => {
    it('should create push action', () => {
      const pagePath = '/home';
      expect(pageSliceActions.push(pagePath)).toEqual({
        type: 'page/push',
        payload: pagePath,
      });
    });

    it('should create pop action', () => {
      expect(pageSliceActions.pop()).toEqual({
        type: 'page/pop',
      });
    });

    it('should create replace action', () => {
      const pagePath = '/home';
      expect(pageSliceActions.replace(pagePath)).toEqual({
        type: 'page/replace',
        payload: pagePath,
      });
    });

    it('should create clear action', () => {
      expect(pageSliceActions.clear()).toEqual({
        type: 'page/clear',
      });
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state on push', () => {
      const originalState = [...initialState];
      pageSlice.reducer(initialState, pageSliceActions.push('/home'));
      expect(initialState).toEqual(originalState);
    });

    it('should not mutate original state on pop', () => {
      const state = ['/home'];
      const originalState = [...state];

      pageSlice.reducer(state, pageSliceActions.pop());
      expect(state).toEqual(originalState);
    });

    it('should not mutate original state on replace', () => {
      const state = ['/home'];
      const originalState = [...state];

      pageSlice.reducer(state, pageSliceActions.replace('/about'));
      expect(state).toEqual(originalState);
    });

    it('should not mutate original state on clear', () => {
      const state = ['/home'];
      const originalState = [...state];

      pageSlice.reducer(state, pageSliceActions.clear());
      expect(state).toEqual(originalState);
    });
  });
});
