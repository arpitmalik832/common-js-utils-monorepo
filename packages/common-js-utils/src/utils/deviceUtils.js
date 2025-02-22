/**
 * This file is used to detect the device type.
 * @file This file is saved as `deviceUtils.js`.
 */

/**
 * Checks if the code is running in a browser environment.
 * @returns {boolean} True if in a browser, false otherwise.
 * @example
 * // returns true if running in a browser
 * isBrowser();
 */
function isBrowser() {
  return typeof window !== 'undefined';
}

class IsMobile {
  static android() {
    return /Android/i.test(navigator.userAgent) ? 'android' : false;
  }

  static iOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'ios' : false;
  }

  static any() {
    return this.android() || this.iOS();
  }
}

/**
 * Checks if the current browser is a mobile browser.
 * @returns {string|boolean} Returns 'android', 'ios', or false if not a mobile browser.
 * @example
 * // returns 'android' or 'ios' if on a mobile browser
 * isMobileBrowser();
 */
function isMobileBrowser() {
  return isBrowser() ? IsMobile.any() : false;
}

/**
 * Checks if the current device is a desktop.
 * @returns {boolean} True if the device is a desktop, false otherwise.
 * @example
 * // returns true if on a desktop
 * isDesktop();
 */
function isDesktop() {
  return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export { isBrowser, isDesktop, IsMobile, isMobileBrowser };
