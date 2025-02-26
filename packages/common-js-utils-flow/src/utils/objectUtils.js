// @flow
function convertToArrayOfPairs<T>(
  properties: Record<string, T> = {},
): [string, T][][] {
  return Object.entries(properties).reduce((acc, curr, idx) => {
    if (idx % 2 === 0) {
      acc.push([curr]);
    } else {
      acc[Math.floor(idx / 2)].push(curr);
    }
    return acc;
  }, []);
}

function renameKeys<T>(
  keysMap: Record<string, string>,
  obj: Record<string, T>,
): Record<string, T> {
  return Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
    }),
    {},
  );
}

export { convertToArrayOfPairs, renameKeys };
