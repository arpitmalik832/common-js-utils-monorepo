/**
 * This file is used to export the store based on the environment.
 * @file This file is saved as `redux/store.js`.
 */
import { ENVS } from '../../../build_utils/config/index.mjs';
import devStore from './store.dev.mjs';
import prodStore from './store.prod.mjs';

const store = process.env.APP_ENV === ENVS.PROD ? prodStore : devStore;

export default store;
