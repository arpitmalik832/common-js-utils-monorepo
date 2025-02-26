// @flow
import { AxiosInstance } from 'axios';
import { APP_ENUMS } from '@arpitmalik832/common-js-utils-flow';

import devStore from './dev';
import prodStore from './prod';
import { sampleQuery } from '../queries/sampleQuery';

type APIData = {
  host: string,
  headers: Record<string, string | Record<string, string>>,
  axiosInstance: AxiosInstance,
};
type ApisRedux = APIData[];

type NavigationRedux = {
  stack: VoidFunctionWithParams<mixed>[],
};

const store: {
  app: AppRedux,
  apis: ApisRedux,
  navigation: NavigationRedux,
  sampleQuery: typeof sampleQuery.reducer,
} = process.env.APP_ENV === APP_ENUMS.ENVS.PROD ? prodStore : devStore;

export default store;
