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
  columnHandle: CSSProperties;
};

type CreateAppStyle = (profile: AppProfile) => AppStyle;
type PureKeys = Exclude<keyof AppStyle, 'cellCommon' | 'cellCols' | 'cellRows'> | 'column';

export const NativeClassNames: Record<PureKeys, string> = {
  appContent: 'app-content.is-open',
  drawer: 'drawer.wide',
  columnsContainer: 'app-columns-container',
  columns: 'app-columns',
  column: 'column',
  columnHandle: 'column-drag-handle',
};

const DEFAULT_DRAWER_WIDTH = 400;
const GAP = 2;

const AppStyle: CreateAppStyle = (profile) => {
  const { drawerWidth } = profile;
  const drawerDiff = DEFAULT_DRAWER_WIDTH - drawerWidth;

  const cellCols = profile.columns.reduce<CSSProperties[]>((acc, width) => {
    acc.push({
      width,
    });
    return acc;
  }, []);

  const cellRows = profile.rows.map((col) => {
    const gapTotal = GAP * (col.length - 1);
    return col.reduce<CSSProperties[]>((acc, percentage) => {
      acc.push({
        height: rowValue(percentage, gapTotal),
      });
      return acc;
    }, []);
  });

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
    },
    cellCommon: {
      flexShrink: 0,
      flexGrow: 0,
    },
    cellCols,
    cellRows,
    columnHandle: {
      visibility: 'hidden',
    },
  };
};

const rowValue = (percentage: number, gapTotal: number) => `calc(${percentage}% - ${(gapTotal * percentage) / 100}px)`;

const px = (value: number) => `${value}px`;

export default AppStyle;
