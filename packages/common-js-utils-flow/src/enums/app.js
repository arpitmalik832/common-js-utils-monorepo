// @flow
const ENVS = {
  DEV: 'development',
  STG: 'staging',
  BETA: 'beta',
  PROD: 'production',
};

const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

const DEPRECATION_MSG_FOR_REMOVAL =
  'will be deprecated in the next patch release. Please use your own hook for the same.';

export { ENVS, THEME, DEPRECATION_MSG_FOR_REMOVAL };
