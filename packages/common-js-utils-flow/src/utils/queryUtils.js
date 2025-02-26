// @flow
function getQueryParam(
  query: string,
  param: string,
): string | URLSearchParams | null {
  const urlSearchParams = new URLSearchParams(query);
  return param ? urlSearchParams.get(param) : urlSearchParams;
}

function processQueryParams(searchString: string): Record<string, string> {
  const data = searchString.substring(1);
  const array = data.split('&');
  return array.reduce((oldData, currentData) => {
    const split = currentData.split('=');
    const [key, value] = split;
    return {
      ...oldData,
      [key]: value,
    };
  }, {});
}

export { getQueryParam, processQueryParams };
