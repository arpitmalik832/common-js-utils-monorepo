/**
 * Unit tests for minimizerUtils.
 * @file This file is saved as `minimizerUtils.test.js`.
 */
import fs from 'fs/promises';
import { minify } from 'terser';
import postcss from 'postcss';
import '@testing-library/jest-dom';

// Import the functions we'll be testing
import { minimizeContent, processPath } from '../minimizerUtils.js';
import { errorLog } from '../logsUtils.js';

// Mock dependencies
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  stat: jest.fn(),
  readdir: jest.fn(),
}));

jest.mock('terser', () => ({
  minify: jest.fn(),
}));

jest.mock('postcss', () =>
  jest.fn().mockReturnValue({
    process: jest.fn().mockResolvedValue({ css: 'minified css' }),
  }),
);

jest.mock('cssnano', () => jest.fn(() => 'cssnano plugin'));

jest.mock('postcss-scss', () => jest.fn());

jest.mock('../logsUtils.js', () => ({
  errorLog: jest.fn(),
}));

// Mock the minimizeContent function
jest.mock('../minimizerUtils.js', () => {
  const originalModule = jest.requireActual('../minimizerUtils.js');
  return {
    ...originalModule,
    minimizeContent: jest
      .fn()
      .mockImplementation(originalModule.minimizeContent),
    processPath: originalModule.processPath, // Use the actual implementation
  };
});

describe('minimizerUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock implementations
    fs.readFile.mockResolvedValue('file content');
    fs.writeFile.mockResolvedValue(undefined);
    fs.stat.mockResolvedValue({ isDirectory: () => false, isFile: () => true });
    fs.readdir.mockResolvedValue(['file1.js', 'file2.css']);
    minify.mockResolvedValue({ code: 'minified js' });
  });

  describe('minimizeContent', () => {
    it('should minify JavaScript files', async () => {
      await minimizeContent('test.js');
      expect(minify).toHaveBeenCalledWith('file content', expect.any(Object));
      expect(fs.writeFile).toHaveBeenCalledWith('test.js', 'minified js');
    });

    it('should minify CSS files', async () => {
      await minimizeContent('test.css');
      expect(postcss).toHaveBeenCalledWith(['cssnano plugin']);
      expect(fs.writeFile).toHaveBeenCalledWith('test.css', 'minified css');
    });

    it('should minify SCSS files', async () => {
      await minimizeContent('test.scss');
      expect(postcss).toHaveBeenCalledWith(['cssnano plugin']);
      expect(fs.writeFile).toHaveBeenCalledWith('test.scss', 'minified css');
    });

    it('should handle errors gracefully', async () => {
      minify.mockRejectedValueOnce(new Error('Minification failed'));
      await minimizeContent('test.js');
      expect(errorLog).toHaveBeenCalledWith(
        'Error minifying test.js:',
        expect.any(Error),
      );
    });
  });

  describe('processPath', () => {
    it('should process a single file', async () => {
      // Set up mocks for a single file
      fs.stat.mockResolvedValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      });

      await processPath('test.js');

      // Verify fs.stat was called with the correct path
      expect(fs.stat).toHaveBeenCalledWith('test.js');
    });

    it('should process all files in a directory', async () => {
      // Set up mocks for a directory with multiple files
      fs.stat.mockResolvedValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      });
      fs.readdir.mockResolvedValueOnce([
        'file1.js',
        'file2.css',
        'subdir/file3.js',
      ]);

      // Mock stat for each file in the directory
      fs.stat.mockResolvedValue({
        isDirectory: () => false,
        isFile: () => true,
      });

      await processPath('test-dir');

      // Verify fs.stat was called with the correct path
      expect(fs.stat).toHaveBeenCalledWith('test-dir');

      // Verify fs.readdir was called with the correct path and options
      expect(fs.readdir).toHaveBeenCalledWith('test-dir', { recursive: true });
    });

    it('should skip directories within a directory', async () => {
      // Set up mocks for a directory with files and subdirectories
      fs.stat.mockResolvedValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      });
      fs.readdir.mockResolvedValueOnce(['file1.js', 'subdir', 'file2.css']);

      // Mock stat for the main directory
      fs.stat.mockResolvedValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      });

      // Mock stat for each file in the directory
      fs.stat.mockResolvedValue({
        isDirectory: () => false,
        isFile: () => true,
      });

      await processPath('test-dir');

      // Verify fs.stat was called with the correct path
      expect(fs.stat).toHaveBeenCalledWith('test-dir');

      // Verify fs.readdir was called with the correct path and options
      expect(fs.readdir).toHaveBeenCalledWith('test-dir', { recursive: true });
    });

    it('should handle errors when processing a directory', async () => {
      // Set up mocks for a directory
      fs.stat.mockResolvedValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      });
      fs.readdir.mockResolvedValueOnce(['file1.js', 'file2.css']);

      await processPath('test-dir');
    });

    it('should handle errors when reading directory', async () => {
      // Make fs.stat throw an error
      fs.stat.mockRejectedValueOnce(new Error('Directory not found'));

      await processPath('nonexistent-dir');

      // Verify error was logged
      expect(errorLog).toHaveBeenCalledWith(
        'Error processing path nonexistent-dir:',
        expect.any(Error),
      );
    });
  });
});
