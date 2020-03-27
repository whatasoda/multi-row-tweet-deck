import { TDClassName } from './utils/TDClassName';
import { HEADER_HEIGHT } from './constants';

export const vanilla: VanillaTweetDeck = { drawerWidth: 270, headerHeight: 40 };

type Expected = Partial<Record<OneOfTDClassName, CSSObject>>;
const helper = <T extends Expected>(styles: T & Expected): T => styles;

export const updateVanillaTweetDeck = () => {
  const dummy = document.createElement('div');
  dummy.style.display = 'none';

  document.documentElement.appendChild(dummy);

  dummy.className = TDClassName.html.drawer;
  const { width: drawerWidth } = getComputedStyle(dummy);
  vanilla.drawerWidth = parseFloat(drawerWidth) || vanilla.drawerWidth;

  dummy.className = TDClassName.html.columnHeader;
  const { height: headerHeight } = getComputedStyle(dummy);
  vanilla.headerHeight = parseFloat(headerHeight) || vanilla.headerHeight;

  dummy.remove();
};

export const createDrawerStyle = (drawer: MultiRowProfile['drawer']) => {
  return helper({
    appContentOpened: {
      marginLeft: `${drawer.width - vanilla.drawerWidth}px`,
    },
    appContentClosed: {
      marginLeft: 0,
    },
    drawer: {
      width: `${drawer.width}px`,
      left: `${-drawer.width}px`,
    },
  });
};

export const createColumnHeaderStyle = (header: MultiRowProfile['header']) => {
  const height = HEADER_HEIGHT[header.height];
  const transform = `translateY(${(height - vanilla.headerHeight) / 2}px)`;

  return helper({
    columnHeader: {
      height: `${height}px`,
      maxHeight: `${height}px`,
      lineHeight: `${height}px`,
    },
    columnHeaderTitle: { transform },
    columnTitleBackIcon: { transform },
  });
};

export const createCellStylesInColumn = (column: ColumnProfile, headerHeight: number, gap: number) => {
  const { rowOrder, rows } = column;
  const rowCount = rowOrder.length;
  const staticHeight = gap * (rowCount - 1) + headerHeight * rowCount;

  const width = `${column.width}px`;

  return [
    width,
    rowOrder.reduce<Record<string, string>>((acc, rowId) => {
      acc[rowId] = `calc(${headerHeight}px + (100% - ${staticHeight}px) * ${rows[rowId].height / 100})`;
      return acc;
    }, {}),
  ] as const;
};
