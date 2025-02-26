/**
 * Unit tests for cookieUtils.
 * @file This file is saved as `cookieUtils.test.js`.
 */
import '@testing-library/jest-dom';

import { deleteCookie, getCookie, setCookie } from '../cookieUtils';

describe('classNames unit test', () => {
  it('testing setCookie', () => {
    setCookie('abc', 'xyz', 1000);
    setCookie('z', 'b');
  });

  it('testing getCookie', () => {
    getCookie('abc');
    getCookie('z');
  });

  it('should return the decoded cookie value', () => {
    document.cookie = 'abc=%E2%9C%93'; // Encoded value for '✓'
    expect(getCookie('abc')).toBe('✓');
  });

  it('should return an empty string if the cookie value is empty', () => {
    document.cookie = 'empty=';
    expect(getCookie('empty')).toBe('');
  });

  it('should return null if the cookie does not exist', () => {
    expect(getCookie('nonexistent')).toBe('');
  });

  it('testing deleteCookie', () => {
    deleteCookie('abc');
    deleteCookie('z');
  });
});
