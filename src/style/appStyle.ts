import { CSSProperties } from 'react';
import { AppProfile } from '../store/app';

export type AppStyle = {
  appContent: CSSProperties;
  drawer: CSSProperties;
  columnsContainer: CSSProperties;
  columns: CSSProperties;
  cellCommon: CSSProperties;
  cellCols: CSSProperties[];
  cellRows: CSSProperties[][];
  columnHeader: CSSProperties;
  columnHandle: CSSProperties;
  columnHeaderTitle: CSSProperties;
  columnTitleBackIcon: CSSProperties;
};

type CreateAppStyle = (profile: AppProfile) => AppStyle;
type PureKeys = Exclude<keyof AppStyle, 'cellCommon' | 'cellCols' | 'cellRows'> | 'column';

const nativeClassNameBase: Record<PureKeys, string[]> = {
  appContent: ['app-content', 'is-open'],
  drawer: ['drawer', 'wide'],
  columnsContainer: ['app-columns-container'],
  columns: ['app-columns'],
  column: ['column'],
  columnHeader: ['column-header'],
  columnHandle: ['column-drag-handle'],
  columnHeaderTitle: ['column-header-title'],
  columnTitleBackIcon: ['column-title-back .icon'],
};

export const NativeClassName = {
  css: Object.entries(nativeClassNameBase).reduce<Record<PureKeys, string>>(
    (acc, [key, list]) =>
      Object.assign(acc, {
        [key]: `.${list.filter(Boolean).join('.')}`,
      }),
    {} as any,
  ),
  html: Object.entries(nativeClassNameBase).reduce<Record<PureKeys, string>>(
    (acc, [key, list]) =>
      Object.assign(acc, {
        [key]: list.filter(Boolean).join(' '),
      }),
    {} as any,
  ),
};

const DEFAULT_DRAWER_WIDTH = 400;
const DEFAULT_COLUMN_HEADER_HEIGHT = 50;

const AppStyle: CreateAppStyle = (profile) => {
  const { drawerWidth, cellHeaderHeight, cellGap } = profile;
  const drawerDiff = DEFAULT_DRAWER_WIDTH - drawerWidth;

  const cellCols = profile.columns.reduce<CSSProperties[]>((acc, width) => {
    acc.push({
      width: px(width),
    });
    return acc;
  }, []);

  const cellRows = profile.rows.map((col) => {
    const gapTotal = cellGap * (col.length - 1) + col.length * cellHeaderHeight;
    return col.reduce<CSSProperties[]>((acc, percentage) => {
      acc.push({
        height: `calc(${cellHeaderHeight}px + ${percentage}% - ${(gapTotal * percentage) / 100}px)`,
      });
      return acc;
    }, []);
  });

  const headerTransform = `translateY(${(cellHeaderHeight - DEFAULT_COLUMN_HEADER_HEIGHT) / 2}px)`;

  return {
    appContent: {
      marginLeft: px(-drawerDiff),
    },
    drawer: {
      width: px(drawerWidth),
      left: px(-drawerWidth),
    },
    columnsContainer: {},
    columns: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignContent: 'flex-start',
    },
    cellCommon: {
      flexShrink: 0,
      flexGrow: 0,
      marginRight: px(cellGap),
    },
    cellCols,
    cellRows,
    columnHeader: {
      height: px(cellHeaderHeight),
      maxHeight: px(cellHeaderHeight),
      lineHeight: px(cellHeaderHeight),
    },
    columnHandle: {
      visibility: 'hidden',
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
