/**
 * @file Unit tests for Cypress ESLint configuration.
 */
import cypressConfig from '../cypress.js';
import { FILES_ENUMS } from '../../enums/index.js';

// Mock the cypress plugin
jest.mock('eslint-plugin-cypress/flat', () => ({
  configs: {
    recommended: {
      rules: {
        'cypress/no-assigning-return-values': 'error',
        'cypress/no-unnecessary-waiting': 'error',
      },
    },
  },
}));

describe('Cypress ESLint Configuration', () => {
  let config;

  beforeEach(() => {
    [config] = cypressConfig;
  });

  describe('Configuration Structure', () => {
    test('should export an array of configurations', () => {
      expect(Array.isArray(cypressConfig)).toBe(true);
      expect(cypressConfig).toHaveLength(1);
    });

    test('should have valid configuration object', () => {
      expect(config).toBeInstanceOf(Object);
    });
  });

  describe('File Patterns', () => {
    test('should target E2E test files', () => {
      expect(config.files).toEqual([FILES_ENUMS.E2E_FILES]);
    });
  });

  describe('Rules', () => {
    test('should include recommended Cypress rules', () => {
      expect(config.rules).toBeDefined();
      expect(config.rules['cypress/no-assigning-return-values']).toBe('error');
      expect(config.rules['cypress/no-unnecessary-waiting']).toBe('error');
    });
  });
});
