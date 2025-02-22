/**
 * This file is used to convert different formats of values.
 * @file This file is saved as `converters.js`.
 */
import { log } from './logsUtils';

/**
 * Converts an RGB string to a hexadecimal color format.
 * @param {string} rgbString - The RGB color string to convert.
 * @returns {string} The hexadecimal color representation.
 * @example
 * // returns '#FF0000' for 'rgb(255, 0, 0)'
 */
function rgbToHex(rgbString = '') {
  const rgbArray = rgbString
    .replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(n => parseInt(n, 10));

  return `#${rgbArray
    .map(x => {
      const hex = x.toString(16).toUpperCase();
      return hex.length === 1 ? `0${hex}` : hex;
    })
    .join('')}`;
}

/**
 * Converts an RGBA string to a hexadecimal color format.
 * @param {string} rgbaString - The RGBA color string to convert.
 * @returns {string} The hexadecimal color representation.
 * @example
 * // returns '#FF0000' for 'rgba(255, 0, 0, 1)'
 */
function rgbaToHex(rgbaString = '') {
  const rgbaArray = rgbaString
    .replace('rgba(', '')
    .replace(')', '')
    .split(',')
    .map((n, i) => (i !== 3 ? parseInt(n, 10) : parseFloat(n)));
  return `${rgbToHex(`rgb(${rgbaArray.slice(0, 3).join(',')})`)}  ${(rgbaArray[3] * 100).toFixed(2)}`;
}

/**
 * Converts seconds to a Yoda time format (HH:MM:SS or MM:SS).
 * @param {number} seconds - The number of seconds to convert.
 * @returns {string} The formatted time in Yoda format.
 * @example
 * // returns '00:01' for 1 second
 */
function formatSecToYodaTime(seconds = 1) {
  const isoString = new Date(seconds * 1000).toISOString();
  if (seconds >= 3600) {
    return isoString.substr(11, 8);
  }
  return isoString.substr(14, 5);
}

/**
 * Converts a logarithmic gain value to a percentage format.
 * @param {number} lg - The logarithmic gain value.
 * @returns {string} The formatted gain as a percentage.
 * @example
 * // returns '+50.00%'
 * convertGainFormat(0.5);
 */
function convertGainFormat(lg) {
  const stringGain = `${Math.abs(lg) * 100}`.split('.');
  let res;
  if (stringGain[1]) {
    res = (Math.abs(lg) * 100).toFixed(2);
  } else {
    res = Math.abs(lg) * 100;
  }
  return `${lg > 0 ? '+' : '-'}${res}%`;
}

/**
 * Calculates the greatest common divisor (GCD) of two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The greatest common divisor of a and b.
 * @example
 * // returns 2
 * gcd(4, 2);
 */
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Calculates the aspect ratio of the given width and height.
 * @param {number} width - The width of the element.
 * @param {number} height - The height of the element.
 * @returns {number} The aspect ratio calculated as width divided by height.
 * @example
 * // returns 1.5
 * getAspectRatio(16, 9);
 */
function getAspectRatio(width, height) {
  const ratio = gcd(width, height);
  log('~ getAspectRatio ~ ', `${width / ratio}/${height / ratio}`);
  return width / ratio / (height / ratio);
}

export {
  rgbToHex,
  rgbaToHex,
  formatSecToYodaTime,
  convertGainFormat,
  gcd,
  getAspectRatio,
};
