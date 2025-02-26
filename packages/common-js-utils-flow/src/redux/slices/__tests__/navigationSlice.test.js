/**
 * Unit tests for navigationSlice.
 * @file This file is saved as `navigationSlice.test.js`.
 */
import { navigationSlice, navigationSliceActions } from '../navigationSlice';

jest.mock('../../../utils/logsUtils', () => ({
  errorLog: jest.fn(),
}));

describe('navigationSlice reducers', () => {
  let initialState;
  let mockCallback;

  beforeEach(() => {
    mockCallback = jest.fn();
    initialState = [];
  });

  it('should handle initial state', () => {
    expect(navigationSlice.reducer(undefined, { type: 'unknown' })).toEqual([]);
  });

  describe('pushStack', () => {
    it('should add callback to empty stack', () => {
      const actual = navigationSlice.reducer(
        initialState,
        navigationSliceActions.push(mockCallback),
      );
      expect(actual).toHaveLength(1);
      expect(actual[0]).toBe(mockCallback);
    });

    it('should add multiple callbacks to stack', () => {
      const mockCallback2 = jest.fn();
      let state = navigationSlice.reducer(
        initialState,
        navigationSliceActions.push(mockCallback),
      );
      state = navigationSlice.reducer(
        state,
        navigationSliceActions.push(mockCallback2),
      );

      expect(state).toHaveLength(2);
      expect(state[0]).toBe(mockCallback);
      expect(state[1]).toBe(mockCallback2);
    });

    it('should preserve existing callbacks when pushing new one', () => {
      const existingState = [jest.fn()];
      const actual = navigationSlice.reducer(
        existingState,
        navigationSliceActions.push(mockCallback),
      );
      expect(actual).toHaveLength(2);
      expect(actual[1]).toBe(mockCallback);
    });
  });

  describe('popStack', () => {
    it('should execute and remove last callback from stack', () => {
      // Setup initial state with a callback
      const state = navigationSlice.reducer(
        initialState,
        navigationSliceActions.push(mockCallback),
      );

      // Pop the callback
      const actual = navigationSlice.reducer(
        state,
        navigationSliceActions.pop(),
      );

      expect(actual).toHaveLength(0);
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should handle empty stack', () => {
      const actual = navigationSlice.reducer(
        initialState,
        navigationSliceActions.pop(),
      );
      expect(actual).toHaveLength(0);
    });

    it('should handle multiple pops', () => {
      const mockCallback2 = jest.fn();
      let state = navigationSlice.reducer(
        initialState,
        navigationSliceActions.push(mockCallback),
      );
      state = navigationSlice.reducer(
        state,
        navigationSliceActions.push(mockCallback2),
      );

      // Pop first callback
      state = navigationSlice.reducer(state, navigationSliceActions.pop());
      expect(state).toHaveLength(1);
      expect(mockCallback2).toHaveBeenCalled();

      // Pop second callback
      state = navigationSlice.reducer(state, navigationSliceActions.pop());
      expect(state).toHaveLength(0);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('clearStack', () => {
    it('should clear all callbacks from stack', () => {
      // Setup initial state with multiple callbacks
      let state = navigationSlice.reducer(
        initialState,
        navigationSliceActions.push(mockCallback),
      );
      state = navigationSlice.reducer(
        state,
        navigationSliceActions.push(jest.fn()),
      );

      const actual = navigationSlice.reducer(
        state,
        navigationSliceActions.clear(),
      );
      expect(actual).toHaveLength(0);
    });

    it('should handle clearing empty stack', () => {
      const actual = navigationSlice.reducer(
        initialState,
        navigationSliceActions.clear(),
      );
      expect(actual).toHaveLength(0);
    });

    it('should not execute callbacks when clearing', () => {
      // Setup initial state with a callback
      const state = navigationSlice.reducer(
        initialState,
        navigationSliceActions.push(mockCallback),
      );

      // Clear the stack
      navigationSlice.reducer(state, navigationSliceActions.clear());
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('error cases', () => {
    it('should handle non-function callbacks in pushStack', () => {
      const invalidCallback = 'not a function';
      const actual = navigationSlice.reducer(
        initialState,
        navigationSliceActions.push(invalidCallback),
      );
      expect(actual.length).toBe(0);
    });

    it('should handle undefined callback in pushStack', () => {
      const actual = navigationSlice.reducer(
        initialState,
        navigationSliceActions.push(undefined),
      );
      expect(actual.length).toBe(0);
    });

    it('should handle error in callback execution', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Callback error');
      });

      // Setup state with error callback
      const state = navigationSlice.reducer(
        initialState,
        navigationSliceActions.push(errorCallback),
      );

      // Pop should not throw
      expect(() => {
        navigationSlice.reducer(state, navigationSliceActions.pop());
      }).not.toThrow();
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state on pushStack', () => {
      const originalState = [...initialState];
      navigationSlice.reducer(
        initialState,
        navigationSliceActions.push(mockCallback),
      );
      expect(initialState).toEqual(originalState);
    });

    it('should not mutate original state on popStack', () => {
      const state = [mockCallback];
      const originalState = [...state];

      navigationSlice.reducer(state, navigationSliceActions.pop());
      expect(state).toEqual(originalState);
    });

    it('should not mutate original state on clearStack', () => {
      const state = [mockCallback];
      const originalState = [...state];

      navigationSlice.reducer(state, navigationSliceActions.clear());
      expect(state).toEqual(originalState);
    });
  });

  describe('action creators', () => {
    it('should create pushStack action', () => {
      expect(navigationSliceActions.push(mockCallback)).toEqual({
        type: 'navigation/push',
        payload: mockCallback,
      });
    });

    it('should create popStack action', () => {
      expect(navigationSliceActions.pop()).toEqual({
        type: 'navigation/pop',
      });
    });

    it('should create clearStack action', () => {
      expect(navigationSliceActions.clear()).toEqual({
        type: 'navigation/clear',
      });
    });
  });

  describe('replaceStack', () => {
    it('should replace callback at top of non-empty stack', () => {
      const newCallback = jest.fn();
      let state = navigationSlice.reducer(
        initialState,
        navigationSliceActions.push(mockCallback),
      );

      state = navigationSlice.reducer(
        state,
        navigationSliceActions.replace(newCallback),
      );

      expect(state).toHaveLength(1);
      expect(state[0]).toBe(newCallback);
    });

    it('should add callback to empty stack', () => {
      const actual = navigationSlice.reducer(
        initialState,
        navigationSliceActions.replace(mockCallback),
      );

      expect(actual).toHaveLength(1);
      expect(actual[0]).toBe(mockCallback);
    });

    it('should handle non-function callbacks', () => {
      const invalidCallback = 'not a function';
      const state = [mockCallback];

      const actual = navigationSlice.reducer(
        state,
        navigationSliceActions.replace(invalidCallback),
      );

      expect(actual).toEqual(state);
    });

    it('should handle undefined callback', () => {
      const state = [mockCallback];

      const actual = navigationSlice.reducer(
        state,
        navigationSliceActions.replace(undefined),
      );

      expect(actual).toEqual(state);
    });

    it('should preserve state immutability', () => {
      const state = [mockCallback];
      const originalState = [...state];

      navigationSlice.reducer(state, navigationSliceActions.replace(jest.fn()));

      expect(state).toEqual(originalState);
    });
  });
});
