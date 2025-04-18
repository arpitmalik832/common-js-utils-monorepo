/**
 * This file is used to export the store based on the environment.
 * @file This file is saved as `redux/store.js`.
 */
import { APP_ENUMS } from '@arpitmalik832/common-js-utils';

import devStore from './dev';
import prodStore from './prod';

const store =
  process.env.APP_ENV === APP_ENUMS.ENVS.PROD ? prodStore : devStore;

export default store;
