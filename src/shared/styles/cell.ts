import { HEADER_HEIGHT } from '../constants';

export interface CellStyles {
  common: CSSObject;
  cells: Record<string, readonly [CSSObject, Record<string, CSSObject>]>;
  orders: [string, string[]][];
}

export const createCellStyles = ({ cells, header }: MultiRowProfile): CellStyles => {
  const headerHeight = HEADER_HEIGHT[header.height];
  const common: CSSObject = {
    marginRight: `${cells.gap}px`,
    flexShrink: 0,
    flexGrow: 0,
  };

  return cells.columnOrder.reduce<CellStyles>(
    (acc, columnId) => {
      const { width, rows, rowOrder } = cells.columns[columnId];
      const rowCount = rowOrder.length;
      const staticHeight = cells.gap * (rowCount - 1) + headerHeight * rowCount;

      const columnStyle: CSSObject = {
        width: `${width}px`,
      };
      const rowStyles = rowOrder.reduce<Record<string, CSSObject>>((acc, rowId) => {
        const { height: pct } = rows[rowId];
        acc[rowId] = {
          height: `calc(${headerHeight}px + (100% - ${staticHeight}px) * ${pct / 100})`,
        };
        return acc;
      }, {});

      acc.cells[columnId] = [columnStyle, rowStyles];
      acc.orders.push([columnId, [...rowOrder]]);
      return acc;
    },
    { common, cells: {}, orders: [] },
  );
};
