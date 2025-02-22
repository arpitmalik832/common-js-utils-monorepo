/**
 * It renders a list of icons.
 * @file The file is saved as `Icons/index.jsx`.
 */
import React, { useEffect, useRef, useState } from 'react';

import iconsList from '../../../static/enums/icons_list.mjs';
import { capitalizeFirstChar } from '../../utils/stringUtils';
import { copyToClipboard } from '../../utils/commonUtils';
import { errorLog, log } from '../../utils/logsUtils';

import s from './index.module.scss';

/**
 * Icon component that dynamically imports and renders an SVG icon.
 * @param {object} props - The component props.
 * @param {string} props.name - The name of the icon to import.
 * @returns {import('react').JSX.Element|null} The rendered icon or null if not available.
 * @example
 * <Icon name="exampleIcon.svg" />
 */
function Icon({ name }) {
  const ImportedIconRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    import(`../../assets/icons/${name}`)
      .then(comp => {
        ImportedIconRef.current = comp.ReactComponent;
        setLoading(false);
      })
      .catch(e => {
        errorLog('Failed to fetch icon: ', e);
      });
  }, []);

  if (!name || loading || !ImportedIconRef.current) return null;
  // eslint-disable-next-line react/jsx-pascal-case
  return <ImportedIconRef.current />;
}

/**
 * Icons component that renders a list of icons and handles icon selection.
 * @returns {import('react').JSX.Element} The rendered icons component.
 * @example
 * <Icons />
 */
function Icons() {
  const [currentIcon, setCurrentIcon] = useState('');

  /**
   * Generates the import path for the selected icon.
   * @returns {string} The import statement for the icon.
   * @example
   * const importPath = getImportPath();
   */
  function getImportPath() {
    return `import { ReactComponent as ${capitalizeFirstChar(
      currentIcon.split('/')[1].replace('.svg', ''),
    )} } from 'library_name/icons/${currentIcon}'`;
  }

  /**
   * Renders a section of icons with a specified size.
   * @param {string} size - The size of the icons section.
   * @param {Array<string>} icons - The list of icon names to render.
   * @returns {import('react').JSX.Element} The rendered icon section.
   * @example
   * renderIconSection('sm16', ['icon1.svg', 'icon2.svg']);
   */
  function renderIconSection(size, icons) {
    return (
      <section className={s.iconSection}>
        <div className={s.sectionName}>{size}</div>
        <div className={s.icons}>
          {icons?.map(icon => (
            <div
              role="button"
              data-testid="icon-box"
              tabIndex={0}
              aria-pressed="false"
              className={s.iconBox}
              key={icon}
              onClick={() => {
                setCurrentIcon(icon);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setCurrentIcon(icon);
                }
              }}
            >
              <Icon name={icon} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className={s.iconsListContainer}>
      {renderIconSection(
        'sm16',
        iconsList.filter(icon => icon.includes('sm16'))?.sort(),
      )}
      {renderIconSection(
        'rg24',
        iconsList.filter(icon => icon.includes('rg24'))?.sort(),
      )}
      {renderIconSection(
        'lg32',
        iconsList.filter(icon => icon.includes('lg32'))?.sort(),
      )}
      {currentIcon && (
        <div className={s.modal} data-testid="icon-modal">
          <div
            role="button"
            data-testid="backdrop"
            tabIndex={0}
            aria-label="backdrop"
            aria-pressed="false"
            className={s.backdrop}
            onClick={() => {
              setCurrentIcon('');
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                setCurrentIcon('');
              }
            }}
          />
          <div className={s.content}>
            <section className={s.titleSection}>
              <div className={s.iconName}>{currentIcon}</div>
              <span
                role="button"
                data-testid="close-icon"
                tabIndex={0}
                aria-pressed="false"
                className={s.dismissIcon}
                onClick={() => {
                  setCurrentIcon('');
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setCurrentIcon('');
                  }
                }}
              >
                Close
              </span>
            </section>
            <section className={s.codeSection}>
              <code className={s.code} data-testid="code-element">
                {getImportPath()}
              </code>
              <span
                role="button"
                data-testid="copy-icon"
                tabIndex={0}
                aria-pressed="false"
                className={s.copyIcon}
                onClick={() => {
                  copyToClipboard(getImportPath(), () => {
                    log('Copied!');
                  });
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    copyToClipboard(getImportPath(), () => {
                      log('Copied!');
                    });
                  }
                }}
              >
                Copy
              </span>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default Icons;
