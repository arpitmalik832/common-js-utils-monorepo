/**
 * Style Dictionary configuration file.
 * @file The file is saved as `style-dictionary.config.js`.
 */
const config = {
  source: ['./static/enums/**/*.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: './static/styles/style-dictionary/',
      files: [
        {
          destination: 'colors.scss',
          format: 'scss/map-flat',
          options: {
            mapName: 'colors',
          },
          filter: token => token.attributes.category === 'color-semantics',
        },
        {
          destination: 'typography.scss',
          format: 'scss/map-deep',
          options: {
            mapName: 'typography',
          },
          filter: token => token.attributes.category === 'typography',
        },
      ],
    },
    // "scss-export": {
    //   transformGroup: "scss",
    //   buildPath: "./static/styles/",
    //   files: [
    //     {
    //       destination: "_colors.scss",
    //       format: "scss/map-deep",
    //       options: { mapName: "colors" },
    //       filter: (token) => token.attributes.category === "color-semantics",
    //     },
    //   ],
    // },
  },
};

export default config;
