// @flow
import React, { useEffect, useRef, useState } from 'react';

import iconsList from '../../../static/enums/icons_list.mjs';
import { capitalizeFirstChar } from '../../utils/stringUtils';
import { copyToClipboard } from '../../utils/commonUtils';
import { errorLog, log } from '../../utils/logsUtils';

import s from './index.module.scss';

function Icon({ name }: { name: string }): React.Node {
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

function Icons(): React.Node {
  const [currentIcon, setCurrentIcon] = useState('');

  function getImportPath() {
    return `import { ReactComponent as ${capitalizeFirstChar(
      currentIcon.split('/')[1].replace('.svg', ''),
    )} } from 'library_name/icons/${currentIcon}'`;
  }

  function renderIconSection(size: string, icons: string[]): React.Node {
    return (
      <section className={s.iconSection}>
        <div className={s.sectionName}>{size}</div>
        <div className={s.icons}>
          {icons.map(icon => (
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
