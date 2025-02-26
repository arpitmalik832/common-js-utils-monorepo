// @flow
import { SW_URL, LOGS } from '../enums/sw';
import { errorLog, log } from '../utils/logsUtils';
import { isLocalhost } from '../utils/commonUtils';
import load from '../utils/eventListeners/load';
import { ENVS } from '../enums/app';

function registerValidSW() {
  navigator.serviceWorker
    ?.register(SW_URL)
    .then(registration => {
      log(LOGS.SUCCESS, registration);
    })
    .catch(error => {
      errorLog(LOGS.REGISTRATION_ERROR, error);
    });
}

function checkValidSW() {
  log(LOGS.CHECKING_SW);
  fetch(SW_URL, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      // To ensure if service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (response.status === 404 || !contentType?.includes('javascript')) {
        log(LOGS.NO_SW);
        // No service worker found. Probably a different app. Reloading the page.
        navigator.serviceWorker?.ready
          .then(registration => {
            registration
              .unregister()
              .then(() => {
                window.location.reload();
              })
              .catch(err => {
                errorLog('registration.unregister()', err);
              });
          })
          .catch(err => {
            errorLog('navigator.serviceWorker.ready', err);
          });
      } else {
        // Service worker found. Proceed as normal.
        log(LOGS.SW_FOUND);
        registerValidSW();
      }
    })
    .catch(() => {
      log(LOGS.NO_INTERNET);
    });
}

const SWRegistration = {
  register() {
    if (
      [ENVS.PROD, ENVS.BETA, ENVS.STG].includes(process.env.APP_ENV) &&
      'serviceWorker' in navigator
    ) {
      // The URL constructor is available in all browsers that support SW.
      const publicUrl = new URL(
        process.env.PUBLIC_URL ?? '',
        window.location.href,
      );
      if (publicUrl.origin !== window.location.origin) {
        // Our service worker won't work if PUBLIC_URL is on a different origin
        // from what our page is served on. This might happen if a CDN is used to
        // serve assets; see https://github.com/facebook/create-react-app/issues/2374
        return;
      }

      load.subscribe(() => {
        if (isLocalhost()) {
          // Running on localhost -> Let's check if the service worker still exists or not.
          checkValidSW();

          navigator.serviceWorker?.ready
            .then(() => {
              log(LOGS.SW_READY);
            })
            .catch(err => {
              errorLog('navigator.serviceWorker.ready', err);
            });
        } else {
          // Not localhost -> Just register the service worker
          registerValidSW();
        }
      });
    }
  },
  unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker?.ready
        .then(registration => {
          registration.unregister().catch(err => {
            errorLog('registration.unregister()', err);
          });
        })
        .catch(error => {
          errorLog('navigator.serviceWorker.ready', error.message);
        });
    }
  },
};

export default SWRegistration;
