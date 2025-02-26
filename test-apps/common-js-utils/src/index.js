/**
 * This is the entry point of the application.
 * @file This file is saved as `index.js`.
 */
import {
  errorLog,
  SWRegistration,
  APP_ENUMS,
} from '@arpitmalik832/common-js-utils-pkg';

import('./bootstrap')
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

if (process.env.APP_ENV !== APP_ENUMS.ENVS.PROD) {
  import('@arpitmalik832/common-js-utils-pkg')
    .then(({ reportWebVitals: func }) => func())
    .catch(err => {
      errorLog(
        'Facing issue while using reportWebVitals from external library',
        err,
      );
    });
}
