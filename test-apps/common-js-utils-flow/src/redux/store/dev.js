// @flow
import { AxiosInstance } from 'axios';
import { thunk } from 'redux-thunk';
import { logger } from 'redux-logger';
import { slices } from '@arpitmalik832/common-js-utils-flow';
import { configureStore } from '@reduxjs/toolkit';

import { sampleQuery } from '../queries/sampleQuery';

type APIData = {
  host: string,
  headers: Record<string, string | Record<string, string>>,
  axiosInstance: AxiosInstance,
};

type ApisRedux = APIData[];

type NavigationRedux = VoidFunctionWithParams<mixed>[];

type PageRedux = VoidFunctionWithParams<mixed>[];

const store: {
  app: AppRedux,
  apis: ApisRedux,
  navigation: NavigationRedux,
  page: PageRedux,
  sampleQuery: typeof sampleQuery.reducer,
} = configureStore({
  reducer: {
    app: slices.appSlice.reducer,
    apis: slices.apisSlice.reducer,
    navigation: slices.navigationSlice.reducer,
    page: slices.pageSlice.reducer,
    sampleQuery: sampleQuery.reducer,
  },
  middleware: getDefault =>
    getDefault({
      serializableCheck: {
        ignoredActions: [
          'apis/addNewApiData',
          'navigation/pushStack',
          'sampleQuery/executeQuery/rejected',
          'sampleQuery/executeQuery/fulfilled',
        ],
        ignoredPaths: ['apis', 'sampleQuery', 'navigation'],
      },
    }).concat(sampleQuery.middleware, thunk, logger),
});

export default store;
