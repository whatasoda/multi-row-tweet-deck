import { v4 as uuid } from 'uuid';
import { createStoreModule } from '../utils/storeModule';
import { clamp } from '../utils/math';

const MIN_COLUMN_WIDTH = 30;

export const [createMultiRowProfileAction, createMultiRowProfileReducer] = createStoreModule({
  switchProfile: (profile: MultiRowProfile) => ({ payload: profile }),

  setDisplayName: (displayName: string) => ({ payload: displayName }),
  setDrawer: (drawer: Partial<MultiRowProfile['drawer']>) => ({ payload: drawer }),
  setHeader: (header: Partial<MultiRowProfile['header']>) => ({ payload: header }),
  setCells: (cells: Partial<Omit<MultiRowProfile['header'], 'columns' | 'colmunOrder'>>) => ({ payload: cells }),

  createColumn: (init: ColumnInit, insert?: number) => ({ payload: { id: uuid(), init, insert } }),
  createRow: (columnId: string, init: RowInit, insert?: number) => ({
    payload: { id: uuid(), columnId, init, insert },
  }),

  tweakColumnWidth: (id: string, next: number) => ({ payload: { id, next } }),
  tweakRowTop: (columnId: string, id: string, next: number) => ({ payload: { columnId, id, next } }),
  tweakRowBottom: (columnId: string, id: string, next: number) => ({ payload: { columnId, id, next } }),
});

export const MultiRowProfileReducer = createMultiRowProfileReducer<MultiRowProfile>({
  switchProfile: (_, { payload }) => ({ ...payload }),

  setDisplayName: (state, { payload }) => ({ ...state, displayName: payload }),
  setDrawer: (state, { payload }) => ({ ...state, drawer: { ...state.drawer, ...payload } }),
  setHeader: (state, { payload }) => ({ ...state, header: { ...state.header, ...payload } }),
  setCells: (state, { payload }) => ({ ...state, cells: { ...state.cells, ...payload } }),

  createColumn: (state, { payload: { id, init, insert = Infinity } }) => {
    const column = newColumn(id, init);
    const { columns, columnOrder } = state.cells;

    insert = Math.min(insert, columnOrder.length);
    const cells = {
      ...state.cells,
      columns: { ...columns, [column.id]: column },
      colmunOrder: [...columnOrder.slice(0, insert), column.id, ...columnOrder.slice(insert)],
    };

    return { ...state, cells };
  },
  createRow: (state, { payload: { id, columnId, init, insert = Infinity } }) => {
    const row = newRow(id, columnId, init);
    const prevColumn = state.cells.columns[columnId];
    const { rows, rowOrder } = prevColumn;
    insert = Math.min(insert, rowOrder.length);
    // TOOD: split existing row

    const column = {
      ...prevColumn,
      rows: { ...rows, [row.id]: row },
      rowOrder: [...rowOrder.slice(0, insert), row.id, ...rowOrder.slice(insert)],
    };

    return {
      ...state,
      cells: {
        ...state.cells,
        columns: { ...state.cells.columns, [columnId]: column },
      },
    };
  },

  tweakColumnWidth: (state, { payload: { id, next } }) => {
    const prevCells = state.cells;
    return {
      ...state,
      cells: {
        ...prevCells,
        columns: { ...prevCells.columns, [id]: { ...prevCells.columns[id], width: Math.max(MIN_COLUMN_WIDTH, next) } },
      },
    };
  },
  tweakRowTop: (state, { payload: { columnId, id, next } }) => {
    const prevCells = state.cells;
    const column = prevCells.columns[columnId];
    const { rows, rowOrder } = column;

    const order = rowOrder.indexOf(id);
    if (order < 1) return state;

    const max = rowOrder.slice(order + 1).reduce((acc, id) => acc - rows[id].height, 100);

    next = clamp(next, 0, max);
    const row = rows[id];
    const unnormalized: Record<string, Row> = { ...rows, [id]: { ...row, height: next } };

    let change = next - row.height;
    const targets = rowOrder.slice(0, order).reverse();
    const normalized = targets.reduce((acc, id) => {
      const row = rows[id];
      if (change === 0) return acc;
      if (change <= row.height /* || change < 0 */) {
        acc[id] = { ...row, height: row.height - change };
        change = 0;
      } else {
        acc[id] = { ...row, height: 0 };
        change -= row.height;
      }
      return acc;
    }, unnormalized);

    return {
      ...state,
      cells: {
        ...prevCells,
        columns: {
          ...prevCells.columns,
          [columnId]: {
            ...column,
            rows: normalized,
          },
        },
      },
    };
  },

  tweakRowBottom: (state, { payload: { columnId, id, next } }) => {
    const prevCells = state.cells;
    const column = prevCells.columns[columnId];
    const { rows, rowOrder } = column;

    const order = rowOrder.indexOf(id);
    if (order === -1 || order >= rowOrder.length - 1) return state;

    const max = rowOrder.slice(0, order).reduce((acc, id) => acc - rows[id].height, 100);

    next = clamp(next, 0, max);
    const row = rows[id];
    const unnormalized: Record<string, Row> = { ...rows, [id]: { ...row, height: next } };

    let change = next - row.height;
    const targets = rowOrder.slice(order + 1);
    const normalized = targets.reduce((acc, id) => {
      const row = rows[id];
      if (change === 0) return acc;
      if (change <= row.height /* || change < 0 */) {
        acc[id] = { ...row, height: row.height - change };
        change = 0;
      } else {
        acc[id] = { ...row, height: 0 };
        change -= row.height;
      }
      return acc;
    }, unnormalized);

    return {
      ...state,
      cells: {
        ...prevCells,
        columns: {
          ...prevCells.columns,
          [columnId]: {
            ...column,
            rows: normalized,
          },
        },
      },
    };
  },
});

const newColumn = (id: string, init: ColumnInit): Column => {
  const rowId = uuid();
  const row = newRow(rowId, id, { height: 100 });
  const rows = { [rowId]: row };
  const rowOrder = [row.id];

  return { id, rows, rowOrder, ...init };
};

const newRow = (id: string, columnId: string, init: RowInit): Row => {
  return { columnId, id, ...init };
};
