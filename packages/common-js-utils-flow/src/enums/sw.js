// @flow
const SW_URL = `/sw.js`;

const LOGS = {
  SUCCESS: 'Service Worker registered successfully',
  SW_READY: 'This web-app is being served cache-first by a service.',
  REGISTRATION_ERROR: 'Error during service worker registration ->',
  NO_INTERNET: 'No internet connection found. App is running in offline mode.',
  CHECKING_SW: 'Checking for service worker...',
  NO_SW: 'No service worker found. Probably a different app.',
  SW_FOUND: 'Service worker found. Proceeding as normal.',
};

export { SW_URL, LOGS };
