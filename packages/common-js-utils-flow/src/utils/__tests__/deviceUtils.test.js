/**
 * Unit Tests for the deviceUtils functions.
 * @file This file is saved as `deviceUtils.test.js`.
 */
import '@testing-library/jest-dom';

import {
  isBrowser,
  isDesktop,
  IsMobile,
  isMobileBrowser,
} from '../deviceUtils';

describe('deviceUtils unit tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  /**
   * Mocks the user agent for testing purposes.
   * @param {string} userAgent - The user agent string to mock.
   * @example
   * mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
   */
  function mockUserAgent(userAgent) {
    Object.defineProperty(global.navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });
  }

  it('isBrowser unit test', () => {
    expect(isBrowser()).toBe(true);
  });

  it('IsMobile class unit test when device is android', () => {
    mockUserAgent(
      'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Mobile Safari/537.36',
    );

    expect(IsMobile.any()).toBe('android');
  });

  it('IsMobile class unit test when device is ios', () => {
    mockUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    );

    expect(IsMobile.any()).toBe('ios');
  });

  it('IsMobile class unit test when device is not mobile', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    expect(IsMobile.any()).toBe(false);
  });

  it('isMobileBrowser unit test when window object is there', () => {
    expect(isMobileBrowser()).toBe(false);
  });

  it('isDesktop unit test', () => {
    isDesktop();
  });

  it('isMobileBrowser unit test when window object is not there', () => {
    // Delete the window object
    delete global.window;

    expect(isMobileBrowser()).toBe(false);
  });
});
