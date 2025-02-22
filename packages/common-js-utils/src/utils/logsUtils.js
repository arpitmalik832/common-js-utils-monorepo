/**
 * This file contains utility functions for logging.
 * @file This file is saved as `logsUtils.js`.
 */
import { ENVS } from '../enums/app';

/**
 * Logs messages to the console.
 * @param {...any} args - The messages to log.
 * @example
 * log('This is a log message');
 */
function log(...args) {
  if (process.env.APP_ENV !== ENVS.PROD) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}

/**
 * Logs error messages to the console.
 * @param {...any} args - The error messages to log.
 * @example
 * errorLog('This is an error message');
 */
function errorLog(...args) {
  if (process.env.APP_ENV !== ENVS.PROD) {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
}

/**
 * Logs warning messages to the console.
 * @param {...any} args - The warning messages to log.
 * @example
 * warnLog('This is a warning message');
 */
function warnLog(...args) {
  if (process.env.APP_ENV !== ENVS.PROD) {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }
}

/**
 * Logs debug messages to the console.
 * @param {...any} args - The debug messages to log.
 * @example
 * debugLog('This is a debug message');
 */
function debugLog(...args) {
  if (process.env.APP_ENV !== ENVS.PROD) {
    // eslint-disable-next-line no-console
    console.debug(...args);
  }
}

/**
 * Logs trace messages to the console.
 * @param {...any} args - The trace messages to log.
 * @example
 * traceLog('This is a trace message');
 */
function traceLog(...args) {
  if (process.env.APP_ENV !== ENVS.PROD) {
    // eslint-disable-next-line no-console
    console.trace(...args);
  }
}

/**
 * Logs tabular data to the console.
 * @param {...any} args - The data to log in a table format.
 * @example
 * tableLog(['Header1', 'Header2'], [1, 2]);
 */
function tableLog(...args) {
  if (process.env.APP_ENV !== ENVS.PROD) {
    // eslint-disable-next-line no-console
    console.table(args);
  }
}

/**
 * Logs informational messages to the console.
 * @param {...any} args - The informational messages to log.
 * @example
 * infoLog('This is an info message');
 */
function infoLog(...args) {
  if (process.env.APP_ENV !== ENVS.PROD) {
    // eslint-disable-next-line no-console
    console.info(...args);
  }
}

const timeLog = label => {
  if (process.env.APP_ENV !== ENVS.PROD) {
    // eslint-disable-next-line no-console
    console.time(label);
  }
};

const timeEndLog = label => {
  if (process.env.APP_ENV !== ENVS.PROD) {
    // eslint-disable-next-line no-console
    console.timeEnd(label);
  }
};

export {
  log,
  errorLog,
  warnLog,
  debugLog,
  traceLog,
  tableLog,
  infoLog,
  timeLog,
  timeEndLog,
};
