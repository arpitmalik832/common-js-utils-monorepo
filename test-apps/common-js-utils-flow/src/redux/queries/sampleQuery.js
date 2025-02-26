// @flow
import { AxiosInstance } from 'axios';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  QueryDefinition,
  MutationDefinition,
  BaseQueryFn,
  Api,
} from '@reduxjs/toolkit/query';

import baseQueryFn from './baseQueryFn';

type BaseQueryParams = {
  axiosInstance: AxiosInstance,
  url: string,
};

const sampleQuery: Api<
  BaseQueryFn<BaseQueryParams>,
  {
    fetchData: QueryDefinition,
    updateData: MutationDefinition,
  },
  'sampleQuery',
  'Jokes',
> = createApi({
  reducerPath: 'sampleQuery',
  baseQuery: baseQueryFn(),
  tagTypes: ['Jokes'],
  endpoints: builder => ({
    fetchData: builder.query({
      query: axiosInstance => ({
        axiosInstance,
        url: '/jokes',
      }),
      providesTags: [{ type: 'Jokes', id: 'LIST' }],
    }),
    updateData: builder.mutation({
      query: axiosInstance => ({
        axiosInstance,
        url: '/jokes/update',
      }),
      invalidatesTags: [{ type: 'Jokes', id: 'LIST' }],
    }),
  }),
});

export { sampleQuery };
export const { useFetchDataQuery, useUpdateDataMutation } = sampleQuery;
