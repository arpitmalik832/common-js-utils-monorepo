/**
 * Unit tests for pageSlice.
 * @file This file is saved as `pageSlice.test.js`.
 */
import { pageSlice, pageSliceActions } from '../pageSlice';

jest.mock('../../../utils/logsUtils', () => ({
  errorLog: jest.fn(),
}));

describe('pageSlice reducers', () => {
  let initialState;
  let mockCallback;

  beforeEach(() => {
    mockCallback = jest.fn();
    initialState = [];
  });

  it('should handle initial state', () => {
    expect(pageSlice.reducer(undefined, { type: 'unknown' })).toEqual([]);
  });

  describe('pushStack', () => {
    it('should add callback to empty stack', () => {
      const actual = pageSlice.reducer(
        initialState,
        pageSliceActions.push(mockCallback),
      );
      expect(actual).toHaveLength(1);
      expect(actual[0]).toBe(mockCallback);
    });

    it('should add multiple callbacks to stack', () => {
      const mockCallback2 = jest.fn();
      let state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(mockCallback),
      );
      state = pageSlice.reducer(state, pageSliceActions.push(mockCallback2));

      expect(state).toHaveLength(2);
      expect(state[0]).toBe(mockCallback);
      expect(state[1]).toBe(mockCallback2);
    });

    it('should preserve existing callbacks when pushing new one', () => {
      const existingState = [jest.fn()];
      const actual = pageSlice.reducer(
        existingState,
        pageSliceActions.push(mockCallback),
      );
      expect(actual).toHaveLength(2);
      expect(actual[1]).toBe(mockCallback);
    });
  });

  describe('popStack', () => {
    it('should execute and remove last callback from stack', () => {
      // Setup initial state with a callback
      const state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(mockCallback),
      );

      // Pop the callback
      const actual = pageSlice.reducer(state, pageSliceActions.pop());

      expect(actual).toHaveLength(0);
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should handle empty stack', () => {
      const actual = pageSlice.reducer(initialState, pageSliceActions.pop());
      expect(actual).toHaveLength(0);
    });

    it('should handle multiple pops', () => {
      const mockCallback2 = jest.fn();
      let state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(mockCallback),
      );
      state = pageSlice.reducer(state, pageSliceActions.push(mockCallback2));

      // Pop first callback
      state = pageSlice.reducer(state, pageSliceActions.pop());
      expect(state).toHaveLength(1);
      expect(mockCallback2).toHaveBeenCalled();

      // Pop second callback
      state = pageSlice.reducer(state, pageSliceActions.pop());
      expect(state).toHaveLength(0);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('clearStack', () => {
    it('should clear all callbacks from stack', () => {
      // Setup initial state with multiple callbacks
      let state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(mockCallback),
      );
      state = pageSlice.reducer(state, pageSliceActions.push(jest.fn()));

      const actual = pageSlice.reducer(state, pageSliceActions.clear());
      expect(actual).toHaveLength(0);
    });

    it('should handle clearing empty stack', () => {
      const actual = pageSlice.reducer(initialState, pageSliceActions.clear());
      expect(actual).toHaveLength(0);
    });

    it('should not execute callbacks when clearing', () => {
      // Setup initial state with a callback
      const state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(mockCallback),
      );

      // Clear the stack
      pageSlice.reducer(state, pageSliceActions.clear());
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('error cases', () => {
    it('should handle non-function callbacks in pushStack', () => {
      const invalidCallback = 'not a function';
      const actual = pageSlice.reducer(
        initialState,
        pageSliceActions.push(invalidCallback),
      );
      expect(actual.length).toBe(0);
    });

    it('should handle undefined callback in pushStack', () => {
      const actual = pageSlice.reducer(
        initialState,
        pageSliceActions.push(undefined),
      );
      expect(actual.length).toBe(0);
    });

    it('should handle error in callback execution', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Callback error');
      });

      // Setup state with error callback
      const state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(errorCallback),
      );

      // Pop should not throw
      expect(() => {
        pageSlice.reducer(state, pageSliceActions.pop());
      }).not.toThrow();
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state on pushStack', () => {
      const originalState = [...initialState];
      pageSlice.reducer(initialState, pageSliceActions.push(mockCallback));
      expect(initialState).toEqual(originalState);
    });

    it('should not mutate original state on popStack', () => {
      const state = [mockCallback];
      const originalState = [...state];

      pageSlice.reducer(state, pageSliceActions.pop());
      expect(state).toEqual(originalState);
    });

    it('should not mutate original state on clearStack', () => {
      const state = [mockCallback];
      const originalState = [...state];

      pageSlice.reducer(state, pageSliceActions.clear());
      expect(state).toEqual(originalState);
    });
  });

  describe('action creators', () => {
    it('should create pushStack action', () => {
      expect(pageSliceActions.push(mockCallback)).toEqual({
        type: 'page/push',
        payload: mockCallback,
      });
    });

    it('should create popStack action', () => {
      expect(pageSliceActions.pop()).toEqual({
        type: 'page/pop',
      });
    });

    it('should create clearStack action', () => {
      expect(pageSliceActions.clear()).toEqual({
        type: 'page/clear',
      });
    });
  });

  describe('replaceStack', () => {
    it('should replace callback at top of non-empty stack', () => {
      const newCallback = jest.fn();
      let state = pageSlice.reducer(
        initialState,
        pageSliceActions.push(mockCallback),
      );

      state = pageSlice.reducer(state, pageSliceActions.replace(newCallback));

      expect(state).toHaveLength(1);
      expect(state[0]).toBe(newCallback);
    });

    it('should add callback to empty stack', () => {
      const actual = pageSlice.reducer(
        initialState,
        pageSliceActions.replace(mockCallback),
      );

      expect(actual).toHaveLength(1);
      expect(actual[0]).toBe(mockCallback);
    });

    it('should handle non-function callbacks', () => {
      const invalidCallback = 'not a function';
      const state = [mockCallback];

      const actual = pageSlice.reducer(
        state,
        pageSliceActions.replace(invalidCallback),
      );

      expect(actual).toEqual(state);
    });

    it('should handle undefined callback', () => {
      const state = [mockCallback];

      const actual = pageSlice.reducer(
        state,
        pageSliceActions.replace(undefined),
      );

      expect(actual).toEqual(state);
    });

    it('should preserve state immutability', () => {
      const state = [mockCallback];
      const originalState = [...state];

      pageSlice.reducer(state, pageSliceActions.replace(jest.fn()));

      expect(state).toEqual(originalState);
    });

    it('should create replaceStack action', () => {
      expect(pageSliceActions.replace(mockCallback)).toEqual({
        type: 'page/replace',
        payload: mockCallback,
      });
    });
  });
});
