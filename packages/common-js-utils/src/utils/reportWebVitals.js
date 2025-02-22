/**
 * Contains utility functions for reporting web vitals.
 * @file The file is saved as `reportWebVitals.js`.
 */
import { onLCP, onFID, onCLS, onFCP, onTTFB } from 'web-vitals';

import { log } from './logsUtils';

/**
 * Logs performance metrics.
 * @example
 * reportWebVitals();
 */
function reportWebVitals() {
  onCLS(log);
  onFID(log);
  onLCP(log);
  onFCP(log);
  onTTFB(log);
}

export default reportWebVitals;
