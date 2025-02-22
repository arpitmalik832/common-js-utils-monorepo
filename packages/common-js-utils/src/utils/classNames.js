/**
 * This function is used to concatenate multiple class names into a single string.
 * @file This file is saved as `classNames.js`.
 */
/**
 * Concatenates multiple class names into a single string.
 * @param {...(string|object|Array)} args - The class names to concatenate.
 * @returns {string} The concatenated class names.
 * @example
 * classNames('c1', 'c2', 'c3'); // returns 'c1 c2 c3'
 * classNames('c1', {c2: true, c3: false}); // returns 'c1 c2'
 */
function classnames(...args) {
  const classes = args.reduce((acc, val) => {
    if (typeof val === 'string') {
      acc.push(val);
    } else if (Array.isArray(val)) {
      acc.push(...val);
    } else if (typeof val === 'object' && Object.keys(val).length) {
      Object.entries(val).forEach(([key, value]) => {
        if (typeof key === 'string' && value) {
          acc.push(key);
        }
      });
    }
    return acc;
  }, []);
  return classes.join(' ');
}

export default classnames;
