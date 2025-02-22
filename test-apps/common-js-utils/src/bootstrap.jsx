/**
 * This file contains the bootstrap logic for mounting the React application.
 * @file This file is saved as `src/bootstrap.jsx`.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import AppProvider from './providers/AppProvider';
import { MOUNT_ERRORS } from './enums/app';
/**
 * Mounts the React application to the provided DOM element.
 * @param {HTMLElement} ele - The DOM element to mount the React application to.
 * @returns {Function} A function to unmount the React application.
 * @throws {Error} If the element is not provided.
 * @throws {Error} If the element is not a valid DOM element.
 * @example
 * ```js
 * const unmount = mount(document.getElementById('root'));
 * // To unmount the application
 * unmount();
 * ```
 */
function mount(ele) {
  // Validating the element
  if (!ele) {
    throw new Error(MOUNT_ERRORS.ELEMENT_REQUIRED);
  }

  if (!(ele instanceof Element)) {
    throw new Error(MOUNT_ERRORS.INVALID_DOM_ELEMENT);
  }

  const root = createRoot(ele);

  root.render(
    <StrictMode>
      <AppProvider />
    </StrictMode>,
  );

  return () => queueMicrotask(() => root.unmount());
}

export { mount };
