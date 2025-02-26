/* eslint-disable no-param-reassign */
/**
 * Strip Custom Window Variables Plugin.
 * @file The file is saved as `build_utils/webpack/customPlugins/StripCustomWindowVariables.mjs`.
 */
import webpack from 'webpack';

class StripCustomWindowVariablesPlugin {
  constructor({ variables }) {
    this.variables = variables || [];
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
      'StripCustomWindowVariablesPlugin',
      compilation => {
        compilation.hooks.processAssets.tap(
          {
            name: 'StripCustomWindowVariablesPlugin',
            stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          assets => {
            Object.keys(assets).forEach(assetName => {
              if (assetName.endsWith('.js')) {
                const asset = assets[assetName];
                let source = asset.source();

                this.variables.forEach(variable => {
                  const regex = new RegExp(
                    `window\\.${variable}\\s*=\\s*[^;]+;`,
                    'g',
                  );
                  source = source.replace(regex, '');
                });

                assets[assetName] = new webpack.sources.RawSource(source);
              }
            });
          },
        );
      },
    );
  }
}

export { StripCustomWindowVariablesPlugin };
