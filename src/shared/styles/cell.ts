import { css } from 'styled-components';
import { HEADER_HEIGHT } from '../constants';

export interface CellStyles {
  common: Style;
  cells: Record<string, readonly [Style, Record<string, Style>]>;
  orders: [string, string[]][];
}

export const createCellStyles = ({ cells, header }: MultiRowProfile): CellStyles => {
  const headerHeight = HEADER_HEIGHT[header.height];
  const common = css`
    margin-right: ${cells.gap}px;
    flex-shrink: 0;
    flex-grow: 0;
  `;

  return cells.columnOrder.reduce<CellStyles>(
    (acc, columnId) => {
      const { width, rows, rowOrder } = cells.columns[columnId];
      const rowCount = rowOrder.length;
      const staticHeight = cells.gap * (rowCount - 1) + headerHeight * rowCount;

      const columnStyle = css`
        width: ${width}px;
      `;
      const rowStyles = rowOrder.reduce<Record<string, Style>>((acc, rowId) => {
        const { height: pct } = rows[rowId];
        acc[rowId] = css`
          height: calc(${headerHeight}px + (100% - ${staticHeight}px) * ${pct / 100});
        `;
        return acc;
      }, {});

      acc.cells[columnId] = [columnStyle, rowStyles];
      acc.orders.push([columnId, [...rowOrder]]);
      return acc;
    },
    { common, cells: {}, orders: [] },
  );
};
