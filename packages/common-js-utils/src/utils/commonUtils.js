/**
 * Contains common utility functions.
 * @file This file is saved as `commonUtils.js`.
 */
import { errorLog } from './logsUtils';

/**
 * Checks if the provided value is a non-integer.
 * @param {string} val - The value to check.
 * @returns {boolean} True if the value is non-integer, otherwise false.
 * @example
 * isNonInteger('3.14'); // returns true
 */
function isNonInteger(val) {
  if (typeof val === 'string') {
    return !/^[0-9,]*$/.test(val);
  }
  return val === '.';
}

/**
 * Triggers a callback function with the provided arguments.
 * @param {Function} callback - The callback function to be executed.
 * @param {...any} args - The arguments to pass to the callback function.
 * @example
 * triggerCallback(() => console.log('Called!'), arg1, arg2);
 */
function triggerCallback(callback, ...args) {
  if (callback && typeof callback === 'function') {
    callback(...args);
  }
}

/**
 * Generates a unique serial string based on the specified base.
 * @param {number} base - The base to use for generating the serial.
 * @returns {string} The generated unique serial string.
 * @example
 * const serial = generateUniqSerial(16); // returns a unique serial in base 16
 */
function generateUniqSerial(base) {
  return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, () => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(base);
  });
}

/**
 * Generates a random string of specified length.
 * @param {number} len - The length of the random string to generate.
 * @returns {string} The generated random string.
 * @example
 * const randomString = generateRandomString(10);
 */
function generateRandomString(len) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < len; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Masks all but the last four characters of a string.
 * @param {string} str - The string to mask.
 * @returns {string} The masked string.
 * @example
 * const masked = getMaskedValue('12345678'); // returns '****5678'
 */
function getMaskedValue(str) {
  return `${str}`.replace(/.(?=.{4})/g, '*');
}

/**
 * Downloads a file from the provided data.
 * @param {Blob} fileData - The data to be downloaded as a file.
 * @param {string} fileName - The name of the file to be downloaded.
 * @param {string} contentType - The MIME type of the file.
 * @example
 * downloadFileFromData(fileData, 'myFile.pdf', 'application/pdf');
 */
function downloadFileFromData(
  fileData,
  fileName = 'file.pdf',
  contentType = 'application/pdf',
) {
  const file = new Blob([fileData], { type: contentType });
  const url = window.URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Encodes a URL and pathname for redirection.
 * @param {string} url - The URL to encode.
 * @param {string} pathname - The pathname to encode.
 * @returns {string} The encoded URI string.
 * @example
 * const encoded = getEncodedURI('http://example.com', '/path'); // returns 'redirect=http%3A%2F%2Fexample.com&pathname=path'
 */
function getEncodedURI(url, pathname) {
  return `redirect=${encodeURIComponent(url)}&pathname=${pathname.slice(1)}`;
}

/**
 * Scrolls the window to the top of the page.
 * @example
 * scrollToTop(); // Scrolls to the top of the page
 */
function scrollToTop() {
  window.scrollTo(0, 0);
}

/**
 * Copies the provided text to the clipboard.
 * @param {string} text - The text to copy to the clipboard.
 * @param {Function} callback - The callback function to be executed after copying.
 * @example
 * copyToClipboard('Hello, World!', () => console.log('Copied!'));
 */
async function copyToClipboard(text, callback) {
  navigator?.clipboard
    ?.writeText(text)
    ?.then(() => {
      callback();
    })
    .catch(e => {
      errorLog('Failed to copy: ', e);
    });
}

/**
 * Checks if the current environment is localhost.
 * @returns {boolean} True if the hostname is localhost, otherwise false.
 * @example
 * const isLocal = isLocalhost(); // returns true if running on localhost
 */
function isLocalhost() {
  return Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
      ),
  );
}

export {
  isNonInteger,
  triggerCallback,
  generateUniqSerial,
  generateRandomString,
  getMaskedValue,
  downloadFileFromData,
  getEncodedURI,
  scrollToTop,
  copyToClipboard,
  isLocalhost,
};
