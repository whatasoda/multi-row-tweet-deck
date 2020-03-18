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

  createColumn: (init: ColumnProfileInit, insert?: number) => ({ payload: { id: uuid(), init, insert } }),
  createRow: (columnId: string, init: RowProfileInit, insert?: number) => ({
    payload: { id: uuid(), columnId, init, insert },
  }),

  tweakColumnWidth: (id: string, next: number) => ({ payload: { id, next } }),
  tweakRowHeightByBoundary: (columnId: string, id: string, nextBoundary: number) => ({
    payload: { columnId, id, nextBoundary },
  }),
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

  tweakRowHeightByBoundary: (state, { payload: { columnId, id: upper, nextBoundary: next } }) => {
    const column = state.cells.columns[columnId];
    const { rows, rowOrder } = column;

    const idx = rowOrder.indexOf(upper);
    if (idx === -1 || idx >= rowOrder.length - 1) return state;
    const lower = rowOrder[idx + 1];

    const backwardTargets = rowOrder.slice(0, idx + 1).map((id) => rows[id]);
    const forwardTargets = rowOrder.slice(idx + 1).map((id) => rows[id]);

    next = clamp(next, 0, 100);
    const curr = backwardTargets.reduce((acc, { height }) => acc + height, 0);

    if (next === curr) return state;

    const nextRows = tweakHelper(
      next - curr,
      ...(next > curr ? ([upper, rows, forwardTargets] as const) : ([lower, rows, backwardTargets.reverse()] as const)),
    );

    return {
      ...state,
      cells: {
        ...state.cells,
        columns: {
          ...state.cells.columns,
          [columnId]: {
            ...column,
            rows: nextRows,
          },
        },
      },
    };
  },
});

const newColumn = (id: string, init: ColumnProfileInit): ColumnProfile => {
  const rowId = uuid();
  const row = newRow(rowId, id, { height: 100 });
  const rows = { [rowId]: row };
  const rowOrder = [row.id];

  return { id, rows, rowOrder, ...init };
};

const newRow = (id: string, columnId: string, init: RowProfileInit): RowProfile => {
  return { columnId, id, ...init };
};

const tweakHelper = (rawChange: number, originId: string, rows: Record<string, RowProfile>, targets: RowProfile[]) => {
  let change = Math.abs(rawChange);
  const origin = rows[originId];
  const next = origin.height + change;
  const unnormalized: Record<string, RowProfile> = { ...rows, [originId]: { ...origin, height: next } };

  return targets.reduce((acc, row) => {
    if (change === 0) return acc;
    if (change <= row.height) {
      acc[row.id] = { ...row, height: row.height - change };
      change = 0;
    } else {
      acc[row.id] = { ...row, height: 0 };
      change -= row.height;
    }
    return acc;
  }, unnormalized);
};
