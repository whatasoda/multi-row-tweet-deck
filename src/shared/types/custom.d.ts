type OneOfTDClassName = import('../utils/TDClassName').OneOfTDClassName;
type Style = ReturnType<typeof import('styled-components')['css']>;
type CSSObject = import('styled-components').CSSObject;

type OneOfDrawerType = 'options' | 'profileList' | 'home' | 'unset';
type OneOfProfileSelectionMode = 'edit' | 'use';

interface ValLoader {
  code: string;
  cacheable?: boolean;
  contextDependencies?: string[];
}

declare module '*.png' {
  const _path: string;
  export default _path;
}
