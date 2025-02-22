/**
 * This is the entry point of the application.
 * @file This file is saved as `index.js`.
 */
import { errorLog, SWRegistration } from '@arpitmalik832/common-js-utils';

import { ENVS } from '../build_utils/config/index.mjs';

// eslint-disable-next-line import/extensions
import('./bootstrap.jsx')
  .then(({ mount }) => {
    const appElement = document.getElementById('app');
    if (appElement) {
      mount(appElement);
    } else {
      errorLog('App element not found');
    }
  })
  .catch(err => {
    errorLog('Facing err while importing bootstrap file: ', err);
  });

SWRegistration.register();

if (process.env.APP_ENV !== ENVS.PROD) {
  import('@arpitmalik832/common-js-utils')
    .then(({ reportWebVitals: func }) => func())
    .catch(err => {
      errorLog(
        'Facing issue while using reportWebVitals from external library',
        err,
      );
    });
}
