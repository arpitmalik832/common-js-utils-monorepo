/**
 * This file is used to create a sample query.
 * @file This file is saved as 'src/redux/queries/sampleQuery.js'.
 */
import { createApi } from '@reduxjs/toolkit/query/react';

import baseQueryFn from './baseQueryFn.js';

const sampleQuery = createApi({
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
