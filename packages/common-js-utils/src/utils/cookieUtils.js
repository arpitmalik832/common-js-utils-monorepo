/**
 * This file contains utility functions to handle cookies.
 * @file This file is saved as `cookieUtils.js`.
 */

/**
 * Retrieves the value of a cookie by its name.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string} The value of the cookie, or an empty string if not found.
 * @example
 * const myCookie = getCookie('myCookieName');
 */
function getCookie(name) {
  const b = document.cookie.match(`(^|[^;]+)\\s*${name}\\s*=\\s*([^;]+)`);
  const top = b?.pop();
  return top != null ? decodeURIComponent(top) : '';
}

/**
 * Sets a cookie with the specified name, value, and expiration time.
 * @param {string} name - The name of the cookie to set.
 * @param {string} value - The value to assign to the cookie.
 * @param {Date|number} expTime - The expiration time of the cookie, either as a Date object or a timestamp.
 * @example
 * setCookie('myCookie', 'myValue', new Date(2023, 11, 31));
 */
function setCookie(name, value, expTime) {
  const expOn = expTime ? new Date(expTime) : new Date(2021, 11, 31);
  const expires = expOn.toUTCString();
  const path = '/';
  const cookie = `${name}=${value}; expires=${expires}; path=${path}; domain=.paytmmoney.com`;
  document.cookie = cookie;
}

/**
 * Deletes a cookie by its name.
 * @param {string} name - The name of the cookie to delete.
 * @example
 * deleteCookie('myCookieName');
 */
function deleteCookie(name) {
  const expires = new Date().toUTCString();
  const path = '/';
  const cookie = `${name}=; expires=${expires}; path=${path}; domain=.paytmmoney.com`;
  const cookieOnCurrentDomain = `${name}=; expires=${expires}; path=${path};`;
  document.cookie = cookie;
  document.cookie = cookieOnCurrentDomain;
}

export { deleteCookie, getCookie, setCookie };
