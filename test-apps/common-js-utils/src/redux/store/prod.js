/**
 * Redux store configuration for production environment.
 * @file This file is saved as `redux/store/store.prod,js`.
 */
import { slices } from '@arpitmalik832/common-js-utils';
import { configureStore } from '@reduxjs/toolkit';

import { sampleQuery } from '../queries/sampleQuery';

const store = configureStore({
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
          'navigation/push',
          'navigation/replace',
          'page/push',
          'page/replace',
          'sampleQuery/executeQuery/rejected',
          'sampleQuery/executeQuery/fulfilled',
        ],
        ignoredPaths: ['apis', 'sampleQuery', 'navigation', 'page'],
      },
    }).concat(sampleQuery.middleware),
});

export default store;
