// @flow
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
  addRequestInterceptor,
  addResponseInterceptor,
  slices,
} from '@arpitmalik832/common-js-utils-flow-pkg';

import { DEFAULT_API_TIMEOUT } from '../enums/app';

function useInitAxios(): void {
  const dispatch = useDispatch();
  const api1 = {
    host: 'no-host',
    headers: {},
  };

  useEffect(() => {
    const axiosInstance = axios.create({
      baseURL: api1.host,
      timeout: DEFAULT_API_TIMEOUT,
      headers: {
        common: {
          ...api1.headers,
        },
      },
    });

    addRequestInterceptor(axiosInstance);
    addResponseInterceptor(axiosInstance);

    const api1Final = {
      host: api1.host,
      headers: api1.headers,
      axiosInstance,
    };

    dispatch(slices.apisSliceActions.addNewApiData(api1Final));
  }, []);
}

export default useInitAxios;
