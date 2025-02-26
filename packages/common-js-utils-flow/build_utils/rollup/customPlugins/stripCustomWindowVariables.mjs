/* eslint-disable no-console */
/**
 * Strip custom window variables.
 * @file This file is saved as `stripCustomWindowVariables.mjs`.
 */
import { createFilter } from '@rollup/pluginutils';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';

const traverse = _traverse.default;
const generate = _generate.default;

/**
 * Strip custom window variables from the code.
 * @param {object} options - The options for the plugin.
 * @param {string[]} options.include - The include patterns.
 * @param {string[]} options.exclude - The exclude patterns.
 * @param {string[]} options.variables - The custom window variables to strip.
 * @returns {object} - The transformed code and map.
 * @example This is an example of how to use the plugin.
 */
function stripCustomWindowVariables({
  include = ['**/*.{cjs,mjs,js,jsx,ts,tsx}'],
  variables = [],
  exclude = [],
}) {
  const filter = createFilter(include, exclude);

  return {
    name: 'strip-custom-window-variables-plugin',
    transform(code, id) {
      if (!filter(id)) return null;

      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      traverse(ast, {
        MemberExpression(path) {
          const { node } = path;
          if (
            node.object &&
            node.object.name === 'window' &&
            node.property &&
            node.property.name &&
            variables.includes(node.property.name)
          ) {
            console.log(
              `\nRemoving window variable: ${node.object.name}.${node.property.name}`,
            );
            path.remove();
          }
        },
        AssignmentExpression(path) {
          const { node } = path;
          if (
            node.left &&
            node.left.object &&
            node.left.object.name === 'window' &&
            node.left.property &&
            node.left.property.name &&
            variables.includes(node.left.property.name)
          ) {
            console.log(
              `\nRemoving window variable assignment: ${node.left.object.name}.${node.left.property.name}`,
            );
            path.remove();
          }
        },
      });

      const output = generate(ast, {}, code);
      return {
        code: output.code,
        map: output.map,
      };
    },
  };
}

export default stripCustomWindowVariables;
