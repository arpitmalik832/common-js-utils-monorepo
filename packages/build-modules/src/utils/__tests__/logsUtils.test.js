/* eslint-disable no-console */
/**
 * Unit tests for logsUtils.
 * @file This file is saved as `logsUtils.test.js`.
 */
import '@testing-library/jest-dom';

import {
  log,
  errorLog,
  warnLog,
  debugLog,
  traceLog,
  tableLog,
  infoLog,
  timeEndLog,
  timeLog,
} from '../logsUtils.js';
import { MAIN_ENUMS } from '../../enums/index.js';

describe('logUtils unit tests', () => {
  const originalNodeEnv = process.env.APP_ENV;

  beforeAll(() => {
    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.debug = jest.fn();
    console.trace = jest.fn();
    console.table = jest.fn();
    console.info = jest.fn();
    console.time = jest.fn();
    console.timeEnd = jest.fn();
  });

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  afterEach(() => {
    process.env.APP_ENV = originalNodeEnv;
  });

  it('log unit test', () => {
    process.env.APP_ENV = MAIN_ENUMS.ENVS.DEV;
    log('test');
    expect(console.log).toHaveBeenCalledTimes(1);
    process.env.APP_ENV = MAIN_ENUMS.ENVS.PROD;
    log('test');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('errorLog unit test', () => {
    process.env.APP_ENV = MAIN_ENUMS.ENVS.DEV;
    errorLog('test');
    expect(console.error).toHaveBeenCalledTimes(1);
    process.env.APP_ENV = MAIN_ENUMS.ENVS.PROD;
    errorLog('test');
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('warnLog unit test', () => {
    process.env.APP_ENV = MAIN_ENUMS.ENVS.DEV;
    warnLog('test');
    expect(console.warn).toHaveBeenCalledTimes(1);
    process.env.APP_ENV = MAIN_ENUMS.ENVS.PROD;
    warnLog('test');
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('debugLog unit test', () => {
    process.env.APP_ENV = MAIN_ENUMS.ENVS.DEV;
    debugLog('test');
    expect(console.debug).toHaveBeenCalledTimes(1);
    process.env.APP_ENV = MAIN_ENUMS.ENVS.PROD;
    debugLog('test');
    expect(console.debug).toHaveBeenCalledTimes(1);
  });

  it('traceLog unit test', () => {
    process.env.APP_ENV = MAIN_ENUMS.ENVS.DEV;
    traceLog('test');
    expect(console.trace).toHaveBeenCalledTimes(1);
    process.env.APP_ENV = MAIN_ENUMS.ENVS.PROD;
    traceLog('test');
    expect(console.trace).toHaveBeenCalledTimes(1);
  });

  it('tableLog unit test', () => {
    process.env.APP_ENV = MAIN_ENUMS.ENVS.DEV;
    tableLog(['test']);
    expect(console.table).toHaveBeenCalledTimes(1);
    process.env.APP_ENV = MAIN_ENUMS.ENVS.PROD;
    tableLog(['test']);
    expect(console.table).toHaveBeenCalledTimes(1);
  });

  it('infoLog unit test', () => {
    process.env.APP_ENV = MAIN_ENUMS.ENVS.DEV;
    infoLog('test');
    expect(console.info).toHaveBeenCalledTimes(1);
    process.env.APP_ENV = MAIN_ENUMS.ENVS.PROD;
    infoLog('test');
    expect(console.info).toHaveBeenCalledTimes(1);
  });

  it('timeLog unit test', () => {
    process.env.APP_ENV = MAIN_ENUMS.ENVS.DEV;
    timeLog('test');
    expect(console.time).toHaveBeenCalledTimes(1);
    process.env.APP_ENV = MAIN_ENUMS.ENVS.PROD;
    timeLog('test');
    expect(console.time).toHaveBeenCalledTimes(1);
  });

  it('timeEndLog unit test', () => {
    process.env.APP_ENV = MAIN_ENUMS.ENVS.DEV;
    timeEndLog('test');
    expect(console.timeEnd).toHaveBeenCalledTimes(1);
    process.env.APP_ENV = MAIN_ENUMS.ENVS.PROD;
    timeEndLog('test');
    expect(console.timeEnd).toHaveBeenCalledTimes(1);
  });
});
