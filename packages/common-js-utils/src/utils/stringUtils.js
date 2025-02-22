/**
 * String Utilities.
 * @file The file is saved as `stringUtils.js`.
 */

/**
 * Compares two strings for equality, ignoring case.
 * @param {string} text1 - The first string to compare.
 * @param {string} text2 - The second string to compare.
 * @returns {boolean} True if the strings are equal, ignoring case; otherwise, false.
 * @example
 * isEqualsIgnoringCase('hello', 'HELLO'); // returns true
 */
function isEqualsIgnoringCase(text1, text2) {
  return text1.localeCompare(text2, undefined, { sensitivity: 'base' }) === 0;
}

/**
 * Capitalizes the first character of a string and converts the rest to lowercase.
 * @param {string} string - The string to capitalize.
 * @returns {string} The capitalized string.
 * @example
 * capitalizeFirstChar('hello'); // returns 'Hello'
 */
function capitalizeFirstChar(string) {
  const trimmedString = string && string.trim();
  return trimmedString
    ? trimmedString[0].toUpperCase() + trimmedString.slice(1).toLowerCase()
    : '';
}

/**
 * Masks all characters in a string except for the last N characters.
 * @param {string} val - The string to mask.
 * @param {number} n - The number of characters to leave unmasked from the end.
 * @returns {string} The masked string.
 * @example
 * maskCharsExceptLastN('1234567890', 4); // returns '******7890'
 */
function maskCharsExceptLastN(val, n = 4) {
  let new_string = '';
  const str = val.toString();
  for (let i = 0; i < str.length - n; i += 1) {
    new_string += '*';
  }
  new_string += str.substring(str.length - n);
  return new_string;
}

/**
 * Generates initials from a display name.
 * @param {string} displayName - The full name to extract initials from.
 * @returns {string} The initials of the display name, or 'JD' if no name is provided.
 * @example
 * getInitials('John Doe'); // returns 'JD'
 */
function getInitials(displayName) {
  const [firstName, lastName = ''] = displayName.split(' ');

  return displayName
    ? `${firstName.slice(0, 1).toUpperCase()}${lastName
        .slice(0, 1)
        .toUpperCase()}`
    : 'JD';
}

export {
  capitalizeFirstChar,
  isEqualsIgnoringCase,
  maskCharsExceptLastN,
  getInitials,
};
