import { CSSProperties } from 'react';
import { AppProfile, HEADER_HEIGHT_MAP } from '../store/app';
import NativeEnvironments from './NativeEnvironments';

export type AppStyle = {
  appContent: CSSProperties;
  drawer: CSSProperties;
  columnsContainer: CSSProperties;
  columns: CSSProperties;
  cellCommon: CSSProperties;
  cellCols: CSSProperties[];
  cellRows: CSSProperties[][];
  columnHeader: CSSProperties;
  columnHeaderTitle: CSSProperties;
  columnTitleBackIcon: CSSProperties;
};

type CreateAppStyle = (profile: AppProfile) => AppStyle;
type NativeClassNameKeys = keyof typeof nativeClassNameBase;
const nativeClassNameBase = {
  appContent: ['app-content', 'is-open'],
  drawer: ['drawer'],
  columnsContainer: ['app-columns-container'],
  columns: ['app-columns'],
  column: ['column'],
  columnHeader: ['column-header'],
  columnHeaderTitle: ['column-header-title'],
  columnTitleBackIcon: ['column-title-back .icon'],
};

export const ROOT_CLASS_NAME = 'multi-row';
export const ROOT_SELECTOR_CSS = 'html.multi-row body.multi-row';

export const NativeClassName = {
  css: Object.entries(nativeClassNameBase).reduce<Record<NativeClassNameKeys, string>>(
    (acc, [key, list]) =>
      Object.assign(acc, {
        [key]: `.${list.filter(Boolean).join('.')}`,
      }),
    {} as any,
  ),
  html: Object.entries(nativeClassNameBase).reduce<Record<NativeClassNameKeys, string>>(
    (acc, [key, list]) =>
      Object.assign(acc, {
        [key]: list.filter(Boolean).join(' '),
      }),
    {} as any,
  ),
};

const AppStyle: CreateAppStyle = (profile) => {
  const { drawerWidth, headerType, cellGap } = profile;
  const drawerDiff = NativeEnvironments.drawerWidth - drawerWidth;
  const hHeight = HEADER_HEIGHT_MAP[headerType];

  const cellCols = profile.columns.map<CSSProperties>((width) => ({
    width: px(width),
  }));

  const cellRows = profile.rows.map((col) => {
    const gapTotal = cellGap * (col.length - 1) + hHeight * col.length;
    return col.map<CSSProperties>((percentage) => ({
      height: `calc(${hHeight}px + ${percentage}% - ${(gapTotal * percentage) / 100}px)`,
    }));
  });

  const headerTransform = `translateY(${(hHeight - NativeEnvironments.columnHeaderHeight) / 2}px)`;

  return {
    appContent: {
      marginLeft: px(-drawerDiff),
    },
    drawer: {
      width: px(drawerWidth),
      left: px(-drawerWidth),
    },
    columnsContainer: {},
    columns: {},
    cellCommon: {
      marginRight: px(cellGap),
    },
    cellCols,
    cellRows,
    columnHeader: {
      height: px(hHeight),
      maxHeight: px(hHeight),
      lineHeight: px(hHeight),
    },
    columnHeaderTitle: {
      transform: headerTransform,
    },
    columnTitleBackIcon: {
      transform: headerTransform,
    },
  };
};

const px = (value: number) => `${value}px`;

export default AppStyle;
