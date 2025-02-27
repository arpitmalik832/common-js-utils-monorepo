// @flow
declare module '*.svg.js' {
  import type React from 'react';

  declare export type SvgrComponent = React$ComponentType<{
    title?: string,
    desc?: string,
    fill?: string,
    stroke?: string,
    width?: number | string,
    height?: number | string,
    className?: string,
    style?: Object,
  }>;

  declare module.exports: SvgrComponent;
}

declare module '*.module.scss' {
  declare export type ModuleScssComponent = Record<string, string>;

  declare module.exports: ModuleScssComponent;
}

declare module '*.scss' {
  declare module.exports: string;
}

declare module '*.png' {
  declare export default string;
}
