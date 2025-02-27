// @flow
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosInstance } from 'axios';

import useApiRequest from '../../hooks/useApiRequest';

interface BaseQueryParams {
  axiosInstance: AxiosInstance;
  url: string;
}

const baseQueryFn =
  <B: BaseQueryParams, T>(): BaseQueryFn<B> =>
  async ({ axiosInstance, url }: B) => {
    const { makeGetCall } = useApiRequest();

    return makeGetCall<T>({ url, axiosInstance })
      .then(response => ({ data: response }))
      .catch(err => ({ error: err }));
  };

export default baseQueryFn;
