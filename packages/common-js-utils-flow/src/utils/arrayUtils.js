// @flow
function deduplicate<T>(array: Array<T>): Array<T> {
  return [...new Set(array)];
}

export { deduplicate };
