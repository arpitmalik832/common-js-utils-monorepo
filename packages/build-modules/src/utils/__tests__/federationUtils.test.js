/**
 * @file Test file for federationUtils.js.
 */

import { getProjEntries } from '../federationUtils.js';
import { MAIN_ENUMS } from '../../enums/index.js';

describe('federationUtils', () => {
  describe('getProjEntries', () => {
    it('should return an empty object when no projects are provided', () => {
      const result = getProjEntries(MAIN_ENUMS.ENVS.PROD);
      expect(result).toEqual({});
    });

    it('should return project URLs for a single project', () => {
      const result = getProjEntries(MAIN_ENUMS.ENVS.PROD, ['proj_x']);
      expect(result).toEqual({
        proj_x: 'https://proj-x.com/',
      });
    });

    it('should return project URLs for multiple projects', () => {
      const result = getProjEntries(MAIN_ENUMS.ENVS.PROD, ['proj_x', 'proj_y']);
      expect(result).toEqual({
        proj_x: 'https://proj-x.com/',
        proj_y: 'https://proj-x.com/',
      });
    });

    it('should return the correct URL for different environments', () => {
      const environments = [
        MAIN_ENUMS.ENVS.PROD,
        MAIN_ENUMS.ENVS.BETA,
        MAIN_ENUMS.ENVS.STG,
        MAIN_ENUMS.ENVS.DEV,
        MAIN_ENUMS.ENVS.DEFAULT,
      ];

      const expectedUrls = [
        'https://proj-x.com/',
        'https://proj-x-beta.com/',
        'https://proj-x-stg.com/',
        'https://proj-x-dev.com/',
        'https://proj-x-stg.com/',
      ];

      environments.forEach((env, index) => {
        const result = getProjEntries(env, ['proj_x']);
        expect(result).toEqual({
          proj_x: expectedUrls[index],
        });
      });
    });

    it('should handle unknown project names', () => {
      const result = getProjEntries(MAIN_ENUMS.ENVS.PROD, ['unknown_proj']);
      expect(result).toEqual({
        unknown_proj: 'https://proj-x.com/',
      });
    });
  });
});
