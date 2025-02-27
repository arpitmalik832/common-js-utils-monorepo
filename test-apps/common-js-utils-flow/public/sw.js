/**
 * The service worker file that is used to cache the application.
 * @file This file is saved as `public/sw.js`.
 */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { PrecacheController } from 'workbox-precaching';

self.__precacheManifest = [].concat(
  self.__precacheManifest || self.__WB_MANIFEST,
);

/**
 * Checks if the given URL origin is the same as the service worker's origin.
 * @param {string} urlOrigin - The origin of the URL to check.
 * @returns {boolean} True if the URL origin matches the service worker's origin, false otherwise.
 * @example
 * // Assuming the service worker's origin is 'https://example.com'
 * isSelfLocation('https://example.com'); // returns true
 * isSelfLocation('https://anotherdomain.com'); // returns false
 */
function isSelfLocation(urlOrigin) {
  return [self.location.origin].includes(urlOrigin);
}

const precacheController = new PrecacheController();

registerRoute(
  ({ request }) => precacheController.getCacheKeyForURL(request.url),
  new StaleWhileRevalidate({
    cacheName: precacheController.strategy.cacheName,
  }),
);

registerRoute(
  ({ url }) =>
    isSelfLocation(url.origin) &&
    (url.pathname.includes(`/js/`) ||
      url.pathname.includes(`/css/`) ||
      url.pathname.includes('/dll/') ||
      url.pathname.endsWith(`remoteEntry.js`) ||
      url.pathname.endsWith(`/`)),
  new StaleWhileRevalidate({
    cacheName: 'chunks',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

registerRoute(
  ({ url }) =>
    isSelfLocation(url.origin) &&
    (url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.gif') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith(`.ico`)),
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

self.skipWaiting();
