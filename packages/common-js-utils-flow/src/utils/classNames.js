// @flow
function classnames(
  ...args: (string | Array<string> | Record<string, boolean>)[]
): string {
  const classes = args.reduce<Array<string>>((acc, val) => {
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
