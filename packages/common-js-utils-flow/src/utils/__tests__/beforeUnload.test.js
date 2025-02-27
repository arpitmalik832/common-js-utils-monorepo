/**
 * Unit tests for beforeUnload event listener.
 * @file This file is saved as `beforeUnload.test.js`.
 */
import '@testing-library/jest-dom';

import beforeUnload from '../eventListeners/beforeUnload';

describe('beforeUnload unit tests', () => {
  const callBackFn = jest.fn();
  it('beforeUnload functions test', () => {
    beforeUnload.callBackFn();
    beforeUnload.subscribe(callBackFn);
    beforeUnload.callBackFn();
    expect(callBackFn).toHaveBeenCalledTimes(1);
    beforeUnload.unSubscribe();
  });
});
