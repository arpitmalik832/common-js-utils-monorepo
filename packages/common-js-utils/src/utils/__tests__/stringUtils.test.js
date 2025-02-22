/**
 * Unit tests for the `stringUtils` utility functions.
 * @file The file is saved as `stringUtils.test.js`.
 */
import '@testing-library/jest-dom';

import {
  capitalizeFirstChar,
  isEqualsIgnoringCase,
  maskCharsExceptLastN,
  getInitials,
} from '../stringUtils';

describe('stringUtils unit tests', () => {
  it('testing capitalizeFirstChar', () => {
    capitalizeFirstChar('test');
    capitalizeFirstChar(' ');
  });

  it('testing equalsIgnoringCase', () => {
    isEqualsIgnoringCase('test', 'test');
  });

  it('testing maskCharsExceptLastN', () => {
    maskCharsExceptLastN('test', 2);
    maskCharsExceptLastN('testing');
  });

  it('testing renderInitials', () => {
    getInitials('test');
    getInitials('test test');
    getInitials('');
  });
});
