/**
 * Base query for making get requests.
 * @file This file is saved as `baseQuery.js`.
 */
import useApiRequest from '../../hooks/useApiRequest';

const baseQueryFn =
  () =>
  async ({ axiosInstance, url }) => {
    const { makeGetCall } = useApiRequest();

    return makeGetCall({ url, axiosInstance })
      .then(response => ({ data: response }))
      .catch(err => ({ error: err }));
  };

export default baseQueryFn;
