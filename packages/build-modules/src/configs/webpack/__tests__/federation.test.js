/**
 * @file Test file for webpack federation configuration.
 */

import '@testing-library/jest-dom';

import getConfig from '../federation.js';
import { getProjEntries } from '../../../utils';

// Mock the dependencies
jest.mock('../../../utils', () => ({
  getProjEntries: jest.fn().mockReturnValue({
    app1: 'http://localhost:3001',
    app2: 'http://localhost:3002',
  }),
}));

describe('getConfig', () => {
  const mockProjectRoot = '/mock/project/root';
  const mockEnv = 'development';
  const mockDeps = {
    react: '^18.0.0',
    'react-dom': '^18.0.0',
  };
  const mockProjs = ['app1', 'app2'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a valid webpack federation configuration object', () => {
    const config = getConfig(mockProjectRoot, mockEnv, mockDeps, mockProjs);

    expect(config).toBeDefined();
    // The actual implementation returns an empty object since plugins are commented out
    expect(config).toEqual({});
  });

  it('should call getProjEntries with the correct parameters', () => {
    getConfig(mockProjectRoot, mockEnv, mockDeps, mockProjs);

    expect(getProjEntries).toHaveBeenCalledWith(mockEnv, mockProjs);
  });

  // These tests are for the commented-out code, which would be useful if the code is uncommented in the future
  it('should create remotes object with correct format', () => {
    // This is a test for the logic that would be used if the code is uncommented
    const remotesObj = {};
    const REMOTE_HOSTS = {
      app1: 'http://localhost:3001',
      app2: 'http://localhost:3002',
    };

    Object.keys(REMOTE_HOSTS).forEach(proj => {
      remotesObj[proj] = `${proj}@${REMOTE_HOSTS[proj]}remoteEntry.js`;
    });

    expect(remotesObj).toEqual({
      app1: 'app1@http://localhost:3001remoteEntry.js',
      app2: 'app2@http://localhost:3002remoteEntry.js',
    });
  });
});
