export type OneOfTDClassName = keyof typeof TDClassNameInput;
const TDClassNameInput = {
  appContentOpened: ['app-content', 'is-open'],
  appContentClosed: ['app-content'],
  drawer: ['drawer'],
  columnsContainer: ['app-columns-container'],
  columns: ['app-columns'],
  column: ['column'],
  columnHeader: ['column-header'],
  columnHeaderTitle: ['column-header-title'],
  columnTitleBackIcon: ['column-title-back .icon'],
} as const;

const entries = Object.entries(TDClassNameInput) as [string, readonly string[]][];

export const TDClassName = {
  css: entries.reduce<Record<string, string>>((acc, [key, list]) => {
    acc[key] = `.${list.filter(Boolean).join('.')}`;
    return acc;
  }, {}) as Record<OneOfTDClassName, string>,
  html: entries.reduce<Record<string, string>>((acc, [key, list]) => {
    acc[key] = list.filter(Boolean).join(' ');
    return acc;
  }, {}) as Record<OneOfTDClassName, string>,
};
