/**
 * Renders the Colors storybook component.
 * @file The file is saved as `Colors/index.js`.
 */
import tokens from '../../../static/enums/design_tokens.json';
import { capitalizeFirstChar } from '../../utils/stringUtils';
import classnames from '../../utils/classNames';
import s from './index.module.scss';

/**
 * Colors component that renders color boxes based on design tokens.
 * @returns {import('react').JSX.Element} The rendered color boxes.
 * @example
 * return <Colors />;
 */
function Colors() {
  /**
   * Retrieves the color value based on the provided parameters.
   * @param {string} type - The type of color.
   * @param {string} innerType - The inner type of color.
   * @param {string} semanticLabel - The semantic label for the color.
   * @param {string} theme - The theme (light or dark).
   * @returns {string} The color value in hex format or as a color name.
   * @example
   * const color = getColorValue('primary', 'default', 'background', 'light');
   */
  function getColorValue(type, innerType, semanticLabel, theme) {
    const colorValue =
      tokens['color-semantics']?.[theme]?.[type]?.[innerType]?.[semanticLabel]
        ?.value;
    if (!colorValue) {
      return '';
    }
    if (colorValue?.startsWith('#')) {
      return colorValue;
    }
    const [, colorName, shade] = colorValue.split('.');
    return tokens['color-primitives']?.[colorName]?.[shade.replace('}', '')]
      ?.value;
  }

  /**
   * Retrieves the color value based on the provided parameters.
   * @param {string} type - The type of color.
   * @param {string} innerType - The inner type of color.
   * @param {string} semanticLabel - The semantic label for the color.
   * @param {string} theme - The theme (light or dark).
   * @returns {string} The color value in hex format or as a color name.
   * @example
   * const color = getColorValue('primary', 'default', 'background', 'light');
   */
  function renderColorBox(type, innerType, semanticLabel, theme) {
    const colorValue = getColorValue(type, innerType, semanticLabel, theme);
    return (
      <div
        data-testid="colorCard"
        style={{
          background: colorValue,
        }}
        className={s.colorCard}
      >
        <div
          className={classnames(s.colorName, {
            [s.whiteText]: theme === 'light',
          })}
          data-testid="colorName"
        >{`--${type}-${innerType}-${semanticLabel}`}</div>
        <div
          className={classnames(s.colorCode, {
            [s.whiteText]: theme === 'light',
          })}
          data-testid="colorCode"
        >
          {colorValue}
        </div>
      </div>
    );
  }

  return (
    <div data-testid="colorsContainer" className={s.colorsContainer}>
      {Object.entries(tokens['color-semantics'].light).map(
        ([type, properties]) =>
          Object.entries(properties).map(([innerType, innerProperties]) => (
            <section key={type}>
              <div data-testid="type" className={s.sectionHeading}>
                {capitalizeFirstChar(type)}
              </div>
              <div data-testid="innerType" className={s.sectionHeading}>
                {capitalizeFirstChar(innerType)}
              </div>
              <div data-testid="themeHeader" className={s.themeHeader}>
                <div>Light</div>
                <div>Dark</div>
              </div>
              {Object.entries(innerProperties).map(([semanticLabel]) => (
                <div
                  data-testid="colorsRow"
                  key={`${type}-${innerType}-${semanticLabel}`}
                  className={s.colorsRow}
                >
                  {renderColorBox(type, innerType, semanticLabel, 'light')}
                  {renderColorBox(type, innerType, semanticLabel, 'dark')}
                </div>
              ))}
            </section>
          )),
      )}
    </div>
  );
}

export default Colors;
